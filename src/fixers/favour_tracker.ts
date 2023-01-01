import {IMutationAwareFixer, IStateAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {GameStateController, Quality} from "../game_state.js";

const FAVOUR_NAMES = [
    "Favours: Bohemians",
    "Favours: Society",
    "Favours: Criminals",
    "Favours: The Church",
    "Favours: The Docks",
    "Favours: Fingerkings",
    "Favours: Hell",
    "Favours: Revolutionaries",
    "Favours: Rubbery Men",
    "Favours: The Great Game",
    "Favours: Tomb-Colonies",
];

export class FavourTrackerFixer implements IMutationAwareFixer, IStateAware {
    private displayFavourTracker = false;
    private favourValues: Map<string, Quality> = new Map();

    private updateOrCreateFavour(title: string, icon: string, value: number) {
        title = title.replace("Favours: ", "");

        const favourTracker = document.querySelector("ul[class*='favour_tracker']");
        if (!favourTracker) {
            console.error("Favour tracker not found!");
            return;
        }

        const qualityDisplay = favourTracker.querySelector(`li[data-favour-type='${title}']`);
        if (qualityDisplay) {
            const valueSpan = qualityDisplay.querySelector("span[class='item__value']");
            if (valueSpan) {
                valueSpan.textContent = ` ${value} / 7`;
            }
            const progressBarSpan = qualityDisplay.querySelector("span[class*='progress-bar__stripe']") as HTMLElement;
            if (progressBarSpan) {
                const percentage = (value / 7) * 100;
                progressBarSpan.style.cssText = `width: ${percentage}%;`;
            }
        } else {
            const newDisplay = this.createFavourDisplay(title, icon + "small", value);
            favourTracker.appendChild(newDisplay);
        }
    }

    private createFavourDisplay(title: string, icon: string, initialValue: number): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('js-item', 'item', 'sidebar-quality');
        li.style.cssText = 'text-align: left';
        li.dataset.favourType = title;

        const div = document.createElement('div');
        div.classList.add('js-icon', 'icon', 'js-tt', 'icon--circular');

        const div3 = document.createElement('div');
        div3.classList.add('item__desc');

        const div4 = document.createElement('div');
        div4.setAttribute('tabindex', '0');
        div4.setAttribute('role', 'button');
        div4.setAttribute('aria-label', title);
        div4.style.cssText = 'outline: 0px; outline-offset: 0px; cursor: default;';

        const span = document.createElement('span');
        span.classList.add('js-item-name', 'item__name');
        span.textContent = title;

        const span3 = document.createElement('span');
        span3.classList.add('item__value');
        span3.textContent = ` ${initialValue} / 7`;

        const div5 = document.createElement('div');
        div5.classList.add('progress-bar');

        const img = document.createElement('img');
        img.classList.add('cursor-default');
        img.setAttribute('alt', `Favours: ${title}`);
        img.setAttribute('src', `//images.fallenlondon.com/icons/${icon}.png`);
        img.setAttribute('aria-label', `Favours: ${title}`);

        const span4 = document.createElement('span');
        span4.classList.add('progress-bar__stripe', 'progress-bar__stripe--has-transition');
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

    applySettings(settings: SettingsObject): void {
        this.displayFavourTracker = settings.display_favour_tracker as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return true;
    }

    onNodeAdded(node: HTMLElement): void {
        const travelColumn = node.querySelector("div[class='travel']");
        if (!travelColumn) return;

        let sidebar = travelColumn.querySelector("div[id='right-sidebar']");
        if (!sidebar) {
            sidebar = document.createElement("div");
            sidebar.id = "right-sidebar";
            sidebar.classList.add("sidebar");
            travelColumn.appendChild(sidebar);
        }

        let favoursPanel = sidebar?.querySelector("ul[class*='favour_tracker']");
        // Trackers are already created and visible, nothing to do here.
        if (!favoursPanel) {
            const favoursHeader = document.createElement('p');
            favoursHeader.classList.add('heading', 'heading--4');
            favoursHeader.textContent = 'Favours'
            sidebar?.appendChild(favoursHeader);

            favoursPanel = document.createElement("ul");
            favoursPanel.classList.add("items", "items--list", "favour_tracker");
            sidebar?.appendChild(favoursPanel);
        }

        for (const favourQuality of this.favourValues.values()) {
            this.updateOrCreateFavour(favourQuality.name, favourQuality.image, favourQuality.level);
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }

    linkState(state: GameStateController): void {
        state.onCharacterDataLoaded((g) => {
            for (const groupName of FAVOUR_NAMES) {
                const quality = g.getQuality("Contacts", groupName);
                if (quality) {
                    this.favourValues.set(groupName, quality);
                }
            }
        });

        state.onQualityChanged((quality, previous, current) => {
           if (FAVOUR_NAMES.includes(quality.name)) {
               this.updateOrCreateFavour(quality.name, quality.image, current);
           }
        });
    }
}
