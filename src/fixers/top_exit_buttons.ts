import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";

export class TopExitButtonsFixer implements IMutationAwareFixer {
    private moveExitButtonsToTop = true;

    applySettings(settings: SettingsObject): void {
        this.moveExitButtonsToTop = settings.top_exit_buttons as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.moveExitButtonsToTop;
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
            const mediaRoot = exitButtonDiv.parentElement?.querySelector("div[class*='media--root']");
            if (!mediaRoot) {
                return;
            }

            const trueButton = exitButtonDiv.querySelector("button");
            const [mimicPanel, mimicButton] = this.createPerhapsNotMimic();

            if (trueButton && mimicButton) {
                trueButton.addEventListener("click", () => mimicPanel.remove());
                mimicButton.addEventListener("click", () => {
                    trueButton!!.click();
                    mimicPanel.remove();
                });
                mediaRoot.parentElement?.insertBefore(mimicPanel, mediaRoot.nextSibling!!);
            }
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
