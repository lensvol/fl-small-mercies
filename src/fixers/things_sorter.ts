import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";

const MYSTERIES_ORDER = [143188, 143189, 143190, 143191, 143192];
const MYSTERIES_SELECTOR = MYSTERIES_ORDER.map((i) => `div[data-branch-id='${i}']`).join(", ");

const NEATHBOW_ORDER = [141683, 142658, 142674, 142711, 142712, 142713, 142714];
const NEATHBOW_SELECTOR = NEATHBOW_ORDER.map((i) => `div[data-quality-id='${i}']`).join(", ");

const SEAL_ORDER = [141891, 141892, 141893, 141894, 141895, 141896, 141897, 141898, 142381];
const SEAL_SELECTOR = SEAL_ORDER.map((i) => `div[data-branch-id='${i}']`).join(", ");


function sortSeals(sealIcons: NodeListOf<Element>) {
    const seals = Array
        .from(sealIcons)
        // @ts-ignore
        .sort((i1, i2) => i1.dataset.branchId - i2.dataset.branchId)
        .map((icon) => icon.parentElement);

    if (seals.length <= 1 || seals[0] == null) {
        return;
    }

    const parent = seals[0].parentElement;
    const start = seals[0];

    if (parent == null) {
        return;
    }

    // const parent = seals[0].parentElement;
    // const start = seals[0].previousSibling;

    seals
        .slice(1)
        .reverse()
        .forEach(seal => {
            if (seal != null) {
                parent.removeChild(seal);
                start.after(seal);
            }
        })
}

function sortNeathbowBoxes(neathbowIcons: NodeListOf<Element>) {
    const neathbow = Array
        .from(neathbowIcons)
        // @ts-ignore
        .sort((i1, i2) => i1.dataset.qualityId - i2.dataset.qualityId)
        .map((icon) => icon.parentElement);

    if (neathbow.length <= 1 || neathbow[0] == null) {
        return;
    }

    const parent = neathbow[0].parentElement;
    const start = neathbow[0];

    if (parent == null) {
        return;
    }
    
    neathbow
        .slice(1)
        .reverse()
        .forEach(box => {
            if (box != null) {
                parent.removeChild(box);
                start.after(box);
            }
        })
}

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
                const mysteryIcons = node.querySelectorAll(MYSTERIES_SELECTOR);
                if (mysteryIcons.length > 1) {
                    sortMysteries(mysteryIcons);
                }
            }

            if (this.sortSeals) {
                const sealIcons = node.querySelectorAll(SEAL_SELECTOR);
                if (sealIcons.length > 1) {
                    sortSeals(sealIcons);
                }
            }
        }
        
        if (this.sortNeathbow) {
            const neathbowIcons = node.querySelectorAll(NEATHBOW_SELECTOR);
            if (neathbowIcons.length > 1) {
                sortNeathbowBoxes(neathbowIcons);
            }
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
