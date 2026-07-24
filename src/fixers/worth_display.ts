import {IMutationAware} from "./base";
import {SettingsObject} from "../settings";
import {getSingletonByClassName} from "../utils";
import {ITEM_PRICES_BY_ID, ITEM_ID_BY_NAME} from "../datasets/item_prices";

export class WorthDisplayFixer implements IMutationAware {
    private addWorthToTooltips: boolean = false;

    applySettings(settings: SettingsObject): void {
        this.addWorthToTooltips = settings.add_worth_tooltips as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.addWorthToTooltips) return false;

        return getSingletonByClassName(node, "tooltip__desc") !== null;
    }

    onNodeAdded(node: HTMLElement): void {
        const itemNameSpan = getSingletonByClassName(node, "item__name");
        const itemId = ITEM_ID_BY_NAME.get(itemNameSpan?.textContent || "");
        const worth = ITEM_PRICES_BY_ID.get(itemId || 0);

        if (!worth) {
            return;
        }

        // Tippy caches its tooltips, so we need to make sure we have not already processed this one.
        if (getSingletonByClassName(node, "fl-item-worth") != null) {
            return;
        }
        const secondaryDescription = getSingletonByClassName(node, "tooltip__secondary-description");
        if (secondaryDescription) {
            const insert = document.createElement("div");
            insert.classList.add("tooltip__secondary-description", "fl-item-worth");

            const worthIndicator = document.createElement("span");
            worthIndicator.classList.add("worth-indicator-golden");
            worthIndicator.textContent = `Worth ${worth} Echoes`;
            insert.appendChild(worthIndicator);

            secondaryDescription.insertAdjacentElement("afterend", insert);
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
