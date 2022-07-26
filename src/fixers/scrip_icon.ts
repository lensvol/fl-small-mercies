import {IMercyFixer} from "./base.js";

export class ScripIconFixer implements IMercyFixer {
    private observer: MutationObserver

    constructor() {
        this.observer = new MutationObserver((mutations, observer) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];

                for (let n = 0; n < mutation.addedNodes.length; n++) {
                    const node = mutation.addedNodes[n] as HTMLElement;

                    if (node.nodeName.toLowerCase() !== "div") {
                        continue;
                    }

                    const currencyHeadings = node.querySelectorAll("span[class='item__name']");
                    for (const heading of currencyHeadings) {
                        if (heading.textContent == "Hinterland Scrip" && heading.parentElement) {
                            const scripIndicator = heading.parentElement.querySelector("div[class='item__value']");
                            if (scripIndicator) {
                                scripIndicator.classList.add("scrip", "price--inverted");
                            }
                        }
                    }
                }
            }
        });
    }

    disable(): void {
        this.observer.disconnect();
    }

    enable(): void {
        this.observer.observe(document, {childList: true, subtree: true});
    }
}
