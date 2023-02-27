import {SettingsObject} from "../settings.js";
import {IMutationAwareFixer, IStateAware} from "./base";
import {FLPlayerLocation, GameStateController} from "../game_state.js";

class CurrencyDisplay {
    private readonly name: string;
    private readonly iconImage: string;
    private readonly title: string;
    private readonly currencySymbol: string;

    private quantity: number = 0;

    constructor(fullName: string, icon: string, symbol: string, title?: string) {
        this.name = fullName;
        this.iconImage = icon;
        this.currencySymbol = symbol;

        this.title = typeof title != "undefined" ? title : fullName;
    }

    setQuantity(quantity: number) {
        this.quantity = quantity;
        this.refresh();
    }

    refresh() {
        let currentDisplay = null;

        const currencyList = document.querySelector("div[class='col-secondary sidebar'] ul[class*='items--list']");
        if (!currencyList) {
            return;
        }

        const currencyDisplays = currencyList.querySelectorAll("li[class='item'] div[class='item__desc'] span[class='item__name']");
        for (const display of currencyDisplays) {
            if (display.textContent === this.name || display.textContent === this.title) {
                currentDisplay = display;
            }
        }

        if (!currentDisplay) {
            currentDisplay = this.createMimic();
            currencyList.appendChild(currentDisplay);
        }

        const valueIndicator = currentDisplay.querySelector("div[class*='item__value']");
        if (valueIndicator) {
            valueIndicator.textContent = this.quantity.toString();
        }
    }

    createMimic() {
        const root = document.createElement('div');

        const li = document.createElement('li');
        li.classList.add('item');

        const container = document.createElement('div');
        container.classList.add('icon', 'icon--circular');
        container.style.cssText = 'width: 45px;';

        const container2 = document.createElement('div');
        container2.classList.add('item__desc');

        const img = document.createElement('img');
        img.setAttribute('src', `//images.fallenlondon.com/icons/${this.iconImage}.png`);

        const textSpan = document.createElement('span');
        textSpan.classList.add('item__name');

        const container3 = document.createElement('div');
        container3.classList.add('item__value', `currency__${this.currencySymbol}`, 'price--inverted');

        const text = document.createTextNode(this.title);

        const text2 = document.createTextNode('0');

        root.appendChild(li);

        li.appendChild(container);
        li.appendChild(container2);

        container.appendChild(img);

        container2.appendChild(textSpan);
        container2.appendChild(container3);

        textSpan.appendChild(text);

        container3.appendChild(text2);

        return root;
    }
}

export class MoreCurrencyDisplaysFixer implements IMutationAwareFixer, IStateAware {
    private displayMoreCurrencies = false;
    private currencyToDisplay = new Map<string, CurrencyDisplay>();

    constructor() {
        this.currencyToDisplay.set("Rat-Shilling", new CurrencyDisplay("Rat-Shilling", "purse", "rat_shilling"));
        this.currencyToDisplay.set("Assortment of Khaganian Coinage", new CurrencyDisplay("Assortment of Khaganian Coinage", "currency2_silver", "khaganian", "Khaganian Coinage"));
    }

    applySettings(settings: SettingsObject): void {
        this.displayMoreCurrencies = settings.display_more_currencies as boolean;
    }

    linkState(stateController: GameStateController): void {
        stateController.onCharacterDataLoaded((state) => {
            for (const [name, display] of this.currencyToDisplay.entries()) {
                const quality = state.getQuality("Currency", name);
                if (quality) {
                    display.setQuantity(quality.level);
                }
            }
        });

        stateController.onQualityChanged((quality, previous, current) => {
            if (quality.category !== "Currency") return;

            const display = this.currencyToDisplay.get(quality.name);
            if (display) {
                display.setQuantity(quality.level);
            }
        });
    }

    checkEligibility(node: HTMLElement): boolean {
        return this.displayMoreCurrencies;
    }

    onNodeAdded(node: HTMLElement): void {
        const currencyList = document.querySelector("div[class='col-secondary sidebar'] ul[class*='items--list']");
        if (!currencyList) return;

        for (const display of this.currencyToDisplay.values()) {
            display.refresh();
        }
    }

    onNodeRemoved(node: HTMLElement): void {
    }

}
