import {IMutationAwareFixer, IStateAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {GameStateController} from "../game_state";

const SUPPORTED_STORYLETS: number[] = [
    // Offering Tribute to the Court of the Wakeful Eye
    285304,
    // Assembling Skeleton at the Bone Market
    330107,
];

export class TopExitButtonsFixer implements IMutationAwareFixer, IStateAware {
    private moveExitButtonsToTop = true;
    private inSupportedStorylet = false;

    applySettings(settings: SettingsObject): void {
        this.moveExitButtonsToTop = settings.top_exit_buttons as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.moveExitButtonsToTop && this.inSupportedStorylet;
    }

    findNodeWithClass(container: HTMLElement, className: string): HTMLElement | null {
        if (container.classList.contains(className)) {
            return container;
        }

        return container.querySelector(`div[class*='${className}']`);
    }

    createPerhapsNotMimic(): [HTMLElement, HTMLElement] {
        const root = document.createElement('div');

        const container = document.createElement('div');
        container.classList.add('buttons', 'buttons--left', 'buttons--storylet-exit-options');
        // Mark as mimic to prevent duplicates
        container.classList.add('mimic-perhaps-not')

        const button = document.createElement('button');
        button.classList.add('button', 'button--primary');
        button.setAttribute('type', 'button');

        const textSpan = document.createElement('span');

        const italics = document.createElement('i');
        italics.classList.add('fa', 'fa-arrow-left');

        const text = document.createTextNode('Perhaps not');

        root.appendChild(container);

        container.appendChild(button);

        button.appendChild(textSpan);

        textSpan.appendChild(italics);
        textSpan.appendChild(text);

        return [root, button];
    }

    onNodeAdded(node: HTMLElement): void {
        const exitButtonDiv = this.findNodeWithClass(node, 'buttons--storylet-exit-options');

        if (exitButtonDiv) {
            if (exitButtonDiv.classList.contains("mimic-perhaps-not")) {
                return;
            }

            const mediaRoot = exitButtonDiv.parentElement?.querySelector("div[class*='media--root']");
            if (!mediaRoot) {
                return;
            }

            let originalPerhapsNot: HTMLElement | null = exitButtonDiv.querySelector("button > span > i[class*='fa-arrow-left']");
            const [mimicPanel, mimicButton] = this.createPerhapsNotMimic();

            if (originalPerhapsNot && mimicButton) {
                mimicButton.addEventListener("click", () => {
                    mimicPanel.remove();
                    originalPerhapsNot!!.click();
                });

                for (const exitBtn of exitButtonDiv.querySelectorAll("button")) {
                    exitBtn.addEventListener("click", () => mimicPanel.remove());
                }

                const otherButtons = exitButtonDiv.parentElement?.querySelectorAll("div[class*='media'][data-branch-id]") || [];
                for (const otherBtn of otherButtons) {
                    otherBtn.addEventListener("click", () => mimicPanel.remove());
                }

                mediaRoot.parentElement?.insertBefore(mimicPanel, mediaRoot.nextSibling!!);
            }
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }

    linkState(stateController: GameStateController): void {
        stateController.onStoryletPhaseChanged((state) => {
            this.inSupportedStorylet = SUPPORTED_STORYLETS.includes(state.storyletId);
        })
    }
}
