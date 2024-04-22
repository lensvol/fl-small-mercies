import {INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IChooseBranchRequest, IChooseBranchResponse} from "../interfaces";

export class BranchResultsFixer implements INetworkAware {
    apiInterceptor: FLApiInterceptor | null = null;

    removeQualityCapMessages = true;
    removeSimpleChallengeText = true;

    applySettings(settings: SettingsObject): void {
        this.removeQualityCapMessages = settings.remove_quality_cap_msgs as boolean;
        this.removeSimpleChallengeText = settings.remove_simple_challenge_text as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        this.apiInterceptor = interceptor;

        interceptor.onResponseReceived(
            "/api/storylet/choosebranch",
            (request: IChooseBranchRequest, response: IChooseBranchResponse) => {
                if (!response.messages) {
                    return;
                }

                const resultingMessages = [];

                for (let message of response.messages) {
                    if (
                        this.removeQualityCapMessages &&
                        message.type === "QualityCapMessage" &&
                        message.changeType === "Unaltered"
                    ) {
                        continue;
                    }

                    if (this.removeSimpleChallengeText) {
                        if (message.type === "DifficultyRollSuccessMessage") {
                            message.message = message.message.replace(
                                "(Simple challenges mean you don't learn so much.)",
                                ""
                            );
                        }

                        if (message.type === "DifficultyRollFailureMessage") {
                            message.message = message.message.replace(
                                "(This challenge was old territory for you - you won't learn so much.)",
                                ""
                            );
                        }
                    }

                    resultingMessages.push(message);
                }

                response.messages = resultingMessages;

                return;
            }
        );
    }
}
