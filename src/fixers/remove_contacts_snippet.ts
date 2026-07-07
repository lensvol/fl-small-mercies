import {IMutationAware} from "./base";
import {SettingsObject} from "../settings";
import {getSingletonByClassName} from "../utils";
import {debug} from "../logging";

export class ContactsSnippetFixer implements IMutationAware {
    private hideContactsSnippet: boolean = false;

    applySettings(settings: SettingsObject): void {
        this.hideContactsSnippet = settings.remove_contacts_snippet as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.hideContactsSnippet) {
            return false;
        }

        return getSingletonByClassName(node, "snippet") !== null;
    }

    onNodeAdded(node: HTMLElement): void {
        const snippetHeaders = node.getElementsByClassName("heading heading--3 snippet__heading");

        for (const header of snippetHeaders) {
            if (header.textContent === "Make Contacts" && header.parentElement) {
                debug("Removing 'Make Contacts' snippet...");
                header.parentElement.style.display = "none";

                // Blank space before "Make Contacts" snippet is laid out as a sequence of HTML line break elements,
                // so we need to clean them up after removing the snippet to avoid "holes" in the sidebar.
                let previous: Element | null = header.parentElement.previousElementSibling;
                while (previous?.tagName.toLowerCase() === "br") {
                    (previous as HTMLElement).style.display = "none";
                    previous = previous.previousElementSibling;
                }
            }
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
