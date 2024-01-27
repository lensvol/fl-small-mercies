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
                branch.challenges = branch.challenges.filter((challenge) => {
                    return challenge.targetNumber < 100;
                });
            });
        };

        interceptor.onResponseReceived("/api/storylet/begin", trivialChallengeRemover);
        interceptor.onResponseReceived("/api/storylet", trivialChallengeRemover);
    }
}
