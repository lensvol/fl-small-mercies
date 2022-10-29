import {FLSettingsFrontend} from "./settings.js";
import {EXTENSION_ID, EXTENSION_NAME, SETTINGS_SCHEMA} from "./constants.js";
import {
    AutoScrollFixer,
    JournalUiFixer,
    ThousandSeparatorFixer,
    DiscreteScrollbarsFixer,
    ScripIconFixer,
    ShipSaverFixer,
    RightSidebarFixer, PlanButtonsFixer
} from "./fixers/index.js";
import {IMutationAwareFixer} from "./fixers/base.js";

const nodeAwareFixers: IMutationAwareFixer[] = [
    new JournalUiFixer(),
    new ThousandSeparatorFixer(),
    new AutoScrollFixer(),
    new DiscreteScrollbarsFixer(),
    new RightSidebarFixer(),
    new ScripIconFixer(),
    new ShipSaverFixer(),
    new PlanButtonsFixer(),
];

const settingsFrontend = new FLSettingsFrontend(EXTENSION_ID, EXTENSION_NAME, SETTINGS_SCHEMA);
settingsFrontend.installSettingsPage();
settingsFrontend.registerUpdateHandler((settings) => {
    nodeAwareFixers.map((fixer) => fixer.applySettings(settings))
});

const centralMutationObserver = new MutationObserver((mutations, observer) => {
    centralMutationObserver.disconnect();

    for (let m = 0; m < mutations.length; m++) {
        const mutation = mutations[m];

        for (let n = 0; n < mutation.addedNodes.length; n++) {
            const node = mutation.addedNodes[n] as HTMLElement;

            if (node.nodeName.toLowerCase() !== "div") {
                continue;
            }

            nodeAwareFixers
                .filter((fixer) => fixer.checkEligibility(node))
                .map((fixer) => fixer.onNodeAdded(node))
        }

        for (let n = 0; n < mutation.removedNodes.length; n++) {
            const node = mutation.removedNodes[n] as HTMLElement;

            if (node.nodeName.toLowerCase() !== "div") {
                continue;
            }

            nodeAwareFixers
                .filter((fixer) => fixer.checkEligibility(node))
                .map((fixer) => fixer.onNodeRemoved(node))
        }
    }

    centralMutationObserver.observe(document, {childList: true, subtree: true});
});
centralMutationObserver.observe(document, {childList: true, subtree: true});