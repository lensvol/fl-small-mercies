import {IMercyFixer} from "./base.js";

// Adapted from
// https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
function isElementInViewport (el: Element): boolean {
    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

export class AutoScrollFixer implements IMercyFixer {
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

                    let mediaRoot: Element | null
                    if (node.classList.contains("media--root")) {
                        mediaRoot = node;
                    } else {
                        mediaRoot = node.querySelector("div[class*='media--root']");
                    }
                    if (!mediaRoot) {
                        continue;
                    }

                    if (!isElementInViewport(mediaRoot)) {
                        console.debug("Storylet not visible, scrolling back...");
                        const tabList = document.querySelector("ul[role='tablist']");
                        if (tabList) {
                            tabList.scrollIntoView();
                        } else {
                            mediaRoot.scrollIntoView();
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
