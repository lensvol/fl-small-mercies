import { INetworkAware, IStateAware } from "./base.js";
import {SettingsObject} from "../settings.js";
import {FLApiInterceptor} from "../api_interceptor";
import { GameStateController } from "../game_state";

const PENNY_QUALITY_ID: number = 22390;
const SCRIP_QUALITY_ID: number = 125025;

function numberWithCommas(x: string): string {
    const result = x.replace(/\B(?=(\d{3})+(?!\d))/g, ",").trim();
    return result.endsWith(".00") ? result.slice(0, result.length - 3) : result;
}

export class ShopTransactionFixer implements IStateAware {
    trackShopTransactions = true;

    applySettings(settings: SettingsObject): void {
        this.trackShopTransactions = settings.track_shop_transactions as boolean;
    }

    linkState(state: GameStateController): void {
        state.onQualityChanged((state, quality, previous, current) => {
            if (quality.qualityId === PENNY_QUALITY_ID) {
                const echoesIndicator = document.querySelector("li[class*='item'] > div[class='item__desc'] > div[class='item__value'] > div[class*='price']");
                if (echoesIndicator) {
                    echoesIndicator.textContent = numberWithCommas((quality.level / 100).toString());
                }
            }

            if (quality.qualityId === SCRIP_QUALITY_ID) {
                const echoesIndicator = document.querySelector("li[class*='item'] > div[class='item__desc'] > div[class='item__value'] > div[class*='price']");
                if (echoesIndicator) {
                    echoesIndicator.textContent = numberWithCommas((quality.level / 100).toString());
                }
            }
        });
    }
}
