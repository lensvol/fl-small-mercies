import {SettingsObject} from "../settings.js";

interface IMercyFixer {
    applySettings(settings: SettingsObject): void
}

interface IMutationAwareFixer{
    onNodeAdded(node: HTMLElement): void
    onNodeRemoved(node: HTMLElement): void

    checkEligibility(node: HTMLElement): boolean
}

export { IMercyFixer, IMutationAwareFixer };