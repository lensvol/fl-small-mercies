import {IMutationAware, IStateAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {FLUser, GameState, GameStateController, StoryletPhases} from "../game_state.js";
import {getSingletonByClassName} from "../utils.js";
import {FLApiClient} from "../api_client.js";

const SHARE_BUTTON_SELECTOR = "div[class='storylet-root__frequency'] button[class='buttonlet-container'] span[class*='buttonlet-edit']";
const SOURCE_EXTRACTION_REGEX = /\/\/images\.fallenlondon\.com\/icons\/([a-z0-9]+)\.png/;

export class QuickShareFixer implements IMutationAware, IStateAware {
    private replaceShareButton = false;
    private currentStoryletId: number | null = null;
    private authToken: string | null = null;
    private shareClickListener: EventListener;

    private apiClient: FLApiClient;

    constructor() {
        this.apiClient = new FLApiClient();

        this.shareClickListener = (ev) => {
            if (!this.currentStoryletId) {
                return;
            }

            const image = document.querySelector("img[class*='storylet-root__card-image']") as HTMLImageElement;
            const title = document.querySelector("h1[class*='storylet-root__heading']");
            // For some reason event target here is the button itself, not the buttonlet container
            const icon = ev.target as HTMLElement;

            let imageCode = "";

            if (image) {
                const parts = image.src.match(SOURCE_EXTRACTION_REGEX);
                if (parts) {
                    imageCode = parts[1];
                }
            }

            icon?.parentElement?.classList.remove("buttonlet-enabled");
            icon?.classList.remove("fa-pencil");
            icon?.classList.add("fa-refresh", "fa-spin");

            this.apiClient
                .shareToProfile(this.currentStoryletId, imageCode)
                .then((_r) => {
                    // FIXME: Replace direct CSS manipulation with something classier
                    icon?.classList.remove("fa-refresh", "fa-spin");
                    icon?.classList.add("fa-check");

                    icon?.parentElement?.classList.add("buttonlet-enabled");
                })
                .catch((err) => {
                    console.error(err);
                    icon?.parentElement?.classList.add("buttonlet-enabled");

                    // Make buttonlet to indicate that there was an error
                    if (icon?.parentElement) {
                        icon.parentElement.style.color = "red";
                    }
                });
        };
    }

    applySettings(settings: SettingsObject): void {
        this.replaceShareButton = settings.quick_share_button as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.replaceShareButton) {
            return false;
        }

        if (this.currentStoryletId == null || this.authToken == null) {
            return false;
        }

        return getSingletonByClassName(node, "media--root") !== null;
    }

    onNodeAdded(node: HTMLElement): void {
        const shareButton = node.querySelector(SHARE_BUTTON_SELECTOR);
        const shareContainer = shareButton?.parentElement;
        if (shareContainer != null && shareContainer.parentElement != null) {
            const shareMimic = shareContainer.cloneNode(true) as HTMLElement;

            shareMimic.addEventListener("click", this.shareClickListener);
            shareContainer.parentElement.replaceChild(shareMimic, shareContainer);
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }

    linkState(stateController: GameStateController): void {
        stateController.onUserDataLoaded((g) => {
            if (g.user instanceof FLUser) {
                this.authToken = g.user.jwtToken;
            }
        });

        stateController.onStoryletPhaseChanged((g: GameState) => {
            if ([StoryletPhases.In, StoryletPhases.End].includes(g.storyletPhase)) {
                this.currentStoryletId = g.storyletId;
            } else {
                this.currentStoryletId = null;
            }
        });
    }
}
