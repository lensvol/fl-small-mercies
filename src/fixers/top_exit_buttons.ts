import {IMutationAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {GameStateController, StoryletPhases} from "../game_state";
import {getSingletonByClassName} from "../utils";

export class TopExitButtonsFixer implements IMutationAware, IStateAware {
    private moveExitButtonsToTop = false;
    private ignoreBranchAmount = false;
    private inStorylet = false;
    private mimicPanel?: HTMLElement;

    applySettings(settings: SettingsObject): void {
        this.moveExitButtonsToTop = settings.top_exit_buttons as boolean;
        this.ignoreBranchAmount = settings.top_exit_buttons_always as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.moveExitButtonsToTop) {
            return false;
        }

        if (!this.inStorylet) {
            return false;
        }

        return getSingletonByClassName(node, "media--root") != null;
    }

    createPerhapsNotMimic(): [HTMLElement, HTMLElement] {
        const root = document.createElement("div");

        const container = document.createElement("div");
        container.classList.add("buttons", "buttons--left", "buttons--storylet-exit-options");
        // Mark as mimic to prevent duplicates
        container.classList.add("mimic-perhaps-not");

        const button = document.createElement("button");
        button.classList.add("button", "button--primary");
        button.setAttribute("type", "button");

        const textSpan = document.createElement("span");

        const italics = document.createElement("i");
        italics.classList.add("fa", "fa-arrow-left");

        const text = document.createTextNode(" Perhaps not");

        root.appendChild(container);

        container.appendChild(button);

        button.appendChild(textSpan);

        textSpan.appendChild(italics);
        textSpan.appendChild(text);

        return [root, button];
    }

    onNodeAdded(node: HTMLElement): void {
        /**
         * When navigating nested storylets (branch leads into more branches), default exit buttons aren't deleted.
         * This means that we can't reliably use exit buttons to track when we need to insert mimic.
         */
        const mediaRoot: HTMLElement | null = getSingletonByClassName(node, "media--root");

        if (!mediaRoot || !mediaRoot.parentNode) {
            return;
        }

        const root = mediaRoot.parentNode as HTMLElement;

        const branches = root.getElementsByClassName("media--branch");
        // don't show unless storylet has more than a 4 or more branches
        if (!this.ignoreBranchAmount && branches.length < 4) {
            return;
        }

        const exitButtonDiv = getSingletonByClassName(root, "buttons--storylet-exit-options");
        if (!exitButtonDiv) {
            return;
        }

        if (exitButtonDiv.classList.contains("mimic-perhaps-not")) {
            return;
        }

        const originalPerhapsNot: HTMLElement | null = exitButtonDiv.querySelector(
            "button > span > i[class*='fa-arrow-left']"
        );
        if (!originalPerhapsNot) {
            return;
        }

        let mimicButton: HTMLElement;
        [this.mimicPanel, mimicButton] = this.createPerhapsNotMimic();

        mimicButton.addEventListener("click", () => {
            this.mimicPanel?.remove();
            originalPerhapsNot.click();
        });

        for (const exitBtn of exitButtonDiv.getElementsByTagName("button")) {
            exitBtn.addEventListener("click", () => this.mimicPanel?.remove());
        }

        const otherButtons =
            exitButtonDiv.parentNode?.querySelectorAll(
                ".media--branch[data-branch-id] .storylet__buttons .button--primary"
            ) || [];
        for (const otherBtn of otherButtons) {
            otherBtn.addEventListener("click", () => this.mimicPanel?.remove());
        }

        root.insertBefore(this.mimicPanel, mediaRoot.nextSibling);
    }

    onNodeRemoved(node: HTMLElement): void {
        if (node.matches("div[class*='media--root']")) {
            this.mimicPanel?.remove();
        }
    }

    linkState(stateController: GameStateController): void {
        stateController.onStoryletPhaseChanged((state) => {
            this.inStorylet = state.storyletPhase === StoryletPhases.In;
        });
    }
}
