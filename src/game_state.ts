// @ts-nocheck: There is hell and then there is typing other people's API.
import {FLApiInterceptor} from "./api_interceptor";

export class UnknownUser {}
export class UnknownCharacter {}

enum StateChangeTypes {
    StateChanged,
    QualityChanged,
}

export class FLUser {
    userId: number
    jwtToken: string
    name: string

    constructor(userId: number, name: string,  jwtToken: string) {
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
    category: string;

    constructor(qualityId: number, category: string, name: string, level: number) {
        this.qualityId = qualityId;
        this.category = category;
        this.name = name;
        this.level = level;
    }
}

export class GameState {
    public user: UnknownUser | FLUser = new UnknownUser();
    public character: UnknownCharacter | FLCharacter = new UnknownCharacter();

    public actionsLeft = 0;

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

        const category = this.qualities.get(categoryName);
        category.set(qualityName, quality);
    }
}


export class GameStateController {
    private state: GameState = new GameState();

    private changeListeners: { [key in StateChangeTypes]: ((g: GameState) => void)[] } = {
        [StateChangeTypes.StateChanged]: [],
        [StateChangeTypes.QualityChanged]: [],
    }

    public parseUserResponse(response: Object) {
        if (!("user" in response)) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        this.state.user = new FLUser(response.user.id, response.user.name, response.jwt);

        this.triggerListeners(StateChangeTypes.StateChanged)
    }

    public parseMyselfResponse(response: Object) {
        if (!("character" in response)) return;

        // @ts-ignore: There is hell and then there is writing types for external APIs
        this.state.character = new FLCharacter(response.character.id, response.character.name);

        for (const category of response.possessions) {
            for (const thing of category.possessions) {
                const existingQuality = this.state.getQuality(category.name, thing.name);

                if (existingQuality && existingQuality.level != thing.level) {
                    // We save previous value here so that we can update quality value in-place and still pass it on.
                    const previousLevel = existingQuality.level;
                    this.triggerListeners(StateChangeTypes.QualityChanged, existingQuality, previousLevel, thing.effectiveLevel);
                } else {
                    const quality = new Quality(thing.id, thing.category, thing.name, thing.level);
                    this.state.setQuality(category.name, thing.name, quality);
                    this.triggerListeners(StateChangeTypes.QualityChanged, quality, 0, thing.effectiveLevel);
                }
            }
        }

        this.triggerListeners(StateChangeTypes.StateChanged, this.state);
    }

    public onStateChanged(handler: ((g: GameState) => void)) {
        this.changeListeners[StateChangeTypes.StateChanged].push(handler);
    }

    public onQualityChanged(handler: ((quality: Quality, previousLevel: number, currentLevel: number) => void)) {
        this.changeListeners[StateChangeTypes.QualityChanged].push(handler);
    }

    private triggerListeners(changeType: StateChangeTypes, ...additionalArgs: any[]): void {
        this.changeListeners[changeType].map((handler) => handler(...additionalArgs));
    }

    public hookIntoApi(interceptor: FLApiInterceptor) {
        interceptor.onResponseReceived("/api/login/user", this.parseUserResponse.bind(this));
        interceptor.onResponseReceived("/api/character/myself", this.parseMyselfResponse.bind(this));
    }
}