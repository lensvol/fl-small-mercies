import {SettingsObject} from "../settings.js";
import {IMutationAwareFixer, IStateAware} from "./base";
import {GameState, GameStateController} from "../game_state.js";
import {IsInSetting, OrPredicate, StateMatcher} from "../matchers.js";

class CurrencyDisplay {
    private readonly name: string;
    private readonly iconImage: string;
    private readonly title: string;
    private readonly currencySymbol: string;

    private quantity: number = 0;
    private hidden: boolean = false;

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

    hide() {
        this.hidden = true;
        this.refresh();
    }

    show() {
        this.hidden = false;
        this.refresh();
    }

    refresh() {
        let currentDisplay = null;

        const currencyList = document.querySelector("div[class='col-secondary sidebar'] ul[class*='items--list']");
        if (!currencyList) {
            return;
        }

        const currencyNames = currencyList.querySelectorAll("li[class='item'] div[class='item__desc'] span[class='item__name']");
        // TODO: Re-implement with .find()
        for (const display of currencyNames) {
            if (display.textContent === this.name || display.textContent === this.title) {
                currentDisplay = display.parentElement?.parentElement;
                break;
            }
        }

        if (!currentDisplay) {
            currentDisplay = this.createMimic();
            currencyList.appendChild(currentDisplay);
        }

        if (currentDisplay) {
            currentDisplay.style.cssText = this.hidden ? "display: none" : "";
        }

        const valueIndicator = currentDisplay?.querySelector("div[class*='item__value']");
        if (valueIndicator) {
            valueIndicator.textContent = this.quantity.toString();
        }
    }

    createMimic() {
        const li = document.createElement("li");
        li.classList.add("item");

        const container = document.createElement("div");
        container.classList.add("icon", "icon--circular");
        container.style.cssText = "width: 45px;";

        const container2 = document.createElement("div");
        container2.classList.add("item__desc");

        const img = document.createElement("img");
        img.setAttribute("src", `//images.fallenlondon.com/icons/${this.iconImage}.png`);

        const textSpan = document.createElement("span");
        textSpan.classList.add("item__name");

        const container3 = document.createElement("div");
        container3.classList.add("item__value", `currency__${this.currencySymbol}`, "price--inverted");

        const text = document.createTextNode(this.title);

        const text2 = document.createTextNode("0");

        li.appendChild(container);
        li.appendChild(container2);

        container.appendChild(img);

        container2.appendChild(textSpan);
        container2.appendChild(container3);

        textSpan.appendChild(text);

        container3.appendChild(text2);

        return li;
    }
}

export class MoreCurrencyDisplaysFixer implements IMutationAwareFixer, IStateAware {
    private displayMoreCurrencies = false;
    private displayCurrenciesEverywhere = false;

    private currencyToDisplay = new Map<string, CurrencyDisplay>();
    private currencyToPredicate = new Map<string, StateMatcher>();
    private isInBazaar: boolean = false;
    private isInFifthCity: boolean = false;

    constructor() {
        this.currencyToDisplay.set("Rat-Shilling", new CurrencyDisplay("Rat-Shilling", "purse", "rat_shilling"));
        this.currencyToDisplay.set("Assortment of Khaganian Coinage", new CurrencyDisplay("Assortment of Khaganian Coinage", "currency2_silver", "khaganian", "Khaganian Coinage"));
        this.currencyToDisplay.set("Justificande Coin", new CurrencyDisplay("Justificande Coin", "currency1_silversmall", "khaganian", "Justificande Coin"));
        this.currencyToDisplay.set("Memory of a Tale", new CurrencyDisplay("Memory of a Tale", "book", "khaganian", "Memory of a Tale"));

        this.currencyToPredicate.set(
            "Assortment of Khaganian Coinage",
            new OrPredicate(
                new OrPredicate(
                    new IsInSetting(107955), // Khanate (Inner)
                    new IsInSetting(107959) // Khanate (Copper Quarter)
                ),
                new IsInSetting(107975) // Irem
            )
        );

        this.currencyToPredicate.set(
            "Rat-Shilling",
            new IsInSetting(107960) // Rat-Market
        );

        this.currencyToPredicate.set(
            "Justificande Coin",
            new IsInSetting(107975) // Irem
        );
    }

    applySettings(settings: SettingsObject): void {
        this.displayMoreCurrencies = settings.display_more_currencies as boolean;
        this.displayCurrenciesEverywhere = settings.display_currencies_everywhere as boolean;

        this.currencyToDisplay.forEach((display, _) => {
            if (this.displayCurrenciesEverywhere) {
                display.show();
            } else {
                display.hide();
            }
        });
    }

    linkState(controller: GameStateController): void {
        controller.onCharacterDataLoaded((state) => {
            for (const [name, display] of this.currencyToDisplay.entries()) {
                const quality = state.getQuality("Currency", name);
                if (quality) {
                    display.setQuantity(quality.level);
                }
            }
        });

        controller.onQualityChanged((state: GameState, quality, previous, current) => {
            if (quality.category !== "Currency") return;

            const display = this.currencyToDisplay.get(quality.name);
            if (display) {
                display.setQuantity(quality.level);
            }
        });

        controller.onLocationChanged((state, location) => {
            this.isInFifthCity = location.setting.settingId == 2;

            this.checkVisibilityPredicates(state);
            this.checkSpecialVisibility();
        });

        controller.onStoryletPhaseChanged((state) => {
            this.checkVisibilityPredicates(state);
        });
    }

    private checkVisibilityPredicates(state: GameState) {
        if (this.displayCurrenciesEverywhere) {
            return;
        }

        for (const [name, predicate] of this.currencyToPredicate.entries()) {
            const display = this.currencyToDisplay.get(name)!!;
            if (!predicate.match(state)) {
                display.hide();
            } else {
                display.show();
            }
        }
    }

    checkEligibility(node: HTMLElement): boolean {
        return this.displayMoreCurrencies;
    }

    onNodeAdded(node: HTMLElement): void {
        const bazaarTabButton = node.querySelector("li[data-name='bazaar']");
        if (bazaarTabButton) {
            const areWeBazaar = bazaarTabButton.classList.contains("active");
            if (areWeBazaar != this.isInBazaar) {
                this.isInBazaar = areWeBazaar;
                this.checkSpecialVisibility();
            } else {
                this.isInBazaar = areWeBazaar;
            }
        }

        const currencyList = node.querySelector("div[class='col-secondary sidebar'] ul[class*='items--list']");
        if (!currencyList) return;

        for (const display of this.currencyToDisplay.values()) {
            display.refresh();
        }
    }

    onNodeRemoved(node: HTMLElement): void {}

    private checkSpecialVisibility() {
        const memoryTaleDisplay = this.currencyToDisplay.get("Memory of a Tale")!!;
        if (this.displayCurrenciesEverywhere) {
            return;
        }

        if (this.isInFifthCity && this.isInBazaar) {
            memoryTaleDisplay.show();
        } else {
            memoryTaleDisplay.hide();
        }
    }
}
