import {IMutationAwareFixer} from "./base.js";
import {SettingsObject} from "../settings.js";

const MYSTERIES_ORDER = [143188, 143189, 143190, 143191, 143192];
const MYSTERIES_SELECTOR = MYSTERIES_ORDER.map((i) => `div[data-branch-id='${i}']`).join(", ");

/*
 The following order is confirmed to be canonical by Bruno himself:
 https://cohost.org/bruno/post/66284-favorite-new-fallen
 */
const NEATHBOW_ORDER = [
    142658, // Peligin
    142714, // Violant
    142713, // Apocyan
    142674, // Viric
    141683, // Cosmogone
    142711, // Irrigo
    142712, // Gant
];
const NEATHBOW_SELECTOR = NEATHBOW_ORDER.map((i) => `div[data-quality-id='${i}']`).join(", ");

const SEAL_ORDER = [141891, 141892, 141893, 141894, 141895, 141896, 141897, 141898, 142381];
const SEAL_SELECTOR = SEAL_ORDER.map((i) => `div[data-branch-id='${i}']`).join(", ");

const DREAM_ORDER = [
    239, // HRD: A Game of Chess
    142643, // HRD: Betwixt Us and the Sun
    235, // HRD: Death by Water
    142642, // HRD: I Shot the Albatross
    234, // HRD: Is Someone There?
    237, // HRD: The Burial of the Dead
    141026, // Haunted by Stairs
    238, // HRD: The Fire Sermon
    141027, // Seeing in Apocyan
    236, // HRD: What the Thunder Said
    774, // Stormy-Eyed
];
const DREAM_SELECTOR = DREAM_ORDER.map((i) => `div[data-branch-id='${i}']`).join(", ");

function findAndSortIcons(node: Element, selector: string, order: number[]) {
    const icons = node.querySelectorAll(selector) as NodeListOf<HTMLElement>;
    const things = Array.from(icons)
        .sort((i1: HTMLElement, i2: HTMLElement) => {
            const pos1 = order.findIndex((objId) => objId == parseInt(i1.dataset.qualityId || i1.dataset.branchId || "0"));
            const pos2 = order.findIndex((objId) => objId == parseInt(i2.dataset.qualityId || i2.dataset.branchId || "0"));
            return pos1 - pos2;
        })
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
        .forEach((thing) => {
            if (thing != null) {
                parent.removeChild(thing);
                start.after(thing);
            }
        });
}

export class ThingSortFixer implements IMutationAwareFixer {
    private sortCityMysteries = false;
    private sortSeals = false;
    private sortDreams = false;
    private sortNeathbow = false;

    applySettings(settings: SettingsObject): void {
        this.sortCityMysteries = settings.sort_city_mysteries as boolean;
        this.sortSeals = settings.sort_discordance_seals as boolean;
        this.sortDreams = settings.sort_dreams as boolean;
        this.sortNeathbow = settings.sort_neathbow_boxes as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.sortCityMysteries || this.sortSeals || this.sortDreams || this.sortNeathbow;
    }

    onNodeAdded(node: HTMLElement): void {
        const accomplishments = node.querySelectorAll("div[data-group-name='Accomplishments']");
        // if found, we are on the "Myself" tab
        if (accomplishments.length > 0) {
            if (this.sortCityMysteries) {
                findAndSortIcons(node, MYSTERIES_SELECTOR, MYSTERIES_ORDER);
            }

            if (this.sortSeals) {
                findAndSortIcons(node, SEAL_SELECTOR, SEAL_ORDER);
            }

            if (this.sortDreams) {
                findAndSortIcons(node, DREAM_SELECTOR, DREAM_ORDER);
            }
        }

        if (this.sortNeathbow) {
            findAndSortIcons(node, NEATHBOW_SELECTOR, NEATHBOW_ORDER);
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
