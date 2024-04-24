import {INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IBeginStoryletRequest, IBranch, IQualityRequirement, IStoryletResponse} from "../interfaces";

const PENNY_MESSAGE_REGEX = /You've (lost|gained) ([0-9,]+) x Penny \(new total ([0-9,]+)\)./;
const PENNY_REQUIREMENT_REGEX = /.*\s([0-9,]+)\s.*\s([0-9,]+).*/;

export class EchoPenniesFixer implements INetworkAware {
    convertPenniesToEchoes = false;

    applySettings(settings: SettingsObject): void {
        this.convertPenniesToEchoes = settings.convert_pennies_to_echoes as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        const echoRequirementPatcher = (request: IBeginStoryletRequest, response: IStoryletResponse) => {
            if (!this.convertPenniesToEchoes) {
                return;
            }

            // Since /storylet response can hold either contents of the current storylet or list of available
            // storylets, we need to explicitly check which is which. We are only interested in the already started
            // storylets.
            if (!response.storylet) {
                return;
            }

            response.storylet.childBranches.map((branch: IBranch) => {
                branch.qualityRequirements.map((req: IQualityRequirement) => {
                    if (req.qualityName === "Penny") {
                        const matches = req.tooltip.match(PENNY_REQUIREMENT_REGEX);
                        if (!matches) {
                            return;
                        }

                        const [_, current_amount_str, needed_amount_str] = matches;
                        const currentAmount = parseInt(current_amount_str.replace(/,/g, ""), 10);
                        const neededAmount = parseInt(needed_amount_str.replace(/,/g, ""), 10);
                        req.tooltip = `You unlocked this with ${currentAmount / 100} Echoes (you needed ${
                            neededAmount / 100
                        })`;
                    }
                });
            });
        };
        interceptor.onResponseReceived("/api/storylet/begin", echoRequirementPatcher);
        interceptor.onResponseReceived("/api/storylet", echoRequirementPatcher);

        interceptor.onResponseReceived("/api/storylet/choosebranch", (request, response) => {
            if (!this.convertPenniesToEchoes) {
                return;
            }

            if (!response.messages) {
                return;
            }

            const pennyChangeMessage = response.messages.find(
                (m: any) => m.type == "StandardQualityChangeMessage" && m.possession.name == "Penny"
            );

            if (!pennyChangeMessage) {
                return;
            }

            const matches = pennyChangeMessage.message.match(PENNY_MESSAGE_REGEX);
            if (!matches) {
                return;
            }

            const [_, direction, delta_str, new_total_str] = matches;
            const delta = parseInt(delta_str.replace(/,/g, ""), 10);
            const new_total = parseInt(new_total_str.replace(/,/g, ""), 10);

            pennyChangeMessage.message = `You've ${direction} ${delta / 100} x Echoes (new total: ${new_total / 100}).`;
        });
    }
}
