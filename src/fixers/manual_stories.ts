import {FLApiInterceptor} from "../api_interceptor";
import {GameStateController} from "../game_state";
import {SettingsObject} from "../settings";
import {INetworkAware, IStateAware} from "./base";
import {IStoryletListResponse} from "../interfaces";
import {debug} from "../logging";

export class PersistentStoriesFixer implements IStateAware, INetworkAware {
    interceptorInstalled = false;
    spoofedStoryletList: string = "{}";
    currentSettingId: number = 0;

    originalGetItem = Storage.prototype.getItem;

    installInterceptor() {
        if (!this.interceptorInstalled) {
            // TODO: Rework with .bind(...)
            const envelope = this;

            Storage.prototype.getItem = function (key: string): string | null {
                if (this === window.localStorage) {
                    if (key === "disclosure_used_at") {
                        /*
                        Makes FL UI think that we have already opened the
                        list ourselves and there is no need to do it on auto.
                         */
                        return "2147382001000";
                    }
                    if (key === "hidden_storylets") {
                        /*
                        FL UI stores list of the persistent storylet already
                        seen by the user inside a mapping keyed by setting
                        ID. If this list does not have any of the persistent
                        storylets returned by the server, then it will open
                        "Fifth City Stories" automatically.

                        To work around that, we intercept list of storylets
                        returned by server and put them inside a "spoofed"
                        list which will be returned on the later call.
                        */
                        return envelope.spoofedStoryletList;
                    }
                }

                // @ts-ignore: Not sure how to properly type that call.
                return envelope.originalGetItem.apply(this, arguments);
            };

            debug("Installed interceptor for local storage");
            this.interceptorInstalled = true;
        } else {
            debug("Local storage interceptor already installed!");
        }
    }

    uninstallInterceptor() {
        Storage.prototype.getItem = this.originalGetItem;

        this.interceptorInstalled = false;

        debug("Local storage interceptor has been uninstalled.");
    }

    applySettings(settings: SettingsObject): void {
        if (settings.manual_fifth_stories) {
            this.installInterceptor();
        } else {
            this.uninstallInterceptor();
        }
    }

    linkState(state: GameStateController): void {
        state.onLocationChanged((state, location) => {
            this.currentSettingId = location.setting.settingId;
        });
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        const idExtractor = (_request: any, response: IStoryletListResponse) => {
            if ("storylet" in response) {
                return;
            }

            const hiddenStorylets: {[key: number]: number[]} = {};
            hiddenStorylets[this.currentSettingId] = response.storylets.map((storylet) => storylet.id);
            this.spoofedStoryletList = JSON.stringify(hiddenStorylets);
        };

        interceptor.onResponseReceived("/api/storylet", idExtractor);
        interceptor.onResponseReceived("/api/storylet/goback", idExtractor);
    }
}
