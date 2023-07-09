import {IMutationAwareFixer, IStateAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {GameStateController, StoryletPhases} from "../game_state.js";

export class TopExitButtonsFixer implements IMutationAwareFixer, IStateAware {
    private moveExitButtonsToTop = false;
    private ignoreBranchAmount = false;
    private inStorylet = false;
    private mimicPanel?: HTMLElement;

    applySettings(settings: SettingsObject): void {
        this.moveExitButtonsToTop = settings.top_exit_buttons as boolean;
        this.ignoreBranchAmount = settings.top_exit_buttons_always as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.moveExitButtonsToTop && this.inStorylet;
    }

    findNodeWithClass(container: HTMLElement, className: string): HTMLElement | null {
        if (container.classList.contains(className)) {
            return container;
        }

        return container.querySelector(`div[class*='${className}']`);
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
        let mediaRoot: ParentNode | undefined | null;

        if (node.classList.contains("media--branch")) {
            // track branches after the page is loaded
            mediaRoot = node.parentNode?.querySelector(".media--root");
        } else {
            // track anything that contains media root when the page initially loads
            mediaRoot = node.querySelector(".media--root");
        }

        if (!mediaRoot) {
            return;
        }

        // don't show unless storylet has more than a 4 or more branches
        if (!this.ignoreBranchAmount && (mediaRoot.parentNode?.querySelectorAll(".media--branch").length ?? 0) < 4) {
            return;
        }

        const exitButtonDiv = mediaRoot.parentNode?.querySelector(".buttons--storylet-exit-options");
        if (exitButtonDiv) {
            if (exitButtonDiv.classList.contains("mimic-perhaps-not")) {
                return;
            }

            const originalPerhapsNot: HTMLElement | null = exitButtonDiv.querySelector("button > span > i[class*='fa-arrow-left']");
            let mimicButton: HTMLElement;
            [this.mimicPanel, mimicButton] = this.createPerhapsNotMimic();

            if (originalPerhapsNot && mimicButton) {
                mimicButton.addEventListener("click", () => {
                    this.mimicPanel?.remove();
                    originalPerhapsNot.click();
                });

                for (const exitBtn of exitButtonDiv.querySelectorAll("button")) {
                    exitBtn.addEventListener("click", () => this.mimicPanel?.remove());
                }

                const otherButtons = exitButtonDiv.parentNode?.querySelectorAll(".media--branch[data-branch-id] .storylet__buttons .button--primary") || [];
                for (const otherBtn of otherButtons) {
                    otherBtn.addEventListener("click", () => this.mimicPanel?.remove());
                }

                mediaRoot.parentNode?.insertBefore(this.mimicPanel, mediaRoot.nextSibling);
            }
        }
    }

    onNodeRemoved(node: HTMLElement): void {
        // fix: When we switch equipment loadouts delete the mimic
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
