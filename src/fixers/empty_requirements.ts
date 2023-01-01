import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";

export class SocialEmptyReqsFixer implements IMutationAwareFixer {
    private fixEmptyRequirements = false;

    applySettings(settings: SettingsObject): void {
        this.fixEmptyRequirements = settings.fix_empty_requirements as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.fixEmptyRequirements;
    }

    onNodeAdded(node: HTMLElement): void {
        const requirementsPanel = node.querySelector("div[class*='act__quality-requirements']") as HTMLElement;
        if (!requirementsPanel) {
            if (node.classList.contains('act__quality-requirements')) {
                node.style.cssText = "display: none";
            }
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
