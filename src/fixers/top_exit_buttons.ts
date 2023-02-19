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

    onNodeAdded(node: HTMLElement): void {
        const exitButtonDiv = this.findNodeWithClass(node, 'buttons--storylet-exit-options');

        if (exitButtonDiv) {
            const mediaRoot = exitButtonDiv.parentElement?.querySelector("div[class*='media--root']");
            if (!mediaRoot) {
                return;
            }

            mediaRoot.parentElement?.insertBefore(exitButtonDiv, mediaRoot.nextSibling!!);
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
