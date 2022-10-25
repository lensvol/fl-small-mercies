import {SettingsObject} from "../settings";

interface IMercyFixer {
    enable(): void
    disable(): void
}

interface IMutationAwareFixer{
    onNodeAdded(node: HTMLElement): void
    onNodeRemoved(node: HTMLElement): void

    applySettings(settings: SettingsObject): void
    checkEligibility(node: HTMLElement): boolean
}

export { IMercyFixer, IMutationAwareFixer };