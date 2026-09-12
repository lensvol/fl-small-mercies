import {GameStateController, Quality} from "../game_state";
import {SettingsObject} from "../settings";
import {IMutationAware, INetworkAware, IStateAware} from "./base";
import {getSingletonByClassName} from "../utils";

export class MaxedOutScrollbarsFixer implements IMutationAware, IStateAware {
    private removeMaxedOutScrollbars = false;
    private maxedOutQualities: Set<string> = new Set();
    private qualityDisplays: Map<string, HTMLElement> = new Map();

    onNodeAdded(node: HTMLElement): void {
        let sidebarQualities = node.getElementsByClassName("sidebar-quality");
        if (sidebarQualities.length <= 0) {
            if (node.classList.contains("sidebar-quality")) {
                const qualityName = getSingletonByClassName(node as HTMLElement, "item__name");
                if (!qualityName || !qualityName.textContent) {
                    return;
                }

                this.qualityDisplays.set(qualityName.textContent, node as HTMLElement);
                this.updateScrollBarVisibility(qualityName.textContent);
            } else {
                return;
            }
        }

        for (const quality of sidebarQualities) {
            const qualityName = getSingletonByClassName(quality as HTMLElement, "item__name");
            if (!qualityName || !qualityName.textContent) {
                continue;
            }

            this.qualityDisplays.set(qualityName.textContent, quality as HTMLElement);
            this.updateScrollBarVisibility(qualityName.textContent);

            if (this.shouldBeHidden(qualityName.textContent)) {
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
        this.removeMaxedOutScrollbars = settings.maxed_out_scrollbars as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.removeMaxedOutScrollbars) {
            return false;
        }

        return node.getElementsByClassName("sidebar-quality").length > 0 || node.classList.contains("sidebar-quality");
    }

    updateScrollBarVisibility(qualityName: string) {
        const qualityDisplay = this.qualityDisplays.get(qualityName);
        if (!qualityDisplay) {
            return;
        }

        const scrollBar = getSingletonByClassName(qualityDisplay, "progress-bar");
        if (scrollBar) {
            scrollBar.style.cssText = this.shouldBeHidden(qualityName) ? "display: none;" : "";
        }
    }

    private shouldBeHidden(qualityName: string) {
        return this.removeMaxedOutScrollbars && this.maxedOutQualities.has(qualityName);
    }

    isMaxedOut(quality: Quality): boolean {
        return (
            (quality.cap !== 0 && quality.level >= quality.cap) ||
            (quality.progressAsPercentage !== -1 && quality.progressAsPercentage >= 100)
        );
    }

    linkState(state: GameStateController): void {
        state.onCharacterDataLoaded((g) => {
            for (const quality of g.enumerateQualities()) {
                if (this.isMaxedOut(quality)) {
                    this.maxedOutQualities.add(quality.name);
                }

                this.updateScrollBarVisibility(quality.name);
            }
        });

        state.onQualityChanged((_state, _previous, quality) => {
            if (this.isMaxedOut(quality)) {
                this.maxedOutQualities.add(quality.name);
            } else {
                this.maxedOutQualities.delete(quality.name);
            }

            this.updateScrollBarVisibility(quality.name);
        });
    }
}
