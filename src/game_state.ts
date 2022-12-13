import {FLApiInterceptor} from "./api_interceptor";

export class UnknownUser {}
export class UnknownCharacter {}

enum StateChangeTypes {
    StateChanged
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

export class GameState {
    public user: UnknownUser | FLUser = new UnknownUser();
    public character: UnknownCharacter | FLCharacter = new UnknownCharacter();

    public actionsLeft = 0;
}


export class GameStateController {
    private state: GameState = new GameState();

    private changeListeners: { [key in StateChangeTypes]: ((g: GameState) => void)[] } = {
        [StateChangeTypes.StateChanged]: []
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

        this.triggerListeners(StateChangeTypes.StateChanged)
    }

    public onStateChanged(handler: ((g: GameState) => void)) {
        this.changeListeners[StateChangeTypes.StateChanged].push(handler);
    }

    private triggerListeners(changeType: StateChangeTypes): void {
        this.changeListeners[changeType].map((handler) => handler(this.state))
    }

    public hookIntoApi(interceptor: FLApiInterceptor) {
        interceptor.onResponseReceived("/api/login/user", this.parseUserResponse.bind(this));
        interceptor.onResponseReceived("/api/character/myself", this.parseMyselfResponse.bind(this));
    }
}