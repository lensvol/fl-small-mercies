import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";


const AF_YEAR_OFFSET = 122;

export class AfterFallYearFixer implements IMutationAwareFixer {
    private showAfYear = false;

    applySettings(settings: SettingsObject): void {
        this.showAfYear = settings.show_af_year as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.showAfYear;
    }

    onNodeAdded(node: HTMLElement): void {
        const dateSpans = node.querySelectorAll("span[class='journal-entry__date']");
        for (const span of dateSpans) {
            if (!span.textContent) {
                continue;
            }

            const parts = span.textContent.split(",");
            const year = Number.parseInt(parts[1]);
            span.textContent = `${parts[0]}, ${year - AF_YEAR_OFFSET}`;
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
    // Do nothing if DOM node is removed.
    }
}
