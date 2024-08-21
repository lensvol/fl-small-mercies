import { IMutationAware, IStateAware } from "./base";
import { SettingsObject } from "../settings";
import { GameState, GameStateController } from "../game_state";
import { getSingletonByClassName } from "../utils";
import { MSG_TYPE_SAVE_SETTINGS } from "../constants";
import { sendToServiceWorker } from "../comms";

export class MiscTracker implements IMutationAware, IStateAware {

    private displayMiscTracker = true;
    private miscQualities: Map<string, TrackedQuality> = new Map();
    private qualityNameAndCategory: Map<string, string> = new Map();
    private qualityNames: string[] = [];
    private currentState?: GameState;
    private settingsString: string | undefined;
    private currentSettings: SettingsObject | undefined;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

    }

    applySettings(settings: SettingsObject): void {
        this.currentSettings = settings;
        console.log("received settings")
        console.log(settings)
        let temp = settings.trackedQualities as string;
        if (!temp) {
            temp = "{}";
        }
        this.miscQualities = new Map(Object.entries(JSON.parse(temp)));
    }

    

    linkState(state: GameStateController): void {
        state.onCharacterDataLoaded((g) => {
            this.currentState = g;
            const unsortedQualityNames: string[] = []
            for (const quality of g.enumerateQualities()) {
                this.qualityNameAndCategory.set(quality.name, quality.category);
                unsortedQualityNames.push(quality.name);
            }
            this.qualityNames = unsortedQualityNames.sort(this.stringSorter())
            for (const [key, value] of this.miscQualities) {
                const quality = g.getQuality(value.category, key);
                if (quality) {
                    value.currentValue = quality.level;
                } else {
                    value.currentValue = 0;
                }

                this.updateTracker(key, quality?.level || 0);
            }
        });

        state.onQualityChanged((state, quality, _previous, current) => {
            if (!this.qualityNames.includes(quality.name)) {
                this.qualityNames.push(quality.name);
                this.qualityNames = this.qualityNames.sort(this.stringSorter())
                this.qualityNameAndCategory.set(quality.name, quality.category);

                const miscSelect = document.getElementById("track-target-name");
                const option = document.createElement("option");
                option.value = quality.name;
                option.text = quality.name;
                miscSelect?.appendChild(option);
                
            }
            if (this.miscQualities.has(quality.name)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.miscQualities.get(quality.name)!.currentValue = current;
                this.updateTracker(quality.name, current);
            }
        });
    }

    private stringSorter(): ((a: string, b: string) => number) | undefined {
        return (s1, s2) => {
            if (s1 > s2) {
                return 1;
            }
            if (s1 < s2) {
                return -1;
            }
            return 0;
        };
    }

    //create the html element to track one quality
    private createTracker(title: string): HTMLElement {
        const trackedQuality = this.miscQualities.get(title);
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

        const div5 = document.createElement("div");
        div5.classList.add("progress-bar");

        const img = document.createElement("img");
        img.classList.add("cursor-default");
        img.setAttribute("alt", `${title}`);
        img.setAttribute("src", `//images.fallenlondon.com/icons/${icon}.png`);
        img.setAttribute("aria-label", `${title}`);

        const span4 = document.createElement("span");
        span4.classList.add("progress-bar__stripe", "progress-bar__stripe--has-transition");
        let percentage = (initialValue / targetValue) * 100;
        if (percentage > 100) {
            percentage = 100;
        }
        span4.style.cssText = `width: ${percentage}%;`;

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
            console.log("before delete")
            console.log(this.miscQualities)
            console.log(this.currentSettings)
            document.getElementById(li.id)?.remove();
            this.miscQualities.delete(title);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.currentSettings!.trackedQualities = JSON.stringify(Object.fromEntries(this.miscQualities))

            sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });

            console.log(this.miscQualities)
            console.log(this.currentSettings)
        })

        li.appendChild(div);
        li.appendChild(div3);
        li.appendChild(deleteButton);
        div.appendChild(div4);
        div3.appendChild(span);
        div3.appendChild(span3);
        div3.appendChild(div5);
        div4.appendChild(img);
        div5.appendChild(span4);
        
        return li;
    }

    //find the element, update the number
    private updateTracker(title: string, value: number) {
        const miscTracker = document.getElementById("misc-tracker");
        if (!miscTracker) {
            return;
        }

        let qualityDisplay = null;
        const existingDisplays = miscTracker.getElementsByClassName("tracked-misc");
        for (const display of existingDisplays) {
            const displayTitle = (display as HTMLElement).dataset.qualityName;
            if (displayTitle == title) {
                qualityDisplay = display as HTMLElement;
                break;
            }
        }

        if (!qualityDisplay) {
            return;
        }

        const valueSpan = getSingletonByClassName(qualityDisplay, "item__value");
        const target = this.miscQualities.get(title)?.targetValue || 1;
        if (valueSpan) {
            valueSpan.textContent = ` ${value} / ${target}`;
        }

        const progressBarSpan = getSingletonByClassName(qualityDisplay, "progress-bar__stripe") as HTMLElement;
        if (progressBarSpan) {
            let percentage = (value / target) * 100;
            if (percentage > 100) {
                percentage = 100;
            }
            progressBarSpan.style.cssText = `width: ${percentage}%;`;
        }
        qualityDisplay.style.cssText = "text-align: left";

    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.displayMiscTracker) {
            return false;
        }

        if (node.getElementsByClassName("travel").length == 0) {
            return false;
        }
        return document.getElementById("misc-tracker") == null;
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

        let miscPanel = document.getElementById("misc-tracker");
        // Trackers are already created and visible, nothing to do here.
        if (!miscPanel) {
            const fragment = document.createDocumentFragment();

            const miscHeader = document.createElement("p");
            miscHeader.classList.add("heading", "heading--4");
            miscHeader.textContent = "Tracked Values";
            fragment.appendChild(miscHeader);

            miscPanel = document.createElement("ul");
            miscPanel.setAttribute("id", "misc-tracker");
            miscPanel.classList.add("items", "items--list");
            fragment.appendChild(miscPanel);

            for (const valueName of this.miscQualities.keys()) {
                const miscDisplay = this.createTracker(valueName);
                miscPanel.appendChild(miscDisplay);
            }

            const miscPicker = document.createElement("div");
            const miscSelect = document.createElement("select");
            miscSelect.id = "track-target-name";
            miscPicker.appendChild(miscSelect);
            for (const qualityName of this.qualityNames) {
                const option = document.createElement("option");
                option.value = qualityName;
                option.text = qualityName;
                miscSelect.appendChild(option);
            }
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
                console.log("before add")
                console.log(this.miscQualities)
                console.log(this.currentSettings)
                this.miscQualities.set(trackName, newQuality);
                if (this.currentSettings) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    this.currentSettings!.trackedQualities = JSON.stringify(Object.fromEntries(this.miscQualities)) ;
                }

                sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
                console.log(this.miscQualities)
                console.log(this.currentSettings)
               
                const miscDisplay = this.createTracker(trackName);
                miscPanel?.appendChild(miscDisplay);
                miscPanel?.appendChild(miscPicker);
            })
            const trackText = document.createElement("span");
            trackText.textContent = "Track";
            trackButton.appendChild(trackText);
            miscPicker.appendChild(trackButton);

            miscPanel.appendChild(miscPicker);

            sidebar.appendChild(fragment);
        }

        if (!travelColumn.contains(sidebar)) {
            travelColumn.appendChild(sidebar);
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }

}



export interface TrackedQuality {
    name: string;
    category: string;
    currentValue: number;
    targetValue: number;
    image: string;
};