import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";

const PLAN_ARIA_LABELS = ["Mark this choice as a plan", "You have completed this plan; click to restart it", "Remove this choice from your plans"];
const PLAN_BUTTONLET_SELECTOR = PLAN_ARIA_LABELS.map((label) => `div.branch__plan-buttonlet button[aria-label='${label}']`).join(", ");
const PLANS_BUTTON_SELECTOR = "li[data-name='plans']";

export class PlanButtonsFixer implements IMutationAwareFixer {
    private removePlanButtons = false;

    applySettings(settings: SettingsObject): void {
        this.removePlanButtons = settings.remove_plan_buttons as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.removePlanButtons;
    }

    onNodeAdded(node: HTMLElement): void {
        node.querySelectorAll(PLAN_BUTTONLET_SELECTOR).forEach((b) => b.remove());

        node.querySelectorAll(PLANS_BUTTON_SELECTOR).forEach((b) => b.remove());
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
