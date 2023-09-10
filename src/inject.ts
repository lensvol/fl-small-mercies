import {FLSettingsFrontend} from "./settings";
import {EXTENSION_ID, EXTENSION_NAME, SETTINGS_SCHEMA} from "./constants";
import AVAILABLE_FIXERS from "./fixers/index";
import {IMercyFixer, isMutationAware, isNetworkAware, isStateAware} from "./fixers/base";
import {GameStateController} from "./game_state";
import {FLApiInterceptor} from "./api_interceptor";

const fixers: IMercyFixer[] = AVAILABLE_FIXERS.map((fixer) => new fixer());

const settingsFrontend = new FLSettingsFrontend(EXTENSION_ID, EXTENSION_NAME, SETTINGS_SCHEMA);
settingsFrontend.installSettingsPage();
settingsFrontend.registerUpdateHandler((settings) => {
    fixers.map((fixer) => fixer.applySettings(settings));
});

const apiInterceptor = FLApiInterceptor.getInstance();
const gameStateController = GameStateController.getInstance();

gameStateController.hookIntoApi(apiInterceptor);
apiInterceptor.install();

fixers.filter(isNetworkAware).map((fixer) => fixer.linkNetworkTools(apiInterceptor));
fixers.filter(isStateAware).map((fixer) => fixer.linkState(gameStateController));

const centralMutationObserver = new MutationObserver((mutations, _observer) => {
    centralMutationObserver.disconnect();

    for (let m = 0; m < mutations.length; m++) {
        const mutation = mutations[m];

        for (let n = 0; n < mutation.addedNodes.length; n++) {
            const node = mutation.addedNodes[n] as HTMLElement;

            if (node.nodeName.toLowerCase() !== "div") {
                continue;
            }

            fixers
                .filter(isMutationAware)
                .filter((fixer) => fixer.checkEligibility(node))
                .map((fixer) => fixer.onNodeAdded(node));
        }

        for (let n = 0; n < mutation.removedNodes.length; n++) {
            const node = mutation.removedNodes[n] as HTMLElement;

            if (node.nodeName.toLowerCase() !== "div") {
                continue;
            }

            fixers
                .filter(isMutationAware)
                .filter((fixer) => fixer.checkEligibility(node))
                .map((fixer) => fixer.onNodeRemoved(node));
        }
    }
    centralMutationObserver.observe(document, {childList: true, subtree: true});
});
centralMutationObserver.observe(document, {childList: true, subtree: true});
