import { SettingsObject } from "../settings.js";
import {IMercyFixer, IMutationAwareFixer} from "./base.js";

export class ScripIconFixer implements IMercyFixer, IMutationAwareFixer {
    private showScripIcon: boolean = false;

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

    onNodeRemoved(node: HTMLElement): void {}

    applySettings(settings: SettingsObject): void {
        this.showScripIcon = settings.scrip_icon;
    }

    checkEligibility(node: HTMLElement): boolean {
        return this.showScripIcon;
    }
}
