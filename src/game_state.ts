// @ts-nocheck: There is hell and then there is typing other people's API.
import {FLApiInterceptor} from "./api_interceptor";

export const UNKNOWN = -1;

export class UnknownUser {
}

export class UnknownCharacter {
}

export enum StoryletPhases {
    Available,
    In,
    End,
    Unknown
}

enum StateChangeTypes {
    QualityChanged= "QualityChanged",
    CharacterDataLoaded = "CharacterDataLoaded",
    UserDataLoaded = "UserDataLoaded",
    StoryletPhaseChanged = "StoryletPhaseChanged"
}

export class FLUser {
    userId: number
    jwtToken: string
    name: string

    constructor(userId: number, name: string, jwtToken: string) {
        this.userId = userId;
        this.jwtToken = jwtToken;
        this.name = name;
    }
}

export class FLCharacter {
    characterId: number
    name: string

    constructor(characterId: number, name: string) {
        this.characterId = characterId;
        this.name = name;
    }
}

export class Quality {
    qualityId: number;
    name: string
    level: number;
    effectiveLevel: number;
    category: string;
    image: string;
    cap: number;
    nature: string

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

    public storyletPhase: StoryletPhases = StoryletPhases.Unknown;

    public actionsLeft = 0;

    public storyletId = UNKNOWN;

    private qualities: Map<string, Map<string, Quality>> = new Map();

    public getQuality(category: string, name: string): Quality | undefined {
        const existingCategory = this.qualities.get(category);
        if (existingCategory == undefined) {
            return undefined;
        }

        return existingCategory.get(name)
    }

    public setQuality(categoryName: string, qualityName: string, quality: Quality) {
        if (!this.qualities.has(categoryName)) {
            this.qualities.set(categoryName, new Map());
        }

        const category = this.qualities.get(categoryName) || new Map();
        category.set(qualityName, quality);
    }

    public* enumerateQualities() {
        for (const category of this.qualities.values()) {
            for (const thing of category.values()) {
                yield thing
            }
        }
    }
}


export class GameStateController {
    private state: GameState = new GameState();

    private changeListeners: { [key in StateChangeTypes]: ((...args: any[]) => void)[] } = {
        [StateChangeTypes.QualityChanged]: [],
        [StateChangeTypes.CharacterDataLoaded]: [],
        [StateChangeTypes.UserDataLoaded]: [],
        [StateChangeTypes.StoryletPhaseChanged]: [],
    }

    private upsertQuality(qualityId: number, categoryName: string, qualityName: string, effectiveLevel: number, level: number, image: string, cap: number, nature: string): [Quality, number] {
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

        this.triggerListeners(StateChangeTypes.UserDataLoaded, this.state);
    }

    public parseMyselfResponse(request: Object, response: Object) {
        if (!("character" in response)) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        this.state.character = new FLCharacter(response.character.id, response.character.name);

        // @ts-ignore: There is hell and then there is writing types for external APIs
        for (const category of response.possessions) {
            for (const thing of category.possessions) {
                this.upsertQuality(
                    thing.id, thing.category, thing.name, thing.effectiveLevel,
                    thing.level, thing.image, thing.cap || 0, thing.nature
                );
            }
        }

        this.triggerListeners(StateChangeTypes.CharacterDataLoaded, this.state);
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
        for (const message of (response.messages || [])) {
            if (message.type == "StandardQualityChangeMessage"
                || message.type == "PyramidQualityChangeMessage"
                || message.type == "QualityExplicitlySetMessage") {
                const thing = message.possession;
                const [quality, previousLevel] = this.upsertQuality(
                    thing.id, thing.category, thing.name,
                    thing.effectiveLevel, thing.level, thing.image, thing.cap || 0,
                    thing.nature
                );
                this.triggerListeners(StateChangeTypes.QualityChanged, quality, previousLevel, quality.level);
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
                this.triggerListeners(StateChangeTypes.StoryletPhaseChanged, this.state);
            }
        }
    }

    public parseEquipResponse(request: Object, response: Object) {
        // @ts-ignore: There is hell and then there is writing types for external APIs
        for (const thing of response.changedPossessions) {
            const [quality, previous] = this.upsertQuality(
                thing.id, thing.category, thing.name, thing.effectiveLevel,
                thing.level, thing.image, thing.cap || 0, thing.nature
            );

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

        this.triggerListeners(StateChangeTypes.StoryletPhaseChanged, this.state);
    }

    public onStoryletPhaseChanged(handler: ((g: GameState) => void)) {
        this.changeListeners[StateChangeTypes.StoryletPhaseChanged].push(handler);
    }

    public onCharacterDataLoaded(handler: ((g: GameState) => void)) {
        this.changeListeners[StateChangeTypes.CharacterDataLoaded].push(handler);
    }

    public onUserDataLoaded(handler: ((g: GameState) => void)) {
        this.changeListeners[StateChangeTypes.UserDataLoaded].push(handler);
    }

    public onQualityChanged(handler: ((quality: Quality, previousLevel: number, currentLevel: number) => void)) {
        this.changeListeners[StateChangeTypes.QualityChanged].push(handler);
    }

    private triggerListeners(changeType: StateChangeTypes, ...additionalArgs: any[]): void {
        this.changeListeners[changeType].map((handler) => {
            try {
                handler(...additionalArgs)
            } catch (e) {
                console.error(`Error caught while triggering listeners for "${changeType}":`, e)
            }
        });
    }

    public hookIntoApi(interceptor: FLApiInterceptor) {
        interceptor.onResponseReceived("/api/login/user", this.parseUserResponse.bind(this));
        interceptor.onResponseReceived("/api/character/myself", this.parseMyselfResponse.bind(this));
        interceptor.onResponseReceived("/api/outfit/equip", this.parseEquipResponse.bind(this));
        interceptor.onResponseReceived("/api/outfit/unequip", this.parseEquipResponse.bind(this));
        interceptor.onResponseReceived("/api/storylet/choosebranch", this.parseChooseBranchResponse.bind(this));
        interceptor.onResponseReceived("/api/storylet", this.parseStoryletResponse.bind(this));
        interceptor.onResponseReceived("/api/storylet/begin", this.parseStoryletResponse.bind(this));
        interceptor.onResponseReceived("/api/storylet/goback", this.parseStoryletResponse.bind(this));
    }
}