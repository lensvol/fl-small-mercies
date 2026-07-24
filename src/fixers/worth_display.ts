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
        if (!node.hasAttribute("data-tippy-root")) {
            return;
        }

        let itemName: string = "";
        const itemNameSpan = getSingletonByClassName(node, "item__name");
        if (!itemNameSpan?.textContent) {
            // Tooltips that appear on branch results usually do not have item name on them, but we can try
            // and find it by trying to find a 'div' described by this tooltip.
            const tooltipId = node.id;
            const qualityUpdatesNode = getSingletonByClassName(document.body, "media--quality-updates");
            if (!qualityUpdatesNode) {
                // Something strange is going on here, we better bail.
                return;
            }

            const tooltipIcon = node.querySelector('div[class*="tooltip__icon"] img');
            if (!tooltipIcon) {
                return;
            }

            const itemIcon = qualityUpdatesNode.querySelector(`img[src="${tooltipIcon.getAttribute("src")!!}"]`);
            if (!itemIcon) {
                return;
            }

            itemName = itemIcon.getAttribute("aria-label") || "";
        } else {
            itemName = itemNameSpan.textContent;
        }

        const itemId = ITEM_ID_BY_NAME.get(itemName || "");
        const itemWorth = ITEM_PRICES_BY_ID.get(itemId || 0);

        if (!itemWorth) {
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
            worthIndicator.textContent = `Worth ${itemWorth} Echoes`;
            insert.appendChild(worthIndicator);

            secondaryDescription.insertAdjacentElement("afterend", insert);
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
