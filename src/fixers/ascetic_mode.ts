import {IMutationAware} from "./base";
import {SettingsObject} from "../settings";
import {getSingletonByClassName} from "../utils";

export class AsceticModeFixer implements IMutationAware {
    private removeHeaderAndCandles = false;
    private removeFateCounter = false;

    applySettings(settings: SettingsObject): void {
        this.removeHeaderAndCandles = settings.ascetic_mode as boolean;
        this.removeFateCounter = settings.remove_fate_counter as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.removeHeaderAndCandles && !this.removeFateCounter) {
            return false;
        }

        return getSingletonByClassName(node, "sidebar") !== null;
    }

    onNodeAdded(node: HTMLElement): void {
        if (this.removeHeaderAndCandles) {
            const banner = getSingletonByClassName(node, "banner--lg-up");

            if (banner) {
                const parentDiv = banner?.parentElement?.parentElement;
                parentDiv?.classList.add("u-visually-hidden");
            }

            const candleContainer = getSingletonByClassName(node, "candle-container");
            if (candleContainer) {
                candleContainer.classList.add("u-visually-hidden");
            }

            // Shift columns a little to make overall look nicer
            const primaryColumn = getSingletonByClassName(node, "col-primary");
            if (primaryColumn) {
                primaryColumn.style.cssText = "padding-top: 10px;";
            }

            const tertiaryColumn = getSingletonByClassName(node, "col-tertiary");
            if (tertiaryColumn) {
                tertiaryColumn.style.cssText = "padding-top: 44px;";
            }
        }

        if (this.removeFateCounter) {
            const fateButton = getSingletonByClassName(node, "sidebar__fate-button");
            const fateItem = fateButton?.parentElement;
            fateItem?.classList.remove("item");
            fateItem?.classList.add("u-visually-hidden");
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
