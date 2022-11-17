import {SettingsObject} from "../settings.js";

interface IMercyFixer {
    applySettings(settings: SettingsObject): void
}

interface IMutationAwareFixer extends IMercyFixer{
    onNodeAdded(node: HTMLElement): void
    onNodeRemoved(node: HTMLElement): void

    checkEligibility(node: HTMLElement): boolean
}

const isMutationAware = (fixer: IMercyFixer): fixer is IMutationAwareFixer => "onNodeAdded" in fixer

export { IMercyFixer, IMutationAwareFixer, isMutationAware };