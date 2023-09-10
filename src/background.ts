import {FLSettingsBackend} from "./settings";
import {SETTINGS_SCHEMA} from "./constants";

const settingsBackend = new FLSettingsBackend(SETTINGS_SCHEMA);

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
    if (settingsBackend.isMessageRelevant(request)) {
        settingsBackend.handleMessage(request);
    }
});
