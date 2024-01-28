import {INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IBeginStoryletRequest, IBeginStoryletResponse} from "../interfaces";

export class TrivialChecksFixer implements INetworkAware {
    hideTrivialChecks = false;
    apiInterceptor: FLApiInterceptor | null = null;

    applySettings(settings: SettingsObject): void {
        this.hideTrivialChecks = settings.hide_trivial_checks as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        const trivialChallengeRemover = (request: IBeginStoryletRequest, response: IBeginStoryletResponse) => {
            if (!this.hideTrivialChecks) {
                return;
            }

            response.storylet.childBranches.map((branch) => {
                const remainingChallenges = [];

                for (const challenge of branch.challenges) {
                    if (challenge.targetNumber === 100) {
                        branch.qualityRequirements.push({
                            allowedOn: "Character",
                            qualityId: 777_777_777 + challenge.id,
                            qualityName: challenge.name,
                            tooltip:
                                `There was a check for your <span class='quality-name'>${challenge.name}</span> skill, but since you would ` +
                                `100% pass it anyway... We removed it.<br><br><b>You can change that behaviour in ` +
                                `<i>"Small Mercies"</i> settings.</b>`,
                            category: "Accomplishment",
                            nature: "Status",
                            status: "Unlocked",
                            isCost: false,
                            image: challenge.image,
                            id: 777_777_777 + challenge.id,
                        });

                        continue;
                    }

                    remainingChallenges.push(challenge);
                }

                branch.challenges = remainingChallenges;
            });
        };

        interceptor.onResponseReceived("/api/storylet/begin", trivialChallengeRemover);
        interceptor.onResponseReceived("/api/storylet", trivialChallengeRemover);
    }
}
