import {INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";

export class BranchResultsFixer implements INetworkAware {
    apiInterceptor: FLApiInterceptor | null = null;

    removeQualityCapMessages = true;

    applySettings(settings: SettingsObject): void {
        this.removeQualityCapMessages = settings.remove_quality_cap_msgs as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        this.apiInterceptor = interceptor;

        interceptor.onResponseReceived("/api/storylet/choosebranch", (request, response) => {
            if (!response.messages) {
                return;
            }

            if (this.removeQualityCapMessages) {
                response.messages = response.messages.filter((message: any) => {
                    return !(message.type == "QualityCapMessage" && message.changeType === "Unaltered");
                });
            }

            return;
        });
    }
}
