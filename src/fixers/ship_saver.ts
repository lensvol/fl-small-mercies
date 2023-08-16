import {IMutationAware} from "./base.js";
import {SettingsObject} from "../settings.js";

export class ShipSaverFixer implements IMutationAware {
    private disableSaleOption = false;

    applySettings(settings: SettingsObject): void {
        this.disableSaleOption = settings.ship_saver as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.disableSaleOption) {
            return false;
        }

        return node.getElementsByClassName("branch").length > 0;
    }

    onNodeAdded(node: HTMLElement): void {
        const candidates = node.getElementsByClassName("branch__title");
        let shipStorylet = null;
        for (const candidate of candidates) {
            if (candidate.textContent !== "Get rid of your current ship") {
                continue;
            }

            let parent = candidate.parentNode as HTMLElement;
            while (!parent.hasAttribute("data-branch-id")) {
                parent = parent.parentNode as HTMLElement;
            }
            shipStorylet = parent;
            break;
        }

        if (!shipStorylet) {
            return;
        }

        const description = shipStorylet.querySelector("div[class='media__body branch__body'] > div > p") as HTMLElement;
        const labelNode = document.createElement("b");
        labelNode.innerText = "This branch was disabled for your own good.";
        description.appendChild(document.createElement("br"));
        description.appendChild(document.createElement("br"));
        description.appendChild(labelNode);
        shipStorylet.classList.add("media--locked");
        shipStorylet.querySelectorAll("button").forEach((b) => b.remove());
        const actionButton = shipStorylet.querySelector("div[class*='buttons']");
        if (actionButton) {
            actionButton.remove();
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
