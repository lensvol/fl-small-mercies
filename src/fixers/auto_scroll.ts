import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";
import {debug} from "../logging.js";

// Adapted from
// https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
function isElementInViewport(el: Element): boolean {
    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

export class AutoScrollFixer implements IMutationAwareFixer {
    private enableAutoScrollBack = false;
    private scrollBehavior = "auto";

    applySettings(settings: SettingsObject): void {
        this.enableAutoScrollBack = settings.auto_scroll_back as boolean;
        this.scrollBehavior = settings.scroll_back_behavior as string;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.enableAutoScrollBack;
    }

    onNodeAdded(node: HTMLElement): void {
        let mediaRoot: Element | null;
        if (node.classList.contains("media--root")) {
            mediaRoot = node;
        } else {
            mediaRoot = node.querySelector("div[class*='media--root']");
        }
        if (!mediaRoot) {
            return;
        }

        if (!isElementInViewport(mediaRoot)) {
            debug("Storylet not visible, scrolling back...");
            const tabList = document.querySelector("ul[role='tablist']");
            if (tabList) {
                tabList.scrollIntoView({behavior: this.scrollBehavior as ScrollBehavior});
            } else {
                mediaRoot.scrollIntoView({behavior: this.scrollBehavior as ScrollBehavior});
            }
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
