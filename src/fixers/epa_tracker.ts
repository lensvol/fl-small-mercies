import {IMutationAware, INetworkAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {GameStateController} from "../game_state";
import {ITEM_PRICES_BY_ID} from "../datasets/item_prices";
import {FLApiInterceptor} from "../api_interceptor";
import {IChooseBranchResponse} from "../interfaces";
import {debug} from "../logging";

const QUALITY_MESSAGE_REGEX = /You've (lost|gained) (\d+) x ([\s\w]+) \(new total ([\d,]+)\)./;
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
    HTMLDivElement,
    HTMLSpanElement,
    HTMLSpanElement,
    HTMLAnchorElement,
    HTMLAnchorElement
] {
    const root = document.createElement("div");

    const li = document.createElement("li");
    li.classList.add("item");

    const img = document.createElement("img");
    img.classList.add("media__object");
    img.setAttribute("height", "78");
    img.setAttribute("width", "60");
    img.setAttribute("alt", "");
    img.setAttribute("src", "//images.fallenlondon.com/currencies/echoes.png");
    img.setAttribute("aria-label", "");

    const containingDiv = document.createElement("div");
    containingDiv.classList.add("icon--currency", "sidebar__echoes-button", "sidebar__button--has-focus-outline");

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

    const text3 = document.createTextNode("7,4");

    const text4 = document.createTextNode("123 Echoes / 14 Actions");

    // Weird hyperlink here is used to prevent window frame from "jumping" to the
    // top when the link is clicked upon (https://stackoverflow.com/a/39112476)
    const trackerToggle = document.createElement("a");
    trackerToggle.setAttribute("href", "javascript:void(0)");

    const text5 = document.createTextNode(" • ");

    const trackerReset = document.createElement("a");
    trackerReset.setAttribute("href", "javascript:void(0)");

    const text6 = document.createTextNode("Start");

    const text7 = document.createTextNode("Reset");

    root.appendChild(li);

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

    return [root, epa, info, trackerToggle, trackerReset];
}

export class EpaTrackerFixer implements IStateAware, INetworkAware, IMutationAware {
    private showEpaTracker = false;
    private areWeTracking = false;
    private currentActions = 0;
    private epaTracker = new EPATracker();

    private trackerUiMimic: HTMLDivElement;
    private epaIndicator: HTMLSpanElement;
    private epaInfoLine: HTMLSpanElement;
    private trackerToggle: HTMLAnchorElement;
    private trackerReset: HTMLAnchorElement;

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
            this.updateTrackerUI();
        });

        this.trackerToggle.addEventListener("click", () => {
            this.areWeTracking = !this.areWeTracking;
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

        localStorage.setItem(STORED_STATE_KEY, serializedState);
    }

    private loadSavedState() {
        const saved_epa_info = localStorage.getItem(STORED_STATE_KEY);
        debug(`Saved EPA state: ${saved_epa_info}`);
        if (saved_epa_info) {
            const parts = saved_epa_info.split("|");
            if (parts.length == 3) {
                // We just silently ignore things that seem corrupted
                debug("Loaded state:", parts);
                this.areWeTracking = parts[0] == "true";
                this.epaTracker.increaseWealth(Number(parts[1]));
                this.epaTracker.increaseActions(Number(parts[2]));
            } else {
                debug(`Saved EPA state looks corrupted: ${saved_epa_info}`);
            }
        }
    }

    applySettings(settings: SettingsObject): void {
        this.showEpaTracker = settings.show_epa_tracker as boolean;
    }

    linkState(state: GameStateController): void {
        state.onActionsChanged((g, actionsLeft) => {
            const actionDiff = this.currentActions - actionsLeft;
            if (actionDiff > 0) {
                this.epaTracker.increaseActions(actionDiff);
            }

            this.currentActions = actionsLeft;
        });
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/choosebranch", (_, response: IChooseBranchResponse) => {
            if (!this.showEpaTracker || !this.areWeTracking || !response.isSuccess) return;

            for (const message of response.messages) {
                if (message.type === "StandardQualityChangeMessage" && message.changeType !== "Unaltered") {
                    // Due to the quirk of the game's code change types for increase and decrease are swapped ¯\_(ツ)_/¯
                    const wasIncreased = message.changeType === "Decreased";
                    const extractedTexts = message.message.match(QUALITY_MESSAGE_REGEX);

                    if (!extractedTexts) {
                        // We should never hit this branch?
                        continue;
                    }

                    const amountChanged =
                        (ITEM_PRICES_BY_ID.get(message.possession.id) || 1) *
                        Number(extractedTexts[2]) *
                        (wasIncreased ? 1 : -1);

                    this.epaTracker.increaseWealth(amountChanged);
                    this.updateTrackerUI();
                    this.saveTrackerState();
                }
            }

            this.updateTrackerUI();
        });
    }

    private resetTracker() {
        this.epaTracker.reset();
        this.epaIndicator.textContent = "0,0";
        this.epaInfoLine.textContent = "0E / ??? Action(s)";
    }

    private updateTrackerUI() {
        this.epaIndicator.textContent = String(this.epaTracker.getEPA().toFixed(2));
        this.epaInfoLine.textContent = `${this.epaTracker
            .getWealth()
            .toFixed(2)}E / ${this.epaTracker.getActionCount()} Action(s)`;
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
