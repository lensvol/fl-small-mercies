import {SettingsObject} from "../settings";
import {IMutationAware} from "./base";
import {getSingletonByClassName} from "../utils";

export class CurrencyIconsFixer implements IMutationAware {
    private showScripIcon = false;
    private showStuiversIcon = false;
    private showShillingsIcon = false;

    onNodeAdded(node: HTMLElement): void {
        const currencyHeadings = node.querySelectorAll("span[class='item__name']");
        const currencyClasses = new Map<string, [boolean, string]>([
            ["Hinterland Scrip", [this.showScripIcon, "currency__scrip"]],
            ["Stuivers", [this.showStuiversIcon, "currency__stuiver"]],
            ["Rat-Shillings", [this.showShillingsIcon, "currency__rat_shilling"]],
        ]);

        for (const heading of currencyHeadings) {
            if (!heading.textContent || !heading.parentElement) {
                continue;
            }

            if (currencyClasses.has(heading.textContent)) {
                let [enabled, iconCls] = currencyClasses.get(heading.textContent)!!;

                if (!enabled) {
                    continue;
                }

                const indicator = heading.parentElement.querySelector("div[class='item__value']");
                if (indicator) {
                    indicator.classList.add(iconCls, "price--inverted");
                }
            }
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }

    applySettings(settings: SettingsObject): void {
        this.showScripIcon = settings.scrip_icon as boolean;
        this.showStuiversIcon = settings.stuiver_icon as boolean;
        this.showShillingsIcon = settings.shillings_icon as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.showScripIcon) {
            return false;
        }

        return getSingletonByClassName(node, "sidebar") != null;
    }
}
