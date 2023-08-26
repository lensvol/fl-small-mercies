import {IMutationAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {getSingletonByClassName} from "../utils.js";

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

                    let priceField = element.querySelector("div[class*='item__price']");
                    if (!priceField || priceField.textContent === null) {
                        priceField = element.querySelector("div[class*='item__desc'] > div > span");
                    }

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
            const isQuality = originalText.includes(" x ");
            const quantityValue = parseInt(quantityDisplay.textContent ?? "0");
            let reservedAmount = 0;

            const flgf_container = getSingletonByClassName(parent, "flgf__reserve-display");
            if (flgf_container) {
                reservedAmount = parseInt(flgf_container.textContent?.substring(9) || "0");
                if (reservedAmount > quantityValue) {
                    reservedAmount = quantityValue;
                }
            }

            let totalPrice: string;
            let priceText: string;
            if (isQuality) {
                const parts = originalText.split(" x ");
                if (parts.length != 2) {
                    // Something is clearly wrong, so we just abort.
                    return;
                }

                priceText = parts[0];
                const price = parseFloat(priceText.replace(/,/, "") || "0");

                // Price in items is always an integer, so we can just multiply
                // it without caring for fractions.
                totalPrice = (price * (quantityValue - reservedAmount)).toString();
            } else {
                priceText = originalText;
                const price = parseFloat(priceText.replace(/,/, "") || "0");

                totalPrice = (price * (quantityValue - reservedAmount)).toFixed(2);
            }

            if (this.separateThousands) {
                totalPrice = numberWithCommas(totalPrice);
            }

            if (reservedAmount == 0) {
                priceField.textContent = `${priceText} × ${quantityValue} = ${totalPrice}`;
            } else {
                priceField.textContent = `${priceText} × (${quantityValue} - ${reservedAmount}) = ${totalPrice}`;
            }

            sellButton.addEventListener(
                "mouseout",
                () => {
                    priceField.textContent = originalText;
                },
                {once: true}
            );
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

    checkEligibility(node: HTMLElement): boolean {
        if (!this.separateThousands && !this.displayPriceTotals) {
            return false;
        }

        return getSingletonByClassName(node, "shop") != null;
    }

    onNodeAdded(node: HTMLElement): void {
        const shopPanel = node.querySelector("div[class*='shop']");
        if (shopPanel) {
            this.shopPriceObserver.disconnect();
            this.shopPriceObserver.observe(shopPanel, {childList: true});
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
