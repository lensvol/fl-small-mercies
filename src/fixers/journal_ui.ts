import {IMercyFixer} from "./base.js";

const CALENDAR_STENCIL_SELECTOR = "svg[class*='react-date-picker__button__icon']";
const LIGHT_TURQUOISE_RGB = "#92d1d5";

class JournalUiFixer implements IMercyFixer {
    private observer: MutationObserver

    constructor() {
        this.observer = new MutationObserver(((mutations, observer) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];

                for (let n = 0; n < mutation.addedNodes.length; n++) {
                    const node = mutation.addedNodes[n] as HTMLElement;

                    if (node.nodeName.toLowerCase() !== "div") {
                        continue;
                    }

                    node.querySelectorAll(CALENDAR_STENCIL_SELECTOR)
                        .forEach((st) => st.setAttribute("stroke", LIGHT_TURQUOISE_RGB));

                    const topButtonsContainer = node.querySelector("div[class='journal-entries__header-and-controls']");
                    if (topButtonsContainer) {
                        const header = topButtonsContainer.querySelector("h1");
                        if (header) {
                            const newHeader = header.cloneNode(true) as HTMLElement;
                            newHeader.style.cssText = "position: absolute";
                            topButtonsContainer.parentElement?.insertBefore(newHeader, topButtonsContainer);

                            header.remove();
                        }

                        const buttons = node.querySelector("div[class='journal-entries__controls']");
                        if (buttons) {
                            buttons.remove();
                            topButtonsContainer.parentElement?.insertBefore(buttons, topButtonsContainer);
                        }
                    }
                }
            }
        }));
    }

    disable(): void {
        this.observer.disconnect();
    }

    enable(): void {
        this.observer.observe(document, {childList: true, subtree: true});
    }
}

export { JournalUiFixer };