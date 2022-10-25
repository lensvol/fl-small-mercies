import {FLSettingsFrontend} from "./settings.js";
import {EXTENSION_ID, EXTENSION_NAME, SETTINGS_SCHEMA} from "./constants.js";
import {
    AutoScrollFixer,
    JournalUiFixer,
    ThousandSeparatorFixer,
    DiscreteScrollbarsFixer,
    ScripIconFixer,
    ShipSaverFixer,
    RightSidebarFixer
} from "./fixers/index.js";
import {debug} from "./logging.js";
import {IMutationAwareFixer} from "./fixers/base.js";

const journalUiFixer = new JournalUiFixer();
const thousandSeparatorFixer = new ThousandSeparatorFixer();
const autoScrollFixer = new AutoScrollFixer();
const discreteScrollbarsFixer = new DiscreteScrollbarsFixer();
const scripIconFixer = new ScripIconFixer();
const shipSaverFixer = new ShipSaverFixer();

const rightSidebarFixer = new RightSidebarFixer();
const nodeAwareFixers: [IMutationAwareFixer] = [
    rightSidebarFixer
];

const settingsFrontend = new FLSettingsFrontend(EXTENSION_ID, EXTENSION_NAME, SETTINGS_SCHEMA);
settingsFrontend.installSettingsPage();
settingsFrontend.registerUpdateHandler((settings) => {
    if (settings.fix_journal_navigation) {
        debug("Enabling fixer for Journal UI...");
        journalUiFixer.enable();
    } else {
        debug("Disabling stencil fixer for Journal UI...");
        journalUiFixer.disable();
    }

    if (settings.add_thousands_separator) {
        debug("Enabling fixer for currency amounts...");
        thousandSeparatorFixer.enable();
    } else {
        debug("Disabling fixer for currency amounts...");
        thousandSeparatorFixer.disable();
    }

    if (settings.auto_scroll_back) {
        debug("Enabling auto scroll back...");
        autoScrollFixer.enable();
    } else {
        debug("Disabling auto scroll back...");
        autoScrollFixer.disable();
    }

    if (settings.discrete_scrollbars) {
        debug("Enabling discrete scrollbars...");
        discreteScrollbarsFixer.enable();
    } else {
        debug("Disabling discrete scrollbars...");
        discreteScrollbarsFixer.disable();
    }

    if (settings.scrip_icon) {
        debug("Enabling scrip icon...");
        scripIconFixer.enable();
    } else {
        debug("Disabling scrip icon...")
        scripIconFixer.disable();
    }

    if (settings.ship_saver) {
        debug("Enabling ship saver...");
        shipSaverFixer.enable();
    } else {
        debug("Disabling ship saver...");
        shipSaverFixer.disable();
    }

    nodeAwareFixers.map((fixer) => fixer.applySettings(settings))
});

const centralMutationObserver = new MutationObserver((mutations, observer) => {
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
    }
});
centralMutationObserver.observe(document, {childList: true, subtree: true});