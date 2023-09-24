import {IMutationAware, INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IInfobarResponse, ISnippet} from "../interfaces";
import {COMMUNITY_SNIPPETS} from "../constants";
import {getSingletonByClassName} from "../utils";

export class CustomSnippetsFixer implements INetworkAware, IMutationAware {
    enableCustomSnippets = true;
    customSnippets: ISnippet[];
    replaceDefaultSnippets = true;

    snippetObserver = new MutationObserver((mutations) => {
        this.hideEditButtonIfNeeded(mutations[0].target as HTMLElement);
    });

    private hideEditButtonIfNeeded(snippetContainer: HTMLElement) {
        const mark = getSingletonByClassName(snippetContainer as HTMLElement, "community-mark");
        const editBtn = getSingletonByClassName(snippetContainer as HTMLElement, "buttonlet-edit");

        if (editBtn) {
            if (mark) {
                editBtn.classList.toggle("buttonlet-enabled", false);
                editBtn.setAttribute("title", "Community snippets cannot be saved to your Journal.");
                editBtn.addEventListener("click", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                });
            } else {
                editBtn.classList.toggle("buttonlet-enabled", true);
                editBtn.setAttribute("title", "");
            }
        }
    }

    constructor() {
        let i = 0;

        this.customSnippets = COMMUNITY_SNIPPETS.map((snippet) => {
            i += 1;
            const textWithMention =
                snippet.description +
                `<p><i>(by <b><a href="${snippet.link}">${snippet.author}</a></b>)</i></p>` +
                '<p hidden aria-hidden="true" class="community-mark" />';

            return {
                id: 777_777_777 + i,
                title: snippet.title,
                description: textWithMention,
                image: "well",
            };
        });
    }

    applySettings(settings: SettingsObject): void {
        this.enableCustomSnippets = settings.enable_custom_snippets as boolean;
        this.replaceDefaultSnippets = settings.replace_fbg_snippets as boolean;
    }

    augmentInterceptedSnippets(originalSnippets: ISnippet[]): ISnippet[] {
        return [...(this.replaceDefaultSnippets ? [] : originalSnippets), ...this.customSnippets];
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        const snippetModifier = (_request: any, response: IInfobarResponse | ISnippet[]) => {
            if (!this.enableCustomSnippets) {
                return;
            }

            if ("snippets" in response) {
                response.snippets = this.augmentInterceptedSnippets(response.snippets);
            } else {
                response.splice(0, response.length, ...this.augmentInterceptedSnippets(response));
            }
        };

        interceptor.onResponseReceived("/api/infobar", snippetModifier);
        interceptor.onResponseReceived("/api/infobar/snippets", snippetModifier);
    }

    checkEligibility(node: HTMLElement): boolean {
        return (
            getSingletonByClassName(node, "snippet") != null || getSingletonByClassName(node, "buttonlet-edit") != null
        );
    }

    onNodeAdded(node: HTMLElement): void {
        const snippetContainer = getSingletonByClassName(node, "snippet");
        if (snippetContainer) {
            this.snippetObserver.observe(snippetContainer, {childList: true, subtree: true});
            this.hideEditButtonIfNeeded(snippetContainer);
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
