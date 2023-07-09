import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";

export class SingleItemIconFixer implements IMutationAwareFixer {
    private hideSingleItemIcon: boolean = false;

    applySettings(settings: SettingsObject): void {
        this.hideSingleItemIcon = settings.hide_single_item_icon as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.hideSingleItemIcon;
    }

    onNodeAdded(node: HTMLElement): void {
        const itemCounters = node.querySelectorAll("li > div > span[class*='js-item-value']");
        itemCounters.forEach((counter) => {
            if (counter.textContent == "1") {
                counter.remove();
            }
        });
    }

    onNodeRemoved(node: HTMLElement): void {
    }
}