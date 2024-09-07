import { IMutationAware, IStateAware } from "./base";
import { SettingsObject } from "../settings";
import { GameState, GameStateController } from "../game_state";
import { getSingletonByClassName } from "../utils";
import { MSG_TYPE_SAVE_SETTINGS } from "../constants";
import { sendToServiceWorker } from "../comms";

export class MiscTrackerFixer implements IMutationAware, IStateAware {

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
        let temp = settings.trackedQualities as string;
        if (!temp) {
            temp = "{}";
        }
        this.miscQualities = new Map(Object.entries(JSON.parse(temp)));
        this.displayMiscTracker = this.currentSettings.display_quality_tracker as boolean;
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
            for (const [key, value] of this.miscQualities) {
                let dirty = false;
                if (value.category === "") {
                    value.category = this.qualityNameAndCategory.get(key) || "";
                    value.image = this.currentState?.getQuality(value.category, key)?.image || "question"
                    if (value.image !== "question") {
                        const tracker = document.getElementById(`${key}-tracker-icon`)
                        tracker?.setAttribute("src", `//images.fallenlondon.com/icons/${value.image}.png`);
                    }
                    dirty = value.category !== "";
                }
                if (value.category != "") {
                    const quality = g.getQuality(value.category, key);
                    if (quality) {;
                        value.currentValue = quality.level;
                    } else {
                        value.currentValue = 0;
                    }
                    this.updateTracker(key, quality?.level || 0);
                }
                if (dirty && this.currentSettings) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    this.currentSettings!.trackedQualities = JSON.stringify(Object.fromEntries(this.miscQualities))
                    sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
                }
            }
        });

        state.onQualityChanged((state, quality, _previous, current) => {
            if (!this.qualityNames.includes(quality.name)) {
                this.qualityNames.push(quality.name);
                this.qualityNames = this.qualityNames.sort(stringSorter)
                this.qualityNameAndCategory.set(quality.name, quality.category);

                const miscSelect = document.getElementById("track-target-name");
                const option = document.createElement("option");
                option.value = quality.name;
                option.text = quality.name;
                miscSelect?.appendChild(option);
                
            }
            if (this.miscQualities.has(quality.name)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const updatedQuality = this.miscQualities.get(quality.name)!;
                updatedQuality.currentValue = current;
                this.updateTracker(quality.name, current);
                if (updatedQuality.category === "") {
                    updatedQuality.category = this.qualityNameAndCategory.get(quality.name) || "";
                    updatedQuality.image = this.currentState?.getQuality(quality.category, quality.name)?.image || "question"
                    if (updatedQuality.image !== "question") {
                        const tracker = document.getElementById(`${quality.name}-tracker-icon`)
                        tracker?.setAttribute("src", `//images.fallenlondon.com/icons/${updatedQuality.image}.png`);
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.currentSettings!.trackedQualities = JSON.stringify(Object.fromEntries(this.miscQualities))
                sendToServiceWorker(MSG_TYPE_SAVE_SETTINGS, { settings: this.currentSettings });
            }
        });
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
        img.setAttribute("id", `${title}-tracker-icon`)
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

        li.appendChild(div);
        li.appendChild(div3);
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