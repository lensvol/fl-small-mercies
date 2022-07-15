// Shamelessly taken from https://stackoverflow.com/a/2901298
function numberWithCommas(x) {
    const result = x.replace(/\B(?=(\d{3})+(?!\d))/g, ",").trim();
    return result.endsWith(".00") ? result.slice(0, result.length - 3) : result;
}
class ThousandSeparatorFixer {
    constructor() {
        this.currencyObserver = new MutationObserver((mutations, observer) => {
            for (let m = 0; m < mutations.length; m++) {
                const amount = mutations[m].target.textContent;
                if (amount) {
                    observer.disconnect();
                    mutations[m].target.textContent = numberWithCommas(amount);
                    observer.observe(mutations[m].target, { subtree: true, characterData: true });
                }
            }
        });
        this.shopPriceObserver = new MutationObserver((mutations, observer) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];
                for (let n = 0; n < mutation.addedNodes.length; n++) {
                    const node = mutation.addedNodes[n];
                    if (node.nodeName.toLowerCase() != "li") {
                        continue;
                    }
                    const priceField = node.querySelector("div[class*='item__price']");
                    if (priceField) {
                        priceField.textContent = numberWithCommas(priceField.textContent);
                    }
                }
            }
        });
        this.observer = new MutationObserver((mutations, observer) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];
                for (let n = 0; n < mutation.addedNodes.length; n++) {
                    const node = mutation.addedNodes[n];
                    if (node.nodeName.toLowerCase() !== "div") {
                        continue;
                    }
                    const echoesIndicator = document.querySelector("div[class*='sidebar'] ul li div div[class='item__value'] div[class*='item__price']");
                    if (echoesIndicator) {
                        echoesIndicator.textContent = numberWithCommas(echoesIndicator.textContent);
                        this.currencyObserver.observe(echoesIndicator, { subtree: true, characterData: true });
                    }
                    const shopPanel = node.querySelector("div[class*='shop']");
                    if (shopPanel) {
                        this.shopPriceObserver.observe(shopPanel, { childList: true, subtree: true });
                    }
                }
            }
        });
    }
    disable() {
        this.shopPriceObserver.disconnect();
        this.currencyObserver.disconnect();
        this.observer.disconnect();
    }
    enable() {
        this.observer.observe(document, { childList: true, subtree: true });
    }
}
export { ThousandSeparatorFixer };
//# sourceMappingURL=thousands_separator.js.map