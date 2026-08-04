import {FLSettingsBackend} from "./settings";
import {SETTINGS_SCHEMA, MSG_TYPE_GET_VERSION, MSG_TYPE_CURRENT_SETTINGS} from "./constants";
import {getFallenLondonTabs, sendMessageToTabs} from "./comms";

const settingsBackend = new FLSettingsBackend(SETTINGS_SCHEMA);

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (settingsBackend.isMessageRelevant(request)) {
        settingsBackend.handleMessage(request);
    } else if (request.action === MSG_TYPE_GET_VERSION) {
        // FIXME: This is needlessly convoluted.
        getFallenLondonTabs().then((tabs) => {
            sendMessageToTabs(tabs, MSG_TYPE_GET_VERSION, {
                action: MSG_TYPE_GET_VERSION,
                version: chrome.runtime.getManifest().version,
            });
        });
    }
});
