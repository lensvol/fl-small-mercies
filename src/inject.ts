import {FLSettingsFrontend} from "./settings.js";
import {EXTENSION_ID, EXTENSION_NAME, SETTINGS_SCHEMA} from "./constants.js";
import AVAILABLE_FIXERS from "./fixers/index.js";
import {IMercyFixer, isMutationAware, isNetworkAware, isStateAware} from "./fixers/base.js";
import {GameStateController} from "./game_state.js";
import {FLApiInterceptor} from "./api_interceptor.js";

const fixers: IMercyFixer[] = AVAILABLE_FIXERS.map((fixer) => new fixer());

const settingsFrontend = new FLSettingsFrontend(EXTENSION_ID, EXTENSION_NAME, SETTINGS_SCHEMA);
settingsFrontend.installSettingsPage();
settingsFrontend.registerUpdateHandler((settings) => {
    fixers.map((fixer) => fixer.applySettings(settings));
});

const apiInterceptor = new FLApiInterceptor();
apiInterceptor.install();
fixers.filter(isNetworkAware).map((fixer) => fixer.linkNetworkTools(apiInterceptor));

const gameStateController = new GameStateController();
gameStateController.hookIntoApi(apiInterceptor);

fixers.filter(isStateAware).map((fixer) => fixer.linkState(gameStateController));

const centralMutationObserver = new MutationObserver((mutations, _observer) => {
    centralMutationObserver.disconnect();

    const totalTimings = new Map<string, number>();
    const totalInvocations = new Map<string, number>();
    const start = performance.now();
    const mutationTag = performance.now().toFixed(0).toString() + "-" + Math.random().toFixed(2).toString();
    let totalAdded = 0;
    let totalRemoved = 0;

    for (let m = 0; m < mutations.length; m++) {
        totalAdded += mutations[m].addedNodes.length;
        totalRemoved += mutations[m].removedNodes.length;
    }

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
                .map((fixer) =>{
                    const fixerStart = performance.now();
                    fixer.onNodeAdded(node)
                    const fixerEnd = performance.now();

                    totalTimings.set(fixer.constructor.name, (totalTimings.get(fixer.constructor.name) || 0) + (fixerEnd - fixerStart));
                    totalInvocations.set(fixer.constructor.name, (totalInvocations.get(fixer.constructor.name) || 0) + 1);
                });
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

    const end = performance.now();

    if (end - start > 1) {
        console.groupCollapsed(`[Perf] Mutation ${mutationTag}: ${totalAdded} added nodes + ${totalRemoved} removed nodes = ${(end - start).toFixed(2)} ms`);

        console.group(`Timings (${totalTimings.size} fixers)`);
        [...totalTimings.entries()].sort((a, b) => b[1] - a[1]).map((entry) => {
            const name = entry[0];
            const time = entry[1];

            if (time > 0) {
                console.debug(`${name} took ${time.toFixed(2)} ms.`);
            }
        });
        console.groupEnd();

        console.groupCollapsed(`Invocation counts (${totalTimings.size} fixers)`);
        [...totalInvocations.entries()].sort((a, b) => b[1] - a[1]).map((entry) => {
            const name = entry[0];
            const count = entry[1];

            if (count > 0) {
                console.debug(`${name} was called ${count} times.`);
            }
        });
        console.groupEnd();

        console.groupEnd();
    }

    centralMutationObserver.observe(document, {childList: true, subtree: true});
});
centralMutationObserver.observe(document, {childList: true, subtree: true});
