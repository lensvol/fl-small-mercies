import { IStateAware } from "./base.js";
import { SettingsObject } from "../settings.js";
import { GameStateController } from "../game_state";

const PENNY_QUALITY_ID: number = 22390;
const SCRIP_QUALITY_ID: number = 125025;

function numberWithCommas(x: string): string {
    const result = x.replace(/\B(?=(\d{3})+(?!\d))/g, ",").trim();
    return result.endsWith(".00") ? result.slice(0, result.length - 3) : result;
}

const ECHO_DISPLAY_SELECTOR = "li[class='item'] > div[class='item__desc'] > div[class='item__value'] > div[class*='price']";
const SCRIP_DISPLAY_SELECTOR = "li[class='item'] > div[class='item__desc'] > div[class='item__value'] > div[class*='scrip']";

export class ShopTransactionFixer implements IStateAware {
    trackShopTransactions = true;
    private shouldSeparateThousands = false;

    applySettings(settings: SettingsObject): void {
        this.trackShopTransactions = settings.track_shop_transactions as boolean;
        this.shouldSeparateThousands = settings.add_thousands_separator as boolean;
    }

    linkState(state: GameStateController): void {
        state.onQualityChanged((state, quality, previous, current) => {
            if (!this.trackShopTransactions) {
                return;
            }

            let quantity = 0;
            let selector = null;

            if (quality.qualityId === PENNY_QUALITY_ID) {
                selector = ECHO_DISPLAY_SELECTOR;
                quantity = (quality.level / 100);
            }

            if (quality.level === SCRIP_QUALITY_ID) {
                selector = SCRIP_DISPLAY_SELECTOR;
                quantity = quality.level;
            }

            if (!selector) {
                return;
            }

            const display = document.querySelector(selector);
            if (!display) {
                return;
            }

            if (this.shouldSeparateThousands) {
                display.textContent = numberWithCommas(quantity.toString());
            } else {
                display.textContent = quantity.toString();
            }
        });
    }
}
