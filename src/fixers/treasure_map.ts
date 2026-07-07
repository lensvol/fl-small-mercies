import {INetworkAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {GameState, GameStateController} from "../game_state";
import {debug} from "../logging";
import {IMapResponse} from "../interfaces";

const DIRECTIONS_QUALITY_ID = 144084;
const TREASURE_LOCATIONS: string[] = [
    "unknown location",
    "Hunter's Keep",
    "Mutton Island",
    "The Elder Continent",
    "Polythreme",
    "The Khanate",
    "Port Cecil",
    "Godfall",
    "The Iron Republic",
];

export class TreasureMapFixer implements INetworkAware, IStateAware {
    private currentTreasureLocation: string = "";
    private showTreasureMarker = false;

    applySettings(settings: SettingsObject): void {
        this.showTreasureMarker = settings.show_treasure_marker as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/map", (request, response: IMapResponse) => {
            if (!this.showTreasureMarker) {
                return;
            }

            if (!response.isSuccess) {
                // For some reason calls to `/map` may fail abruptly and thus no areas will be present.
                return;
            }

            for (const area of response.areas) {
                if (area.name.toLowerCase() === this.currentTreasureLocation.toLowerCase()) {
                    area.name = "💎 " + area.name;
                    area.unavailableDescription += "<br><br><i>Your treasure map points here!</i>";
                }
            }
        });
    }

    linkState(state: GameStateController): void {
        state.onUserDataLoaded((gameState: GameState) => {
            const locationQuality = gameState.getQuality("Circumstance", "Directions to a Hidden Stash");
            if (!locationQuality) {
                return;
            }

            if (locationQuality.level > TREASURE_LOCATIONS.length) {
                debug(`Unknown treasure location: ${locationQuality.level}`);
                return;
            }

            this.currentTreasureLocation = TREASURE_LOCATIONS[locationQuality.level];
            debug(`Current treasure location is ${this.currentTreasureLocation}`);
        });
        state.onQualityChanged((gameState, q, prevLevel, curLevel) => {
            if (q.qualityId === DIRECTIONS_QUALITY_ID && curLevel <= TREASURE_LOCATIONS.length) {
                this.currentTreasureLocation = TREASURE_LOCATIONS[curLevel];
                debug(`Your treasure is now stashed at ${this.currentTreasureLocation}!`);
            }
        });
    }
}
