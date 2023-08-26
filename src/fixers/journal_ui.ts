import {IMutationAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {getSingletonByClassName} from "../utils.js";

const LIGHT_TURQUOISE_RGB = "#92d1d5";

export class JournalUiFixer implements IMutationAware {
    private fixJournalUI = false;

    applySettings(settings: SettingsObject): void {
        this.fixJournalUI = settings.fix_journal_navigation as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        if (!this.fixJournalUI) {
            return false;
        }

        return document.getElementsByClassName("react-date-picker__button__icon").length > 0;
    }

    onNodeAdded(node: HTMLElement): void {
        const datePickerIcons = node.getElementsByClassName("react-date-picker__button__icon");
        for (const icon of datePickerIcons) {
            const stencil = icon as HTMLElement;
            stencil.setAttribute("stroke", LIGHT_TURQUOISE_RGB);
        }

        const topButtonsContainer = getSingletonByClassName(node, "journal-entries__header-and-controls");
        if (topButtonsContainer) {
            const header = getSingletonByClassName(topButtonsContainer, "journal-entries__header");
            if (header) {
                const newHeader = header.cloneNode(true) as HTMLElement;
                newHeader.style.cssText = "position: absolute";
                topButtonsContainer.parentElement?.insertBefore(newHeader, topButtonsContainer);

                header.remove();
            }

            const buttons = getSingletonByClassName(node, "journal-entries__controls");
            if (buttons) {
                buttons.remove();
                topButtonsContainer.parentElement?.insertBefore(buttons, topButtonsContainer);
            }
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
