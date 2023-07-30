import {SettingsObject} from "../settings.js";
import {GameStateController} from "../game_state";
import {FLApiInterceptor} from "../api_interceptor";

interface IMercyFixer {
    applySettings(settings: SettingsObject): void;
}

interface IMutationAware extends IMercyFixer {
    onNodeAdded(node: HTMLElement): void;
    onNodeRemoved(node: HTMLElement): void;

    checkEligibility(node: HTMLElement): boolean;
}

interface IStateAware extends IMercyFixer {
    linkState(state: GameStateController): void;
}

export interface INetworkAware extends IMercyFixer {
    linkNetworkTools(interceptor: FLApiInterceptor): void;
}

const isMutationAware = (fixer: IMercyFixer): fixer is IMutationAware => "onNodeAdded" in fixer;
const isStateAware = (fixer: IMercyFixer): fixer is IStateAware => "linkState" in fixer;
const isNetworkAware = (fixer: IMercyFixer): fixer is INetworkAware => "linkNetworkTools" in fixer;

export {IMercyFixer, IMutationAware, IStateAware, isMutationAware, isStateAware, isNetworkAware};
