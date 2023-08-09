import {IMutationAware} from "./base.js";
import {SettingsObject} from "../settings.js";

const PLAN_ARIA_LABELS = ["Mark this choice as a plan", "You have completed this plan; click to restart it", "Remove this choice from your plans"];
const PLAN_BUTTONLET_SELECTOR = PLAN_ARIA_LABELS.map((label) => `div.branch__plan-buttonlet button[aria-label='${label}']`).join(", ");
const PLANS_BUTTON_SELECTOR = "li[data-name='plans']";

export class PlanButtonsFixer implements IMutationAware {
    private removePlanButtons = false;

    applySettings(settings: SettingsObject): void {
        this.removePlanButtons = settings.remove_plan_buttons as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if(!this.removePlanButtons) {
            return false;
        }

        const planButtonlets = node.getElementsByClassName("branch__plan-buttonlet");
        const navButtons = node.getElementsByClassName("nav__item");

        if (planButtonlets.length > 0) {
            return true;
        }

        for (const buttonElement of navButtons) {
            const button = buttonElement as HTMLElement;
            if (button.dataset.name === "plans") {
                return true;
            }
        }

        return false;
    }

    onNodeAdded(node: HTMLElement): void {
        node.querySelectorAll(PLAN_BUTTONLET_SELECTOR).forEach((b) => b.remove());

        node.querySelectorAll(PLANS_BUTTON_SELECTOR).forEach((b) => b.remove());
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
