import {IMutationAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import { getSingletonByClassName } from "../utils.js";

export class SingleItemIconFixer implements IMutationAware {
    private hideSingleItemIcon = false;

    applySettings(settings: SettingsObject): void {
        this.hideSingleItemIcon = settings.hide_single_item_icon as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.hideSingleItemIcon) {
            return false;
        }

        return getSingletonByClassName(node,"possessions") !== null;
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

    onNodeRemoved(_node: HTMLElement): void {
        // We do not care about counters being removed.
    }
}
