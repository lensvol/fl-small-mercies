import {SettingsObject} from "../settings.js";
import {IStateAware} from "./base";
import {FLPlayerLocation, GameStateController} from "../game_state.js";

type LocationPredicate = (location: FLPlayerLocation) => boolean

function isArea(areaName: string): LocationPredicate {
    return (location: FLPlayerLocation) => location.area.name == areaName
}

function isSetting(settingName: string): LocationPredicate {
    return (location: FLPlayerLocation) => location.setting.name == settingName
}

const QUALITIY_LOCATION_PREDICATES = new Map<string, LocationPredicate>();
QUALITIY_LOCATION_PREDICATES.set("Moonlit", isArea("Balmoral"));
QUALITIY_LOCATION_PREDICATES.set("Taimen's Attention", isSetting("Khanate (Inner)"));
QUALITIY_LOCATION_PREDICATES.set("A Turncoat", isArea("Spite"));
QUALITIY_LOCATION_PREDICATES.set("Disgruntlement among the Students", isSetting("Science Laboratory"));


export class LocationQualitiesFixer implements IStateAware {
    private hideNonlocalQualities = false;

    applySettings(settings: SettingsObject): void {
        this.hideNonlocalQualities = settings.hide_nonlocal_qualities as boolean;
    }

    linkState(state: GameStateController): void {
        state.onLocationChanged((location) => {
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
        });
    }

}
