import {INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IInfobarResponse, ISnippet} from "../interfaces";
import {COMMUNITY_SNIPPETS} from "../constants";

export class CustomSnippetsFixer implements INetworkAware {
    // FIXME: Implement hiding of "record snippet" button on custom ones

    enableCustomSnippets = true;
    customSnippets: ISnippet[];
    replaceDefaultSnippets = true;

    constructor() {
        let i = 0;

        this.customSnippets = COMMUNITY_SNIPPETS.map((snippet) => {
            i += 1;
            const textWithMention =
                snippet.description + `<p><i>(by <b><a href="${snippet.link}">${snippet.author}</a></b>)</i></p>`;

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
}
