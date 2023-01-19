import { GameStateController } from "../game_state.js";
import {SettingsObject} from "../settings.js";
import {IMutationAwareFixer, IStateAware} from "./base.js";
import {debug} from "../logging.js";

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

export class DiscreteScrollbarsFixer implements IMutationAwareFixer, IStateAware {
    private removeDiscreteScrollbars = false;
    private removeMaxedOutScrollbars = false;
    private maxedOutQualities: Set<string> = new Set();

    onNodeAdded(node: HTMLElement): void {
        const sidebarQualities = node.querySelectorAll("li[class*='sidebar-quality'] div[class='item__desc']");
        if (sidebarQualities.length > 0) {
            for (const quality of sidebarQualities) {
                const qualityName = quality.querySelector("span[class*='item__name']");
                if (!qualityName || !qualityName.textContent) {
                    continue;
                }

                if ((this.removeDiscreteScrollbars && DISCRETE_SIDEBAR_QUALITIES.includes(qualityName.textContent))
                    || (this.removeMaxedOutScrollbars && this.maxedOutQualities.has(qualityName.textContent))) {
                    this.hideScrollBar(quality as HTMLElement);

                    // This is hackish as heck, but still better than misaligned quality names... So be it.
                    // (although "Monstrous Anatomy" will still fail the check and be misaligned)
                    if (qualityName.textContent.length < 16) {
                        (quality as HTMLElement).style.cssText = "padding-top: 7px";
                    } else {
                        (quality as HTMLElement).style.cssText = "margin-top: -4px";
                    }
                }
            }
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }

    applySettings(settings: SettingsObject): void {
        this.removeDiscreteScrollbars = settings.discrete_scrollbars as boolean;
        this.removeMaxedOutScrollbars = settings.maxed_out_scrollbars as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.removeDiscreteScrollbars || this.removeMaxedOutScrollbars;
    }

    hideScrollBar(node: HTMLElement) {
        const scrollBar = node.parentElement?.querySelector("div[class='progress-bar']") as HTMLElement;
        if (scrollBar) {
            // FIXME: Use classes to manipulate visibility
            scrollBar.style.cssText = "display: none;";
        }
    }

    showScrollBar(node: HTMLElement) {
        const scrollBar = node.parentElement?.querySelector("div[class='progress-bar']") as HTMLElement;
        if (scrollBar) {
            // FIXME: Use classes to manipulate visibility
            scrollBar.style.cssText = "";
        }
    }

    linkState(state: GameStateController): void {
        // FIXME: Take into account that qualities can be affected as a result of the branch!!
        state.onCharacterDataLoaded((g) => {
            for (const quality of g.enumerateQualities()) {
                if (quality.cap > 0 && quality.effectiveLevel >= quality.cap) {
                    debug(`"${quality.name}" is maxed out! (${quality.level} >= ${quality.cap})`);
                    this.maxedOutQualities.add(quality.name);
                }
            }
        });

        state.onQualityChanged((quality, before, after) => {
            if (quality.qualityId === 212) {
                debugger;
            }

            // FIXME: Optimize by looking at "before"
            if (quality.level < quality.cap) {
                this.maxedOutQualities.delete(quality.name);
            } else {
                this.maxedOutQualities.add(quality.name);
            }

            const sidebarIndicatior = this.findSidebarQuality(quality.name);
            if (sidebarIndicatior) {
                if (this.maxedOutQualities.has(quality.name)) {
                    this.hideScrollBar(sidebarIndicatior);
                } else {
                    this.showScrollBar(sidebarIndicatior);
                }
            }
        });
    }

    private findSidebarQuality(qualityName: string): HTMLElement | null {
        const sideBarLabels = document.querySelectorAll(`li[class*='sidebar-quality'] span[class*='item__name']`);
        for (const label of sideBarLabels) {
            if (label.textContent == qualityName) {
                return label as HTMLElement;
            }
        }

        return null;
    }
}
