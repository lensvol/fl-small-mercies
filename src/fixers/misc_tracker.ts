import { IMutationAware, IStateAware } from "./base";
import { SettingsObject } from "../settings";
import { GameState, GameStateController } from "../game_state";
import { getSingletonByClassName } from "../utils";
import { MSG_TYPE_SAVE_SETTINGS, MSG_TYPE_UPDATE_SETTINGS } from "../constants";
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
    trackedQualities: Map<string, TrackedQuality> = new Map();
    private qualityNameAndCategory: Map<string, string> = new Map();
    private qualityNames: string[] = [];
    private currentState?: GameState;
    currentSettings!: SettingsObject;
    //todo consider reworking all this to use quality ID rather than name
    //the quality Advance! just moved from category progress to sidebartransient, which broke tracking for that quality
    //presumably other qualities could move at any time, if the developers want them to

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
            //if a quality is cleared (not like you have a thing, then sell it, but removed or set to 0) it seems to be missed by onQualityChanged
            //so settings can have 'tracking this, it's 5', and if you look it up in state, no result (because it's gone,  and everything that's 0 is gone)
            //and then when something makes the game realise it's not there, it's still not saved to settings, so it comes back on refresh.
            if (this.currentState) {
                let dirty = false;
                for (const [key, quality] of this.trackedQualities) {
                    const fromState = this.currentState.getQuality(quality.category, key);
                    if (fromState) {
                        if (fromState.level !== quality.currentValue) {
                            quality.currentValue = fromState.level;
                            dirty = true;
                        }
                    } else if(quality.currentValue) {
                        quality.currentValue = 0;
                        dirty = true;
                    }
                }
                if (dirty) {
                    this.regenerateTrackers();
                    sendToServiceWorker(MSG_TYPE_UPDATE_SETTINGS, { settings: { trackedQualities: JSON.stringify(Object.fromEntries(this.trackedQualities))}})
                }
            }
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
            let dirty = false;
            for (const [trackedQualityName, trackedQuality] of this.trackedQualities) {
                if (trackedQuality.category === "") {
                    trackedQuality.category = this.qualityNameAndCategory.get(trackedQualityName) || "";
                    trackedQuality.image = this.currentState?.getQuality(trackedQuality.category, trackedQualityName)?.image || "question";
                    if (trackedQuality.image !== "question") {
                        const trackerIcon = document.getElementById(`${trackedQualityName}-tracker-icon`);
                        trackerIcon?.setAttribute("src", `//images.fallenlondon.com/icons/${trackedQuality.image}small.png`);
                    }
                    dirty = trackedQuality.category !== "";
                }
                if (trackedQuality.category !== "") {
                    const quality = g.getQuality(trackedQuality.category, trackedQualityName);
                    if (quality) {
                        if (trackedQuality.currentValue !== quality.level) {
                            dirty = true;
                        }
                        trackedQuality.currentValue = quality.level;
                        if (trackedQuality.image === "question") {
                            if (quality.image !== "question") {
                                dirty = true;
                            }
                            trackedQuality.image = quality.image;
                        }
                    } else {
                        if (trackedQuality.currentValue !== 0) {
                            dirty = true;
                        }
                        trackedQuality.currentValue = 0;
                    }
                }
            }
            if (dirty && this.currentSettings) {
                this.regenerateTrackers();
                this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));
                sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
            }
        });

        state.onQualityChanged((_state, quality, _previous, current) => {
            if (!this.qualityNames.includes(quality.name)) {
                this.qualityNames.push(quality.name);
                this.qualityNames = this.qualityNames.sort(stringSorter);
                this.qualityNameAndCategory.set(quality.name, quality.category);

                const qualityList = document.getElementById("quality-list");
                let found = false;
                if (qualityList) {
                    for (const existingOption of qualityList.getElementsByClassName("option") as HTMLCollectionOf<HTMLOptionElement>) {
                        if (existingOption.value === quality.name) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        const option = document.createElement("option");
                        option.value = quality.name;
                        option.text = quality.name;
                        const nextElementName = this.qualityNames[this.qualityNames.indexOf(quality.name) + 1];
                        const nextElement = document.getElementById(`option-${nextElementName}`);
                        if (nextElement) {
                            qualityList.insertBefore(option, nextElement);
                        } else {
                            qualityList.appendChild(option);
                        }
                    }
                }
            }
            if (this.trackedQualities.has(quality.name)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const updatedQuality = this.trackedQualities.get(quality.name)!;
                updatedQuality.currentValue = current;
                if (updatedQuality.category === "") {
                    updatedQuality.category = this.qualityNameAndCategory.get(quality.name) || "";
                }
                updatedQuality.image = quality.image || "question";
                this.regenerateTracker(updatedQuality);
                this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));
                sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
            }
        });
    }

    //replace the HTML element on the main page and the edit modal for one tracker
    regenerateTracker(quality: TrackedQuality) {
        const original = document.getElementById(`${quality.name}-tracker`);
        const originalEdit = document.getElementById(`${quality.name}-tracker-edit`);
        original?.parentNode?.replaceChild(this.createTracker(quality, false), original);
        originalEdit?.parentNode?.replaceChild(this.createTracker(quality, true), originalEdit);
    }

    //replace the HTML element on the main page and the edit modal for all trackers
    regenerateTrackers() {
        for (const [_, quality] of this.trackedQualities) {
            this.regenerateTracker(quality);
        }
    }

    //create the html element to track one quality
    createTracker(quality: TrackedQuality, editMode: boolean): HTMLElement {
        const title = quality.name;
        const initialValue = quality.currentValue;
        const targetValues = quality.targetValues;
        let icon = quality.image;
        if (icon === "question" && quality.category) {
            icon = this.currentState?.getQuality(quality.category, title)?.image || "question";
        }

        const qualityListItem = document.createElement("li");
        if (editMode) {
            qualityListItem.id = `${title}-tracker-edit`;
            qualityListItem.classList.add("js-item", "item", "tracked-quality-edit");//"sidebar-quality", 
        } else {
            qualityListItem.id = `${title}-tracker`;
            qualityListItem.classList.add("js-item", "item", "tracked-quality"); //"sidebar-quality", 
        }
        qualityListItem.style.textAlign = "left";
        qualityListItem.dataset.qualityName = title;

        const iconDiv = document.createElement("div");
        iconDiv.classList.add("js-icon", "icon", "js-tt", "icon--circular");

        const img = document.createElement("img");
        img.classList.add("cursor-default");
        const imgIcon = editMode ? `${title}-tracker-icon-edit` : `${title}-tracker-icon`;
        img.setAttribute("id", imgIcon);
        img.setAttribute("alt", `${title}`);
        img.setAttribute("src", `//images.fallenlondon.com/icons/${icon}small.png`);
        img.setAttribute("aria-label", `${title}`);

        const innerIconDiv = document.createElement("div");
        innerIconDiv.setAttribute("tabindex", "0");
        innerIconDiv.setAttribute("role", "button");
        innerIconDiv.setAttribute("aria-label", title);
        innerIconDiv.style.cssText = "outline: 0px; outline-offset: 0px; cursor: default;";
        iconDiv.appendChild(innerIconDiv);
        innerIconDiv.appendChild(img);

        const nameDiv = document.createElement("div");
        nameDiv.classList.add("js-item-name", "item__name");
        nameDiv.textContent = title;

        const targetElementsToAdd: HTMLElement[] = this.generateTargetElements(title,targetValues, initialValue, editMode);
        

        if (!editMode) {
            qualityListItem.appendChild(iconDiv);
            const wrapperDiv = document.createElement("div");
            wrapperDiv.id = `${title}-tracker-inner-div`;
            wrapperDiv.style.width = "100%";
            wrapperDiv.appendChild(nameDiv);
            for (const targetElement of targetElementsToAdd) {
                wrapperDiv.appendChild(targetElement);
            }
            qualityListItem.appendChild(wrapperDiv);
        } else {
            qualityListItem.appendChild(iconDiv);
            qualityListItem.appendChild(nameDiv);
            for (const [idx, targetElement] of targetElementsToAdd.entries()) {
                targetElement.style.gridArea = `${idx + 2} / 2`;
                qualityListItem.appendChild(targetElement);
            }
            const editDiv = document.createElement("div");
            qualityListItem.style.display = "grid";
            qualityListItem.style.gridTemplateColumns = "1fr 8fr 4fr";
            iconDiv.style.gridArea = "1 / 1";
            nameDiv.style.gridArea = "1 / 2";
            nameDiv.style.textAlign = "left";
            editDiv.style.gridArea = "1 / 3";
            editDiv.style.textAlign = "right";
            const newTargetSpan = document.createElement("span");
            const targetInput = document.createElement("input");
            targetInput.id = `${title}-new-target-number`;
            targetInput.type = "number";
            targetInput.style.width = "6ch";
            newTargetSpan.appendChild(targetInput);
            const newTargetButton = document.createElement("button");
            newTargetButton.classList.add("js-tt", "button", "button--primary", "button--margin", "button--go");
            newTargetButton.style.padding = "2px 5px";
            newTargetButton.addEventListener("click", () => {
                const targetInputEnclosed = document.getElementById(`${title}-new-target-number`) as HTMLInputElement;
                const newTargetNumber = Number(targetInputEnclosed?.value);

                const updatedQuality = this.trackedQualities.get(title);
                if (updatedQuality) {
                    updatedQuality.targetValues ? updatedQuality.targetValues.push(newTargetNumber) : updatedQuality.targetValues = [newTargetNumber];
                    this.regenerateTracker(updatedQuality);
                    //(document.getElementById("edit-modal") as HTMLDialogElement).showModal();

                    this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));

                    sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
                }
            });
            const newTargetText = document.createElement("span");
            newTargetText.textContent = "New Target";
            newTargetButton.appendChild(newTargetText);
            newTargetSpan.appendChild(newTargetButton);
            editDiv.appendChild(newTargetSpan);

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
                document.getElementById(`${title}-tracker`)?.remove();
                document.getElementById(`${title}-tracker-edit`)?.remove();
                this.trackedQualities.delete(title);

                this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));
                sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
                this.hideUpAndDownButtons();
            });

            const upAndDownButtonSpan = document.createElement("span");
            const upButton = document.createElement("button");
            upButton.classList.add("js-tt", "button", "button--primary", "button--margin", "button--go", "up-button");
            upButton.addEventListener("click", () => {
                this.moveItem(title, "UP");
            });
            const upButtonText = document.createElement("span");
            upButtonText.textContent = "Up";
            upButton.appendChild(upButtonText);
            upButton.style.padding = "2px 5px";

            const downButton = document.createElement("button");
            downButton.classList.add("js-tt", "button", "button--primary", "button--margin", "button--go", "down-button");
            downButton.addEventListener("click", () => {
                this.moveItem(title, "DOWN");
            });
            const downButtonText = document.createElement("span");
            downButtonText.textContent = "Down";
            downButton.style.padding = "2px 5px";
            downButton.appendChild(downButtonText);
            upAndDownButtonSpan.appendChild(upButton);
            upAndDownButtonSpan.appendChild(downButton);
            editDiv.appendChild(upAndDownButtonSpan);
            editDiv.appendChild(deleteButton);
            qualityListItem.appendChild(editDiv);

            if (targetValues) {
                for (const [idx, target] of targetValues.entries()) {
                    const editTargetDiv = document.createElement("div");
                    editTargetDiv.style.gridArea = `${2 * idx + 2} / 3`;
                    qualityListItem.appendChild(editTargetDiv);
                    const editTargetInput = document.createElement("input");
                    editTargetInput.id = `${title}-edit-target-number-${idx}`;
                    editTargetInput.type = "number";
                    editTargetInput.value = target.toString();
                    editTargetInput.style.width = "6ch";
                    editTargetDiv.appendChild(editTargetInput);

                    const editTargetButton = document.createElement("button");
                    editTargetButton.classList.add("js-tt", "button", "button--primary", "button--margin", "button--go");
                    editTargetButton.style.padding = "2px 5px";
                    editTargetButton.addEventListener("click", () => {
                        const editQuality = this.trackedQualities.get(title);
                        const newTarget = Number((document.getElementById(`${title}-edit-target-number-${idx}`) as HTMLInputElement).value);
                        if (editQuality) {
                            try {
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                editQuality.targetValues![idx] = newTarget;

                                this.regenerateTracker(editQuality);
                                //(document.getElementById("edit-modal") as HTMLDialogElement).showModal();

                                this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));
                                sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
                            } catch (error) {
                                console.error(`Could not find item ${editQuality.name} at index ${idx}`)
                            }

                        }
                    });
                    const editTargetText = document.createElement("span");
                    editTargetText.textContent = "Edit Target";
                    editTargetButton.appendChild(editTargetText);
                    editTargetDiv.appendChild(editTargetButton);

                    const deleteTargetButton = document.createElement("button");
                    deleteTargetButton.classList.add("buttonlet-container");
                    deleteTargetButton.setAttribute("aria-label", "Stop Tracking");
                    deleteTargetButton.setAttribute("type", "button");
                    const deleteTargetSpan1 = document.createElement("span");
                    deleteTargetSpan1.classList.add("buttonlet", "fa-stack", "fa-lg", "buttonlet-enabled", "buttonlet-delete");
                    deleteTargetSpan1.setAttribute("title", "Delete Target");
                    const deleteTargetSpan2 = document.createElement("span");
                    deleteTargetSpan2.classList.add("fa", "fa-circle", "fa-stack-2x");
                    const deleteTargetSpan3 = document.createElement("span");
                    deleteTargetSpan3.classList.add("fa", "fa-inverse", "fa-stack-1x", "fa-times");
                    const deleteTargetSpan4 = document.createElement("span");
                    deleteTargetSpan4.classList.add("u-visually-hidden");
                    deleteTargetSpan4.textContent = "delete target";
                    deleteTargetButton.appendChild(deleteTargetSpan1);
                    deleteTargetSpan1.appendChild(deleteTargetSpan2);
                    deleteTargetSpan1.appendChild(deleteTargetSpan3);
                    deleteTargetSpan1.appendChild(deleteTargetSpan4);
                    deleteTargetButton.addEventListener("click", () => {
                        const editQuality = this.trackedQualities.get(title);
                        if (editQuality) {
                            editQuality.targetValues?.splice(idx, 1);
                            this.regenerateTracker(editQuality);
                            this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));
                            sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
                        }
                    });
                    editTargetDiv.appendChild(deleteTargetButton);
                }
            }
        }
        return qualityListItem;
    }

    //create the HTML elements that track progress towards a target
    generateTargetElements(title: string, targetValues: number[] | undefined, initialValue: number, editMode: boolean): HTMLElement[] {
        const targetElementsToAdd: HTMLElement[] = [];
        if (targetValues && targetValues.length) {
            for (const [idx, target] of targetValues.entries()) {
                const valueAndTargetSpan = document.createElement("span");
                valueAndTargetSpan.id = editMode ? `${title}-tracker-value-and-target-edit-${idx}` : `${title}-tracker-value-and-target-${idx}`;
                valueAndTargetSpan.classList.add("item__value");
                if (target === 0) {
                    valueAndTargetSpan.textContent = ` ${initialValue}`;
                } else {
                    valueAndTargetSpan.textContent = ` ${initialValue} / ${target}`;
                }

                const progressBarDiv = document.createElement("div");
                if (target === 0) {
                    targetElementsToAdd.push(valueAndTargetSpan);
                    targetElementsToAdd.push(progressBarDiv);
                    continue;
                }
                progressBarDiv.classList.add("progress-bar");
                const progressBarSpan = document.createElement("span");
                progressBarSpan.id = editMode ? `${title}-tracker-progress-edit-${idx}` : `${title}-tracker-progress-${idx}`;
                progressBarSpan.classList.add("progress-bar__stripe", "progress-bar__stripe--has-transition");
                let percentage = (initialValue / target) * 100;
                if (percentage > 100) {
                    percentage = 100;
                }
                progressBarSpan.style.cssText = `width: ${percentage}%;`;
                progressBarDiv.appendChild(progressBarSpan);
                targetElementsToAdd.push(valueAndTargetSpan);
                targetElementsToAdd.push(progressBarDiv);
            }
        } else {
            const valueAndTargetSpan = document.createElement("span");
            valueAndTargetSpan.id = editMode ? `${title}-tracker-value-and-target-edit-no-target` : `${title}-tracker-value-and-target-no-target`;
            valueAndTargetSpan.classList.add("item__value");
            valueAndTargetSpan.textContent = initialValue.toString();
            targetElementsToAdd.push(valueAndTargetSpan);
        }
        return targetElementsToAdd;
    }

    moveItem(title: string, upOrDown: UpOrDown) {
        const editItem = document.getElementById(`${title}-tracker-edit`) as HTMLLIElement;
        const mainPageItem = document.getElementById(`${title}-tracker`) as HTMLLIElement;
        const qualityKeys = Array.from(this.trackedQualities.keys());

        const currentIndex = qualityKeys.indexOf(title);
        if (currentIndex === 0 && upOrDown === "UP") {
            return;
        }
        if (currentIndex === qualityKeys.length - 1 && upOrDown === "DOWN") {
            return;
        }
        const editPanel = document.getElementById("quality-tracker-edit") as HTMLUListElement;
        const mainPanel = document.getElementById("quality-tracker") as HTMLUListElement;
        if (editPanel && mainPanel && currentIndex !== -1) {
            if (upOrDown === "UP") {
                qualityKeys.splice(currentIndex - 1, 0, qualityKeys.splice(currentIndex, 1)[0]);
            }
            if (upOrDown === "DOWN") {
                qualityKeys.splice(currentIndex + 1, 0, qualityKeys.splice(currentIndex, 1)[0]);
            }
        }
        this.moveItemInOnePanel(editItem, upOrDown, editPanel);
        this.moveItemInOnePanel(mainPageItem, upOrDown, mainPanel);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.trackedQualities = new Map(qualityKeys.map((key) => [key, this.trackedQualities.get(key)!]));
        this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));
        sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });

        this.hideUpAndDownButtons();
    }

    private moveItemInOnePanel(qualityListItem: HTMLLIElement, upOrDown: UpOrDown, panel: HTMLUListElement) {
        if (!qualityListItem) {
            return;
        }
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

    checkEligibility(node: HTMLElement): boolean {
        if (!this.displayQualityTracker) {
            return false;
        }

        if (node.getElementsByClassName("travel").length === 0) {
            return false;
        }
        if (!this.currentSettings || !this.currentState) {
            console.log("returning false");
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
                sidebar.style.cssText = "margin-top: 30px";
            }
        }

        const qualityTrackerPanel = document.getElementById("quality-tracker");
        // Trackers are already created and visible, nothing to do here.
        if (!qualityTrackerPanel) {
            const wrapperDiv = this.createTrackerPanel(false);

            const editModal = document.getElementById("edit-modal"); 
            if (!editModal) {
                const editModal = this.createEditModal();
                document.body.appendChild(editModal);
                this.hideUpAndDownButtons();
            }
            sidebar.insertBefore(wrapperDiv, sidebar.firstChild);
        }

        if (!travelColumn.contains(sidebar)) {
            travelColumn.appendChild(sidebar);
        }
    }

    private createTrackerPanel(editMode: boolean) {
        const wrapperDiv = document.createElement("div");
        const qualityTrackerHeader = document.createElement("p");
        qualityTrackerHeader.classList.add("heading", "heading--4");
        qualityTrackerHeader.textContent = "Tracked Qualities";
        wrapperDiv.appendChild(qualityTrackerHeader);

        const qualityTrackerPanel = document.createElement("ul");
        const panelId = editMode ? "quality-tracker-edit" : "quality-tracker";
        qualityTrackerPanel.setAttribute("id", panelId);
        qualityTrackerPanel.classList.add("items", "items--list");
        wrapperDiv.appendChild(qualityTrackerPanel);

        for (const quality of this.trackedQualities.values()) {
            const qualityDisplay = this.createTracker(quality, editMode);
            qualityTrackerPanel.appendChild(qualityDisplay);
        }

        if (!editMode) {
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
        return wrapperDiv;
    }

    private createEditModal() {
        const editModal = document.createElement("dialog");
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
            (document.getElementById("edit-modal") as HTMLDialogElement)?.close();
        });
        closeModalButton.classList.add("js-tt", "button", "button--primary", "button--go");
        closeModalButton.style.padding = "2px 5px";
        editModal.appendChild(closeModalButton);
        editModal.addEventListener("click", (event) => {
            if (event.target === (document.getElementById("edit-modal") as HTMLDialogElement)) {
                const qualitySelect = document.getElementById("track-target-name") as HTMLInputElement;
                if (qualitySelect) {
                    qualitySelect.value = "";
                }
                (document.getElementById("edit-modal") as HTMLDialogElement)?.close();
            }
        });
        editModal.style.padding = "0";
        wrapperDiv.style.margin = "0";
        wrapperDiv.style.padding = "1rem";
        return editModal;
    }


    onNodeRemoved(_node: HTMLElement): void {
        ;
    }

    createDropDownSelect() {
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
            option.id = `option-${qualityName}`;
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
            const qualitySelectEnclosed = document.getElementById("track-target-name") as HTMLInputElement;
            const targetInputEnclosed = document.getElementById("track-target-number") as HTMLInputElement;
            const trackName = qualitySelectEnclosed.value;
            const trackNumber = Number(targetInputEnclosed.value);
            const trackCategory = this.qualityNameAndCategory.get(trackName) || "";
            const trackCurrent = this.currentState?.getQuality(trackCategory, trackName)?.level || 0;
            const trackImage = this.currentState?.getQuality(trackCategory, trackName)?.image || "question";
            const newQuality = { name: trackName, category: trackCategory, currentValue: trackCurrent, targetValues: [trackNumber], image: trackImage };
            this.trackedQualities.set(trackName, newQuality);

            this.currentSettings.trackedQualities = JSON.stringify(Object.fromEntries(this.trackedQualities));

            sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
            const editTrackerPanel = document.getElementById("quality-tracker-edit") as HTMLUListElement;
            if (editTrackerPanel) {
                editTrackerPanel.insertBefore(this.createTracker(newQuality, true), null);
                this.hideUpAndDownButtons();
                qualitySelectEnclosed.value = "";
            }
            const baseTrackerPanel = document.getElementById("quality-tracker") as HTMLUListElement;
            const modalButton = document.getElementById("modal-button") as HTMLButtonElement;
            if (baseTrackerPanel && modalButton) {
                baseTrackerPanel.insertBefore(this.createTracker(newQuality, false), modalButton);
                this.hideUpAndDownButtons();
                qualitySelectEnclosed.value = "";
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
                targetValues: [7],
                image: favour[1] || "question"
            });
        }
    }

    hideUpAndDownButtons() {
        const qualityTrackerEditPanel = document.getElementById("quality-tracker-edit");
        if (!qualityTrackerEditPanel) {
            return; //no buttons to hide if you're can't get the edit panel
        }
        const collectionItems = qualityTrackerEditPanel.getElementsByTagName("li");
        if (collectionItems) {
            const arrayItems = Array.from(collectionItems);
            if (arrayItems && arrayItems.length > 0) {
                //hide up on the first, down on the last
                const firstElementUpButton = arrayItems[0].getElementsByClassName("up-button").item(0) as HTMLButtonElement;
                if (firstElementUpButton) {
                    firstElementUpButton.setAttribute("hidden", "");
                    firstElementUpButton.style.opacity = "0.0";
                    firstElementUpButton.disabled = true;
                    if (arrayItems.length > 1) {
                        const firstElementDownButton = arrayItems[0].getElementsByClassName("down-button").item(0) as HTMLButtonElement;
                        firstElementDownButton.removeAttribute("hidden");
                        firstElementDownButton.style.opacity = "1.0";
                        firstElementDownButton.disabled = false;
                    }
                }

                const lastElementDownButton = arrayItems[arrayItems.length - 1].getElementsByClassName("down-button").item(0) as HTMLButtonElement;
                if (lastElementDownButton) {
                    lastElementDownButton.setAttribute("hidden", "");
                    lastElementDownButton.style.opacity = "0.0";
                    lastElementDownButton.disabled = true;
                    if (arrayItems.length > 1) {
                        const lastElementUpButton = arrayItems[arrayItems.length - 1].getElementsByClassName("up-button").item(0) as HTMLButtonElement;
                        lastElementUpButton.removeAttribute("hidden");
                        lastElementUpButton.style.opacity = "1.0";
                        lastElementUpButton.disabled = false;
                    }
                }
                if (arrayItems.length > 2) {
                    arrayItems.slice(1, -1).forEach((element) => {
                        //making sure everything else has its up and down visible
                        const up = element.getElementsByClassName("up-button").item(0) as HTMLButtonElement;
                        const down = element.getElementsByClassName("down-button").item(0) as HTMLButtonElement;
                        if (up) {
                            up.removeAttribute("hidden");
                            up.style.opacity = "1.0";
                            up.disabled = false;
                        }
                        if (down) {
                            down.removeAttribute("hidden");
                            down.style.opacity = "1.0";
                            down.disabled = false;
                        }
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
    targetValues?: number[];
    image: string;
};