function sendToInjectedPage(action: string, detail: object) {
    window.postMessage({
        action: action,
        ...detail
    }, "https://www.fallenlondon.com");
}

console.log(`[FL Small Mercies] Inserting interceptor...`);

const script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL('dist/inject.js'));
script.onload = function () {
    script.remove();
};
(document.head || document.documentElement).appendChild(script);

console.log(`[FL Small Mercies] Setting up comms repeater...`);
["FL_SM_saveSettings", "FL_SM_currentSettings"].forEach((eventType) => {
    window.addEventListener(eventType, (event) => {
        chrome.runtime.sendMessage({
            action: eventType,
            // @ts-ignore
            ...event.detail,
        })
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message.action) return;

    if (!message.action.startsWith("FL_SM_")) return;

    sendToInjectedPage(message.action, message);
});
