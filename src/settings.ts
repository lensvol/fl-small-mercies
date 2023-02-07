import {debug, log, error} from "./logging.js";
import {sendToServiceWorker} from "./comms.js";
import {MSG_TYPE_CURRENT_SETTINGS, MSG_TYPE_SAVE_SETTINGS} from "./constants.js";

import Tab = chrome.tabs.Tab;

type MultipleChoices = [string, string][]
type ToggleSetting = { description: string, default: boolean }
type MultipleChoiceSetting = { description: string, default: string, choices: MultipleChoices }
type SettingDescriptor = MultipleChoiceSetting | ToggleSetting
type SettingGroupDescriptor = { title: string, settings: {[key: string]: SettingDescriptor} }
type SettingsSchema = SettingGroupDescriptor[]
type SettingsObject = {[key: string]: boolean | string }
type SettingsMessage = { action: string, settings?: SettingsObject }

function createDefaultSettings(schema: SettingsSchema): SettingsObject {
    const defaultSettings: {[key: string]: boolean | string} = {};
    for (const groupDescriptor of schema) {
        for (const [settingId, descriptor] of Object.entries(groupDescriptor.settings)) {
            defaultSettings[settingId] = descriptor.default;
        }
    }
    return defaultSettings;
}

const isToggle = (setting: SettingDescriptor): setting is ToggleSetting => typeof setting.default == "boolean"
const isMultipleChoice = (setting: SettingDescriptor): setting is MultipleChoiceSetting => "choices" in setting

class FLSettingsFrontend {
    private readonly name: string;
    private readonly extensionId: string;

    private settings: SettingsObject;
    private readonly schema: SettingsSchema;

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

    createGroupHeader(title: string) {
        const groupTitle = document.createElement('h2');
        groupTitle.classList.add('heading', 'heading--3');
        groupTitle.textContent = title;

        return groupTitle;
    }

    createMultipleChoice(title: string, settingId: string, choices: MultipleChoices) {
        const div = document.createElement('div');
        div.style.cssText = "padding-top: 5px";

        const titleHeader = document.createElement('h2');
        titleHeader.textContent = title + ":";

        const form = document.createElement('form');
        form.setAttribute('action', '#');
        form.setAttribute('id', `choice-${settingId}`);

        const choicesDiv = document.createElement('div');
        choicesDiv.setAttribute('role', 'group');

        for (const [value, description] of choices) {
            const choiceId = `${settingId}-${value}`;

            const label = document.createElement('label');
            label.classList.add('radio');
            label.setAttribute('for', choiceId);
            label.style.cssText = 'margin-left: 20px;';

            const choice = document.createElement('input');
            choice.setAttribute('value', value);
            choice.setAttribute('name', settingId);
            choice.setAttribute('type', 'radio');

            label.appendChild(choice);
            label.appendChild(document.createTextNode(description));

            choicesDiv.appendChild(label);
        }

        div.appendChild(titleHeader);
        div.appendChild(form);
        form.appendChild(choicesDiv);
        return div;
    }

    private createLocalSettingsPanel(): Node {
        const containerDiv = document.createElement("div");
        containerDiv.setAttribute("custom-settings", this.extensionId);

        const heading = document.createElement("h2");
        heading.classList.add("heading", "heading--2");
        heading.textContent = this.name;
        heading.setAttribute("id", "extension-panel");

        const listContainer = document.createElement("ul");
        // FIXME: Use proper CSS classes for that
        listContainer.style.cssText = "padding-left: 5px";

        for (const groupDescriptor of this.schema) {
            listContainer.appendChild(this.createGroupHeader(groupDescriptor.title));

            for (const [settingId, descriptor] of Object.entries(groupDescriptor.settings)) {
                if (isToggle(descriptor)) {
                    const toggle = document.createElement("li");
                    toggle.classList.add("checkbox");

                    const label = document.createElement("label");

                    const input = document.createElement("input");
                    input.setAttribute("id", settingId);
                    input.setAttribute("type", "checkbox");
                    input.checked = (this.settings[settingId] as boolean);
                    input.addEventListener("click", (_ev) => this.saveState());

                    label.appendChild(input);
                    label.appendChild(document.createTextNode(descriptor.description));

                    toggle.appendChild(label);
                    listContainer.appendChild(toggle);
                }

                if (isMultipleChoice(descriptor)) {
                    const choicePanel = this.createMultipleChoice(descriptor.description, settingId, descriptor.choices);

                    const radios: NodeListOf<HTMLInputElement> = choicePanel.querySelectorAll(`input[name='${settingId}']`);
                    for (const radio of radios) {
                        if (radio.value == this.settings[settingId]) {
                            radio.setAttribute("checked", "");
                        } else {
                            radio.removeAttribute("checked");
                        }

                        radio.addEventListener("click", (_ev) => this.saveState());
                    }

                    listContainer.appendChild(choicePanel);
                }
            }
        }

        containerDiv.appendChild(heading);
        containerDiv.appendChild(listContainer);

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

        if (this.updateHandler) {
            this.updateHandler(this.settings);
        }
    }

    private saveState() {
        debug("Collecting settings values from the panel...");

        const rootNode = document.querySelector(`div[custom-settings="${this.extensionId}"]`);
        if (!rootNode) {
            debug("Failed to save state because of missing settings panel.");
            return;
        }

        for (const groupDescriptor of this.schema) {
            for (const [settingId, descriptor] of Object.entries(groupDescriptor.settings)) {
                if (isToggle(descriptor)) {
                    const toggleInput = rootNode.querySelector(`input[id=${settingId}]`)
                    this.settings[settingId] = (toggleInput as HTMLInputElement)?.checked;
                }

                if (isMultipleChoice(descriptor)) {
                    const radios: NodeListOf<HTMLInputElement> = rootNode.querySelectorAll(`input[name='${settingId}']`);
                    for (const radio of radios) {
                        if (radio.checked) {
                            this.settings[settingId] = radio.value;
                        }
                    }
                }
            }
        }

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