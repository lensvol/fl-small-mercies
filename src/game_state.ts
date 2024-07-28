import {FLApiInterceptor} from "./api_interceptor";
import {
    IEquipResponse,
    IShopResponse,
    IStorylet,
    IStoryletListResponse,
    IStoryletResponse,
    IUserResponse,
} from "./interfaces";
import {debug} from "./logging";

export const UNKNOWN = -1;

export class UnknownUser {}

export class UnknownCharacter {}

export class UnknownStorylet {}

export enum StoryletPhases {
    Available = "Available",
    In = "In",
    End = "End",
    Unknown = "<UNKNOWN>",
}

enum StateChangeTypes {
    QualityChanged = "QualityChanged",
    CharacterDataLoaded = "CharacterDataLoaded",
    UserDataLoaded = "UserDataLoaded",
    StoryletChanged = "StoryletChanged",
    StoryletPhaseChanged = "StoryletPhaseChanged",
    ActionsCountChanged = "ActionsCountChanged",
    LocationChanged = "LocationChanged",
    EquipmentChanged = "EquipmentChanged",
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

    constructor(
        qualityId: number,
        category: string,
        name: string,
        effectiveLevel: number,
        level: number,
        image: string,
        cap: number,
        nature: string
    ) {
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
    public currentStorylet: UnknownStorylet | IStorylet = new UnknownStorylet();

    public actionsLeft = 0;

    private qualities: Map<string, Map<string, Quality>> = new Map();
    private qualityIdMapping: Map<number, Quality> = new Map();

    public resetQualities() {
        this.qualities.clear();
    }

    public getQualityById(qualityId: number): Quality | undefined {
        return this.qualityIdMapping.get(qualityId);
    }

    public getQuality(category: string, name: string): Quality | undefined {
        const existingCategory = this.qualities.get(category);
        if (existingCategory == undefined) {
            return undefined;
        }

        return existingCategory.get(name);
    }

    public hasQuality(category: string, name: string): boolean {
        return this.getQuality(category, name) != undefined;
    }

    public setQuality(categoryName: string, qualityName: string, quality: Quality) {
        if (!this.qualities.has(categoryName)) {
            this.qualities.set(categoryName, new Map());
        }

        const category = this.qualities.get(categoryName) || new Map();
        category.set(qualityName, quality);

        this.qualityIdMapping.set(quality.qualityId, quality);
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
    private static instance: GameStateController;

    private constructor() {}

    public static getInstance(): GameStateController {
        if (!GameStateController.instance) {
            GameStateController.instance = new GameStateController();
        }

        return GameStateController.instance;
    }

    private state: GameState = new GameState();

    private changeListeners: {[key in StateChangeTypes]: ((...args: any[]) => void)[]} = {
        [StateChangeTypes.ActionsCountChanged]: [],
        [StateChangeTypes.StoryletChanged]: [],
        [StateChangeTypes.QualityChanged]: [],
        [StateChangeTypes.CharacterDataLoaded]: [],
        [StateChangeTypes.UserDataLoaded]: [],
        [StateChangeTypes.StoryletPhaseChanged]: [],
        [StateChangeTypes.LocationChanged]: [],
        [StateChangeTypes.EquipmentChanged]: [],
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
            const quality = new Quality(
                qualityId,
                categoryName,
                qualityName,
                effectiveLevel,
                level,
                image,
                cap,
                nature
            );
            this.state.setQuality(categoryName, qualityName, quality);
            return [quality, 0];
        }
    }

    public parseUserResponse(response: IUserResponse) {
        if ("user" in response && "jwt" in response) {
            this.state.user = new FLUser(response.user.id, response.user.name, response.jwt);

            this.triggerListeners(StateChangeTypes.UserDataLoaded);
        }

        if ("area" in response) {
            const currentArea = new Area(response.area.id, response.area.name);
            if (currentArea !== this.state.location.area) {
                this.state.location.area = currentArea;
                this.triggerListeners(StateChangeTypes.LocationChanged, this.state.location);
            }
        }
    }

    public parseMyselfResponse(response: Record<string, unknown>) {
        if (!("character" in response)) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        this.state.character = new FLCharacter(response.character.id, response.character.name);

        // @ts-ignore: There is hell and then there is writing types for external APIs
        const currentGeoSetting = new GeoSetting(response.character.setting.id, response.character.setting.name);
        if (this.state.location.setting !== currentGeoSetting) {
            this.state.location.setting = currentGeoSetting;
            this.triggerListeners(StateChangeTypes.LocationChanged, this.state.location);
        }

        this.state.resetQualities();
        // @ts-ignore: There is hell and then there is writing types for external APIs
        for (const category of response.possessions) {
            for (const thing of category.possessions) {
                this.upsertQuality(
                    thing.id,
                    thing.category,
                    thing.name,
                    thing.effectiveLevel,
                    thing.level,
                    thing.image,
                    thing.cap || 0,
                    thing.nature
                );
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

    public parseActionsResponse(response: Record<string, unknown>) {
        if (!("actions" in response)) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        if (response.actions !== this.state.actionsLeft) {
            // @ts-ignore: There is hell and then there is writing types for external APIs
            this.state.actionsLeft = response.actions;
            this.triggerListeners(StateChangeTypes.ActionsCountChanged, this.state.actionsLeft);
        }
    }

    private decodePhase(phase: string): StoryletPhases {
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

    public parseChooseBranchResponse(response: Record<string, unknown>) {
        // @ts-ignore: There is hell and then there is writing types for external APIs
        for (const message of response.messages || []) {
            if (
                message.type === "StandardQualityChangeMessage" ||
                message.type === "PyramidQualityChangeMessage" ||
                message.type === "QualityExplicitlySetMessage"
            ) {
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
                this.state.storyletPhase = currentPhase;
                this.triggerListeners(StateChangeTypes.StoryletPhaseChanged);
            }
            if (response.endStorylet) {
                // @ts-ignore: There is hell and then there is writing types for external APIs
                this.state.currentStorylet = response.endStorylet.event;
                this.triggerListeners(StateChangeTypes.StoryletChanged);
            }
            if (response.storylet) {
                // @ts-ignore: There is hell and then there is writing types for external APIs
                this.state.currentStorylet = response.storylet;
                this.triggerListeners(StateChangeTypes.StoryletChanged);
            }
        }

        // @ts-ignore: There is hell and then there is writing types for external APIs
        if (response.actions != undefined && response.actions !== this.state.actionsLeft) {
            // @ts-ignore: There is hell and then there is writing types for external APIs
            this.state.actionsLeft = response.actions;
            this.triggerListeners(StateChangeTypes.ActionsCountChanged, this.state.actionsLeft);
        }
    }

    public parseEquipmentResponse(response: IEquipResponse) {
        for (const equipmentSlot of response.slots) {
            // TODO: Only trigger listeners on actual _changes_ to slot contents
            if (equipmentSlot.qualityId != null) {
                // Item was equipped into the inventory slot
                const itemQuality = this.state.getQualityById(equipmentSlot.qualityId);
                this.triggerListeners(StateChangeTypes.EquipmentChanged, equipmentSlot.name, itemQuality);
            } else {
                // Equipment slot was cleared
                this.triggerListeners(StateChangeTypes.EquipmentChanged, equipmentSlot.name, null);
            }
        }
    }

    public parseCurrentStoryletResponse(response: IStoryletResponse) {
        this.state.storyletPhase = this.decodePhase(response.phase);
        this.triggerListeners(StateChangeTypes.StoryletPhaseChanged);

        this.state.currentStorylet = response.storylet;
        this.triggerListeners(StateChangeTypes.StoryletChanged);
    }

    public parseStoryletListResponse(response: IStoryletListResponse) {
        this.state.storyletPhase = this.decodePhase(response.phase);

        this.state.currentStorylet = new UnknownStorylet();
        this.triggerListeners(StateChangeTypes.StoryletPhaseChanged);
        this.triggerListeners(StateChangeTypes.StoryletChanged);
    }

    public parseStoryletResponse(response: any) {
        if ("storylet" in response) {
            this.parseCurrentStoryletResponse(response as IStoryletResponse);
        } else {
            this.parseStoryletListResponse(response as IStoryletListResponse);
        }
    }

    public parseMapResponse(response: Record<string, unknown>) {
        // @ts-ignore: There is hell and then there is writing types for external APIs
        if (!response.isSuccess) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        const newArea = new Area(response.currentArea.id, response.currentArea.name);
        if (this.state.location.area != newArea) {
            this.state.location.area = newArea;
            this.triggerListeners(StateChangeTypes.LocationChanged, this.state.location);
        }
    }

    public parseMapMoveResponse(response: Record<string, unknown>) {
        // @ts-ignore: There is hell and then there is writing types for external APIs
        if (!response.isSuccess) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        const newArea = new Area(response.area.id, response.area.name);
        if (this.state.location.area != newArea) {
            this.state.location.area = newArea;
            this.triggerListeners(StateChangeTypes.LocationChanged, this.state.location);
        }
    }

    private parseShopResponse(response: IShopResponse) {
        if (!response.isSuccess) {
            return;
        }

        response.possessionsChanged.forEach((changed) => {
            const [quality, previous] = this.upsertQuality(
                changed.id,
                changed.category,
                changed.name,
                changed.effectiveLevel,
                changed.level,
                changed.image,
                changed.cap || 0,
                changed.nature
            );

            if (quality.level != previous) {
                this.triggerListeners(StateChangeTypes.QualityChanged, quality, previous, quality.level);
            }
        });
    }

    public onStoryletChanged(handler: (g: GameState) => void) {
        this.changeListeners[StateChangeTypes.StoryletChanged].push(handler);
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

    public onQualityChanged(
        handler: (g: GameState, quality: Quality, previousLevel: number, currentLevel: number) => void
    ) {
        this.changeListeners[StateChangeTypes.QualityChanged].push(handler);
    }

    public onLocationChanged(handler: (g: GameState, location: FLPlayerLocation) => void) {
        this.changeListeners[StateChangeTypes.LocationChanged].push(handler);
    }

    public onActionsChanged(handler: (g: GameState, actions: number) => void) {
        this.changeListeners[StateChangeTypes.ActionsCountChanged].push(handler);
    }

    public onEquipmentChanged(handler: (g: GameState, slotName: string, item: Quality | null) => void) {
        this.changeListeners[StateChangeTypes.EquipmentChanged].push(handler);
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
        interceptor.onResponseReceived("/api/login", (_, response) => {
            this.parseUserResponse(response);
        });
        interceptor.onResponseReceived("/api/login/user", (_, response) => {
            this.parseUserResponse(response);
        });
        interceptor.onResponseReceived("/api/character/myself", (_, response) => this.parseMyselfResponse(response));
        interceptor.onResponseReceived("/api/character/actions", (_, response) => this.parseActionsResponse(response));
        interceptor.onResponseReceived("/api/outfit/equip", (_, response) => this.parseEquipmentResponse(response));
        interceptor.onResponseReceived("/api/outfit/unequip", (_, response) => this.parseEquipmentResponse(response));
        interceptor.onResponseReceived("/api/storylet/choosebranch", (_, response) =>
            this.parseChooseBranchResponse(response)
        );
        interceptor.onResponseReceived("/api/storylet", (_, response) => this.parseStoryletResponse(response));
        interceptor.onResponseReceived("/api/storylet/begin", (_, response) => this.parseStoryletResponse(response));
        interceptor.onResponseReceived("/api/storylet/goback", (_, response) => this.parseStoryletResponse(response));
        interceptor.onResponseReceived("/api/map", (_, response) => this.parseMapResponse(response));
        interceptor.onResponseReceived("/api/map/move", (_, response) => this.parseMapMoveResponse(response));
        interceptor.onResponseReceived("/api/exchange/sell", (_, response) => this.parseShopResponse(response));
        interceptor.onResponseReceived("/api/exchange/buy", (_, response) => this.parseShopResponse(response));
    }
}
