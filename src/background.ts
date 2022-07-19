import {FLSettingsBackend} from "./settings.js";
import {SETTINGS_SCHEMA} from "./constants.js";

const settingsBackend = new FLSettingsBackend(SETTINGS_SCHEMA);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (settingsBackend.isMessageRelevant(request)) {
        settingsBackend.handleMessage(request);
    }
});