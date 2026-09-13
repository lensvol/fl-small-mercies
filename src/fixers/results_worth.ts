import {INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IChooseBranchResponse} from "../interfaces";
import {ITEM_PRICES_BY_ID} from "../datasets/item_prices";

const QUALITY_CHANGE_MESSAGE_REGEX = /You've (?:lost|gained) ([\d,.]+) x (.+) \(new total ([\d.,]+)( -[ \w\s]+)?\)./;
const QUALITY_ACQUISITION_MESSAGE_REGEX = /You now have ([\d,.]+) x (.+)/;

export class ResultsWorthFixer implements INetworkAware {
    /*
    TODO: This code needs to be merged with the EPA tracker, too much duplication between them.
     */
    private showTotalNetWorth: boolean = false;
    private showPerMessageBreakdown: boolean = false;
    private colorizeAnnotations: boolean = true;

    applySettings(settings: SettingsObject): void {
        this.showTotalNetWorth = settings.branch_net_worth as boolean;
        this.showPerMessageBreakdown = settings.branch_results_worth as boolean;
        this.colorizeAnnotations = settings.colorize_worth_annotations as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/choosebranch", (_, response: IChooseBranchResponse) => {
            let totalWorthDelta = 0;

            if (!this.showTotalNetWorth && !this.showPerMessageBreakdown) {
                return;
            }

            for (const message of response.messages || []) {
                if (message.type !== "StandardQualityChangeMessage") {
                    continue;
                }

                const item = message.possession;

                if (item.nature !== "Thing" && item.category !== "Currency") {
                    continue;
                }

                const price = ITEM_PRICES_BY_ID.get(item.id) || 0;
                // "Lost" is a bit of a special case here, since it actually signifies that there are no items left.
                const worth = (message.changeType !== "Lost" ? item.effectiveLevel : 1) * price;

                if (worth === 0) {
                    // Apparently we do not know worth of that item, might as well silently skip it
                    // TODO: Maybe display it as (+ ??? Echoes)?
                    continue;
                }

                let parseRegex;
                if (message.changeType === "Gained") {
                    parseRegex = QUALITY_ACQUISITION_MESSAGE_REGEX;
                } else {
                    parseRegex = QUALITY_CHANGE_MESSAGE_REGEX;
                }

                const matches = message.message.match(parseRegex);
                if (matches) {
                    const delta = Number(matches[1].replace(/[,.]/g, ""));
                    const worth = delta * price;
                    const sign = ["Increased", "Gained"].includes(message.changeType) ? "+" : "-";

                    if (this.showPerMessageBreakdown) {
                        const cssClasses = ["worth-branch-annotation"];
                        if (this.colorizeAnnotations) {
                            cssClasses.push(sign === "+" ? "worth-annotation-increase" : "worth-annotation-decrease");
                        }
                        const presentation = cssClasses.join(" ");
                        message.message += `<em class="${presentation}">(${sign}${worth.toFixed(2)} Echoes)</em>`;
                    }

                    totalWorthDelta += worth * (sign === "+" ? 1 : -1);
                }
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

            return response;
        });
    }
}
