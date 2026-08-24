import {FLSettingsBackend} from "./settings";
import {
    AdvancedSkillsArt,
    MSG_TYPE_DEFAULT_MAGCATS,
    MSG_TYPE_GET_VERSION,
    MSG_TYPE_OLD_MAGCATS,
    MSG_TYPE_RED_MAGCATS,
    SETTINGS_SCHEMA,
} from "./constants";
import {getFallenLondonTabs, sendMessageToTabs} from "./comms";
import {debug} from "./logging";

const settingsBackend = new FLSettingsBackend(SETTINGS_SCHEMA);

let currentIconSet = AdvancedSkillsArt.DEFAULT;

function insertCSS(tabId: number, paths: string[]) {
    if (paths.length === 0) {
        return;
    }

    try {
        chrome.scripting
            .insertCSS({
                target: {
                    tabId: tabId || 0,
                },
                files: paths,
            })
            .then((_css) => {
                debug(`CSS inserted into ${tabId}: ${paths}`);
            });
    } catch (err) {
        console.error(`Failed to insert CSS: ${err}`);
    }
}

function removeCSS(tabId: number, paths: string[]) {
    if (paths.length === 0) {
        return;
    }

    try {
        chrome.scripting
            .removeCSS({
                target: {
                    tabId: tabId || 0,
                },
                files: paths,
            })
            .then((_css: any) => {
                debug(`CSS removed from ${tabId}: ${paths}`);
            });
    } catch (err) {
        console.error(`failed to insert CSS: ${err}`);
    }
}

function syncTabIconSet(tabId: number) {
    let toRemove: string[] = [];
    let toAdd: string[] = [];

    if (currentIconSet === AdvancedSkillsArt.DEFAULT) {
        toRemove = ["dist/css/old_magcats.css", "dist/css/red_magcats.css"];
    } else if (currentIconSet === AdvancedSkillsArt.RED) {
        toRemove = ["dist/css/old_magcats.css"];
        toAdd = ["dist/css/red_magcats.css"];
    } else if (currentIconSet === AdvancedSkillsArt.OLD) {
        toRemove = ["dist/css/red_magcats.css"];
        toAdd = ["dist/css/old_magcats.css"];
    }

    removeCSS(tabId || 0, toRemove);
    insertCSS(tabId || 0, toAdd);
}

function syncIconSetsAcrossTabs() {
    getFallenLondonTabs().then((tabs) => {
        debug("Trying to sync icons sets across Fallen London tabs...");
        tabs.map((tab) => {
            syncTabIconSet(tab.id || 0);
        });
    });
}

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
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
    } else if (request.action === MSG_TYPE_RED_MAGCATS && currentIconSet !== AdvancedSkillsArt.RED) {
        currentIconSet = AdvancedSkillsArt.RED;
        syncIconSetsAcrossTabs();
    } else if (request.action === MSG_TYPE_OLD_MAGCATS && currentIconSet !== AdvancedSkillsArt.OLD) {
        currentIconSet = AdvancedSkillsArt.OLD;
        syncIconSetsAcrossTabs();
    } else if (request.action === MSG_TYPE_DEFAULT_MAGCATS && currentIconSet !== AdvancedSkillsArt.DEFAULT) {
        currentIconSet = AdvancedSkillsArt.DEFAULT;
        syncIconSetsAcrossTabs();
    }
});

chrome.tabs.onCreated.addListener((newTab) => {
    if (!newTab.pendingUrl?.includes("fallenlondon.com") || !newTab.id) {
        return;
    }

    syncTabIconSet(newTab.id);
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!tab.url?.includes("fallenlondon.com")) {
        return;
    }

    syncTabIconSet(tabId);
});
