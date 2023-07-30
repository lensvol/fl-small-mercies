import {SettingsObject} from "../settings.js";
import {IMutationAware, IStateAware} from "./base";
import {FLPlayerLocation, GameState, GameStateController} from "../game_state.js";

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
        const sidebarQualities = document.querySelectorAll("div[class*='sidebar'] ul[class*='items--list'] li[class*='sidebar-quality']") as NodeListOf<HTMLElement>;
        for (const quality of sidebarQualities) {
            const qualityName = quality.querySelector("span[class*='item__name']");
            if (!qualityName) continue;

            const is_visible_at = QUALITIY_LOCATION_PREDICATES.get(qualityName.textContent || "");
            if (!is_visible_at) continue;

            if (is_visible_at(location)) {
                quality.style.cssText = "";
            } else {
                quality.style.cssText = "display: none";
            }
        }
    }

    checkEligibility(node: HTMLElement): boolean {
        return this.hideNonlocalQualities;
    }

    onNodeAdded(node: HTMLElement): void {
        if (this.currentLocation) {
            this.processSidebarQualities(this.currentLocation);
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
