import {IMutationAware} from "./base.js";
import {SettingsObject} from "../settings.js";

import {getSingletonByClassName} from "../utils.js";
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

export class AutoScrollFixer implements IMutationAware {
    private enableAutoScrollBack = false;
    private scrollBehavior = "auto";

    applySettings(settings: SettingsObject): void {
        this.enableAutoScrollBack = settings.auto_scroll_back as boolean;
        this.scrollBehavior = settings.scroll_back_behavior as string;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.enableAutoScrollBack) {
            return false;
        }

        if (node.classList.contains("media--root")) {
            return true;
        }

        return node.getElementsByClassName("media--root").length > 0;
    }

    onNodeAdded(node: HTMLElement): void {
        const mediaRoot = getSingletonByClassName(node,"media--root");
        if (!mediaRoot) {
            return;
        }

        if (!isElementInViewport(mediaRoot)) {
            const args = {behavior: this.scrollBehavior as ScrollBehavior};

            const candidates = document.getElementsByClassName("nav--tabs--main");
            if (candidates.length == 0) {
                debug("No tabs found, scrolling to media root.");
                mediaRoot.scrollIntoView(args);
            } else {
                (candidates[0] as HTMLElement).scrollIntoView(args);
            }
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
