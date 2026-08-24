import {FLSettingsBackend} from "./settings";
import {
    SETTINGS_SCHEMA,
    MSG_TYPE_GET_VERSION,
    MSG_TYPE_RED_MAGCATS,
    MSG_TYPE_OLD_MAGCATS,
    MSG_TYPE_DEFAULT_MAGCATS,
} from "./constants";
import {getFallenLondonTabs, sendMessageToTabs} from "./comms";

const settingsBackend = new FLSettingsBackend(SETTINGS_SCHEMA);

function insertCSS(tabId: number, path: string) {
    try {
        chrome.scripting
            .insertCSS({
                target: {
                    tabId: tabId || 0,
                },
                files: [path],
            })
            .then((css) => {
                console.log(`CSS inserted ${tabId}`);
            });
    } catch (err) {
        console.error(`failed to insert CSS: ${err}`);
    }
}

function removeCSS(tabId: number, path: string) {
    try {
        chrome.scripting
            .removeCSS({
                target: {
                    tabId: tabId || 0,
                },
                files: [path],
            })
            .then((css: any) => {
                console.log(`CSS removed from ${tabId}`);
            });
    } catch (err) {
        console.error(`failed to insert CSS: ${err}`);
    }
}

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
    } else if (request.action === MSG_TYPE_RED_MAGCATS) {
        getFallenLondonTabs().then((tabs) => {
            console.log("Trying to attach Red CSS...", tabs);
            tabs.map((tab) => {
                removeCSS(tab.id || 0, "dist/css/old_magcats.css");
                insertCSS(tab.id || 0, "dist/css/red_magcats.css");
            });
        });
    } else if (request.action === MSG_TYPE_OLD_MAGCATS) {
        getFallenLondonTabs().then((tabs) => {
            console.log("Trying to attach Old CSS...", tabs);
            tabs.map((tab) => {
                removeCSS(tab.id || 0, "dist/css/red_magcats.css");
                insertCSS(tab.id || 0, "dist/css/old_magcats.css");
            });
        });
    } else if (request.action === MSG_TYPE_DEFAULT_MAGCATS) {
        getFallenLondonTabs().then((tabs) => {
            console.log("Trying to remove CSS...", tabs);
            tabs.map((tab) => {
                removeCSS(tab.id || 0, "dist/css/old_magcats.css");
                removeCSS(tab.id || 0, "dist/css/red_magcats.css");
            });
        });
    }
});

// TODO: Handle CSS insertion for newly spawned tabs (click on a link within the game) and
// updated ones (manually entered URL)
chrome.tabs.onCreated.addListener((newTab) => {});
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {});

getFallenLondonTabs().then((tabs) => {
    console.log("Trying to attach CSS...", tabs);
    tabs.map((tab) => {
        try {
            chrome.scripting
                .insertCSS({
                    target: {
                        tabId: tab.id || 0, // ts-ignore: asd
                    },
                    files: ["dist/css/red_magcats.css"],
                })
                .then((css) => {
                    console.log(`CSS inserted ${tab.id}`);
                });
        } catch (err) {
            console.error(`failed to insert CSS: ${err}`);
        }
    });
});
