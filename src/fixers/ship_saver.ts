import {IMercyFixer, IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";

export class ShipSaverFixer implements IMercyFixer, IMutationAwareFixer {
    private disableSaleOption: boolean = false

    applySettings(settings: SettingsObject): void {
        this.disableSaleOption = settings.ship_saver
    }

    checkEligibility(node: HTMLElement): boolean {
        return this.disableSaleOption;
    }

    onNodeAdded(node: HTMLElement): void {
        let shipStorylet = node.querySelector("div[data-branch-id='251811']");
        // @ts-ignore
        if (!shipStorylet && node.hasAttribute("data-branch-id") && node.attributes["data-branch-id"].value == 251811) {
            shipStorylet = node;
        }

        if (shipStorylet) {
            const description = shipStorylet.querySelector("div[class='media__body branch__body'] > div > p") as HTMLElement;
            const labelNode = document.createElement("b");
            labelNode.innerText = "This branch was disabled for your own good.";

            description.appendChild(document.createElement("br"));
            description.appendChild(document.createElement("br"));
            description.appendChild(labelNode);

            shipStorylet.classList.add("media--locked");
            shipStorylet
                .querySelectorAll("button")
                .forEach((b) => b.remove());

            const actionButton = shipStorylet.querySelector("div[class*='buttons']");
            if (actionButton) {
                actionButton.remove();
            }
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
