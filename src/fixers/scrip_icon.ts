import {SettingsObject} from "../settings.js";
import {IMutationAwareFixer} from "./base.js";

export class ScripIconFixer implements IMutationAwareFixer {
    private showScripIcon = false;

    onNodeAdded(node: HTMLElement): void {
        const currencyHeadings = node.querySelectorAll("span[class='item__name']");
        for (const heading of currencyHeadings) {
            if (heading.textContent == "Hinterland Scrip" && heading.parentElement) {
                const scripIndicator = heading.parentElement.querySelector("div[class='item__value']");
                if (scripIndicator) {
                    scripIndicator.classList.add("scrip", "price--inverted");
                }
            }
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
    // Do nothing if DOM node is removed.
}

    applySettings(settings: SettingsObject): void {
        this.showScripIcon = settings.scrip_icon;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.showScripIcon;
    }
}
