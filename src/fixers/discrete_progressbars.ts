import {IMercyFixer} from "./base.js";

const DISCRETE_SIDEBAR_QUALITIES = [
    "Notability",
    "Influence",
    "Bizarre",
    "Dreaded",
    "Respectable",
    "Irrigo",
    "A Turncoat",
    "Moonlit"
];

export class DiscreteScrollbarsFixer implements IMercyFixer {
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

                    const sidebarQualities = node.querySelectorAll("li[class*='sidebar-quality'] div[class='item__desc']");
                    if (sidebarQualities.length > 0) {
                        for (const quality of sidebarQualities) {
                            const qualityName = quality.querySelector("span[class*='item__name']");
                            if (!qualityName || !qualityName.textContent) {
                                continue;
                            }

                            if (DISCRETE_SIDEBAR_QUALITIES.includes(qualityName.textContent)) {
                                const progressBar = quality.querySelector("div[class*='progress-bar']");
                                if (progressBar) {
                                    progressBar.remove();
                                }

                                (quality as HTMLElement).style.cssText = "padding-top: 7px";
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
