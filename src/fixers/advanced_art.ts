import {IMercyFixer, IMutationAware, INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {
    IBeginStoryletRequest,
    IBranch,
    IChallenge,
    IChooseBranchRequest,
    IChooseBranchResponse,
    IMessageResult,
    IQualityRequirement,
    IStoryletResponse,
} from "../interfaces";
import {sendToServiceWorker} from "../comms";
import {
    MSG_TYPE_CURRENT_SETTINGS,
    MSG_TYPE_DEFAULT_MAGCATS,
    MSG_TYPE_OLD_MAGCATS,
    MSG_TYPE_RED_MAGCATS,
} from "../constants";

export class AdvancedArtFixer implements IMercyFixer {
    applySettings(settings: SettingsObject): void {
        const iconSet = settings.magcats_icons as string;

        if (iconSet === "default") {
            sendToServiceWorker(MSG_TYPE_DEFAULT_MAGCATS, {});
        } else if (iconSet === "classic") {
            sendToServiceWorker(MSG_TYPE_OLD_MAGCATS, {});
        } else if (iconSet === "red") {
            sendToServiceWorker(MSG_TYPE_RED_MAGCATS, {});
        }
    }
}
