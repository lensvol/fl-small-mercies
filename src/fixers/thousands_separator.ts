import { SettingsObject } from "../settings.js";
import {IMercyFixer, IMutationAwareFixer} from "./base.js";

// Shamelessly taken from https://stackoverflow.com/a/2901298
function numberWithCommas(x: string): string {
    const result = x.replace(/\B(?=(\d{3})+(?!\d))/g, ",").trim();
    return result.endsWith(".00") ? result.slice(0, result.length - 3) : result;
}

class ThousandSeparatorFixer implements IMercyFixer, IMutationAwareFixer {
    private separateThousands: boolean = false;
    private currencyObserver: MutationObserver;
    private shopPriceObserver: MutationObserver;

    constructor() {
        this.currencyObserver = new MutationObserver((mutations, observer) => {
            for (let m = 0; m < mutations.length; m++) {
                const amount = mutations[m].target.textContent;
                if (amount) {
                    observer.disconnect();
                    mutations[m].target.textContent = numberWithCommas(amount);
                    observer.observe(mutations[m].target, {subtree: true, characterData: true});
                }
            }
        });

        this.shopPriceObserver = new MutationObserver((mutations, observer) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];

                for (let n = 0; n < mutation.addedNodes.length; n++) {
                    const node = mutation.addedNodes[n] as HTMLElement;
                    if (node.nodeName.toLowerCase() != "li") {
                        continue;
                    }

                    const priceField = node.querySelector("div[class*='item__price']");
                    if (priceField) {
                        priceField.textContent = numberWithCommas(priceField.textContent!);
                    }
                }
            }
        });
    }

    onNodeAdded(node: HTMLElement): void {
        const echoesIndicator = node.querySelector("div[class*='sidebar'] ul li div div[class='item__value'] div[class*='item__price']");
        if (echoesIndicator) {
            echoesIndicator.textContent = numberWithCommas(echoesIndicator.textContent!);
            this.currencyObserver.observe(echoesIndicator, {subtree: true, characterData: true});
        }

        const currencyHeadings = node.querySelectorAll("span[class='item__name']");
        for (const heading of currencyHeadings) {
            if (heading.textContent == "Hinterland Scrip" && heading.parentElement) {
                const scripIndicator = heading.parentElement.querySelector("div[class='item__value']");
                if (scripIndicator) {
                    scripIndicator.textContent = numberWithCommas(scripIndicator.textContent!);
                    this.currencyObserver.observe(scripIndicator, {subtree: true, characterData: true});
                }
            }
        }

        const shopPanel = node.querySelector("div[class*='shop']");
        if (shopPanel) {
            this.shopPriceObserver.observe(shopPanel, {childList: true, subtree: true});
        }
    }

    onNodeRemoved(node: HTMLElement): void {}

    applySettings(settings: SettingsObject): void {
        this.separateThousands = settings.add_thousands_separator;

        if (!this.separateThousands) {
            this.shopPriceObserver.disconnect();
            this.currencyObserver.disconnect();
        }
    }

    checkEligibility(node: HTMLElement): boolean {
        return this.separateThousands;
    }
}

export { ThousandSeparatorFixer };