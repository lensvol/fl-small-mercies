// @ts-nocheck: There is hell and then there is typing other people's API.
import {FLApiInterceptor} from "./api_interceptor";

export const UNKNOWN = -1;

export class UnknownUser {}

export class UnknownCharacter {}

export enum StoryletPhases {
    Available,
    In,
    End,
    Unknown,
}

enum StateChangeTypes {
    QualityChanged = "QualityChanged",
    CharacterDataLoaded = "CharacterDataLoaded",
    UserDataLoaded = "UserDataLoaded",
    StoryletPhaseChanged = "StoryletPhaseChanged",
    ActionsCountChanged = "ActionsCountChanged",
    LocationChanged = "LocationChanged",
}

export class FLUser {
    userId: number;
    jwtToken: string;
    name: string;

    constructor(userId: number, name: string, jwtToken: string) {
        this.userId = userId;
        this.jwtToken = jwtToken;
        this.name = name;
    }
}

export class FLCharacter {
    characterId: number;
    name: string;

    constructor(characterId: number, name: string) {
        this.characterId = characterId;
        this.name = name;
    }
}

export class Area {
    areaId: number;
    name: string;

    constructor(areaId: number, name: string) {
        this.areaId = areaId;
        this.name = name;
    }
}

export class GeoSetting {
    settingId: number;
    name: string;

    constructor(settingId: number, name: string) {
        this.settingId = settingId;
        this.name = name;
    }
}

export class FLPlayerLocation {
    setting: GeoSetting;
    area: Area;

    constructor(setting: GeoSetting, area: Area) {
        this.setting = setting;
        this.area = area;
    }
}

const UNKNOWN_AREA = new Area(UNKNOWN, "<UNKNOWN AREA>");
const UNKNOWN_GEO_SETTING = new GeoSetting(UNKNOWN, "<UNKNOWN SETTING>");

export class Quality {
    qualityId: number;
    name: string;
    level: number;
    effectiveLevel: number;
    category: string;
    image: string;
    cap: number;
    nature: string;

    constructor(qualityId: number, category: string, name: string, effectiveLevel: number, level: number, image: string, cap: number, nature: string) {
        this.qualityId = qualityId;
        this.category = category;
        this.name = name;
        this.level = level;
        this.effectiveLevel = effectiveLevel;
        this.image = image;
        this.cap = cap;
        this.nature = nature;
    }
}

export class GameState {
    public user: UnknownUser | FLUser = new UnknownUser();
    public character: UnknownCharacter | FLCharacter = new UnknownCharacter();
    public location: FLPlayerLocation = new FLPlayerLocation(UNKNOWN_GEO_SETTING, UNKNOWN_AREA);

    public storyletPhase: StoryletPhases = StoryletPhases.Unknown;

    public actionsLeft = 0;

    public storyletId = UNKNOWN;

    private qualities: Map<string, Map<string, Quality>> = new Map();

    public getQuality(category: string, name: string): Quality | undefined {
        const existingCategory = this.qualities.get(category);
        if (existingCategory == undefined) {
            return undefined;
        }

        return existingCategory.get(name);
    }

    public setQuality(categoryName: string, qualityName: string, quality: Quality) {
        if (!this.qualities.has(categoryName)) {
            this.qualities.set(categoryName, new Map());
        }

        const category = this.qualities.get(categoryName) || new Map();
        category.set(qualityName, quality);
    }

    public *enumerateQualities() {
        for (const category of this.qualities.values()) {
            for (const thing of category.values()) {
                yield thing;
            }
        }
    }
}

export class GameStateController {
    private state: GameState = new GameState();

    private changeListeners: {[key in StateChangeTypes]: ((...args: any[]) => void)[]} = {
        [StateChangeTypes.ActionsCountChanged]: [],
        [StateChangeTypes.QualityChanged]: [],
        [StateChangeTypes.CharacterDataLoaded]: [],
        [StateChangeTypes.UserDataLoaded]: [],
        [StateChangeTypes.StoryletPhaseChanged]: [],
        [StateChangeTypes.LocationChanged]: [],
    };

    private upsertQuality(
        qualityId: number,
        categoryName: string,
        qualityName: string,
        effectiveLevel: number,
        level: number,
        image: string,
        cap: number,
        nature: string
    ): [Quality, number] {
        const existingQuality = this.state.getQuality(categoryName, qualityName);

        if (existingQuality && existingQuality.level != effectiveLevel) {
            // We save previous value here so that we can update quality value in-place and still pass it on.
            const previousLevel = existingQuality.level;
            existingQuality.effectiveLevel = effectiveLevel;
            existingQuality.level = level;
            return [existingQuality, previousLevel];
        } else {
            const quality = new Quality(qualityId, categoryName, qualityName, effectiveLevel, level, image, cap, nature);
            this.state.setQuality(categoryName, qualityName, quality);
            return [quality, 0];
        }
    }

    public parseUserResponse(request: Object, response: Object) {
        if (!("user" in response)) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        this.state.user = new FLUser(response.user.id, response.user.name, response.jwt);

        // @ts-ignore: There is hell and then there is writing types for external APIs
        if ("area" in response.user) {
            // @ts-ignore: There is hell and then there is writing types for external APIs
            const currentArea = new Area(response.user.area.id, response.user.area.name);
            if (currentArea !== this.state.location.area) {
                this.state.location.area = currentArea;
                this.triggerListeners(StateChangeTypes.LocationChanged, this.state.location);
            }
        }

        this.triggerListeners(StateChangeTypes.UserDataLoaded);
    }

    public parseMyselfResponse(request: Object, response: Object) {
        if (!("character" in response)) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        this.state.character = new FLCharacter(response.character.id, response.character.name);

        // @ts-ignore: There is hell and then there is writing types for external APIs
        const currentGeoSetting = new GeoSetting(response.character.setting.id, response.character.setting.name);
        if (this.state.location.setting !== currentGeoSetting) {
            this.state.location.setting = currentGeoSetting;
            this.triggerListeners(StateChangeTypes.LocationChanged, this.state.location);
        }

        // @ts-ignore: There is hell and then there is writing types for external APIs
        for (const category of response.possessions) {
            for (const thing of category.possessions) {
                this.upsertQuality(thing.id, thing.category, thing.name, thing.effectiveLevel, thing.level, thing.image, thing.cap || 0, thing.nature);
            }
        }

        // @ts-ignore: There is hell and then there is writing types for external APIs
        if (response.character.actions != undefined && response.character.actions !== this.state.actionsLeft) {
            // @ts-ignore: There is hell and then there is writing types for external APIs
            this.state.actionsLeft = response.character.actions;
            this.triggerListeners(StateChangeTypes.ActionsCountChanged, this.state.actionsLeft);
        }

        this.triggerListeners(StateChangeTypes.CharacterDataLoaded);
    }

    public parseActionsResponse(request: Object, response: Object) {
        if (!("actions" in response)) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        if (response.actions !== this.state.actionsLeft) {
            // @ts-ignore: There is hell and then there is writing types for external APIs
            this.state.actionsLeft = response.actions;
            this.triggerListeners(StateChangeTypes.ActionsCountChanged, this.state.actionsLeft);
        }
    }

    private decodePhase(phase: String): StoryletPhases {
        if (phase == "Available") {
            return StoryletPhases.Available;
        }

        if (phase == "In") {
            return StoryletPhases.In;
        }

        if (phase == "End") {
            return StoryletPhases.End;
        }

        return StoryletPhases.Unknown;
    }

    public parseChooseBranchResponse(request: Object, response: Object) {
        // @ts-ignore: There is hell and then there is writing types for external APIs
        for (const message of response.messages || []) {
            if (message.type === "StandardQualityChangeMessage" || message.type === "PyramidQualityChangeMessage" || message.type === "QualityExplicitlySetMessage") {
                const thing = message.possession;
                const [quality, previousLevel] = this.upsertQuality(
                    thing.id,
                    thing.category,
                    thing.name,
                    thing.effectiveLevel,
                    thing.level,
                    thing.image,
                    thing.cap || 0,
                    thing.nature
                );
                this.triggerListeners(StateChangeTypes.QualityChanged, quality, previousLevel, quality.level);
            }

            if (message.type === "AreaChangeMessage") {
                this.state.location.area = new Area(message.area.id, message.area.name);
                this.triggerListeners(StateChangeTypes.LocationChanged, this.state.location);
            }

            if (message.type === "SettingChangeMessage") {
                this.state.location.setting = new GeoSetting(message.setting.id, message.setting.name);
                this.triggerListeners(StateChangeTypes.LocationChanged, this.state.location);
            }
        }

        // @ts-ignore: There is hell and then there is writing types for external APIs
        if (response.phase != undefined) {
            // @ts-ignore: There is hell and then there is writing types for external APIs
            const currentPhase = this.decodePhase(response.phase);
            if (currentPhase != this.state.storyletPhase) {
                if (currentPhase == StoryletPhases.End) {
                    // @ts-ignore: There is hell and then there is writing types for external APIs
                    this.state.storyletId = response.endStorylet.event.id;
                }

                this.state.storyletPhase = currentPhase;
                this.triggerListeners(StateChangeTypes.StoryletPhaseChanged);
            }
        }

        // @ts-ignore: There is hell and then there is writing types for external APIs
        if (response.actions != undefined && response.actions !== this.state.actionsLeft) {
            // @ts-ignore: There is hell and then there is writing types for external APIs
            this.state.actionsLeft = response.actions;
            this.triggerListeners(StateChangeTypes.ActionsCountChanged, this.state.actionsLeft);
        }
    }

    public parseEquipResponse(request: Object, response: Object) {
        // @ts-ignore: There is hell and then there is writing types for external APIs
        for (const thing of response.changedPossessions) {
            const [quality, previous] = this.upsertQuality(thing.id, thing.category, thing.name, thing.effectiveLevel, thing.level, thing.image, thing.cap || 0, thing.nature);

            if (quality.level != previous) {
                this.triggerListeners(StateChangeTypes.QualityChanged, quality, previous, quality.level);
            }
        }
    }

    public parseStoryletResponse(request: Object, response: Object) {
        if (!("phase" in response)) return;
        // @ts-ignore: There is hell and then there is writing types for external APIs
        this.state.storyletPhase = this.decodePhase(response.phase);

        if ("storylet" in response) {
            // @ts-ignore: There is hell and then there is writing types for external APIs
            this.state.storyletId = response.storylet.id;
        } else {
            this.state.storyletId = UNKNOWN;
        }

        this.triggerListeners(StateChangeTypes.StoryletPhaseChanged);
    }

    public parseMapResponse(request: Object, response: Object) {
        // @ts-ignore: There is hell and then there is writing types for external APIs
        if (!response.isSuccess) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        const newArea = new Area(response.currentArea.id, response.currentArea.name);
        if (this.state.location.area != newArea) {
            this.state.location.area = newArea;
            this.triggerListeners(StateChangeTypes.LocationChanged, this.state.location);
        }
    }

    public parseMapMoveResponse(request: Object, response: Object) {
        // @ts-ignore: There is hell and then there is writing types for external APIs
        if (!response.isSuccess) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        const newArea = new Area(response.area.id, response.area.name);
        if (this.state.location.area != newArea) {
            this.state.location.area = newArea;
            this.triggerListeners(StateChangeTypes.LocationChanged, this.state.location);
        }
    }

    public onStoryletPhaseChanged(handler: (g: GameState) => void) {
        this.changeListeners[StateChangeTypes.StoryletPhaseChanged].push(handler);
    }

    public onCharacterDataLoaded(handler: (g: GameState) => void) {
        this.changeListeners[StateChangeTypes.CharacterDataLoaded].push(handler);
    }

    public onUserDataLoaded(handler: (g: GameState) => void) {
        this.changeListeners[StateChangeTypes.UserDataLoaded].push(handler);
    }

    public onQualityChanged(handler: (g: GameState, quality: Quality, previousLevel: number, currentLevel: number) => void) {
        this.changeListeners[StateChangeTypes.QualityChanged].push(handler);
    }

    public onLocationChanged(handler: (g: GameState, location: FLPlayerLocation) => void) {
        this.changeListeners[StateChangeTypes.LocationChanged].push(handler);
    }

    public onActionsChanged(handler: (g: GameState, actions: number) => void) {
        this.changeListeners[StateChangeTypes.ActionsCountChanged].push(handler);
    }

    private triggerListeners(changeType: StateChangeTypes, ...additionalArgs: any[]): void {
        this.changeListeners[changeType].map((handler) => {
            try {
                handler(this.state, ...additionalArgs);
            } catch (e) {
                console.error(`Error caught while triggering listeners for "${changeType}":`, e);
            }
        });
    }

    public hookIntoApi(interceptor: FLApiInterceptor) {
        interceptor.onResponseReceived("/api/login/user", this.parseUserResponse.bind(this));
        interceptor.onResponseReceived("/api/character/myself", this.parseMyselfResponse.bind(this));
        interceptor.onResponseReceived("/api/character/actions", this.parseActionsResponse.bind(this));
        interceptor.onResponseReceived("/api/outfit/equip", this.parseEquipResponse.bind(this));
        interceptor.onResponseReceived("/api/outfit/unequip", this.parseEquipResponse.bind(this));
        interceptor.onResponseReceived("/api/storylet/choosebranch", this.parseChooseBranchResponse.bind(this));
        interceptor.onResponseReceived("/api/storylet", this.parseStoryletResponse.bind(this));
        interceptor.onResponseReceived("/api/storylet/begin", this.parseStoryletResponse.bind(this));
        interceptor.onResponseReceived("/api/storylet/goback", this.parseStoryletResponse.bind(this));
        interceptor.onResponseReceived("/api/map", this.parseMapResponse.bind(this));
        interceptor.onResponseReceived("/api/map/move", this.parseMapMoveResponse.bind(this));
    }
}
