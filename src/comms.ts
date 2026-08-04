import Tab = chrome.tabs.Tab;

function sendToServiceWorker(action: string, detail: object) {
    const event = new CustomEvent(action, {
        detail: {...detail},
    });
    window.dispatchEvent(event);
}

function getFallenLondonTabs(): Promise<Array<Tab>> {
    return new Promise((resolve, _) => {
        chrome.windows.getCurrent((w) => {
            chrome.tabs.query({windowId: w.id, url: "*://*.fallenlondon.com/*"}, function (tabs) {
                resolve(tabs);
            });
        });
    });
}

function sendMessageToTabs(tabs: Array<Tab>, action: string, message: Record<any, any>) {
    console.debug("Sending state to tabs", message);
    tabs.map((t) => {
        if (t.id == null) {
            return;
        }

        chrome.tabs.sendMessage(t.id, {action: action, ...message});
    });
}

export {sendToServiceWorker, sendMessageToTabs, getFallenLondonTabs};
