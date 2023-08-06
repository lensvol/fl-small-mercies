import {GameStateController} from "../game_state.js";
import {SettingsObject} from "../settings.js";
import {IMutationAware, IStateAware} from "./base.js";
import { getSingletonByClassName } from "../utils.js";

const DISCRETE_SIDEBAR_QUALITIES = ["Notability", "Influence", "Bizarre", "Dreaded", "Respectable", "Irrigo", "A Turncoat", "Moonlit"];

export class DiscreteScrollbarsFixer implements IMutationAware, IStateAware {
    private removeDiscreteScrollbars = false;
    private removeMaxedOutScrollbars = false;
    private maxedOutQualities: Set<string> = new Set();
    private qualityDisplays: Map<string, HTMLElement> = new Map();

    onNodeAdded(node: HTMLElement): void {
        const sidebarQualities = node.getElementsByClassName("sidebar-quality");
        if (sidebarQualities.length <= 0) {
            return;
        }

        for (const quality of sidebarQualities) {
            const qualityName = getSingletonByClassName(quality as HTMLElement, "item__name");
            if (!qualityName || !qualityName.textContent) {
                continue;
            }

            this.qualityDisplays.set(qualityName.textContent, quality as HTMLElement);

            if (
              (this.removeDiscreteScrollbars && DISCRETE_SIDEBAR_QUALITIES.includes(qualityName.textContent)) ||
              (this.removeMaxedOutScrollbars && this.maxedOutQualities.has(qualityName.textContent))
            ) {
                this.changeScrollBarVisibility(quality as HTMLElement, true);

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

    onNodeRemoved(node: HTMLElement): void {
        for (const key of this.qualityDisplays.keys()) {
            const display = this.qualityDisplays.get(key);
            if (display && node.contains(display)) {
                this.qualityDisplays.delete(key);
            }
        }
    }

    applySettings(settings: SettingsObject): void {
        this.removeDiscreteScrollbars = settings.discrete_scrollbars as boolean;
        this.removeMaxedOutScrollbars = settings.maxed_out_scrollbars as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.removeDiscreteScrollbars && !this.removeMaxedOutScrollbars) {
            return false;
        }

        return node.getElementsByClassName("sidebar-quality").length > 0;
    }

    changeScrollBarVisibility(node: HTMLElement, hidden: boolean) {
        const scrollBar = getSingletonByClassName(node, "progress-bar");
        if (scrollBar) {
            scrollBar.style.cssText = hidden ? "display: none;" : "";
        }
    }

    linkState(state: GameStateController): void {
        // FIXME: Take into account that qualities can be affected as a result of the branch!!
        state.onCharacterDataLoaded((g) => {
            for (const quality of g.enumerateQualities()) {
                if (quality.cap > 0 && quality.level >= quality.cap) {
                    this.maxedOutQualities.add(quality.name);
                }
            }
        });

        state.onQualityChanged((state, quality, _before, _after) => {
            // FIXME: Optimize by looking at "before"
            if (quality.level < quality.cap) {
                this.maxedOutQualities.delete(quality.name);
            } else {
                this.maxedOutQualities.add(quality.name);
            }

            const qualityDisplay = this.qualityDisplays.get(quality.name);
            if (qualityDisplay) {
                this.changeScrollBarVisibility(qualityDisplay, this.maxedOutQualities.has(quality.name));
            }
        });
    }
}
