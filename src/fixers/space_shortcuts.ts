import {INetworkAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {DO_NOT_CARE, FLApiInterceptor, setFakeXhrResponse, SPECIAL_HANDLING} from "../api_interceptor.js";
import {FLApiClient} from "../api_client.js";
import {IBeginStoryletRequest} from "../interfaces.js";

const STORYLET_TO_BRANCH_SHORTCUTS: Map<number, number> = new Map([
    // Put to Zee! -> Into the captain's cabin
    [335704, 246387],
    // The Back Stair to the Bone Market -> Take the door on the left
    [325618, 239296],
    // Leave the Bone Market -> Relatively unnoticed
    [330284, 242571],
    // Stop by your Laboratory -> Go on in
    [321218, 236273],
    // The Rat Market -> Enter the Rat Market again
    [343815, 253288],
    // Leave the Rat Market -> Back to the Flit
    [343819, 252247],
]);

export class SpaceShortcutFixer implements INetworkAware {
    shortcutSpecificBranches = false;
    apiClient: FLApiClient | null = null;

    applySettings(settings: SettingsObject): void {
        this.shortcutSpecificBranches = settings.shortcut_specific_branches as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        this.apiClient = new FLApiClient();

        interceptor.onRequestSent("/api/storylet/begin", (request, data) => {
            if (!this.shortcutSpecificBranches) {
                return DO_NOT_CARE;
            }

            const beginRequest = data as unknown as IBeginStoryletRequest;
            const branchShortcut = STORYLET_TO_BRANCH_SHORTCUTS.get(beginRequest.eventId);
            if (branchShortcut) {
                this.apiClient?.beginStorylet(beginRequest.eventId).then((_) => {
                    this.apiClient?.chooseBranch(branchShortcut).then((json) => {
                        setFakeXhrResponse(request, 200, json);
                    });
                });

                return SPECIAL_HANDLING;
            }

            return DO_NOT_CARE;
        });
    }
}
