import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";

const MYSTERIES_ORDER = [143188, 143189, 143190, 143191, 143192];
const MYSTERIES_SELECTOR = MYSTERIES_ORDER.map((i) => `div[data-branch-id='${i}']`).join(", ");

const NEATHBOW_ORDER = [141683, 142658, 142674, 142711, 142712, 142713, 142714];
const NEATHBOW_SELECTOR = NEATHBOW_ORDER.map((i) => `div[data-quality-id='${i}']`).join(", ");

const SEAL_ORDER = [141891, 141892, 141893, 141894, 141895, 141896, 141897, 141898, 142381];
const SEAL_SELECTOR = SEAL_ORDER.map((i) => `div[data-branch-id='${i}']`).join(", ");


function findAndSortIcons(node: Element, selector: string, order: number[]) {
    const icons = node.querySelectorAll(selector);
    const things = Array
        .from(icons)
        // @ts-ignore
        .sort((i1, i2) => i1.dataset.branchId - i2.dataset.branchId)
        .map((icon) => icon.parentElement);

    if (things.length <= 1 || things[0] == null) {
        return;
    }

    const parent = things[0].parentElement;
    const start = things[0];

    if (parent == null) {
        return;
    }

    things
        .slice(1)
        .reverse()
        .forEach(thing => {
            if (thing != null) {
                parent.removeChild(thing);
                start.after(thing);
            }
        })
}

export class ThingSortFixer implements IMutationAwareFixer {
    private sortCityMysteries: boolean = false;
    private sortSeals: boolean = false;
    private sortNeathbow: boolean = false;

    applySettings(settings: SettingsObject): void {
        this.sortCityMysteries = settings.sort_city_mysteries;
        this.sortSeals = settings.sort_discordance_seals;
        this.sortNeathbow = settings.sort_neathbow_boxes;
    }

    checkEligibility(node: HTMLElement): boolean {
        return this.sortCityMysteries || this.sortSeals
    }

    onNodeAdded(node: HTMLElement): void {
        const accomplishments = node.querySelectorAll("div[data-group-name='Accomplishments']");
        if (accomplishments.length > 0) {
            if (this.sortCityMysteries) {
                findAndSortIcons(node, MYSTERIES_SELECTOR, MYSTERIES_ORDER);
            }

            if (this.sortSeals) {
                findAndSortIcons(node, SEAL_SELECTOR, SEAL_ORDER);
            }
        }

        if (this.sortNeathbow) {
            findAndSortIcons(node, NEATHBOW_SELECTOR, NEATHBOW_ORDER);
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
