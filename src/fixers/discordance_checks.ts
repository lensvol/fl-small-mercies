import {IMutationAware} from "./base";
import {SettingsObject} from "../settings";
import {getSingletonByClassName} from "../utils";

export class DiscordanceChecksFixer implements IMutationAware {
    private prettifyDiscordanceChecks = false;

    applySettings(settings: SettingsObject): void {
        this.prettifyDiscordanceChecks = settings.prettify_discordance_checks as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        if (!this.prettifyDiscordanceChecks) {
            return false;
        }

        return document.getElementsByClassName("challenge__icon").length > 0;
    }

    onNodeAdded(node: HTMLElement): void {
        const challenges = node.getElementsByClassName("challenge") as HTMLCollectionOf<HTMLElement>;
        for (const challenge of challenges) {
            const icon = challenge.querySelector(".challenge__icon > img");
            if (icon?.ariaLabel === "Steward of the Discordance") {
                const heading = getSingletonByClassName(challenge, "challenge__heading");
                const description = getSingletonByClassName(challenge, "challenge__description");

                if (heading) {
                    const challengeClass = heading.children[0];
                    heading.removeChild(heading.firstChild as Node);
                    heading.textContent = "Not a ";
                    heading.appendChild(challengeClass);
                    heading.appendChild(document.createTextNode(" challenge"));
                }

                if (description) {
                    description.textContent = description.textContent?.replace("gives", "does not give") || "";
                }
            }
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
