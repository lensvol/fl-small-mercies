import {IMutationAware} from "./base";
import {SettingsObject} from "../settings";

const AF_YEAR_OFFSET = 122;

export class AfterFallYearFixer implements IMutationAware {
    private showAfYear = false;

    applySettings(settings: SettingsObject): void {
        this.showAfYear = settings.show_af_year as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.showAfYear) {
            return false;
        }

        return node.getElementsByClassName("journal-entry__date").length > 0;
    }

    onNodeAdded(node: HTMLElement): void {
        const dateSpans = node.getElementsByClassName("journal-entry__date");
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
