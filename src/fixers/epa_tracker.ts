import {INetworkAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {GameStateController} from "../game_state";
import {debug} from "../logging";
import {ITEM_PRICES_BY_ID} from "../datasets/item_prices";
import {FLApiInterceptor} from "../api_interceptor";
import {IChooseBranchResponse} from "../interfaces";

const QUALITY_MESSAGE_REGEX = /You've (lost|gained) (\d+) x ([\s\w]+) \(new total ([\d,]+)\)./;

class EPATracker {
    private sessionActions: number = 0;
    private sessionWealth: number = 0;

    constructor() {}

    public increaseWealth(echoes: number) {
        this.sessionWealth += echoes;
    }

    public increaseActions(count: number) {
        if (count < 1) {
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

        debug("EPA tracker has been reset.");
    }
}

export class EpaTrackerFixer implements IStateAware, INetworkAware {
    private showEpaTracker = false;
    private currentActions = 0;
    private epaTracker = new EPATracker();

    applySettings(settings: SettingsObject): void {
        this.showEpaTracker = settings.show_treasure_marker as boolean;
    }

    linkState(state: GameStateController): void {
        state.onActionsChanged((g, actionsLeft) => {
            const actionDiff = this.currentActions - actionsLeft;
            if (actionDiff > 0) {
                debug(`This branch took ${actionDiff}`);
                this.epaTracker.increaseActions(actionDiff);
            }

            this.currentActions = actionsLeft;
        });
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/choosebranch", (_, response: IChooseBranchResponse) => {
            if (!this.showEpaTracker || !response.isSuccess) return;

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

                    const actionDiff = this.currentActions - response.actions;
                    if (actionDiff > 0) {
                        this.epaTracker.increaseActions(actionDiff);
                    } else {
                        this.epaTracker.increaseActions(1);
                    }

                    debug(`You've ${wasIncreased ? "gained" : "lost"} ${amountChanged} Echoes`);
                }
            }

            const epa = this.epaTracker.getEPA();
            debug(`Current EPA: ${this.epaTracker.getWealth()} / ${this.epaTracker.getActionCount()} = ${epa}`);
        });
    }
}
