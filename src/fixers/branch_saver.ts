import {INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IBeginStoryletRequest, IQualityRequirement} from "../interfaces";

const PUT_TO_ZEE_STORYLET_ID = 335704;
const PIGGY_BANK_STORYLET_ID = 380520;

export class BranchProtectorFixer implements INetworkAware {
    private disableShipSaleOption = false;
    private disableBreakBankOption: boolean = false;
    // FIXME: Re-implement using QualityRequirement component
    private SMALL_MERCIES_LOCKED_QUALITY: IQualityRequirement = {
        allowedOn: "Character",
        qualityId: 777_777_777,
        qualityName: "Abundance of Caution",
        tooltip: "It is locked for your own good.",
        availableAtMessage: 'You can re-enable this branch in the "Small Mercies" settings screen.',
        category: "Extension",
        nature: "Status",
        status: "Locked",
        image: "mercy",
        id: 777_777_777,
    };

    applySettings(settings: SettingsObject): void {
        this.disableShipSaleOption = settings.ship_saver as boolean;
        this.disableBreakBankOption = settings.piggy_bank_saver as boolean;
    }

    // FIXME: De-duplicate using single handler and discriminate by type.
    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/begin", (request, response) => {
            if (!this.disableShipSaleOption) {
                return;
            }

            const beginRequest = request as unknown as IBeginStoryletRequest;
            if (beginRequest.eventId !== PUT_TO_ZEE_STORYLET_ID) {
                return;
            }

            for (const branch of response.storylet.childBranches) {
                if (branch.name === "Get rid of your current ship") {
                    branch.qualityLocked = true;
                    branch.qualityRequirements.push(this.SMALL_MERCIES_LOCKED_QUALITY);
                    break;
                }
            }
        });

        interceptor.onResponseReceived("/api/storylet", (_request, response) => {
            if (!this.disableShipSaleOption && !this.disableBreakBankOption) {
                return;
            }

            if (response.phase !== "In" && response.phase !== "InItemUse") {
                return;
            }

            if (response.storylet.id !== PUT_TO_ZEE_STORYLET_ID && response.storylet.id !== PIGGY_BANK_STORYLET_ID) {
                return;
            }

            for (const branch of response.storylet.childBranches) {
                if (
                    (this.disableShipSaleOption &&
                        (branch.name === "Get rid of your current ship" || branch.id === 251811)) ||
                    (this.disableBreakBankOption && (branch.name === "Break the bank" || branch.id === 278678))
                ) {
                    branch.qualityLocked = true;
                    branch.qualityRequirements.push(this.SMALL_MERCIES_LOCKED_QUALITY);
                }
            }
        });
    }
}
