const CALENDAR_STENCIL_SELECTOR = "svg[class*='react-date-picker__button__icon']";
const LIGHT_TURQUOISE_RGB = "#92d1d5";
class JournalUiFixer {
    constructor() {
        this.observer = new MutationObserver(((mutations, observer) => {
            var _a, _b;
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];
                for (let n = 0; n < mutation.addedNodes.length; n++) {
                    const node = mutation.addedNodes[n];
                    if (node.nodeName.toLowerCase() !== "div") {
                        continue;
                    }
                    node.querySelectorAll(CALENDAR_STENCIL_SELECTOR)
                        .forEach((st) => st.setAttribute("stroke", LIGHT_TURQUOISE_RGB));
                    const topButtonsContainer = node.querySelector("div[class='journal-entries__header-and-controls']");
                    if (topButtonsContainer) {
                        const header = topButtonsContainer.querySelector("h1");
                        if (header) {
                            const newHeader = header.cloneNode(true);
                            newHeader.style.cssText = "position: absolute";
                            (_a = topButtonsContainer.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(newHeader, topButtonsContainer);
                            header.remove();
                        }
                        const buttons = node.querySelector("div[class='journal-entries__controls']");
                        if (buttons) {
                            buttons.remove();
                            (_b = topButtonsContainer.parentElement) === null || _b === void 0 ? void 0 : _b.insertBefore(buttons, topButtonsContainer);
                        }
                    }
                }
            }
        }));
    }
    disable() {
        this.observer.disconnect();
    }
    enable() {
        this.observer.observe(document, { childList: true, subtree: true });
    }
}
export { JournalUiFixer };
//# sourceMappingURL=journal_ui.js.map