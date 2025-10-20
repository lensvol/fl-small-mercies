import {FLSettingsFrontend} from "./settings";
import {EXTENSION_ID, EXTENSION_NAME, SETTINGS_SCHEMA} from "./constants";
import AVAILABLE_FIXERS from "./fixers/index";
import {IMercyFixer, isMutationAware, isNetworkAware, isStateAware} from "./fixers/base";
import {GameStateController} from "./game_state";
import {FLApiInterceptor} from "./api_interceptor";
import {debug} from "./logging";

const apiInterceptor = FLApiInterceptor.getInstance();
const gameStateController = GameStateController.getInstance();

gameStateController.hookIntoApi(apiInterceptor);
apiInterceptor.install();

const fixers: IMercyFixer[] = AVAILABLE_FIXERS.flatMap((fixerCls) => {
    try {
        const fixer = new fixerCls();

        if (isNetworkAware(fixer)) {
            fixer.linkNetworkTools(apiInterceptor);
        }

        if (isStateAware(fixer)) {
            fixer.linkState(gameStateController);
        }

        return [fixer];
    } catch (error) {
        console.error(`Error occurred while instantiating ${fixerCls.name}:`, error);
        return [];
    }
});

debug(`Registering listener for stashed responses...`);
// NB: Responses can arrive _after_ we have requested already stashed stuff.
window.addEventListener("message", (event) => {
    if (event.data.action === "FL_SM_stashedResponse") {
        debug(`Processing stashed response from ${event.data.url} (${event.data.response.length})`);
        if (event.data.url.endsWith("/api/character/myself")) {
            apiInterceptor.processResponse(event.data.url, null, event.data.response);
            window.dispatchEvent(new CustomEvent("FL_SM_stopSniffing"));
        }
    }
});
debug(`Requesting stashed responses from the early stage sniffer...`);
window.dispatchEvent(new CustomEvent("FL_SM_divulgeStash"));

const settingsFrontend = new FLSettingsFrontend(EXTENSION_ID, EXTENSION_NAME, SETTINGS_SCHEMA);
settingsFrontend.installSettingsPage();
settingsFrontend.registerUpdateHandler((settings) => {
    fixers.map((fixer) => {
        try {
            fixer.applySettings(settings);
        } catch (error) {
            console.error(`Error occurred while applying settings to ${fixer.constructor.name}:`, error);
        }
    });
});

const centralMutationObserver = new MutationObserver((mutations, _observer) => {
    centralMutationObserver.disconnect();

    for (let m = 0; m < mutations.length; m++) {
        const mutation = mutations[m];

        for (let n = 0; n < mutation.addedNodes.length; n++) {
            const node = mutation.addedNodes[n] as HTMLElement;

            try {
                if (node.nodeName.toLowerCase() !== "div") {
                    continue;
                }
            } catch (e) {
                console.error(`Cannot access 'nodeName' in global mutator: {e}`);
                continue;
            }

            fixers.filter(isMutationAware).map((fixer) => {
                try {
                    if (fixer.checkEligibility(node)) {
                        fixer.onNodeAdded(node);
                    }
                } catch (error) {
                    console.error("Error occurred while processing added node:", error);
                }
            });
        }

        for (let n = 0; n < mutation.removedNodes.length; n++) {
            const node = mutation.removedNodes[n] as HTMLElement;

            try {
                if (node.nodeName.toLowerCase() !== "div") {
                    continue;
                }
            } catch (e) {
                console.error(`Cannot access 'nodeName' in global mutator: {e}`);
                continue;
            }

            fixers.filter(isMutationAware).map((fixer) => {
                try {
                    if (fixer.checkEligibility(node)) {
                        fixer.onNodeRemoved(node);
                    }
                } catch (error) {
                    console.error("Error occurred while processing removed node:", error);
                }
            });
        }
    }
    centralMutationObserver.observe(document, {childList: true, subtree: true});
});
centralMutationObserver.observe(document, {childList: true, subtree: true});
