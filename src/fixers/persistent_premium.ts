import {INetworkAware, IStateAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {FLApiInterceptor} from "../api_interceptor.js";
import {GameState, GameStateController} from "../game_state.js";

// For some reason, Zailing-related storylets in Wolfstack Docks are marked "Premium".
const IGNORED_ZEE_STORYLET_IDS = [
    335704, // Put to Zee
    339490, // A Return to Terra Firma
];

export class PersistentPremiumFixer implements INetworkAware, IStateAware {
    private makePremiumPersistent = false;
    private localSettingId = -1;

    private SMALL_MERCIES_MOVED_QUALITY = {
        allowedOn: "Character",
        qualityId: 777_777_777,
        qualityName: "Quality of Life",
        tooltip:
            "This storylet was made persistent by 'Small Mercies'.<p class='tooltip__secondary-description'><i>You can disable this behaviour in the extension settings screen.</i></p>",
        availableAtMessage: "You can disable this behaviour in the extension's settings screen.",
        category: "Extension",
        nature: "Status",
        status: "Unocked",
        isCost: false,
        image: "mercy",
        id: 777_777_777,
    };

    applySettings(settings: SettingsObject): void {
        this.makePremiumPersistent = settings.persistent_premium as boolean;
    }

    storyletProcessor(_request: any, response: any): any {
        if (!this.makePremiumPersistent) {
            return null;
        }

        const persistedStorylets = [];
        if (!("storylets" in response)) {
            return;
        }

        for (const storylet of response.storylets) {
            if (storylet.category !== "Premium") {
                continue;
            }

            if (IGNORED_ZEE_STORYLET_IDS.includes(storylet.id)) {
                continue;
            }

            storylet.deckType = "Persistent";
            storylet.qualityRequirements.push(this.SMALL_MERCIES_MOVED_QUALITY);

            persistedStorylets.push(storylet.id);
        }

        if (this.localSettingId === -1) {
            // We don't know the setting ID yet, so we can't modify list of seen storylets.
            return response;
        }

        if (persistedStorylets.length == 0) {
            // No storylets were persisted, no need to do modify the list of seen ones.
            return;
        }

        const serializedHiddenIds = localStorage.hidden_storylets;
        const hiddenIds = serializedHiddenIds ? JSON.parse(serializedHiddenIds) : {};
        const settingHiddenIds = hiddenIds[this.localSettingId] || [];

        let changesAreMade = false;

        for (const storyletId of persistedStorylets) {
            if (!settingHiddenIds.includes(storyletId)) {
                settingHiddenIds.push(storyletId);
                changesAreMade = true;
            }
        }

        if (changesAreMade) {
            hiddenIds[this.localSettingId] = settingHiddenIds;
            localStorage.hidden_storylets = JSON.stringify(hiddenIds);
        }

        return response;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet", this.storyletProcessor.bind(this));
        interceptor.onResponseReceived("/api/storylet/goback", this.storyletProcessor.bind(this));
    }

    linkState(state: GameStateController): void {
        const settingUpdater = (state: GameState) => {
            this.localSettingId = state.location.setting.settingId;
        };

        state.onLocationChanged(settingUpdater);
        state.onUserDataLoaded(settingUpdater);
    }
}
