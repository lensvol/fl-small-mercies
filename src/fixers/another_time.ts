import {INetworkAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {DO_NOT_CARE, FLApiInterceptor, setFakeXhrResponse, SPECIAL_HANDLING} from "../api_interceptor.js";
import {FLApiClient} from "../api_client.js";
import {IChooseBranchRequest} from "../interfaces.js";

const ANOTHER_TIME_BRANCH_ID = 211150;

export class AnotherTimeFixer implements INetworkAware {
    shortcutAnotherTimeBranch = false;
    apiInterceptor: FLApiInterceptor | null = null;
    apiClient: FLApiClient | null = null;

    applySettings(settings: SettingsObject): void {
        this.shortcutAnotherTimeBranch = settings.shortcut_another_time as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        this.apiInterceptor = interceptor;
        this.apiClient = new FLApiClient();

        interceptor.onRequestSent("/api/storylet/choosebranch", (request, data) => {
            if (!this.shortcutAnotherTimeBranch) {
                return DO_NOT_CARE;
            }

            const branchRequest = data as unknown as IChooseBranchRequest;
            if (branchRequest.branchId === ANOTHER_TIME_BRANCH_ID) {
                this.apiClient?.goBack().then((json) => {
                    setFakeXhrResponse(request, 200, json);
                });

                return SPECIAL_HANDLING;
            }

            return DO_NOT_CARE;
        });
    }
}
