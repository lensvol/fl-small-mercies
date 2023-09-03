import {INetworkAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {FLApiInterceptor} from "../api_interceptor";

const KHANATE_TIME_BRANCHES = [250668];

export class KhanateOracleFixer implements INetworkAware {
    enableKhanateOracle = false;
    apiInterceptor: FLApiInterceptor | null = null;

    applySettings(settings: SettingsObject): void {
        this.enableKhanateOracle = settings.enable_khanate_oracle as boolean;
    }

    determineProspect(airsValue: number): string {
        if (airsValue < 10) {
            return "Academic";
        } else if (airsValue >= 10 && airsValue < 20) {
            return "Dissident";
        } else if (airsValue >= 20 && airsValue < 30) {
            return "Tailor";
        } else if (airsValue >= 30 && airsValue < 40) {
            return "Thief";
        } else if (airsValue >= 40 && airsValue < 50) {
            return "Aristocrat";
        } else if (airsValue >= 50 && airsValue < 60) {
            return "Officer";
        } else if (airsValue >= 60 && airsValue < 70) {
            return "Diplomat";
        } else if (airsValue >= 70 && airsValue < 80) {
            return "Engineer";
        } else if (airsValue >= 80 && airsValue < 90) {
            return "Physician";
        } else if (airsValue >= 90 && airsValue <= 100) {
            return "Soldier";
        }

        return "???????";
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        this.apiInterceptor = interceptor;

        interceptor.onResponseReceived("/api/storylet/choosebranch", (request, response) => {
            if (!this.enableKhanateOracle) {
                return;
            }

            if (response.messages && KHANATE_TIME_BRANCHES.includes(request.branchId)) {
                const airsOfKhanateMessage = response.messages.find(
                    (m: any) => m.type == "QualityExplicitlySetMessage" && m.possession.name == "Airs of the Khanate"
                );

                if (airsOfKhanateMessage) {
                    const prospect = this.determineProspect(airsOfKhanateMessage.possession.level);
                    response.messages.push({
                        priority: 2,
                        image: "lurkersilhouette",
                        message: `<em>Crumpled note from a lookout reaches your table: "${prospect.toUpperCase()}". You nod sagely.</em>`,
                        type: "InfoMessage",
                        tooltip: "Carpe jugulum!",
                    });
                }
            }

            return;
        });
    }
}
