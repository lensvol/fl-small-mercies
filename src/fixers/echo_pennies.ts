import {INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";

const PENNY_MESSAGE_REGEX = /You've (lost|gained) ([0-9,]+) x Penny \(new total ([0-9,]+)\)./;

export class EchoPenniesFixer implements INetworkAware {
    convertPenniesToEchoes = false;

    applySettings(settings: SettingsObject): void {
        this.convertPenniesToEchoes = settings.convert_pennies_to_echoes as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
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
