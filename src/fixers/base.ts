import {SettingsObject} from "../settings.js";
import {GameStateController} from "../game_state";

interface IMercyFixer {
    applySettings(settings: SettingsObject): void
}

interface IMutationAwareFixer extends IMercyFixer{
    onNodeAdded(node: HTMLElement): void
    onNodeRemoved(node: HTMLElement): void

    checkEligibility(node: HTMLElement): boolean
}

interface IStateAware extends IMercyFixer {
    linkState(state: GameStateController): void
}

const isMutationAware = (fixer: IMercyFixer): fixer is IMutationAwareFixer => "onNodeAdded" in fixer
const isStateAware = (fixer: IMercyFixer): fixer is IStateAware => "linkState" in fixer

export { IMercyFixer, IMutationAwareFixer, IStateAware, isMutationAware, isStateAware};