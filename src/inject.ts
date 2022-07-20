import {FLSettingsFrontend} from "./settings.js";
import {EXTENSION_ID, EXTENSION_NAME, SETTINGS_SCHEMA} from "./constants.js";
import {AutoScrollFixer, JournalUiFixer, ThousandSeparatorFixer, DiscreteScrollbarsFixer} from "./fixers/index.js";
import {debug} from "./logging.js";

const journalUiFixer = new JournalUiFixer();
const thousandSeparatorFixer = new ThousandSeparatorFixer();
const autoScrollFixer = new AutoScrollFixer();
const discreteScrollbarsFixer = new DiscreteScrollbarsFixer();

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
});
