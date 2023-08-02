import {IMutationAware} from "./base.js";
import {SettingsObject} from "../settings.js";

export class SingleItemIconFixer implements IMutationAware {
    private hideSingleItemIcon: boolean = false;

    applySettings(settings: SettingsObject): void {
        this.hideSingleItemIcon = settings.hide_single_item_icon as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.hideSingleItemIcon;
    }

    onNodeAdded(node: HTMLElement): void {
        const itemCounters = node.getElementsByClassName("js-item-value");
        for (let i = 0; i < itemCounters.length; i++) {
            const counter = itemCounters[i] as HTMLElement;
            if (counter.nodeName.toLowerCase() === "span" && counter.textContent == "1") {
                counter.style.cssText = "display: none;";
            }
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
