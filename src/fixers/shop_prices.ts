import {IMutationAware} from "./base.js";
import {SettingsObject} from "../settings.js";

function numberWithCommas(x: string): string {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",").trim();
}

export class ShopPricesFixer implements IMutationAware {
    private separateThousands = false;
    private displayPriceTotals = false;
    private shopPriceObserver: MutationObserver;

    constructor() {
        this.shopPriceObserver = new MutationObserver((mutations, _) => {
            console.debug("Mutation observed in shop panel.");
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    const element = node as HTMLElement;
                    if (element.nodeName.toLowerCase() != "li") {
                        return;
                    }

                    if (!element.classList.contains("shop__item")) {
                        return;
                    }

                    const priceField = element.querySelector("div[class*='item__price']");
                    if (!priceField || priceField.textContent === null) {
                        return;
                    }

                    if (this.separateThousands) {
                        priceField.textContent = numberWithCommas(priceField.textContent);
                    }

                    if (this.displayPriceTotals) {
                        const sellButton = element.querySelector("button.js-bazaar-sell");
                        if (!sellButton || sellButton.classList.contains("flsm-has-listener")) {
                            return;
                        }
                        this.installHoverListener(sellButton, priceField);
                    }
                });
            });
        });
    }

    private installHoverListener(sellButton: Element, priceField: Element) {
        sellButton.addEventListener("mouseover", (event) => {
            const button = event.target as HTMLElement;

            const parent = button.parentElement?.parentElement;
            if (!parent) {
                return;
            }

            const quantityDisplay = parent.querySelector("span.icon__value");
            if (!quantityDisplay) {
                return;
            }

            const originalText = priceField.textContent || "0";
            const price = parseFloat(priceField.textContent?.replace(/,/, "") || "0");

            const quantityValue = parseInt(quantityDisplay.textContent ?? "0");
            let totalPrice = (price * quantityValue).toFixed(2);
            if (this.separateThousands) {
                totalPrice = numberWithCommas(totalPrice);
            }

            priceField.textContent = `${originalText} × ${quantityValue} = ${totalPrice}`;
            sellButton.addEventListener("mouseout", () => {
                priceField.textContent = originalText;
            }, { once: true });
        });
        sellButton.classList.add("flsm-has-listener");
    }

    applySettings(settings: SettingsObject): void {
        this.separateThousands = settings.add_thousands_separator as boolean;
        this.displayPriceTotals = settings.shop_price_totals as boolean;

        if (!this.separateThousands || !this.displayPriceTotals) {
            this.shopPriceObserver.disconnect();
        }
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.separateThousands || this.displayPriceTotals;
    }

    onNodeAdded(node: HTMLElement): void {
        const shopPanel = node.querySelector("div[class*='shop']");
        if (shopPanel) {
            this.shopPriceObserver.disconnect();
            this.shopPriceObserver.observe(shopPanel, {childList: true, subtree: true});
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
