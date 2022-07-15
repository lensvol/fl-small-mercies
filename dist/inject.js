import { FLSettingsFrontend } from "./settings.js";
import { EXTENSION_ID, EXTENSION_NAME } from "./constants.js";
import { JournalUiFixer, ThousandSeparatorFixer } from "./fixers/index.js";
import { debug } from "./logging.js";
const settingsSchema = new Map();
settingsSchema.set("fix_journal_navigation", "Fix color and alignment of the navigation buttons in Journal.");
settingsSchema.set("add_thousands_separator", "Add comma after thousands in the currency indicators.");
const journalUiFixer = new JournalUiFixer();
const thousandSeparatorFixer = new ThousandSeparatorFixer();
const settingsFrontend = new FLSettingsFrontend(EXTENSION_ID, EXTENSION_NAME, settingsSchema);
settingsFrontend.installSettingsPage();
settingsFrontend.registerUpdateHandler((settings) => {
    if (settings.fix_journal_navigation) {
        debug("Enabling fixer for Journal UI...");
        journalUiFixer.enable();
    }
    else {
        debug("Disabling stencil fixer for Journal UI...");
        journalUiFixer.disable();
    }
    if (settings.add_thousands_separator) {
        debug("Enabling fixer for currency amounts...");
        thousandSeparatorFixer.enable();
    }
    else {
        debug("Disabling fixer for currency amounts...");
        thousandSeparatorFixer.disable();
    }
});
//# sourceMappingURL=inject.js.map