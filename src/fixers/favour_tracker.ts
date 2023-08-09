import {IMutationAware, IStateAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {GameStateController} from "../game_state.js";
import {error} from "../logging.js";
import { getSingletonByClassName } from "../utils.js";

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
    ["Favours: Tomb-Colonies", "bandagedman"],
]);

export class FavourTrackerFixer implements IMutationAware, IStateAware {
    private displayFavourTracker = false;
    private showZeroFavours = false;
    private favourValues: Map<string, number> = new Map();

    constructor() {
        for (const favour of FAVOURS.keys()) {
            this.favourValues.set(favour, 0);
        }
    }

    applySettings(settings: SettingsObject): void {
        this.displayFavourTracker = settings.display_favour_tracker as boolean;
        this.showZeroFavours = settings.show_zero_favours as boolean;
    }

    linkState(state: GameStateController): void {
        state.onCharacterDataLoaded((g) => {
            for (const favourName of FAVOURS.keys()) {
                const quality = g.getQuality("Contacts", favourName);
                if (quality) {
                    this.favourValues.set(favourName, quality.level);
                } else {
                    this.favourValues.set(favourName, 0);
                }

                this.updateFavour(favourName, quality?.level || 0);
            }
        });

        state.onQualityChanged((state, quality, previous, current) => {
            if (FAVOURS.has(quality.name)) {
                this.favourValues.set(quality.name, current);
                this.updateFavour(quality.name, current);
            }
        });
    }

    private createFavour(title: string, value: number): HTMLElement {
        const icon = FAVOURS.get(title) || "question";
        title = title.replace("Favours: ", "");

        const newDisplay = this.createFavourDisplay(title, icon + "small", value);
        if (value == 0 && !this.showZeroFavours) {
            newDisplay.style.cssText = "display: none";
        }

        return newDisplay;
    }

    private updateFavour(title: string, value: number) {
        const icon = FAVOURS.get(title) || "question";
        title = title.replace("Favours: ", "");

        const favourTracker = document.getElementById("favour-tracker");
        if (!favourTracker) {
            return;
        }

        let qualityDisplay = null;
        const existingDisplays = favourTracker.getElementsByClassName("tracked-favour");
        for (const display of existingDisplays) {
            const displayTitle = (display as HTMLElement).dataset.favourType;
            if (displayTitle == title) {
                qualityDisplay = display as HTMLElement;
                break;
            }
        }

        if (!qualityDisplay) {
            return;
        }

        const valueSpan = getSingletonByClassName(qualityDisplay, "item__value");
        if (valueSpan) {
            valueSpan.textContent = ` ${value} / 7`;
        }

        const progressBarSpan = getSingletonByClassName(qualityDisplay, "progress-bar__stripe") as HTMLElement;
        if (progressBarSpan) {
            const percentage = (value / 7) * 100;
            progressBarSpan.style.cssText = `width: ${percentage}%;`;
        }

        if (value == 0 && !this.showZeroFavours) {
            // TODO: Use classes.
            qualityDisplay.style.cssText = "display: none";
        } else {
            qualityDisplay.style.cssText = "text-align: left";
        }
    }


    private createFavourDisplay(title: string, icon: string, initialValue: number): HTMLElement {
        const li = document.createElement("li");
        li.classList.add("js-item", "item", "sidebar-quality", "tracked-favour");
        li.style.cssText = "text-align: left";
        li.dataset.favourType = title;

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
        span3.textContent = ` ${initialValue} / 7`;

        const div5 = document.createElement("div");
        div5.classList.add("progress-bar");

        const img = document.createElement("img");
        img.classList.add("cursor-default");
        img.setAttribute("alt", `Favours: ${title}`);
        img.setAttribute("src", `//images.fallenlondon.com/icons/${icon}.png`);
        img.setAttribute("aria-label", `Favours: ${title}`);

        const span4 = document.createElement("span");
        span4.classList.add("progress-bar__stripe", "progress-bar__stripe--has-transition");
        const percentage = (initialValue / 7) * 100;
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

    checkEligibility(node: HTMLElement): boolean {
        if (!this.displayFavourTracker) {
            return false;
        }

        if (node.getElementsByClassName("travel").length == 0) {
            return false;
        }

        return document.getElementById("favour-tracker") == null;
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

        let favoursPanel = document.getElementById("favour-tracker");
        // Trackers are already created and visible, nothing to do here.
        if (!favoursPanel) {
            const fragment = document.createDocumentFragment();

            const favoursHeader = document.createElement("p");
            favoursHeader.classList.add("heading", "heading--4");
            favoursHeader.textContent = "Favours";
            fragment.appendChild(favoursHeader);

            favoursPanel = document.createElement("ul");
            favoursPanel.setAttribute("id", "favour-tracker");
            favoursPanel.classList.add("items", "items--list");
            fragment.appendChild(favoursPanel);

            for (const [favourName, level] of this.favourValues.entries()) {
                const favourDisplay = this.createFavour(favourName, level);
                favoursPanel.appendChild(favourDisplay);
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
