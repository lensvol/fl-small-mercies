import { IMutationAware, IStateAware } from "./base";
import { SettingsObject } from "../settings";
import { GameState, GameStateController } from "../game_state";
import { getSingletonByClassName } from "../utils";
import { MSG_TYPE_SAVE_SETTINGS } from "../constants";
import { sendToServiceWorker } from "../comms";

// Mapping of favour name to its respective image
const FAVOURS = new Map([
    ["Favours: Bohemians", "bohogirl1"],
    ["Favours: Society", "salon2"],
    ["Favours: Criminals", "manacles"],
    ["Favours: The Church", "clergy"],
    ["Favours: The Docks", "ship"],
    ["Favours: Urchins", "urchin"],
    ["Favours: Constables", "constablebadge"],
    ["Favours: Fingerkings", "fingerking"],
    ["Favours: Hell", "devil"],
    ["Favours: Revolutionaries", "flames"],
    ["Favours: Rubbery Men", "rubberyman"],
    ["Favours: The Great Game", "pawn"],
    ["Favours: Tomb-Colonies", "bandagedman"]
]);

type UpOrDown = "UP" | "DOWN";

export class MiscTrackerFixer implements IMutationAware, IStateAware {

    private displayQualityTracker = true;
    private trackedQualities: Map<string, TrackedQuality> = new Map();
    private qualityNameAndCategory: Map<string, string> = new Map();
    private qualityNames: string[] = [];
    private currentState?: GameState;
    private currentSettings!: SettingsObject;

    constructor() {
        ;
    }

    applySettings(settings: SettingsObject): void {
        this.currentSettings = settings;
        const temp = settings.trackedQualities as string;
        if (temp === undefined) {
            this.populateDefaultTrackedQualities();
        } else {
            this.trackedQualities = new Map(Object.entries(JSON.parse(temp)));
        }
        this.displayQualityTracker = this.currentSettings.display_quality_tracker as boolean;
    }

    linkState(state: GameStateController): void {
        const stringSorter = (s1: string, s2: string) => (s1 > s2 ? 1 : -1);
        state.onCharacterDataLoaded((g) => {
            this.currentState = g;
            const unsortedQualityNames: string[] = [];
            for (const quality of g.enumerateQualities()) {
                this.qualityNameAndCategory.set(quality.name, quality.category);
                unsortedQualityNames.push(quality.name);
            }
            this.qualityNames = unsortedQualityNames.sort(stringSorter);
            for (const [trackedQualityName, trackedQuality] of this.trackedQualities) {
                let dirty = false;
                if (trackedQuality.category === "") {
                    trackedQuality.category = this.qualityNameAndCategory.get(trackedQualityName) || "";
                    trackedQuality.image = this.currentState?.getQuality(trackedQuality.category, trackedQualityName)?.image || "question";
                    if (trackedQuality.image !== "question") {
                        const trackerIcon = document.getElementById(`${trackedQualityName}-tracker-icon`);
                        trackerIcon?.setAttribute("src", `//images.fallenlondon.com/icons/${trackedQuality.image}.png`);
                    }
                    dirty = trackedQuality.category !== "";
                }
                if (trackedQuality.category !== "") {
                    const quality = g.getQuality(trackedQuality.category, trackedQualityName);
                    if (quality) {
                        trackedQuality.currentValue = quality.level;
                        if (trackedQuality.image === "question") {
                            trackedQuality.image = quality.image;
                        }
                    } else {
                        trackedQuality.currentValue = 0;
                    }
                    this.updateQualityOnPage(trackedQuality);
                }
                if (dirty && this.currentSettings) {
                    this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));
                    sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
                }
            }
        });

        state.onQualityChanged((_state, quality, _previous, current) => {
            if (!this.qualityNames.includes(quality.name)) {
                this.qualityNames.push(quality.name);
                this.qualityNames = this.qualityNames.sort(stringSorter);
                this.qualityNameAndCategory.set(quality.name, quality.category);

                const qualityList = document.getElementById("quality-list");
                const option = document.createElement("option");
                option.value = quality.name;
                option.text = quality.name;
                qualityList?.appendChild(option);
            }
            if (this.trackedQualities.has(quality.name)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const updatedQuality = this.trackedQualities.get(quality.name)!;
                updatedQuality.currentValue = current;
                if (updatedQuality.category === "") {
                    updatedQuality.category = this.qualityNameAndCategory.get(quality.name) || "";
                }
                updatedQuality.image = quality.image || "question";
                this.updateQualityOnPage(updatedQuality);
                this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));
                sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
            }
        });
    }

    //create the html element to track one quality
    private createTracker(quality: TrackedQuality, editMode: boolean): HTMLElement {
        const title = quality.name;
        const initialValue = quality.currentValue;
        const targetValue = quality.targetValue;
        let icon = quality.image;
        if (icon === "question" && quality.category) {
            icon = this.currentState?.getQuality(quality.category, title)?.image || "question";
        }

        const qualityListItem = document.createElement("li");
        if (editMode) {
            qualityListItem.id = `${title}-tracker-edit`;
            qualityListItem.classList.add("js-item", "item", "sidebar-quality", "tracked-quality-edit");
        } else {
            qualityListItem.id = `${title}-tracker`;
            qualityListItem.classList.add("js-item", "item", "sidebar-quality", "tracked-quality");
        }
        qualityListItem.style.cssText = "text-align: left";
        qualityListItem.dataset.qualityName = title;

        const div = document.createElement("div");
        div.classList.add("js-icon", "icon", "js-tt", "icon--circular");

        const div2 = document.createElement("div");
        div2.classList.add("item__desc");

        const div3 = document.createElement("div");
        div3.setAttribute("tabindex", "0");
        div3.setAttribute("role", "button");
        div3.setAttribute("aria-label", title);
        div3.style.cssText = "outline: 0px; outline-offset: 0px; cursor: default;";

        const nameSpan = document.createElement("span");
        nameSpan.classList.add("js-item-name", "item__name");
        nameSpan.textContent = title;

        const valueAndTargetSpan = document.createElement("span");
        valueAndTargetSpan.classList.add("item__value");
        valueAndTargetSpan.textContent = ` ${initialValue} / ${targetValue}`;

        const progressBarDiv = document.createElement("div");
        progressBarDiv.classList.add("progress-bar");

        const progressBarSpan = document.createElement("span");
        progressBarSpan.classList.add("progress-bar__stripe", "progress-bar__stripe--has-transition");
        let percentage = (initialValue / targetValue) * 100;
        if (percentage > 100) {
            percentage = 100;
        }
        progressBarSpan.style.cssText = `width: ${percentage}%;`;

        const img = document.createElement("img");
        img.classList.add("cursor-default");
        const imgIcon = editMode ? `${title}-tracker-icon-edit` : `${title}-tracker-icon`;
        img.setAttribute("id", imgIcon);
        img.setAttribute("alt", `${title}`);
        img.setAttribute("src", `//images.fallenlondon.com/icons/${icon}.png`);
        img.setAttribute("aria-label", `${title}`);

        qualityListItem.appendChild(div);
        qualityListItem.appendChild(div2);
        div.appendChild(div3);
        div2.appendChild(nameSpan);
        div2.appendChild(valueAndTargetSpan);
        div2.appendChild(progressBarDiv);
        div3.appendChild(img);
        progressBarDiv.appendChild(progressBarSpan);

        if (editMode) {
            const newTargetSpan = document.createElement("span");
            const targetInput = document.createElement("input");
            targetInput.id = `${title}-new-target-number`;
            targetInput.type = "number";
            targetInput.value = `${targetValue}`;
            targetInput.style.width = "6ch";
            newTargetSpan.appendChild(targetInput);
            const newTargetButton = document.createElement("button");
            newTargetButton.classList.add("js-tt", "button", "button--primary", "button--margin", "button--go");
            newTargetButton.addEventListener("click", () => {
                const newTargetNumber = Number(targetInput.value);

                this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));

                sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });

                const updatedQuality = this.trackedQualities.get(quality.name);
                //getting an updated version. If this handler tries to get quality, it's sometimes out of date.
                if (updatedQuality) {
                    const currentValue = updatedQuality.currentValue;
                    valueAndTargetSpan.textContent = ` ${currentValue} / ${newTargetNumber}`;
                    let updatedPercentage = (currentValue / newTargetNumber) * 100;
                    if (updatedPercentage > 100) {
                        updatedPercentage = 100;
                    }
                    progressBarSpan.style.cssText = `width: ${updatedPercentage}%;`;

                    const mirrorItem = document.getElementById(`${title}-tracker`);
                    const mirrorTargetText = mirrorItem?.getElementsByClassName("item__value").item(0);
                    const mirrorTargetBar = mirrorItem?.getElementsByClassName("progress-bar__stripe").item(0) as HTMLSpanElement;
                    if (mirrorTargetText && mirrorTargetBar) {
                        mirrorTargetText.textContent = valueAndTargetSpan.textContent;
                        mirrorTargetBar.style.cssText = progressBarSpan.style.cssText;
                    }
                }
            });
            const newTargetText = document.createElement("span");
            newTargetText.textContent = "New Target";
            newTargetButton.style.padding = "2px 5px";
            newTargetButton.appendChild(newTargetText);
            newTargetSpan.appendChild(newTargetButton);
            qualityListItem.appendChild(newTargetSpan);

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("buttonlet-container");
            deleteButton.setAttribute("aria-label", "Stop Tracking");
            deleteButton.setAttribute("type", "button");
            const deleteSpan1 = document.createElement("span");
            deleteSpan1.classList.add("buttonlet", "fa-stack", "fa-lg", "buttonlet-enabled", "buttonlet-delete");
            deleteSpan1.setAttribute("title", "Stop Tracking");
            const deleteSpan2 = document.createElement("span");
            deleteSpan2.classList.add("fa", "fa-circle", "fa-stack-2x");
            const deleteSpan3 = document.createElement("span");
            deleteSpan3.classList.add("fa", "fa-inverse", "fa-stack-1x", "fa-times");
            const deleteSpan4 = document.createElement("span");
            deleteSpan4.classList.add("u-visually-hidden");
            deleteSpan4.textContent = "delete";
            deleteButton.appendChild(deleteSpan1);
            deleteSpan1.appendChild(deleteSpan2);
            deleteSpan1.appendChild(deleteSpan3);
            deleteSpan1.appendChild(deleteSpan4);
            deleteButton.addEventListener("click", () => {
                const editPanel = qualityListItem.parentElement;
                document.getElementById(`${title}-tracker`)?.remove();
                document.getElementById(`${title}-tracker-edit`)?.remove();
                this.trackedQualities.delete(title);

                this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));
                sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
                this.hideUpAndDownButtons(editPanel as HTMLUListElement);
            });
            qualityListItem.appendChild(deleteButton);

            const upAndDownButtonSpan = document.createElement("span");
            const upButton = document.createElement("button");
            upButton.classList.add("js-tt", "button", "button--primary", "button--margin", "button--go", "up-button");
            upButton.addEventListener("click", () => {
                this.moveItem(title, qualityListItem, "UP");
            });
            const upButtonText = document.createElement("span");
            upButtonText.textContent = "Up";
            upButton.appendChild(upButtonText);
            upButton.style.padding = "2px 5px";

            const downButton = document.createElement("button");
            downButton.classList.add("js-tt", "button", "button--primary", "button--margin", "button--go", "down-button");
            downButton.addEventListener("click", () => {
                this.moveItem(title, qualityListItem, "DOWN");
            });
            const downButtonText = document.createElement("span");
            downButtonText.textContent = "Down";
            downButton.style.padding = "2px 5px";
            downButton.appendChild(downButtonText);
            upAndDownButtonSpan.appendChild(upButton);
            upAndDownButtonSpan.appendChild(downButton);
            qualityListItem.appendChild(upAndDownButtonSpan);
        }
        return qualityListItem;
    }

    private moveItem(title: string, qualityListItem: HTMLLIElement, upOrDown: UpOrDown) {
        const qualityKeys = Array.from(this.trackedQualities.keys());
        let currentIndex = -1;
        for (let i = 0; i < qualityKeys.length; i++) {
            if (qualityKeys[i] === title) {
                currentIndex = i;
                break;
            }
        }
        const editPanel = qualityListItem.parentElement as HTMLUListElement;
        const mainPanel = document.getElementById("quality-tracker") as HTMLUListElement;
        const thisQualityOnTheMainPanel = document.getElementById(`${title}-tracker`) as HTMLLIElement;
        if (editPanel && mainPanel && currentIndex !== -1) {
            if (upOrDown === "UP") {
                qualityKeys.splice(currentIndex - 1, 0, qualityKeys.splice(currentIndex, 1)[0]);
            }
            if (upOrDown === "DOWN") {
                qualityKeys.splice(currentIndex + 1, 0, qualityKeys.splice(currentIndex, 1)[0]);
            }
        }
        this.moveItemInOnePanel(qualityListItem, upOrDown, editPanel);
        this.moveItemInOnePanel(thisQualityOnTheMainPanel, upOrDown, mainPanel);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.trackedQualities = new Map(qualityKeys.map((key) => [key, this.trackedQualities.get(key)!]));
        this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));
        sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });

        this.hideUpAndDownButtons(editPanel);
    }

    private moveItemInOnePanel(qualityListItem: HTMLLIElement, upOrDown: UpOrDown, panel: HTMLUListElement) {
        let insertBeforeTarget: Node | undefined | null;
        if (upOrDown === "UP") {

            insertBeforeTarget = qualityListItem.previousSibling;
            if (!insertBeforeTarget) {
                console.error("Could not find required HTML Element");
                return;
            }
        }
        if (upOrDown === "DOWN") {

            insertBeforeTarget = qualityListItem.nextSibling?.nextSibling;
            //if this is null, insertBefore will add it to the end of the list
        }
        panel.insertBefore(qualityListItem, insertBeforeTarget || null);
    }

    //find the element, update the number
    private updateQualityOnPage(quality: TrackedQuality) {
        const qualityDisplays: HTMLElement[] = [];
        const existingDisplays = document.getElementsByClassName("tracked-quality");
        const existingEdits = document.getElementsByClassName("tracked-quality-edit");
        for (const display of existingDisplays) {
            const displayTitle = (display as HTMLElement).dataset.qualityName;
            if (displayTitle === quality.name) {
                qualityDisplays.push(display as HTMLElement);
            }
        }
        for (const display of existingEdits) {
            const displayTitle = (display as HTMLElement).dataset.qualityName;
            if (displayTitle === quality.name) {
                qualityDisplays.push(display as HTMLElement);
            }
        }

        for (const qualityDisplay of qualityDisplays) {
            const valueSpan = getSingletonByClassName(qualityDisplay, "item__value");
            const target = quality.targetValue;
            if (valueSpan) {
                valueSpan.textContent = ` ${quality.currentValue} / ${target}`;
            }

            const progressBarSpan = getSingletonByClassName(qualityDisplay, "progress-bar__stripe") as HTMLElement;
            if (progressBarSpan) {
                let percentage = (quality.currentValue / target) * 100;
                if (percentage > 100) {
                    percentage = 100;
                }
                progressBarSpan.style.cssText = `width: ${percentage}%;`;
            }
            qualityDisplay.style.cssText = "text-align: left";

            if (quality.image !== "question") {
                const icon = qualityDisplay.getElementsByTagName("img")[0];
                icon?.setAttribute("src", `//images.fallenlondon.com/icons/${quality.image}.png`);
            }
        }
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.displayQualityTracker) {
            return false;
        }

        if (node.getElementsByClassName("travel").length === 0) {
            return false;
        }
        return document.getElementById("quality-tracker") == null;
    }

    onNodeAdded(node: HTMLElement): void {
        const travelColumn = getSingletonByClassName(node, "travel");
        if (!travelColumn) return;

        let sidebar = document.getElementById("right-sidebar");
        if (!sidebar) {
            sidebar = document.createElement("div");
            sidebar.setAttribute("id", "right-sidebar");
            sidebar.classList.add("sidebar");

            if (travelColumn.querySelector("div[class='snippet']")) {
                // Give some clearance in case snippets are not disabled.
                (sidebar as HTMLElement).style.cssText = "margin-top: 30px";
            }
        }

        const qualityTrackerPanel = document.getElementById("quality-tracker");
        // Trackers are already created and visible, nothing to do here.
        if (!qualityTrackerPanel) {
            const fragment = this.createTrackerPanel(false);

            this.createEditModal();

            sidebar.appendChild(fragment);
        }

        if (!travelColumn.contains(sidebar)) {
            travelColumn.appendChild(sidebar);
        }
    }

    private createTrackerPanel(editMode: boolean) {
        const fragment = document.createDocumentFragment();

        const qualityTrackerHeader = document.createElement("p");
        qualityTrackerHeader.classList.add("heading", "heading--4");
        qualityTrackerHeader.textContent = "Tracked Qualities";
        fragment.appendChild(qualityTrackerHeader);

        const qualityTrackerPanel = document.createElement("ul");
        const panelId = editMode ? "quality-tracker-edit" : "quality-tracker";
        qualityTrackerPanel.setAttribute("id", panelId);
        qualityTrackerPanel.classList.add("items", "items--list");
        fragment.appendChild(qualityTrackerPanel);

        for (const quality of this.trackedQualities.values()) {
            const qualityDisplay = this.createTracker(quality, editMode);
            qualityTrackerPanel.appendChild(qualityDisplay);
        }

        if (editMode) {
            this.hideUpAndDownButtons(qualityTrackerPanel);
        } else {
            const modalButton = document.createElement("button");
            modalButton.id = "modal-button";
            modalButton.classList.add("js-tt", "button", "button--primary", "button--go");
            modalButton.style.padding = "2px 5px";
            modalButton.addEventListener("click", () => {
                (document.getElementById("edit-modal") as HTMLDialogElement)?.showModal();
            });
            const editText = document.createElement("span");
            editText.textContent = "Edit tracked qualities";
            modalButton.appendChild(editText);

            qualityTrackerPanel.appendChild(modalButton);
        }
        return fragment;
    }

    private createEditModal() {
        const editModal = document.createElement("dialog");
        document.body.appendChild(editModal);
        editModal.setAttribute("id", "edit-modal");
        const wrapperDiv = document.createElement("div");
        const editTrackerPanel = this.createTrackerPanel(true);
        editTrackerPanel.appendChild(this.createDropDownSelect());
        wrapperDiv.appendChild(editTrackerPanel);
        editModal.appendChild(wrapperDiv);
        const closeModalButton = document.createElement("button");
        closeModalButton.textContent = "Close";
        closeModalButton.addEventListener("click", () => {
            const qualitySelect = document.getElementById("track-target-name") as HTMLInputElement;
            if (qualitySelect) {
                qualitySelect.value = "";
            }
            editModal.close();
        });
        closeModalButton.classList.add("js-tt", "button", "button--primary", "button--go");
        closeModalButton.style.padding = "2px 5px";
        editModal.appendChild(closeModalButton);
        editModal.addEventListener("click", (event) => {
            if (event.target === editModal) {
                const qualitySelect = document.getElementById("track-target-name") as HTMLInputElement;
                if (qualitySelect) {
                    qualitySelect.value = "";
                }
                editModal.close();
            }
        });
        editModal.style.padding = "0";
        wrapperDiv.style.margin = "0";
        wrapperDiv.style.padding = "1rem";
        return editModal;
    }


    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }

    private createDropDownSelect() {
        const qualityPicker = document.createElement("div");
        qualityPicker.setAttribute("id", "quality-picker");
        const qualitySelect = document.createElement("input");
        qualitySelect.setAttribute("list", "quality-list");
        qualitySelect.setAttribute("placeholder", "Item or Quality");
        qualitySelect.id = "track-target-name";
        qualitySelect.style.width = "90ch";
        qualityPicker.appendChild(qualitySelect);
        const dataList = document.createElement("datalist");
        dataList.setAttribute("id", "quality-list");
        for (const qualityName of this.qualityNames) {
            const option = document.createElement("option");
            option.value = qualityName;
            option.text = qualityName;
            dataList.appendChild(option);
        }
        qualityPicker.appendChild(dataList);
        const targetInput = document.createElement("input");
        targetInput.setAttribute("placeholder", "Target number");
        targetInput.id = "track-target-number";
        targetInput.type = "number";
        targetInput.style.width = "12ch";
        qualityPicker.appendChild(targetInput);
        const trackButton = document.createElement("button");
        trackButton.classList.add("js-tt", "button", "button--primary", "button--go");
        trackButton.style.padding = "2px 5px";
        trackButton.addEventListener("click", () => {
            const trackName = qualitySelect.value;
            const trackNumber = Number(targetInput.value);
            const trackCategory = this.qualityNameAndCategory.get(trackName) || "";
            const trackCurrent = this.currentState?.getQuality(trackCategory, trackName)?.level || 0;
            const trackImage = this.currentState?.getQuality(trackCategory, trackName)?.image || "question";
            const newQuality = { name: trackName, category: trackCategory, currentValue: trackCurrent, targetValue: trackNumber, image: trackImage };
            this.trackedQualities.set(trackName, newQuality);

            this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));
            this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));

            sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
            const editTrackerPanel = document.getElementById("quality-tracker-edit") as HTMLUListElement;
            if (editTrackerPanel) {
                editTrackerPanel.insertBefore(this.createTracker(newQuality, true), null);
                this.hideUpAndDownButtons(editTrackerPanel);
                qualitySelect.value = "";
            }
            const baseTrackerPanel = document.getElementById("quality-tracker") as HTMLUListElement;
            const modalButton = document.getElementById("modal-button") as HTMLButtonElement;
            if (baseTrackerPanel && modalButton) {
                baseTrackerPanel.insertBefore(this.createTracker(newQuality, false), modalButton);
                this.hideUpAndDownButtons(editTrackerPanel);
                qualitySelect.value = "";
            }
        });
        const trackText = document.createElement("span");
        trackText.textContent = "Track";
        trackButton.appendChild(trackText);
        qualityPicker.appendChild(trackButton);

        return qualityPicker;
    }

    private populateDefaultTrackedQualities() {
        for (const favour of FAVOURS) {
            this.trackedQualities.set(favour[0], {
                name: favour[0],
                category: "Contacts",
                currentValue: this.currentState?.getQuality("Contacts", favour[0])?.level || 0,
                targetValue: 7,
                image: favour[1] || "question"
            });
        }
    }

    private hideUpAndDownButtons(qualityTrackerEditPanel: HTMLUListElement | null) {
        if (!qualityTrackerEditPanel || qualityTrackerEditPanel.id !== "quality-tracker-edit") {
            return; //no buttons to hide if you're not in edit mode
        }
        const collectionItems = qualityTrackerEditPanel.getElementsByTagName("li");
        if (collectionItems) {
            const arrayItems = Array.from(collectionItems);
            if (arrayItems && arrayItems.length && arrayItems.length > 0) {
                //hide up on the first, down on the last
                const firstElementUpButton = arrayItems[0].getElementsByClassName("up-button").item(0) as HTMLButtonElement;
                if (firstElementUpButton) {
                    firstElementUpButton.setAttribute("hidden", "");
                    firstElementUpButton.style.opacity = "0.0";
                    firstElementUpButton.disabled = true;
                }

                const lastElementDownButton = arrayItems[arrayItems.length - 1].getElementsByClassName("down-button").item(0) as HTMLButtonElement;
                if (lastElementDownButton) {
                    lastElementDownButton.setAttribute("hidden", "");
                    lastElementDownButton.style.opacity = "0.0";
                    lastElementDownButton.disabled = true;
                }
                if (arrayItems.length > 2) {
                    arrayItems.slice(1, -1).forEach((element) => {
                        //making sure everything else has its up and down visible
                        const up = element.getElementsByClassName("up-button").item(0) as HTMLButtonElement;
                        const down = element.getElementsByClassName("down-button").item(0) as HTMLButtonElement;
                        up.removeAttribute("hidden");
                        up.style.opacity = "1.0";
                        up.disabled = false;
                        down.removeAttribute("hidden");
                        down.style.opacity = "1.0";
                        down.disabled = false;
                    });
                }
            }
        }
    }
}


export interface TrackedQuality {
    name: string;
    category: string;
    currentValue: number;
    targetValue: number;
    image: string;
};