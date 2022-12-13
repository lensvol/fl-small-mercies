import {IMutationAwareFixer, IStateAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {FLCharacter, GameState, GameStateController} from "../game_state.js";

export class ProfileLinkFixer implements IMutationAwareFixer, IStateAware {
    private addProfileLink = false;
    private currentUserName: string | null = null;

    private createTabButton(name: string, destinationUrl: string): Element {
        const button = document.createElement("li");
        button.classList.add("nav__item");
        button.dataset.name = "name".replace(" ", "_").toLowerCase();
        button.setAttribute("role", "tab");

        const link = document.createElement("a");
        link.textContent = name;
        link.setAttribute("href", destinationUrl);

        button.appendChild(link);

        return button;
    }

    applySettings(settings: SettingsObject): void {
        this.addProfileLink = settings.add_profile_link;
    }

    checkEligibility(node: HTMLElement): boolean {
        return this.addProfileLink;
    }

    onNodeAdded(node: HTMLElement): void {
        if (this.currentUserName == null) {
            return;
        }

        const tabList = node.querySelector("ul[role='tablist']");
        if (!tabList) {
            return;
        }

        // Check if the button already exists
        if (tabList.querySelector("li[data-name='profile']")) {
            return;
        }

        const profileButton = this.createTabButton(
            "Profile",
            `/profile/${encodeURI(this.currentUserName)}`
        )
        tabList.appendChild(profileButton);
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }

    linkState(stateController: GameStateController): void {
        stateController.onStateChanged((g: GameState) => {
            if (g.character instanceof FLCharacter) {
                this.currentUserName = g.character.name;
            }
        });
    }
}
