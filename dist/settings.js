import { debug } from "./logging.js";
import { sendToServiceWorker } from "./comms.js";
import { MSG_TYPE_CURRENT_SETTINGS, MSG_TYPE_SAVE_SETTINGS } from "./constants.js";
class FLSettingsFrontend {
    constructor(extensionId, name, schema) {
        this.createdToggles = [];
        this.extensionId = extensionId;
        this.name = name;
        this.schema = schema;
        debug("Initializing create default settings object...");
        this.settings = this.createDefaultSettings();
        window.addEventListener("message", (event) => {
            if (event.data.action === MSG_TYPE_CURRENT_SETTINGS) {
                debug("Update settings with the new data...");
                this.updateState(event.data.settings);
            }
        });
        sendToServiceWorker(MSG_TYPE_CURRENT_SETTINGS, {});
    }
    createDefaultSettings() {
        const defaultSettings = {};
        // @ts-ignore
        this.schema.forEach((description, toggleId) => { defaultSettings[toggleId] = false; });
        return defaultSettings;
    }
    attachPanelInjector(node) {
        const panelInjectorObserver = new MutationObserver((mutations) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];
                if (mutation.type != "attributes")
                    continue;
                if (mutation.attributeName != "aria-labelledby")
                    continue;
                const target = mutation.target;
                if (target.getAttribute("aria-labelledby") === "tab--Extensions") {
                    if (target.querySelector(`div[custom-settings="${this.extensionId}"]`)) {
                        continue;
                    }
                    target.appendChild(this.createLocalSettingsPanel());
                }
            }
        });
        panelInjectorObserver.observe(node, { attributes: true });
    }
    prepareForCustomSettings() {
        const tabPanel = document.querySelector("div[role='tabpanel']");
        if (!tabPanel)
            return;
        for (const child of tabPanel.children) {
            if (child.hasAttribute("custom-settings")) {
                continue;
            }
            child.style.cssText = "display: none;";
        }
        tabPanel.setAttribute("aria-labelledby", "tab--Extensions");
    }
    cleanupCustomSettings() {
        const tabPanel = document.querySelector("div[role='tabpanel']");
        if (!tabPanel)
            return;
        const setForRemoval = [];
        for (const child of tabPanel.children) {
            if (child.hasAttribute("custom-settings")) {
                setForRemoval.push(child);
            }
            else {
                child.style.cssText = "display: block;";
            }
        }
        setForRemoval.map((child) => child.remove());
    }
    createSettingsButton() {
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
    createLocalSettingsPanel() {
        const containerDiv = document.createElement("div");
        containerDiv.setAttribute("custom-settings", this.extensionId);
        const heading = document.createElement("h2");
        heading.classList.add("heading", "heading--2");
        heading.textContent = this.name;
        heading.setAttribute("id", "extension-panel");
        const listContainer = document.createElement("ul");
        this.createdToggles = [];
        this.schema.forEach((description, toggleId) => {
            const toggle = document.createElement("li");
            toggle.classList.add("checkbox");
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.setAttribute("id", toggleId);
            input.setAttribute("type", "checkbox");
            input.checked = this.settings[toggleId];
            this.createdToggles.push(input);
            label.appendChild(input);
            label.appendChild(document.createTextNode(description));
            toggle.appendChild(label);
            listContainer.appendChild(toggle);
        });
        const submitButton = document.createElement("button");
        submitButton.classList.add("button", "button--primary");
        submitButton.textContent = "UPDATE";
        submitButton.addEventListener("click", (ev) => this.saveState());
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
                        // @ts-ignore
                        const accountSections = node.querySelector("ul[aria-label='Account sections']");
                        if (accountSections) {
                            const existingExtensionsBtn = accountSections.querySelector("button[id='tab--Extensions']");
                            if (!existingExtensionsBtn) {
                                for (const defaultBtn of accountSections.children) {
                                    defaultBtn.addEventListener("click", (e) => {
                                        this.cleanupCustomSettings();
                                    });
                                }
                                const customSettingsButton = this.createSettingsButton();
                                customSettingsButton.addEventListener("click", (e) => this.prepareForCustomSettings());
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
        settingsButtonObserver.observe(document, { childList: true, subtree: true });
    }
    updateState(newState) {
        this.settings = newState || this.settings;
        this.createdToggles.forEach((toggle) => {
            // @ts-ignore
            toggle.checked = this.settings[toggle.id];
        });
        if (this.updateHandler) {
            this.updateHandler(this.settings);
        }
    }
    saveState() {
        debug("Collecting settings values from the panel...");
        this.createdToggles.forEach((toggle) => {
            // @ts-ignore
            this.settings[toggle.id] = toggle.checked;
        });
        debug("Sending settings to be saved...");
        sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.settings });
    }
    registerUpdateHandler(handler) {
        this.updateHandler = handler;
    }
}
export { FLSettingsFrontend };
//# sourceMappingURL=settings.js.map