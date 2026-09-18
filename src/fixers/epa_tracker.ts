import {IMutationAware, INetworkAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {FLCharacter, GameStateController} from "../game_state";
import {ITEM_PRICES_BY_ID} from "../datasets/item_prices";
import {FLApiInterceptor} from "../api_interceptor";
import {IChooseBranchResponse} from "../interfaces";
import {debug} from "../logging";
import {numberWithCommas} from "../utils";

const QUALITY_CHANGE_MESSAGE_REGEX = /You've (?:lost|gained) ([\d,.]+) x (.+) \(new total ([\d.,]+)( -[ \w\s]+)?\)./;
const QUALITY_ACQUISITION_MESSAGE_REGEX = /You now have ([\d,.]+) x (.+)/;

const STORED_STATE_KEY = "fl_sm_epa_tracker";

class EPATracker {
    private sessionActions: number = 0;
    private sessionWealth: number = 0;

    constructor() {}

    public increaseWealth(echoes: number) {
        this.sessionWealth += echoes;
    }

    public increaseActions(count: number) {
        if (count < 0) {
            throw new Error("Negative action count reported to EPA tracker!");
        }

        this.sessionActions += count;
    }

    public getEPA(): number {
        if (this.sessionActions <= 0) {
            return 0.0;
        }

        return this.sessionWealth / this.sessionActions;
    }

    public getWealth(): number {
        return this.sessionWealth;
    }

    public getActionCount(): number {
        return this.sessionActions;
    }

    public reset() {
        this.sessionWealth = 0;
        this.sessionActions = 0;
    }
}

function createEpaTrackerMimic(): [
    HTMLLIElement,
    HTMLSpanElement,
    HTMLSpanElement,
    HTMLAnchorElement,
    HTMLAnchorElement
] {
    const li = document.createElement("li");
    li.classList.add("item");

    const img = document.createElement("img");
    img.classList.add("media__object");
    img.setAttribute("height", "45");
    img.setAttribute("width", "45");
    img.setAttribute("alt", "");
    img.setAttribute("src", "//images.fallenlondon.com/icons/nibsmall.png");
    img.setAttribute("aria-label", "");

    const containingDiv = document.createElement("div");
    containingDiv.classList.add("icon--circular", "icon", "sidebar__button--has-focus-outline");

    const textSpan = document.createElement("span");
    textSpan.classList.add("u-visually-hidden");

    const container = document.createElement("div");
    container.classList.add("item__desc");

    const text = document.createTextNode("Open the Bazaar tab");

    const textSpan2 = document.createElement("span");
    textSpan2.classList.add("js-item-name", "item__name");

    const container2 = document.createElement("div");
    container2.classList.add("item__value");

    const text2 = document.createTextNode("EPA tracker");

    const container3 = document.createElement("div");
    container3.classList.add("price", "item__price", "price--inverted");

    const epa = document.createElement("span");

    const br = document.createElement("br");

    const info = document.createElement("span");
    info.style.cssText = "font-size: smaller";

    const paragraph = document.createElement("br");

    const text3 = document.createTextNode("0.00");

    const text4 = document.createTextNode("0 Echoes / ??? Actions");

    // Weird hyperlink here is used to prevent window frame from "jumping" to the
    // top when the link is clicked upon (https://stackoverflow.com/a/39112476)
    const trackerToggle = document.createElement("a");
    trackerToggle.setAttribute("href", "javascript:void(0)");

    const text5 = document.createTextNode(" • ");

    const trackerReset = document.createElement("a");
    trackerReset.setAttribute("href", "javascript:void(0)");

    const text6 = document.createTextNode("Start");

    const text7 = document.createTextNode("Reset");

    li.appendChild(containingDiv);
    li.appendChild(textSpan);
    li.appendChild(container);

    containingDiv.appendChild(img);

    textSpan.appendChild(text);

    container.appendChild(textSpan2);
    container.appendChild(container2);

    textSpan2.appendChild(text2);

    container2.appendChild(container3);

    container3.appendChild(epa);
    container3.appendChild(br);
    container3.appendChild(info);
    container3.appendChild(paragraph);
    container3.appendChild(trackerToggle);
    container3.appendChild(text5);
    container3.appendChild(trackerReset);

    epa.appendChild(text3);

    info.appendChild(text4);

    trackerToggle.appendChild(text6);

    trackerReset.appendChild(text7);

    return [li, epa, info, trackerToggle, trackerReset];
}

export class EpaTrackerFixer implements IStateAware, INetworkAware, IMutationAware {
    private showEpaTracker = false;
    private areWeTracking = false;
    private epaTracker = new EPATracker();
    private characterId = 0;

    private trackerUiMimic: HTMLLIElement;
    private epaIndicator: HTMLSpanElement;
    private epaInfoLine: HTMLSpanElement;
    private trackerToggle: HTMLAnchorElement;
    private trackerReset: HTMLAnchorElement;
    private useCommaForThousands: boolean = false;
    private showTotalNetWorth: boolean = false;
    private showPerMessageBreakdown: boolean = false;
    private colorizeAnnotations: boolean = true;

    constructor() {
        const mimicParts = createEpaTrackerMimic();
        this.trackerUiMimic = mimicParts[0];
        this.epaIndicator = mimicParts[1];
        this.epaInfoLine = mimicParts[2];
        this.trackerToggle = mimicParts[3];
        this.trackerReset = mimicParts[4];

        this.trackerReset.addEventListener("click", () => {
            this.resetTracker();
            this.saveTrackerState();
        });

        this.trackerToggle.addEventListener("click", () => {
            this.areWeTracking = !this.areWeTracking;
            this.saveTrackerState();
            this.updateTrackerUI();
        });

        this.loadSavedState();
    }

    // TODO: Ugliest hack possible, but I am not motivated enough right now
    // to implement a proper subsystem-agnostic storage backend
    private saveTrackerState() {
        const serializedState = [
            this.areWeTracking,
            this.epaTracker.getWealth().toFixed(2),
            this.epaTracker.getActionCount(),
        ].join("|");

        if (this.characterId) {
            // To differentiate between EPA stats for different characters we will save them into separate keys
            localStorage.setItem(`${STORED_STATE_KEY}_${this.characterId}`, serializedState);
        } else {
            // This really should not happen, but in this case we will save this information to a shared fallback key
            localStorage.setItem(`${STORED_STATE_KEY}`, serializedState);
        }
    }

    private loadSavedState() {
        const legacySavedEpaInfo = localStorage.getItem(STORED_STATE_KEY);
        const userSpecificStorageKey = `${STORED_STATE_KEY}_${this.characterId}`;

        if (this.characterId && legacySavedEpaInfo) {
            localStorage.setItem(userSpecificStorageKey, legacySavedEpaInfo);
            localStorage.removeItem(STORED_STATE_KEY);
            debug(`Moved undifferentiated EPA stats into ${userSpecificStorageKey}, removing legacy one.`);
        }

        const saved_epa_info = localStorage.getItem(this.characterId ? userSpecificStorageKey : STORED_STATE_KEY);

        debug(`Saved EPA state for user ${this.characterId}: ${saved_epa_info}`);
        if (saved_epa_info) {
            const parts = saved_epa_info.split("|");
            // We just silently ignore things that seem corrupted
            if (parts.length == 3) {
                this.areWeTracking = parts[0] == "true";
                this.epaTracker.increaseWealth(Number(parts[1]));
                this.epaTracker.increaseActions(Number(parts[2]));
                this.updateTrackerUI();
            } else {
                debug(`Saved EPA state looks corrupted: ${saved_epa_info}`);
            }
        }
    }

    applySettings(settings: SettingsObject): void {
        this.showEpaTracker = settings.show_epa_tracker as boolean;
        this.useCommaForThousands = settings.add_thousands_separator as boolean;
        this.showTotalNetWorth = settings.branch_net_worth as boolean;
        this.showPerMessageBreakdown = settings.branch_results_worth as boolean;
        this.colorizeAnnotations = settings.colorize_worth_annotations as boolean;
    }

    linkState(state: GameStateController): void {
        state.onUserDataLoaded((state) => {
            if (state.character instanceof FLCharacter) {
                this.characterId = state.character.characterId;
                debug(`Detected user character ID to be ${this.characterId}`);
                this.loadSavedState();
            }
        });
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/choosebranch", (_, response: IChooseBranchResponse) => {
            if (
                (!this.areWeTracking && !this.showTotalNetWorth && !this.showPerMessageBreakdown) ||
                !response.isSuccess
            )
                return;

            let totalWorthDelta = 0;

            for (const message of response.messages || []) {
                if (message.type === "StandardQualityChangeMessage") {
                    const item = message.possession;

                    if (!ITEM_PRICES_BY_ID.has(item.id)) {
                        // Only things that can be meaningfully measured in Pennies should be considered
                        continue;
                    }

                    const price = ITEM_PRICES_BY_ID.get(item.id) || 0;

                    let parse_regex;
                    if (message.changeType === "Gained") {
                        parse_regex = QUALITY_ACQUISITION_MESSAGE_REGEX;
                    } else {
                        parse_regex = QUALITY_CHANGE_MESSAGE_REGEX;
                    }
                    const matches = message.message.match(parse_regex);

                    if (!matches) {
                        // We should never hit this branch? TODO: Log this branch message for future debugging
                        continue;
                    }

                    const delta = Number(matches[1].replace(/[,.]/g, ""));
                    const wasIncreased = ["Increased", "Gained"].includes(message.changeType);
                    const sign = wasIncreased ? "+" : "-";
                    const worth = delta * price * (wasIncreased ? 1 : -1);

                    if (this.showPerMessageBreakdown) {
                        const cssClasses = ["worth-branch-annotation"];
                        if (this.colorizeAnnotations) {
                            cssClasses.push(wasIncreased ? "worth-annotation-increase" : "worth-annotation-decrease");
                        }
                        const classes = cssClasses.join(" ");
                        message.message += `<em class="${classes}">(${sign}${Math.abs(worth).toFixed(2)} Echoes)</em>`;
                    }

                    totalWorthDelta += worth;
                }
            }

            if (this.areWeTracking) {
                this.epaTracker.increaseActions(response.elapsed);
                this.epaTracker.increaseWealth(totalWorthDelta);
                this.saveTrackerState();
                this.updateTrackerUI();
            }

            if (this.showTotalNetWorth && totalWorthDelta !== 0) {
                const cssClasses = ["worth-branch-annotation"];
                if (this.colorizeAnnotations) {
                    cssClasses.push(totalWorthDelta > 0 ? "worth-annotation-increase" : "worth-annotation-decrease");
                }
                const presentation = cssClasses.join(" ");
                const plus = totalWorthDelta > 0 ? "+" : "";
                const formattedWorth = totalWorthDelta.toFixed(2);

                response.messages.push({
                    priority: 2,
                    image: "banknotes",
                    message: `<em>Net worth change: <span class="${presentation}">${plus}${formattedWorth} Echoes</span></em>`,
                    type: "InfoMessage",
                    tooltip: "For a lack of a penny.",
                });
            }

            for (const message of response.messages) {
                debug(`<b>${message.type}</b>: ${message.message}`);
            }
        });
    }

    private resetTracker() {
        this.epaTracker.reset();
        this.updateTrackerUI();
    }

    private updateTrackerUI() {
        const epa = String(this.epaTracker.getEPA().toFixed(2));
        this.epaIndicator.textContent = this.useCommaForThousands ? epa : numberWithCommas(epa);

        const actions = this.epaTracker.getActionCount();
        let wealth = this.epaTracker.getWealth().toFixed(2);

        if (this.useCommaForThousands) {
            wealth = numberWithCommas(wealth);
        }

        this.epaInfoLine.textContent = `${wealth}E / ${actions > 0 ? actions : "???"} Action(s)`;
        this.trackerToggle.textContent = this.areWeTracking ? "Stop" : "Start";
    }

    checkEligibility(node: HTMLElement): boolean {
        return node.querySelector("div[class='col-secondary sidebar'] ul[class*='items--list']") != null;
    }

    onNodeAdded(node: HTMLElement): void {
        if (!this.showEpaTracker) {
            return;
        }

        const currencyList = node.querySelector("div[class='col-secondary sidebar'] ul[class*='items--list']");
        if (!currencyList) return;

        currencyList.appendChild(this.trackerUiMimic);
        this.updateTrackerUI();
    }

    onNodeRemoved(node: HTMLElement): void {}
}
