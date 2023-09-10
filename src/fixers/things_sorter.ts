import {IMutationAware} from "./base";
import {SettingsObject} from "../settings";

const MYSTERIES_ORDER = [143188, 143189, 143190, 143191, 143192];

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

const SEAL_ORDER = [141891, 141892, 141893, 141894, 141895, 141896, 141897, 141898, 142381];

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

function findAndSortIcons(node: Element, order: number[]) {
    const allIcons = node.getElementsByClassName("icon");
    const icons = Array.from(allIcons).filter((icon) => {
        const element = icon as HTMLElement;
        const iconId = element.dataset.branchId || element.dataset.qualityId;
        return order.includes(parseInt(iconId || "0"));
    });

    const things = icons
        .sort((i1: Element, i2: Element) => {
            const obj1 = i1 as HTMLElement;
            const obj2 = i2 as HTMLElement;

            const pos1 = order.findIndex(
                (objId) => objId == parseInt(obj1.dataset.qualityId || obj1.dataset.branchId || "0")
            );
            const pos2 = order.findIndex(
                (objId) => objId == parseInt(obj2.dataset.qualityId || obj2.dataset.branchId || "0")
            );
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

export class ThingSortFixer implements IMutationAware {
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

    checkEligibility(node: HTMLElement): boolean {
        const needToSortAnything = this.sortCityMysteries || this.sortSeals || this.sortDreams || this.sortNeathbow;
        if (!needToSortAnything) {
            return false;
        }

        if (this.sortNeathbow && node.getElementsByClassName("inventory-group").length > 0) {
            return true;
        }

        return node.getElementsByClassName("quality-group").length > 0;
    }

    onNodeAdded(node: HTMLElement): void {
        //div[data-group-name='Accomplishments']
        const qualityGroups = node.getElementsByClassName("quality-group");
        // if found, we are on the "Myself" tab
        if (qualityGroups.length > 0) {
            for (const element of qualityGroups) {
                const group = element as HTMLElement;
                if (group.dataset.groupName == "Accomplishments" && this.sortCityMysteries) {
                    findAndSortIcons(group, MYSTERIES_ORDER);
                }

                if (group.dataset.groupName == "Stories" && this.sortSeals) {
                    findAndSortIcons(group, SEAL_ORDER);
                }

                if (group.dataset.groupName == "Dreams" && this.sortDreams) {
                    findAndSortIcons(group, DREAM_ORDER);
                }
            }
        } else {
            const equipmentGroups = node.getElementsByClassName("inventory-group");
            if (equipmentGroups.length > 0 && this.sortNeathbow) {
                for (const element of equipmentGroups) {
                    const group = element as HTMLElement;
                    if (group.dataset.groupName === "Contraband") {
                        findAndSortIcons(group, NEATHBOW_ORDER);
                        break;
                    }
                }
            }
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
