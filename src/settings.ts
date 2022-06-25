import {debug} from "./logging.js";

class FLSettingsFrontend {
    private name: string;
    private schema: Map<string, string>;
    private extensionId: string;

    constructor(extensionId: string, name: string, schema: Map<string, string>) {
        this.extensionId = extensionId;
        this.name = name;
        this.schema = schema;
    }

    attachPanelInjector(node: Node) {
        const panelInjectorObserver = new MutationObserver((mutations) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];

                if (mutation.type != "attributes") continue;

                if (mutation.attributeName != "aria-labelledby") continue;

                // @ts-ignore
                if (mutation.target.getAttribute("aria-labelledby") === "tab--Extensions") {
                    if (mutation.target.querySelector(`div[custom-settings="${this.extensionId}"]`)) {
                        continue;
                    }

                    mutation.target.appendChild(this.createLocalSettingsPanel());
                }
            }
        });

        panelInjectorObserver.observe(node, {attributes: true});
    }

    prepareForCustomSettings() {
        const tabPanel = document.querySelector("div[role='tabpanel']");
        if (!tabPanel) return;

        for (const child of (tabPanel.children as HTMLCollectionOf<HTMLElement>)) {
            child.style.cssText = "display: none;";
        }
        tabPanel.setAttribute("aria-labelledby", "tab--Extensions");
    }

    cleanupCustomSettings() {
        const tabPanel = document.querySelector("div[role='tabpanel']");
        if (!tabPanel) return;

        for (const child of (tabPanel.children as HTMLCollectionOf<HTMLElement>)) {
            if (child.hasAttribute("custom-settings")) {
                child.remove();
            } else {
                child.style.cssText = "display: block;";
            }
        }
    }

    createSettingsButton(): Node {
        const button = document.createElement("button");
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

    createLocalSettingsPanel(): Node {
        const containerDiv = document.createElement("div");
        containerDiv.setAttribute("custom-settings", this.extensionId);

        const heading = document.createElement("h2");
        heading.classList.add("heading", "heading--2");
        heading.textContent = this.name;
        heading.setAttribute("id", "extension-panel");

        const listContainer = document.createElement("ul");

        this.schema.forEach((description, toggleId) => {
            const toggle = document.createElement("li");
            toggle.classList.add("checkbox");

            const label = document.createElement("label");

            const input = document.createElement("input");
            input.setAttribute("id", toggleId);
            input.setAttribute("type", "checkbox");

            label.appendChild(input);
            label.appendChild(document.createTextNode(description));

            toggle.appendChild(label);
            listContainer.appendChild(toggle);
        });

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
                        // @ts-ignore
                        const accountSections = node.querySelector("ul[aria-label='Account sections']");
                        if (accountSections) {
                            const existingExtensionsBtn = accountSections.querySelector("button[id='tab--Extensions']");
                            if (!existingExtensionsBtn) {
                                for (const defaultBtn of accountSections.children) {
                                    defaultBtn.addEventListener("click", (e: Event) => {
                                        this.cleanupCustomSettings()
                                    })
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

        settingsButtonObserver.observe(document, {childList: true, subtree: true});
    }
}

export { FLSettingsFrontend };