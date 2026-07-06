import {IMutationAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {GameStateController} from "../game_state";
import {debug} from "../logging";
import {getSingletonByClassName} from "../utils";

export class OldCardCounterFixer implements IMutationAware, IStateAware {
    private useOldCardCounter: boolean = false;
    private counterIntervalID: ReturnType<typeof setInterval> | undefined;
    private cardsLeft: number = 0;
    private nextCardTs: number = 0;
    private cardCounterMimic: HTMLDivElement;
    private cardCounterSpan: HTMLSpanElement;
    private cardCountdownSpan: HTMLSpanElement;

    constructor() {
        const mimicParts = this.createCardCounterMimic();
        this.cardCounterMimic = mimicParts[0];
        this.cardCounterSpan = mimicParts[1];
        this.cardCountdownSpan = mimicParts[2];
    }

    applySettings(settings: SettingsObject): void {
        this.useOldCardCounter = settings.old_card_counter as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        return (
            getSingletonByClassName(node, "deck-info__cards-in-deck") !== null ||
            getSingletonByClassName(node, "deck-info") !== null
        );
    }

    onNodeAdded(node: HTMLElement): void {
        if (!this.useOldCardCounter) return;

        const newCardCounter = getSingletonByClassName(node, "deck-info__cards-in-deck");
        debug("New card counter: ", newCardCounter);
        if (newCardCounter) {
            newCardCounter.style.display = "none";
        }

        const originalCountdown = getSingletonByClassName(node, "deck-info");
        if (originalCountdown) {
            originalCountdown.style.display = "none";
            originalCountdown.parentNode?.insertBefore(this.cardCounterMimic, originalCountdown);
            this.updateCardCounter();
        }
    }

    onNodeRemoved(node: HTMLElement): void {}

    private createCardCounterMimic(): [HTMLDivElement, HTMLSpanElement, HTMLSpanElement] {
        const root = document.createElement("div");

        const container = document.createElement("div");
        container.classList.add("deck-info");

        const container2 = document.createElement("div");
        container2.classList.add("deck-info__timer");

        const container3 = document.createElement("div");
        container3.classList.add("deck-info__timer");
        container3.style.fontWeight = "normal";

        const flSmCardCount = document.createElement("span");

        const flSmCardCountdown = document.createElement("span");

        const text = document.createTextNode("");

        const text2 = document.createTextNode("");

        root.appendChild(container);

        container.appendChild(container2);
        container.appendChild(container3);

        container2.appendChild(flSmCardCount);

        container3.appendChild(flSmCardCountdown);

        flSmCardCount.appendChild(text);

        flSmCardCountdown.appendChild(text2);

        return [container, flSmCardCount, flSmCardCountdown];
    }

    linkState(controller: GameStateController): void {
        controller.onOpportunityDeckChanged((state) => {
            if (!this.useOldCardCounter) return;

            if (this.counterIntervalID) {
                clearInterval(this.counterIntervalID);
                this.counterIntervalID = undefined;
            }

            if (state.opportunityDeck.cardsLeft < state.opportunityDeck.deckSize) {
                // Still some cards may be added to the deck, we need to initiate a countdown!
                this.nextCardTs = state.opportunityDeck.nextCardAt;
                this.cardsLeft = state.opportunityDeck.deckSize - state.opportunityDeck.cardsLeft;

                this.counterIntervalID = setInterval(() => {
                    const nextInSeconds = Math.trunc((this.nextCardTs - Date.now()) / 1000);

                    this.updateCardCounter();
                    if (nextInSeconds <= 0) {
                        this.cardsLeft -= 1;
                        if (this.cardsLeft == 0) {
                            this.updateCardCounter();
                            clearInterval(this.counterIntervalID);
                        } else {
                            this.cardsLeft -= 1;
                            this.nextCardTs += 60 * 10 * 1000;
                        }
                    }
                }, 1000);
            } else if (state.opportunityDeck.cardsLeft === 2147483647) {
                // Infinite draw area!
                this.cardsLeft = 2147483647;
            } else {
                this.cardsLeft = 0;
            }

            this.updateCardCounter();
        });
    }

    private updateCardCounter() {
        if (this.cardsLeft === 2147483647) {
            this.cardCounterSpan.textContent = "No draw limit.";
            this.cardCountdownSpan.textContent = "";
        } else if (this.cardsLeft > 1) {
            this.cardCounterSpan.textContent = `${this.cardsLeft} cards waiting!`;
        } else if (this.cardsLeft == 1) {
            this.cardCounterSpan.textContent = "1 card waiting!";
        } else {
            this.cardCounterSpan.textContent = "No cards waiting.";
            this.cardCountdownSpan.textContent = "";
        }

        if (this.cardsLeft > 0 && this.cardsLeft !== 2147483647) {
            const nextInSeconds = Math.trunc((this.nextCardTs - Date.now()) / 1000);
            if (nextInSeconds > 0) {
                const minutesLeft = String(Math.trunc(nextInSeconds / 60));
                const secondsLeft = String(nextInSeconds % 60).padStart(2, "0");

                this.cardCountdownSpan.textContent = `Next in ${minutesLeft}:${secondsLeft}`;
            }
        }
    }
}
