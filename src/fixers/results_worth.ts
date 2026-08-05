import {INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IChooseBranchResponse} from "../interfaces";
import {ITEM_PRICES_BY_ID} from "../datasets/item_prices";

const QUALITY_MESSAGE_REGEX = /You've (lost|gained) (\d+) x (.+) \(new total ([\d,]+)\)./;

export class ResultsWorthFixer implements INetworkAware {
    applySettings(settings: SettingsObject): void {}

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/choosebranch", (_, response: IChooseBranchResponse) => {
            let totalWorthDelta = 0;

            for (const message of response.messages || []) {
                if (message.type !== "StandardQualityChangeMessage") {
                    continue;
                }

                const item = message.possession;

                if (item.nature !== "Thing") {
                    continue;
                }

                const price = ITEM_PRICES_BY_ID.get(item.id) || 0;
                const worth = item.effectiveLevel * price;

                if (worth === 0) {
                    continue;
                }

                const matches = message.message.match(QUALITY_MESSAGE_REGEX);
                if (matches) {
                    const delta = Number(matches[2]);
                    const sign = message.changeType === "Decreased" ? "+" : "-";
                    const worth = delta * price;
                    const presentation = sign === "+" ? "worth-increased" : "worth-decreased";
                    message.message += `<em class="${presentation}">(${sign}${worth.toFixed(2)} Echoes)</em>`;

                    totalWorthDelta += worth * (sign === "+" ? 1 : -1);
                }
            }

            if (totalWorthDelta !== 0) {
                const presentation = totalWorthDelta > 0 ? "worth-increased" : "worth-decreased";
                const plus = totalWorthDelta > 0 ? "+" : "";
                const formattedWorth = totalWorthDelta.toFixed(2);

                response.messages.push({
                    priority: 2,
                    image: "banknotessmall",
                    message: `<em>Total wealth change: <span class="${presentation}" style="font-size: 1em">${plus}${formattedWorth} Echoes</span></em>`,
                    type: "InfoMessage",
                    tooltip: "For a lack of a penny.",
                });
            }
        });
    }
}
