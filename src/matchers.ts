import {GameState, StoryletPhases} from "./game_state.js";

interface StateMatcher {
    match(state: GameState): boolean;
    describe(): string;
}

class OrPredicate implements StateMatcher {
    private readonly left: StateMatcher;
    private readonly right: StateMatcher;

    constructor(left: StateMatcher, right: StateMatcher) {
        this.left = left;
        this.right = right;
    }

    describe(): string {
        return `Or(${this.left.describe()}, ${this.right.describe()})`;
    }

    match(state: GameState): boolean {
        return this.left.match(state) || this.right.match(state);
    }
}

class IsInSetting implements StateMatcher {
    private readonly expectedSettingId: number;

    constructor(settingId: number) {
        this.expectedSettingId = settingId;
    }

    describe(): string {
        return `InSetting(${this.expectedSettingId})`;
    }

    match(state: GameState): boolean {
        return state.location.setting.settingId === this.expectedSettingId;
    }
}

class IsInStorylet implements StateMatcher {
    private readonly expectedStoryletId: number;

    constructor(storyletId: number) {
        this.expectedStoryletId = storyletId;
    }

    describe(): string {
        return `InStorylet(${this.expectedStoryletId})`;
    }

    match(state: GameState): boolean {
        return state.storyletPhase == StoryletPhases.In && state.storyletId === this.expectedStoryletId;
    }
}

export {IsInSetting, IsInStorylet, OrPredicate, StateMatcher};
