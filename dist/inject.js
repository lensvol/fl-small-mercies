import { FLSettingsFrontend } from "./settings.js";
import { EXTENSION_ID, EXTENSION_NAME } from "./constants.js";
import { CalendarStencilFixer } from "./fixers/index.js";
import { debug } from "./logging.js";
const settingsSchema = new Map();
settingsSchema.set("journal_stencil", "Fix the color of the calendar stencil on the Profile page.");
const stencilFixer = new CalendarStencilFixer();
const settingsFrontend = new FLSettingsFrontend(EXTENSION_ID, EXTENSION_NAME, settingsSchema);
settingsFrontend.installSettingsPage();
settingsFrontend.registerUpdateHandler((settings) => {
    if (settings.journal_stencil) {
        debug("Enabling stencil fixer...");
        stencilFixer.enable();
    }
    else {
        debug("Disabling stencil fixer...");
        stencilFixer.disable();
    }
});
//# sourceMappingURL=inject.js.map