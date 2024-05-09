import {SettingsObject} from "../settings";
import {IMutationAware, IStateAware} from "./base";
import {GameState, GameStateController} from "../game_state";
import {IsInArea, IsInSetting, OrPredicate, StateMatcher} from "../matchers";
import {getSingletonByClassName} from "../utils";

function numberWithCommas(x: string): string {
    const result = x.replace(/\B(?=(\d{3})+(?!\d))/g, ",").trim();
    return result.endsWith(".00") ? result.slice(0, result.length - 3) : result;
}

class CurrencyDisplay {
    private readonly name: string;
    private readonly iconImage: string;
    private readonly title: string;
    private readonly currencySymbol: string;

    private quantity = 0;
    private hidden = false;
    private separateThousands = false;

    constructor(fullName: string, icon: string, symbol: string, title?: string) {
        this.name = fullName;
        this.iconImage = icon;
        this.currencySymbol = symbol;

        this.title = typeof title != "undefined" ? title : fullName;
    }

    setThousandsFlag(flag: boolean) {
        this.separateThousands = flag;
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

        const currencyNames = currencyList.querySelectorAll(
            "li[class='item'] div[class='item__desc'] span[class='item__name']"
        );
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
            let quantityAsText = this.quantity.toString();
            if (this.separateThousands) {
                quantityAsText = numberWithCommas(quantityAsText);
            }

            valueIndicator.textContent = quantityAsText;
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

export class MoreCurrencyDisplaysFixer implements IMutationAware, IStateAware {
    // TODO: This whole fixer needs to cleaned up and reworked, it's a mess.
    private displayMoreCurrencies = false;
    private displayCurrenciesEverywhere = false;

    private currencyToDisplay = new Map<string, CurrencyDisplay>();
    private currencyToPredicate = new Map<string, StateMatcher>();
    private isInLostAndFound = false;
    private separateThousands = false;

    private shopButtonObserver: MutationObserver = new MutationObserver((mutations, _observer) => {
        mutations.forEach((mutation) => {
            const button = mutation.target as HTMLButtonElement;
            this.isInLostAndFound = button.classList.contains("menu-item--active");
            this.checkSpecialVisibility();
        });
    });
    private currentState?: GameState;

    constructor() {
        this.currencyToDisplay.set("Rat-Shilling", new CurrencyDisplay("Rat-Shilling", "purse", "rat_shilling"));
        this.currencyToDisplay.set(
            "Assortment of Khaganian Coinage",
            new CurrencyDisplay("Assortment of Khaganian Coinage", "currency2_silver", "khaganian", "Khaganian Coinage")
        );
        this.currencyToDisplay.set(
            "Justificande Coin",
            new CurrencyDisplay("Justificande Coin", "currency1_silversmall", "justificande", "Justificande Coin")
        );
        this.currencyToDisplay.set(
            "Memory of a Tale",
            new CurrencyDisplay("Memory of a Tale", "book", "memorytale", "Memory of a Tale")
        );
        this.currencyToDisplay.set(
            "Hinterland Prosperity",
            new CurrencyDisplay("Hinterland Prosperity", "ambercoins", "prosperity", "Hinterland Prosperity")
        );
        this.currencyToDisplay.set("Attar", new CurrencyDisplay("Attar", "redhoneyjar", "attar", "Attar"));
        this.currencyToDisplay.set("Stuiver", new CurrencyDisplay("Stuiver", "currency1_copper", "stuiver", "Stuiver"));
        this.currencyToDisplay.set(
            "Ascended Ambergris",
            new CurrencyDisplay("Ascended Ambergris", "midnightwhale", "ambergris", "Ambergris")
        );

        this.currencyToPredicate.set(
            "Assortment of Khaganian Coinage",
            new OrPredicate(
                new IsInSetting(107955), // Khanate (Inner)
                new IsInSetting(107959), // Khanate (Copper Quarter)
                new IsInSetting(107975), // Irem
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
        this.currencyToPredicate.set(
            "Hinterland Prosperity",
            new IsInSetting(107982) // The Far Hinterland
        );
        this.currencyToPredicate.set(
            "Attar",
            new IsInArea(110903) // Arbor, of the Roses
        );
        this.currencyToPredicate.set(
            "Stuiver",
            new IsInSetting(107987) // Hallow's Throat
        );
        this.currencyToPredicate.set(
            "Ascended Ambergris",
            new IsInSetting(107987) // Hallow's Throat
        );
    }

    applySettings(settings: SettingsObject): void {
        this.displayMoreCurrencies = settings.display_more_currencies as boolean;
        this.displayCurrenciesEverywhere = settings.display_currencies_everywhere as boolean;
        this.separateThousands = settings.add_thousands_separator as boolean;

        this.currencyToDisplay.forEach((display, _) => {
            display.setThousandsFlag(this.separateThousands);
        });

        if (this.displayMoreCurrencies) {
            if (this.displayCurrenciesEverywhere) {
                this.currencyToDisplay.forEach((display, _) => display.show());
            } else if (this.currentState) {
                this.checkVisibilityPredicates(this.currentState);
                this.checkSpecialVisibility();
            }
        } else {
            this.currencyToDisplay.forEach((display, _) => display.hide());
        }
    }

    linkState(controller: GameStateController): void {
        controller.onCharacterDataLoaded((state) => {
            for (const [name, display] of this.currencyToDisplay.entries()) {
                let quality = state.getQuality("Currency", name);
                // Some progress-related qualities are not currencies, but are denominated in the
                // same way (e.g. "Hinterlands Prosperity").
                if (!quality) {
                    quality = state.getQuality("Progress", name);
                }

                // Attar, apparently, goes under "Goods" (╯°□°)╯︵ ┻━┻
                if (!quality) {
                    quality = state.getQuality("Goods", name);
                }

                if (quality) {
                    display.setQuantity(quality.level);

                    if (this.displayMoreCurrencies) {
                        display.refresh();
                    }
                }
            }

            this.currentState = state;
        });

        controller.onQualityChanged((_state: GameState, quality, _previous, current) => {
            const display = this.currencyToDisplay.get(quality.name);
            if (display) {
                display.setQuantity(current);
            }
        });

        controller.onLocationChanged((state, _location) => {
            if (this.displayMoreCurrencies) {
                this.checkVisibilityPredicates(state);
            }
        });

        controller.onStoryletPhaseChanged((state) => {
            if (this.displayMoreCurrencies) {
                this.checkVisibilityPredicates(state);
            }
        });
    }

    private checkVisibilityPredicates(state: GameState) {
        if (this.displayCurrenciesEverywhere) {
            return;
        }

        for (const [name, predicate] of this.currencyToPredicate.entries()) {
            const display = this.currencyToDisplay.get(name);
            if (!display) {
                continue;
            }

            if (!predicate.match(state)) {
                display.hide();
            } else {
                display.show();
            }
        }

        this.checkSpecialVisibility();
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.displayMoreCurrencies) {
            return false;
        }

        const isInBazaar = getSingletonByClassName(node, "nav__list") !== null;
        const isSidebarVisible = getSingletonByClassName(node, "sidebar") !== null;

        return isInBazaar || isSidebarVisible;
    }

    onNodeAdded(node: HTMLElement): void {
        const shopButtons = node.getElementsByClassName("nav__button");
        for (const candidate of shopButtons) {
            if (candidate.nodeName.toLowerCase() !== "button") {
                continue;
            }

            if (candidate.textContent === "Mr Chimes' Lost & Found") {
                this.shopButtonObserver.disconnect();
                this.shopButtonObserver.observe(candidate, {attributes: true, attributeFilter: ["class"]});

                this.isInLostAndFound = candidate.classList.contains("menu-item--active");
                this.checkSpecialVisibility();
            }
        }

        const leftSidebar = getSingletonByClassName(node, "col-secondary");
        const currencyList = leftSidebar?.getElementsByClassName("items--list");
        if (!currencyList) return;

        for (const display of this.currencyToDisplay.values()) {
            display.refresh();
        }
    }

    onNodeRemoved(node: HTMLElement): void {
        const shopButtons = node.querySelectorAll("li[class='nav__item'] > button[class*='nav__button']");
        if (shopButtons) {
            shopButtons.forEach((button) => {
                if (button.textContent === "Mr Chimes' Lost & Found") {
                    this.shopButtonObserver.disconnect();
                }
            });

            this.isInLostAndFound = false;
            this.checkSpecialVisibility();
        }
    }

    private checkSpecialVisibility() {
        if (this.displayCurrenciesEverywhere) {
            return;
        }

        const memoryTaleDisplay = this.currencyToDisplay.get("Memory of a Tale");
        if (!memoryTaleDisplay) {
            return;
        }

        if (this.isInLostAndFound) {
            memoryTaleDisplay.show();
        } else {
            memoryTaleDisplay.hide();
        }
    }
}
