import { SettingsObject } from "../settings.js";
import {IMutationAwareFixer} from "./base.js";

const DISCRETE_SIDEBAR_QUALITIES = [
    "Notability",
    "Influence",
    "Bizarre",
    "Dreaded",
    "Respectable",
    "Irrigo",
    "A Turncoat",
    "Moonlit"
];

export class DiscreteScrollbarsFixer implements IMutationAwareFixer {
    private removeDiscreteScrollbars: boolean = false;

    onNodeAdded(node: HTMLElement): void {
        const sidebarQualities = node.querySelectorAll("li[class*='sidebar-quality'] div[class='item__desc']");
        if (sidebarQualities.length > 0) {
            for (const quality of sidebarQualities) {
                const qualityName = quality.querySelector("span[class*='item__name']");
                if (!qualityName || !qualityName.textContent) {
                    continue;
                }

                if (DISCRETE_SIDEBAR_QUALITIES.includes(qualityName.textContent)) {
                    const progressBar = quality.querySelector("div[class*='progress-bar']");
                    if (progressBar) {
                        progressBar.remove();
                    }

                    (quality as HTMLElement).style.cssText = "padding-top: 7px";
                }
            }
        }
    }

    onNodeRemoved(node: HTMLElement): void {}

    applySettings(settings: SettingsObject): void {
        this.removeDiscreteScrollbars = settings.discrete_scrollbars;
    }

    checkEligibility(node: HTMLElement): boolean {
        return this.removeDiscreteScrollbars;
    }

}
