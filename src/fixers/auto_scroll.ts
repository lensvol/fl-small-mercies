import {IMercyFixer, IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";

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

export class AutoScrollFixer implements IMutationAwareFixer {
    private enableAutoScrollBack: boolean = false;

    applySettings(settings: SettingsObject): void {
        this.enableAutoScrollBack = settings.auto_scroll_back;
    }

    checkEligibility(node: HTMLElement): boolean {
        return this.enableAutoScrollBack;
    }

    onNodeAdded(node: HTMLElement): void {
        let mediaRoot: Element | null
        if (node.classList.contains("media--root")) {
            mediaRoot = node;
        } else {
            mediaRoot = node.querySelector("div[class*='media--root']");
        }
        if (!mediaRoot) {
            return;
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

    onNodeRemoved(node: HTMLElement): void {}

}
