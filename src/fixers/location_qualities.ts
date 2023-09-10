import {SettingsObject} from "../settings";
import {IMutationAware, IStateAware} from "./base";
import {FLPlayerLocation, GameStateController} from "../game_state";

type LocationPredicate = (location: FLPlayerLocation) => boolean;

function isArea(areaName: string): LocationPredicate {
    return (location: FLPlayerLocation) => location.area.name == areaName;
}

function isSetting(settingName: string): LocationPredicate {
    return (location: FLPlayerLocation) => location.setting.name == settingName;
}

const QUALITIY_LOCATION_PREDICATES = new Map<string, LocationPredicate>();
QUALITIY_LOCATION_PREDICATES.set("Moonlit", isArea("Balmoral"));
QUALITIY_LOCATION_PREDICATES.set("Taimen's Attention", isSetting("Khanate (Inner)"));
QUALITIY_LOCATION_PREDICATES.set("A Turncoat", isArea("Spite"));
QUALITIY_LOCATION_PREDICATES.set("Disgruntlement among the Students", isSetting("Science Laboratory"));

export class LocationQualitiesFixer implements IMutationAware, IStateAware {
    private hideNonlocalQualities = false;
    private currentLocation: FLPlayerLocation | null = null;
    private relevantQualities: Map<string, HTMLElement> = new Map();

    applySettings(settings: SettingsObject): void {
        this.hideNonlocalQualities = settings.hide_nonlocal_qualities as boolean;
    }

    linkState(state: GameStateController): void {
        state.onLocationChanged((state, location) => {
            this.currentLocation = location;
            if (this.hideNonlocalQualities) {
                this.processSidebarQualities(location);
            }
        });
    }

    private processSidebarQualities(location: FLPlayerLocation) {
        for (const [name, quality] of this.relevantQualities.entries()) {
            const is_visible_at = QUALITIY_LOCATION_PREDICATES.get(name);
            if (!is_visible_at) continue;

            // FIXME: Replace with 'fl-sm-hidden' class usage.
            if (is_visible_at(location)) {
                quality.style.cssText = "";
            } else {
                quality.style.cssText = "display: none";
            }
        }
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.hideNonlocalQualities) {
            return false;
        }

        if (!this.currentLocation) {
            return false;
        }

        return node.getElementsByClassName("sidebar-quality").length > 0;
    }

    onNodeAdded(node: HTMLElement): void {
        if (!this.currentLocation) {
            return;
        }

        const candidates = node.getElementsByClassName("sidebar-quality");
        if (candidates.length > 0) {
            for (const element of candidates) {
                const quality = element as HTMLElement;

                // Check if the quality has a name node.
                const nameCandidates = quality.getElementsByClassName("item__name");
                if (nameCandidates.length == 0) {
                    continue;
                }

                // Check if the quality is one of the location-gated ones.
                const qualityName = (nameCandidates[0] as HTMLElement).textContent || "";
                if (QUALITIY_LOCATION_PREDICATES.has(qualityName)) {
                    this.relevantQualities.set(qualityName, quality as HTMLElement);
                }
            }

            this.processSidebarQualities(this.currentLocation);
        }
    }

    onNodeRemoved(node: HTMLElement): void {
        const keys = [...this.relevantQualities.keys()];
        for (const key of keys) {
            const quality = this.relevantQualities.get(key);
            // If the quality is no longer in the DOM, remove it from the map.
            if (quality && !node.isConnected) {
                this.relevantQualities.delete(key);
            }
        }
    }
}
