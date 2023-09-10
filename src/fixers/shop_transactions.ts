import {IMutationAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {GameStateController} from "../game_state";
import {getSingletonByClassName} from "../utils";

const PENNY_QUALITY_ID = 22390;
const SCRIP_QUALITY_ID = 125025;

function numberWithCommas(x: string): string {
    const result = x.replace(/\B(?=(\d{3})+(?!\d))/g, ",").trim();
    return result.endsWith(".00") ? result.slice(0, result.length - 3) : result;
}

const ECHO_DISPLAY_SELECTOR =
    "li[class='item'] > div[class='item__desc'] > div[class='item__value'] > div[class*='price']";
const SCRIP_DISPLAY_SELECTOR = "li[class='item'] > div[class='item__desc'] > div[class*='scrip']";

export class ShopTransactionFixer implements IStateAware, IMutationAware {
    private trackShopTransactions = true;
    private shouldSeparateThousands = false;
    private echoesDisplay: Element | null = null;
    private scripDisplay: Element | null = null;

    applySettings(settings: SettingsObject): void {
        this.trackShopTransactions = settings.track_shop_transactions as boolean;
        this.shouldSeparateThousands = settings.add_thousands_separator as boolean;
    }

    linkState(state: GameStateController): void {
        state.onQualityChanged((state, quality, _previous, current) => {
            if (!this.trackShopTransactions) {
                return;
            }

            let quantity = 0;
            let actualDisplay = null;

            if (quality.qualityId === PENNY_QUALITY_ID && this.echoesDisplay) {
                actualDisplay = this.echoesDisplay;
                quantity = current / 100;
            }

            if (quality.level === SCRIP_QUALITY_ID && this.scripDisplay) {
                actualDisplay = this.scripDisplay;
                quantity = current;
            }

            if (!actualDisplay) {
                return;
            }

            if (this.shouldSeparateThousands) {
                actualDisplay.textContent = numberWithCommas(quantity.toString());
            } else {
                actualDisplay.textContent = quantity.toString();
            }
        });
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.trackShopTransactions) {
            return false;
        }

        return getSingletonByClassName(node, "sidebar") != null;
    }

    onNodeAdded(node: HTMLElement): void {
        const echoesCandidate = node.querySelector(ECHO_DISPLAY_SELECTOR);
        if (echoesCandidate) {
            this.echoesDisplay = echoesCandidate;
        }

        const scripCandidate = node.querySelector(SCRIP_DISPLAY_SELECTOR);
        if (scripCandidate) {
            this.scripDisplay = scripCandidate;
        }
    }

    onNodeRemoved(node: HTMLElement): void {
        if (node.contains(this.echoesDisplay)) {
            this.echoesDisplay = null;
        }

        if (node.contains(this.scripDisplay)) {
            this.scripDisplay = null;
        }
    }
}
