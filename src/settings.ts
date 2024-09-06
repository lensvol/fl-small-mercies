import {debug, log} from "./logging";
import {sendToServiceWorker} from "./comms";
import {MSG_TYPE_CURRENT_SETTINGS, MSG_TYPE_SAVE_SETTINGS} from "./constants";
import { GameState, GameStateController } from "./game_state";
import Tab = chrome.tabs.Tab;
import { TrackedQuality } from "./fixers/misc_tracker";

type MultipleChoices = [string, string][];
type ToggleSetting = {description: string; default: boolean};
type MultipleChoiceSetting = {description: string; default: string; choices: MultipleChoices};
type DropDownListSetting = { description: string; default: string };
type SettingDescriptor = MultipleChoiceSetting | ToggleSetting | DropDownListSetting;
type SettingGroupDescriptor = {title: string; settings: {[key: string]: SettingDescriptor}};
type SettingsSchema = SettingGroupDescriptor[];
type SettingsObject = {[key: string]: boolean | string};
type SettingsMessage = {action: string; settings?: SettingsObject};

function createDefaultSettings(schema: SettingsSchema): SettingsObject {
    const defaultSettings: {[key: string]: boolean | string} = {};
    for (const groupDescriptor of schema) {
        for (const [settingId, descriptor] of Object.entries(groupDescriptor.settings)) {
            defaultSettings[settingId] = descriptor.default;
        }
    }
    return defaultSettings;
}

const isToggle = (setting: SettingDescriptor): setting is ToggleSetting => typeof setting.default == "boolean";
const isMultipleChoice = (setting: SettingDescriptor): setting is MultipleChoiceSetting => "choices" in setting;
const isDropDown = (setting: SettingDescriptor): setting is DropDownListSetting => setting.default === "select";

class FLSettingsFrontend {
    private readonly name: string;
    private readonly extensionId: string;

    private settings: SettingsObject;
    private readonly schema: SettingsSchema;

    private updateHandler?: (settings: SettingsObject) => void;

    private currentState?: GameState;
    private trackedQualities: Map<string, TrackedQuality> = new Map();
    private qualityNameAndCategory: Map<string, string> = new Map();
    private qualityNames: string[] = [];

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

    linkState(state: GameStateController): void {
        const stringSorter = (s1: string, s2: string) => (s1 > s2 ? 1 : -1)
        state.onCharacterDataLoaded((g) => {
            this.currentState = g;
            const unsortedQualityNames: string[] = []
            for (const quality of g.enumerateQualities()) {
                this.qualityNameAndCategory.set(quality.name, quality.category);
                unsortedQualityNames.push(quality.name);
            }
            this.qualityNames = unsortedQualityNames.sort(stringSorter)
        });
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

        for (const child of tabPanel.children as HTMLCollectionOf<HTMLElement>) {
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

        for (const child of tabPanel.children as HTMLCollectionOf<HTMLElement>) {
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
        const groupTitle = document.createElement("h2");
        groupTitle.classList.add("heading", "heading--3");
        groupTitle.textContent = title;

        return groupTitle;
    }

    createMultipleChoice(title: string, settingId: string, choices: MultipleChoices) {
        const div = document.createElement("div");
        // FIXME: Use proper CSS classes here!
        div.style.cssText = "padding-left: 20px";

        const titleHeader = document.createElement("h2");
        titleHeader.textContent = title + ":";

        const form = document.createElement("form");
        form.setAttribute("action", "#");
        form.setAttribute("id", `choice-${settingId}`);

        const choicesDiv = document.createElement("div");
        choicesDiv.setAttribute("role", "group");

        for (const [value, description] of choices) {
            const choiceId = `${settingId}-${value}`;

            const label = document.createElement("label");
            label.classList.add("radio");
            label.setAttribute("for", choiceId);
            label.style.cssText = "margin-left: 20px;";

            const choice = document.createElement("input");
            choice.setAttribute("value", value);
            choice.setAttribute("name", settingId);
            choice.setAttribute("type", "radio");

            label.appendChild(choice);
            label.appendChild(document.createTextNode(description));

            choicesDiv.appendChild(label);
        }

        div.appendChild(titleHeader);
        div.appendChild(form);
        form.appendChild(choicesDiv);
        return div;
    }

    createDropDownSelect() {
        const miscPicker = document.createElement("div");
        miscPicker.setAttribute("id", "misc-picker");
        const miscSelect = document.createElement("input");
        miscSelect.setAttribute("list", "quality-list");
        miscSelect.id = "track-target-name";
        miscPicker.appendChild(miscSelect);
        const dataList = document.createElement("datalist");
        dataList.setAttribute("id", "quality-list");
        for (const qualityName of this.qualityNames) {
            const option = document.createElement("option");
            option.value = qualityName;
            option.text = qualityName;
            dataList.appendChild(option);
        }
        miscPicker.appendChild(dataList);
        const targetInput = document.createElement("input");
        targetInput.id = "track-target-number";
        targetInput.type = "number";
        miscPicker.appendChild(targetInput);
        const trackButton = document.createElement("button");
        trackButton.classList.add("js-tt", "button", "button--primary", "button--margin", "button--go")
        trackButton.addEventListener("click", () => {
            const trackName = (document.getElementById("track-target-name") as HTMLSelectElement).value;
            const trackNumber = Number((document.getElementById("track-target-number") as HTMLInputElement).value);
            const trackCategory = this.qualityNameAndCategory.get(trackName) || "";
            const trackCurrent: number = this.currentState?.getQuality(trackCategory, trackName)?.level || 0;
            const trackImage: string = this.currentState?.getQuality(trackCategory, trackName)?.image || "question"
            const newQuality = { name: trackName, category: trackCategory, currentValue: trackCurrent, targetValue: trackNumber, image: trackImage };
            this.trackedQualities.set(trackName, newQuality);

            this.settings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));

            sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.settings });

            document.getElementById('misc-tracker')?.insertBefore(this.createTracker(trackName), miscPicker);
        })
        const trackText = document.createElement("span");
        trackText.textContent = "Track";
        trackButton.appendChild(trackText);
        miscPicker.appendChild(trackButton);

        return miscPicker;
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
        listContainer.style.cssText = "padding-left: 12px";

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
                    input.checked = this.settings[settingId] as boolean;
                    input.addEventListener("click", (_ev) => this.saveState());

                    label.appendChild(input);
                    label.appendChild(document.createTextNode(descriptor.description));

                    toggle.appendChild(label);
                    listContainer.appendChild(toggle);
                    if (settingId === "display_quality_tracker") {
                        toggle.addEventListener("click", () => {
                            const miscPanel = document.getElementById('misc-tracker')
                            if (miscPanel) {
                                if (this.settings.display_quality_tracker) {
                                    miscPanel.removeAttribute("hidden")
                                } else {
                                    miscPanel.setAttribute("hidden", "");
                                }
                            }
                        })
                    }
                }

                if (isMultipleChoice(descriptor)) {
                    const choicePanel = this.createMultipleChoice(
                        descriptor.description,
                        settingId,
                        descriptor.choices
                    );

                    const radios: NodeListOf<HTMLInputElement> = choicePanel.querySelectorAll(
                        `input[name='${settingId}']`
                    );
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

                if (isDropDown(descriptor)) {
                    let temp = this.settings.trackedQualities as string;
                    if (!temp) {
                        temp = "{}";
                    }
                    this.trackedQualities = new Map(Object.entries(JSON.parse(temp)));

                    const miscPanel = document.createElement("ul");
                    miscPanel.setAttribute("id", "misc-tracker");
                    miscPanel.setAttribute("hidden", "true")
                    miscPanel.classList.add("items", "items--list");

                    for (const valueName of this.trackedQualities.keys()) {
                        const miscDisplay = this.createTracker(valueName);
                        miscPanel.appendChild(miscDisplay);
                    }

                    if (this.settings.display_quality_tracker) {
                        miscPanel.removeAttribute("hidden")
                    } else {
                        miscPanel.setAttribute("hidden", "");
                    }

                    const dropDown = this.createDropDownSelect()

                    miscPanel.appendChild(dropDown);
                    listContainer.appendChild(miscPanel);
                }
            }
        }

        containerDiv.appendChild(heading);
        containerDiv.appendChild(listContainer);

        return containerDiv;
    }

    private createTracker(title: string): HTMLElement {
        const trackedQuality = this.trackedQualities.get(title);
        const initialValue = trackedQuality?.currentValue || 0;
        const targetValue = trackedQuality?.targetValue || 0;
        const icon = trackedQuality?.image || "question";

        const li = document.createElement("li");
        li.id = `${title}-tracker`;
        li.classList.add("js-item", "item", "sidebar-quality", "tracked-misc");
        li.style.cssText = "text-align: left";
        li.dataset.qualityName = title;

        const div = document.createElement("div");
        div.classList.add("js-icon", "icon", "js-tt", "icon--circular");

        const div3 = document.createElement("div");
        div3.classList.add("item__desc");

        const div4 = document.createElement("div");
        div4.setAttribute("tabindex", "0");
        div4.setAttribute("role", "button");
        div4.setAttribute("aria-label", title);
        div4.style.cssText = "outline: 0px; outline-offset: 0px; cursor: default;";

        const span = document.createElement("span");
        span.classList.add("js-item-name", "item__name");
        span.textContent = title;

        const span3 = document.createElement("span");
        span3.classList.add("item__value");
        span3.textContent = ` ${initialValue} / ${targetValue}`;

        const img = document.createElement("img");
        img.classList.add("cursor-default");
        img.setAttribute("alt", `${title}`);
        img.setAttribute("src", `//images.fallenlondon.com/icons/${icon}.png`);
        img.setAttribute("aria-label", `${title}`);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("buttonlet-container")
        deleteButton.setAttribute("aria-label", "Stop Tracking");
        deleteButton.setAttribute("type", "button");

        const deleteSpan1 = document.createElement("span");
        deleteSpan1.classList.add("buttonlet", "fa-stack", "fa-lg", "buttonlet-enabled", "buttonlet-delete");
        deleteSpan1.setAttribute("title", "Stop Tracking")

        const deleteSpan2 = document.createElement("span");
        deleteSpan2.classList.add("fa", "fa-circle", "fa-stack-2x");

        const deleteSpan3 = document.createElement("span");
        deleteSpan3.classList.add("fa", "fa-inverse", "fa-stack-1x", "fa-times");

        const deleteSpan4 = document.createElement("span");
        deleteSpan4.classList.add("u-visually-hidden")
        deleteSpan4.textContent = "delete";

        deleteButton.appendChild(deleteSpan1);
        deleteSpan1.appendChild(deleteSpan2);
        deleteSpan1.appendChild(deleteSpan3);
        deleteSpan1.appendChild(deleteSpan4);

        deleteButton.addEventListener("click", () => {
            document.getElementById(li.id)?.remove();
            this.trackedQualities.delete(title);
            this.settings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities))

            sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.settings });
        })

        li.appendChild(div);
        li.appendChild(div3);
        li.appendChild(deleteButton);
        div.appendChild(div4);
        div3.appendChild(span);
        div3.appendChild(span3);
        div4.appendChild(img);

        return li;
    }

    installSettingsPage() {
        const settingsButtonObserver = new MutationObserver((mutations) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];

                for (let n = 0; n < mutation.addedNodes.length; n++) {
                    const node = mutation.addedNodes[n];

                    if (node.nodeName.toLowerCase() === "div") {
                        const accountSections = (node as HTMLElement).querySelector(
                            "ul[aria-label='Account sections']"
                        );
                        if (accountSections) {
                            const existingExtensionsBtn = accountSections.querySelector("button[id='tab--Extensions']");
                            if (!existingExtensionsBtn) {
                                for (const defaultBtn of accountSections.children) {
                                    defaultBtn.addEventListener("click", (_e: Event) => {
                                        this.cleanupCustomSettings();
                                    });
                                }

                                const customSettingsButton = this.createSettingsButton();
                                customSettingsButton.addEventListener("click", (_e: Event) =>
                                    this.prepareForCustomSettings()
                                );
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
                    const toggleInput = rootNode.querySelector(`input[id=${settingId}]`);
                    this.settings[settingId] = (toggleInput as HTMLInputElement)?.checked;
                }

                if (isMultipleChoice(descriptor)) {
                    const radios: NodeListOf<HTMLInputElement> = rootNode.querySelectorAll(
                        `input[name='${settingId}']`
                    );
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
            chrome.windows.getCurrent((w) => {
                chrome.tabs.query({windowId: w.id, url: "*://*.fallenlondon.com/*"}, function (tabs) {
                    resolve(tabs);
                });
            });
        });
    }

    private sendStateToTabs(tabs: Array<Tab>, state: SettingsObject) {
        console.debug("Sending state to tabs", state);
        tabs.map((t) => {
            if (t.id == null) {
                return;
            }

            chrome.tabs.sendMessage(t.id, {action: MSG_TYPE_CURRENT_SETTINGS, settings: state});
        });
    }

    isMessageRelevant(message: {[key: string]: boolean | string}) {
        return message.action == MSG_TYPE_CURRENT_SETTINGS || message.action == MSG_TYPE_SAVE_SETTINGS;
    }

    handleMessage(message: SettingsMessage) {
        if (message.action === MSG_TYPE_SAVE_SETTINGS) {
            chrome.storage.local.set(
                {
                    settings: message.settings,
                },
                () => {
                    // Send out new state to the FL tabs
                    this.getFallenLondonTabs().then((tabs) => {
                        if (message.settings == null) {
                            return;
                        }

                        this.sendStateToTabs(tabs, message.settings);
                    });

                    log("Saved settings to local storage.");
                }
            );
        }

        if (message.action === MSG_TYPE_CURRENT_SETTINGS) {
            chrome.storage.local.get(["settings"], (result) => {
                if (chrome.runtime.lastError) {
                    debug("Could not load settings from DB, falling back to defaults.");
                    this.getFallenLondonTabs().then((tabs) =>
                        this.sendStateToTabs(tabs, createDefaultSettings(this.schema))
                    );
                } else {
                    this.getFallenLondonTabs().then((tabs) => this.sendStateToTabs(tabs, result.settings));
                }
            });
        }
    }
}

export {FLSettingsFrontend, FLSettingsBackend, SettingsObject, SettingsSchema};
