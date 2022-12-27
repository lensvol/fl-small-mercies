import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";


export class AsceticModeFixer implements IMutationAwareFixer {
    private removeHeaderAndCandles = false;

    applySettings(settings: SettingsObject): void {
        this.removeHeaderAndCandles = settings.ascetic_mode;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.removeHeaderAndCandles;
    }

    onNodeAdded(node: HTMLElement): void {
        const banner = node.querySelector("div[class*='banner--lg-up']") as HTMLElement;
        if (banner) {
            const parentDiv = banner?.parentElement?.parentElement;
            parentDiv?.classList.add("u-visually-hidden");
        }

        const candleContainer = node.querySelector("div[class='candle-container']") as HTMLElement;
        if (candleContainer) {
            candleContainer.classList.add("u-visually-hidden");
        }

        // Shift columns a little to make overall look nicer
        const primaryColumn = node.querySelector("div[class*='col-primary']") as HTMLElement;
        if (primaryColumn) {
            primaryColumn.style.cssText = "padding-top: 10px;"
        }

        const tertiaryColumn = node.querySelector("div[class='col-tertiary']") as HTMLElement;
        if (tertiaryColumn) {
            tertiaryColumn.style.cssText = "padding-top: 44px;"
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }

}
