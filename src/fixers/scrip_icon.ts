import {SettingsObject} from "../settings.js";
import {IMutationAware} from "./base.js";
import { getSingletonByClassName } from "../utils.js";

export class ScripIconFixer implements IMutationAware {
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
        this.showScripIcon = settings.scrip_icon as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.showScripIcon) {
            return false;
        }

        return getSingletonByClassName(node,"sidebar") != null;
    }
}
