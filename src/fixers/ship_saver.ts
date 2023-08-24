import { INetworkAware } from "./base.js";
import { SettingsObject } from "../settings.js";
import { FLApiInterceptor } from "../api_interceptor.js";
import { IBeginStoryletRequest } from "../interfaces.js";

const PUT_TO_ZEE_STORYLET_ID = 335704;

export class ShipSaverFixer implements INetworkAware {
    private disableSaleOption = false;
    // FIXME: Re-implement using QualityRequirement component
    private SMALL_MERCIES_LOCKED_QUALITY = {
        "allowedOn": "Character",
        "qualityId": 777_777_777,
        "qualityName": "Abundance of Caution",
        "tooltip": "It is locked for your own good.",
        "availableAtMessage": "You can re-enable this branch in the \"Small Mercies\" settings screen.",
        "category": "Extension",
        "nature": "Status",
        "status": "Locked",
        "isCost": false,
        "image": "mercy",
        "id": 777_777_777,
    };

    applySettings(settings: SettingsObject): void {
        this.disableSaleOption = settings.ship_saver as boolean;
    }

    // FIXME: De-duplicate using single handler and discriminate by type.
    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/begin", (request, response) => {
            if (!this.disableSaleOption) {
                return null;
            }

            const beginRequest = request as unknown as IBeginStoryletRequest;
            if (beginRequest.eventId !== PUT_TO_ZEE_STORYLET_ID) {
                return null;
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
            if (!this.disableSaleOption) {
                return null;
            }

            if (response.phase != "In") {
                return null;
            }

            if (response.storylet.id !== PUT_TO_ZEE_STORYLET_ID) {
                return null;
            }

            const clonedResponse = structuredClone(response);
            for (const branch of clonedResponse.storylet.childBranches) {
                if (branch.name === "Get rid of your current ship") {
                    branch.qualityLocked = true;
                    branch.qualityRequirements.push(this.SMALL_MERCIES_LOCKED_QUALITY);
                    return clonedResponse;
                }
            }
        });
    }
}
