import {IMutationAware} from "./base.js";
import {SettingsObject} from "../settings.js";

const CALENDAR_STENCIL_SELECTOR = "svg[class*='react-date-picker__button__icon']";
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
        node.querySelectorAll(CALENDAR_STENCIL_SELECTOR).forEach((st) => st.setAttribute("stroke", LIGHT_TURQUOISE_RGB));

        const topButtonsContainer = node.querySelector("div[class='journal-entries__header-and-controls']");
        if (topButtonsContainer) {
            const header = topButtonsContainer.querySelector("h1");
            if (header) {
                const newHeader = header.cloneNode(true) as HTMLElement;
                newHeader.style.cssText = "position: absolute";
                topButtonsContainer.parentElement?.insertBefore(newHeader, topButtonsContainer);

                header.remove();
            }

            const buttons = node.querySelector("div[class='journal-entries__controls']");
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
