import { debug, log } from "./logging.js";
import { MSG_TYPE_CURRENT_SETTINGS, MSG_TYPE_SAVE_SETTINGS } from "./constants.js";
// Handle saving settings on the first run
function getFallenLondonTabs() {
    return new Promise((resolve, reject) => {
        chrome.windows.getCurrent(w => {
            chrome.tabs.query({ windowId: w.id, url: "*://*.fallenlondon.com/*" }, function (tabs) {
                resolve(tabs);
            });
        });
    });
}
function sendStateToTabs(tabs, state) {
    console.debug("Sending state to tabs", state);
    tabs.map((t) => chrome.tabs.sendMessage(t.id, { action: MSG_TYPE_CURRENT_SETTINGS, settings: state }));
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === MSG_TYPE_SAVE_SETTINGS) {
        chrome.storage.local.set({
            settings: request.settings
        }, () => {
            // Send out new state to the FL tabs
            getFallenLondonTabs().then(tabs => sendStateToTabs(tabs, request.settings));
            log("Saved settings to local storage.");
        });
    }
    if (request.action === MSG_TYPE_CURRENT_SETTINGS) {
        chrome.storage.local.get(['settings'], (result) => {
            if (chrome.runtime.lastError) {
                debug("Could not load settings from DB, falling back to defaults.");
            }
            else {
                getFallenLondonTabs().then(tabs => sendStateToTabs(tabs, result.settings));
            }
        });
    }
});
//# sourceMappingURL=background.js.map