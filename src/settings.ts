import {debug, log} from "./logging.js";
import {sendToServiceWorker} from "./comms.js";
import {MSG_TYPE_CURRENT_SETTINGS, MSG_TYPE_SAVE_SETTINGS} from "./constants.js";

import Tab = chrome.tabs.Tab;

type SettingDescriptor = { description: string, default: boolean }
type SettingsSchema = { [key: string]: SettingDescriptor }
type SettingsObject = {[key: string]: boolean}
type SettingsMessage = { action: string, settings?: SettingsObject }

function createDefaultSettings(schema: SettingsSchema): SettingsObject {
    const defaultSettings: {[key: string]: boolean} = {};
    for (const [toggleId, descriptor] of Object.entries(schema)) {
        defaultSettings[toggleId] = descriptor.default;
    }
    return defaultSettings;
}

class FLSettingsFrontend {
    private readonly name: string;
    private readonly extensionId: string;

    private settings: SettingsObject;
    private schema: SettingsSchema;

    private createdToggles: Array<HTMLInputElement> = [];
    private updateHandler?: (settings: SettingsObject) => void;

    constructor(extensionId: string, name: string, schema: SettingsSchema) {
        this.extensionId = extensionId;
        this.name = name;
        this.schema = schema;

        debug("Initializing create default settings object...");
        this.settings = createDefaultSettings(this.schema);

        window.addEventListener("message", (event) => {
            if (event.data.action === MSG_TYPE_CURRENT_SETTINGS) {
                debug("Update settings with the new data...");
                this.updateState(event.data.settings);
            }
        });

        sendToServiceWorker(MSG_TYPE_CURRENT_SETTINGS, {});
    }

    private attachPanelInjector(node: Node) {
        const panelInjectorObserver = new MutationObserver((mutations) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];

                if (mutation.type != "attributes") continue;

                if (mutation.attributeName != "aria-labelledby") continue;

                const target = mutation.target as HTMLElement;

                if (target.getAttribute("aria-labelledby") === "tab--Extensions") {
                    if (target.querySelector(`div[custom-settings="${this.extensionId}"]`)) {
                        continue;
                    }

                    target.appendChild(this.createLocalSettingsPanel());
                }
            }
        });

        panelInjectorObserver.observe(node, {attributes: true});
    }

    private prepareForCustomSettings() {
        const tabPanel = document.querySelector("div[role='tabpanel']");
        if (!tabPanel) return;

        for (const child of (tabPanel.children as HTMLCollectionOf<HTMLElement>)) {
            if (child.hasAttribute("custom-settings")) {
                continue;
            }

            child.style.cssText = "display: none;";
        }
        tabPanel.setAttribute("aria-labelledby", "tab--Extensions");
    }

    private cleanupCustomSettings() {
        const tabPanel = document.querySelector("div[role='tabpanel']");
        if (!tabPanel) return;

        const setForRemoval: Array<HTMLElement> = [];

        for (const child of (tabPanel.children as HTMLCollectionOf<HTMLElement>)) {
            if (child.hasAttribute("custom-settings")) {
                setForRemoval.push(child);
            } else {
                child.style.cssText = "display: block;";
            }
        }

        setForRemoval.map((child) => child.remove());
    }

    private createSettingsButton(): Node {
        const button = document.createElement("button");
        button.setAttribute("id", "tab--Extensions");
        button.setAttribute("role", "tab");
        button.setAttribute("type", "button");
        button.setAttribute("aria-selected", "true");
        button.classList.add("button--link", "nav__button", "menu-item--active");
        button.textContent = "Extensions";

        const wrapper = document.createElement("li");
        wrapper.classList.add("nav__item");

        wrapper.appendChild(button);

        return wrapper;
    }

    private createLocalSettingsPanel(): Node {
        const containerDiv = document.createElement("div");
        containerDiv.setAttribute("custom-settings", this.extensionId);

        const heading = document.createElement("h2");
        heading.classList.add("heading", "heading--2");
        heading.textContent = this.name;
        heading.setAttribute("id", "extension-panel");

        const listContainer = document.createElement("ul");

        this.createdToggles = [];
        for (const [toggleId, descriptor] of Object.entries(this.schema)) {
            const toggle = document.createElement("li");
            toggle.classList.add("checkbox");

            const label = document.createElement("label");

            const input = document.createElement("input");
            input.setAttribute("id", toggleId);
            input.setAttribute("type", "checkbox");
            input.checked = this.settings[toggleId];

            this.createdToggles.push(input);

            label.appendChild(input);
            label.appendChild(document.createTextNode(descriptor.description));

            toggle.appendChild(label);
            listContainer.appendChild(toggle);
        }

        const submitButton = document.createElement("button");
        submitButton.classList.add("button", "button--primary");
        submitButton.textContent = "UPDATE";
        submitButton.addEventListener("click", (_ev) => this.saveState());

        containerDiv.appendChild(heading);
        containerDiv.appendChild(listContainer);
        containerDiv.appendChild(submitButton);

        return containerDiv;
    }

    installSettingsPage() {
        const settingsButtonObserver = new MutationObserver((mutations) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];

                for (let n = 0; n < mutation.addedNodes.length; n++) {
                    const node = mutation.addedNodes[n];

                    if (node.nodeName.toLowerCase() === "div") {
                        const accountSections = (node as HTMLElement).querySelector("ul[aria-label='Account sections']");
                        if (accountSections) {
                            const existingExtensionsBtn = accountSections.querySelector("button[id='tab--Extensions']");
                            if (!existingExtensionsBtn) {
                                for (const defaultBtn of accountSections.children) {
                                    defaultBtn.addEventListener("click", (_e: Event) => {
                                        this.cleanupCustomSettings()
                                    })
                                }

                                const customSettingsButton = this.createSettingsButton();
                                customSettingsButton.addEventListener("click", (_e: Event) => this.prepareForCustomSettings());
                                accountSections.insertBefore(customSettingsButton, accountSections.firstChild);
                            }
                        }

                        const tabPanel = document.querySelector("div[role='tabpanel']");
                        if (tabPanel) {
                            this.attachPanelInjector(tabPanel);
                        }
                    }
                }
            }
        });

        settingsButtonObserver.observe(document, {childList: true, subtree: true});
    }

    private updateState(newState: SettingsObject) {
        this.settings = newState || this.settings;
        this.createdToggles.forEach((toggle) => {
            toggle.setAttribute("checked", this.settings[toggle.id] ? "true" : "false");
        });

        if (this.updateHandler) {
            this.updateHandler(this.settings);
        }
    }

    private saveState() {
        debug("Collecting settings values from the panel...");
        this.createdToggles.forEach((toggle) => {
            this.settings[toggle.id] = toggle.checked;
        });

        debug("Sending settings to be saved...");
        sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, {settings: this.settings});
    }

    registerUpdateHandler(handler: (settings: SettingsObject) => void) {
        this.updateHandler = handler;
    }
}

class FLSettingsBackend {
    private readonly schema: SettingsSchema;

    constructor(schema: SettingsSchema) {
        this.schema = schema;
    }

    private getFallenLondonTabs(): Promise<Array<Tab>> {
        return new Promise((resolve, _) => {
            chrome.windows.getCurrent(w => {
                chrome.tabs.query(
                    {windowId: w.id, url: "*://*.fallenlondon.com/*"},
                    function (tabs) {
                        resolve(tabs);
                    }
                );
            });
        });
    }

    private sendStateToTabs(tabs: Array<Tab>, state: SettingsObject) {
        console.debug("Sending state to tabs", state);
        tabs.map((t) => {
            if (t.id == null) {
                return;
            }

            chrome.tabs.sendMessage(t.id, {action: MSG_TYPE_CURRENT_SETTINGS, settings: state})
        });
    }

    isMessageRelevant(message: {[key: string]: boolean | string}) {
        return message.action == MSG_TYPE_CURRENT_SETTINGS || message.action == MSG_TYPE_SAVE_SETTINGS;
    }

    handleMessage(message: SettingsMessage) {
        if (message.action === MSG_TYPE_SAVE_SETTINGS) {
            chrome.storage.local.set({
                settings: message.settings
            }, () => {
                // Send out new state to the FL tabs
                this.getFallenLondonTabs().then(tabs => {
                    if (message.settings == null) {
                        return;
                    }

                    this.sendStateToTabs(tabs, message.settings);
                });

                log("Saved settings to local storage.");
            });
        }

        if (message.action === MSG_TYPE_CURRENT_SETTINGS) {
            chrome.storage.local.get(['settings'], (result) => {
                if (chrome.runtime.lastError) {
                    debug("Could not load settings from DB, falling back to defaults.")
                    this.getFallenLondonTabs().then(tabs => this.sendStateToTabs(tabs, createDefaultSettings(this.schema)));
                } else {
                    this.getFallenLondonTabs().then(tabs => this.sendStateToTabs(tabs, result.settings));
                }
            });
        }
    }
}

export { FLSettingsFrontend, FLSettingsBackend, SettingsObject, SettingsSchema };