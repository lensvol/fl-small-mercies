function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */);
}
export class AutoScrollFixer {
    constructor() {
        this.observer = new MutationObserver((mutations, observer) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];
                for (let n = 0; n < mutation.addedNodes.length; n++) {
                    const node = mutation.addedNodes[n];
                    if (node.nodeName.toLowerCase() !== "div") {
                        continue;
                    }
                    let mediaRoot;
                    if (node.classList.contains("media--root")) {
                        mediaRoot = node;
                    }
                    else {
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
                        }
                        else {
                            mediaRoot.scrollIntoView();
                        }
                    }
                }
            }
        });
    }
    disable() {
        this.observer.disconnect();
    }
    enable() {
        this.observer.observe(document, { childList: true, subtree: true });
    }
}
//# sourceMappingURL=auto_scroll.js.map