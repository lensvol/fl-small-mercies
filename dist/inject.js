import { debug } from "./logging.js";
import { FLSettingsFrontend } from "./settings.js";
import { EXTENSION_ID, EXTENSION_NAME } from "./constants.js";
debug("Hello, world!");
const settingsSchema = new Map();
settingsSchema.set("hello", "Hello, world!");
new FLSettingsFrontend(EXTENSION_ID, EXTENSION_NAME, settingsSchema).installSettingsPage();
