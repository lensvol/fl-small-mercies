import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";

const MYSTERIES_ORDER = [143188, 143189, 143190, 143191, 143192];
const MYSTERIES_SELECTOR = MYSTERIES_ORDER.map((i) => `div[data-branch-id='${i}']`).join(", ");

function sortMysteries(mysteryIcons: NodeListOf<Element>) {
    const mysteries = Array
        .from(mysteryIcons)
        // @ts-ignore
        .sort((i1, i2) => i1.dataset.branchId - i2.dataset.branchId)
        .map((icon) => icon.parentElement);

    if (mysteries.length <= 1 || mysteries[0] == null) {
        return;
    }

    const parent = mysteries[0].parentElement;
    const start = mysteries[0];

    if (parent == null) {
        return;
    }

    mysteries
        .slice(1)
        .reverse()
        .forEach(mystery => {
            if (mystery != null) {
                parent.removeChild(mystery);
                start.after(mystery);
            }
        })
}

export class ThingSortFixer implements IMutationAwareFixer {
    private sortCityMysteries: boolean = false;

    applySettings(settings: SettingsObject): void {
        this.sortCityMysteries = settings.sort_city_mysteries;
    }

    checkEligibility(node: HTMLElement): boolean {
        return this.sortCityMysteries
    }

    onNodeAdded(node: HTMLElement): void {
        const accomplishments = node.querySelectorAll("div[data-group-name='Accomplishments']");
        if (accomplishments.length > 0) {
            const mysteryIcons = node.querySelectorAll(MYSTERIES_SELECTOR);
            if (mysteryIcons.length <= 1) {
                return;
            }

            sortMysteries(mysteryIcons);
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
