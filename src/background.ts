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
            .then((css) => {
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
            .then((css: any) => {
                debug(`CSS removed from ${tabId}: ${paths}`);
            });
    } catch (err) {
        console.error(`failed to insert CSS: ${err}`);
    }
}

function syncTabIconSets() {
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

    getFallenLondonTabs().then((tabs) => {
        debug("Trying to sync icons sets across Fallen London tabs...");
        tabs.map((tab) => {
            removeCSS(tab.id || 0, toRemove);
            insertCSS(tab.id || 0, toAdd);
        });
    });
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
    } else if (request.action === MSG_TYPE_RED_MAGCATS && currentIconSet !== AdvancedSkillsArt.RED) {
        currentIconSet = AdvancedSkillsArt.RED;
        syncTabIconSets();
    } else if (request.action === MSG_TYPE_OLD_MAGCATS && currentIconSet !== AdvancedSkillsArt.OLD) {
        currentIconSet = AdvancedSkillsArt.OLD;
        syncTabIconSets();
    } else if (request.action === MSG_TYPE_DEFAULT_MAGCATS && currentIconSet === AdvancedSkillsArt.DEFAULT) {
        currentIconSet = AdvancedSkillsArt.DEFAULT;
        syncTabIconSets();
    }
});

// TODO: Handle CSS insertion for newly spawned tabs (click on a link within the game) and
// updated ones (manually entered URL)
chrome.tabs.onCreated.addListener((newTab) => {
    if (!newTab.pendingUrl?.includes("fallenlondon.com") || !newTab.id) {
        return;
    }

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

    removeCSS(newTab.id, toRemove);
    insertCSS(newTab.id, toAdd);
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!tab.url?.includes("fallenlondon.com")) {
        return;
    }

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

    removeCSS(tabId, toRemove);
    insertCSS(tabId, toAdd);
});
