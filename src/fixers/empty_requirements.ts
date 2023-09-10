import {IMutationAware} from "./base";
import {SettingsObject} from "../settings";
import {getSingletonByClassName} from "../utils";

export class SocialEmptyReqsFixer implements IMutationAware {
    private fixEmptyRequirements = false;

    applySettings(settings: SettingsObject): void {
        this.fixEmptyRequirements = settings.fix_empty_requirements as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.fixEmptyRequirements) {
            return false;
        }

        return getSingletonByClassName(node, "act__quality-requirements") != null;
    }

    onNodeAdded(node: HTMLElement): void {
        let requirementsPanel = node.querySelector("div[class*='act__quality-requirements']") as HTMLElement;
        if (!requirementsPanel) {
            if (node.classList.contains("act__quality-requirements")) {
                requirementsPanel = node;
            }
        }

        if (requirementsPanel && requirementsPanel.childElementCount == 0) {
            requirementsPanel.style.cssText = "display: none";
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
