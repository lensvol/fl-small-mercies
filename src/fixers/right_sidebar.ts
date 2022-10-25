import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";

const MASK_ROSE_BANNER_SELECTOR = "img[aria-label='Wishlist Mask of the Rose on Steam'"
const SNIPPET_CONTAINER_SELECTOR = "div[class='snippet']"

class RightSidebarFixer implements IMutationAwareFixer {
    private removeMaskBanner: boolean = false
    private removeSnippets: boolean = false

    applySettings(settings: SettingsObject): void {
        this.removeMaskBanner = settings.remove_mask_banner;
        this.removeSnippets = settings.remove_sidebar_snippets;
    }

    onNodeAdded(node: HTMLElement): void {
        if (this.removeMaskBanner) {
            const banner = node.querySelector(MASK_ROSE_BANNER_SELECTOR);
            banner?.parentElement?.remove();
        }

        if (this.removeSnippets) {
            const snippetContainer = node.querySelector(SNIPPET_CONTAINER_SELECTOR);
            snippetContainer?.remove();
        }
    }

    onNodeRemoved(node: HTMLElement): void {}

    checkEligibility(node: HTMLElement): boolean {
        return this.removeMaskBanner || !this.removeSnippets;
    }
}

export { RightSidebarFixer };