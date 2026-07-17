import {IMutationAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {getSingletonByClassName} from "../utils";
import {GameStateController} from "../game_state";
import {debug} from "../logging";

const ADDITIONAL_QUALITY_IDS = [
    // Wounds
    214,
    // Scandal
    215,
    // Suspicion
    216,
    // Nightmares
    217,
    // Inerrant
    144845,
    // Insubstantial
    144846,
    // Neathproofed
    142591,
];

class SidebarShield {
    private level: number = 0;
    private modifier: number = 0;
    private imageName: string;
    private container: HTMLDivElement;
    private levelDisplay: HTMLSpanElement;
    private animationTimerId: number;

    constructor(image: string, level: number = 0) {
        this.imageName = image;
        this.container = this.render();
        this.levelDisplay = getSingletonByClassName(this.container, "agent-stat-level")!!;
        this.setLevel(level);
        this.animationTimerId = 0;
    }

    getLevel(): number {
        return this.level;
    }

    setLevel(level: number) {
        this.level = level;
        if (this.levelDisplay) {
            this.levelDisplay.style.setProperty("--num", (this.level + this.modifier).toString());
        }
    }

    pulse() {
        this.container.classList.add("pulse-golden-light");

        if (this.animationTimerId) {
            window.clearTimeout(this.animationTimerId);
        }
        this.animationTimerId = window.setTimeout(() => {
            this.container.classList.remove("pulse-golden-light");
            this.animationTimerId = 0;
        }, 1000);
    }

    private render(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("agent-stat-wrapper");
        container.setAttribute("role", "button");
        container.style.cssText = "outline: 0px; outline-offset: 0px; cursor: default;";
        container.setAttribute("tabindex", "0");

        const container2 = document.createElement("div");
        container2.classList.add("agent-stat");
        // TODO: Move into our own CSS
        container2.style.cssText = "border: 1px solid rgb(29 29 29)";

        const img = document.createElement("img");
        img.classList.add("cursor-default");
        img.setAttribute("src", `//images.fallenlondon.com/icons/${this.imageName}small.png`);

        const textSpan = document.createElement("span");
        textSpan.classList.add("agent-stat-level", "shield-value");

        this.levelDisplay = textSpan;

        container.appendChild(container2);

        container2.appendChild(img);
        container2.appendChild(textSpan);

        return container;
    }

    getElement(): HTMLDivElement {
        return this.container;
    }
}

class SidebarShieldWall {
    private shields: SidebarShield[] = [];
    private wall: HTMLDivElement;

    constructor() {
        this.wall = this.render();
    }

    addShield(shield: SidebarShield) {
        this.shields.push(shield);
    }

    private render(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("agent-stat-container");
        container.style.marginTop = "10px";
        container.style.gridTemplateColumns = "repeat(auto-fill,minmax(32px,1fr))";

        return container;
    }

    renderShields() {
        while (this.wall.firstChild) {
            this.wall.removeChild(this.wall.lastChild as Node);
        }

        this.shields
            .filter((shield) => shield.getLevel() > 0)
            .forEach((shield) => this.wall.appendChild(shield.getElement()));
    }

    getElement(): HTMLDivElement {
        return this.wall;
    }
}

export class SidebarShieldsFixer implements IMutationAware, IStateAware {
    private showShieldWall: boolean = false;
    private shieldWall = new SidebarShieldWall();
    private abilityToShield: Map<number, SidebarShield> = new Map();
    private firstLoad: boolean = true;

    linkState(state: GameStateController): void {
        state.onCharacterDataLoaded((state) => {
            const abilityCategories = ["BasicAbility", "SidebarAbility", "Skills"];
            const relevantQualityIds: number[] = [];

            abilityCategories.map((categoryCode) => {
                const sidebarCategory = state.getQualityCategory(categoryCode);
                if (!sidebarCategory) {
                    return;
                }

                for (const quality of sidebarCategory) {
                    relevantQualityIds.push(quality.qualityId);
                }
            });

            relevantQualityIds.push(...ADDITIONAL_QUALITY_IDS);

            for (const qualityId of relevantQualityIds) {
                const quality = state.getQualityById(qualityId);
                const existingShield = this.abilityToShield.get(qualityId);

                if (!existingShield && quality) {
                    const shield = new SidebarShield(quality.image, quality.effectiveLevel);
                    this.abilityToShield.set(quality.qualityId, shield);
                    this.shieldWall.addShield(shield);

                    if (!this.firstLoad) {
                        shield.pulse();
                    }
                } else if (existingShield) {
                    if (!quality) {
                        existingShield.setLevel(0);
                    } else {
                        existingShield.setLevel(quality.effectiveLevel);
                    }
                }
            }

            this.shieldWall.renderShields();
        });

        state.onOutfitContentsLoaded((_state, _current) => {
            this.firstLoad = false;
        });

        state.onEquipmentChanged((state, slotName, previous, current) => {
            if (this.firstLoad) {
                // Usually the sequence of operations is "equip", then "myself" to reload character state. But on the
                // first load it is actually backwards ("outfit" => "myself")! To prevent us from adding all the
                // modifiers again to the existing values we will use this very hackish way to avoid that scenario.
                return;
            }

            debug(`Equipment changed in slot ${slotName}: ${previous?.name} -> ${current?.name}`);

            // TODO: Pulse different colors for addition and removal
            const removedEnhancements = previous ? previous.enhancements : [];
            const addedEnhancements = current ? current.enhancements : [];

            // Prepare list of qualities that will be affected by this equipment change
            const affectedQualities: Map<number, number> = new Map(
                [...removedEnhancements, ...addedEnhancements].map((enh) => {
                    const existingShield = this.abilityToShield.get(enh.qualityId);
                    const quality = state.getQualityById(enh.qualityId);

                    if (existingShield) {
                        return [enh.qualityId, existingShield.getLevel()];
                    } else if (quality) {
                        return [enh.qualityId, quality.effectiveLevel];
                    } else {
                        return [enh.qualityId, 0];
                    }
                })
            );

            // Process removal of the equipment
            for (const removed of removedEnhancements) {
                affectedQualities.set(removed.qualityId, affectedQualities.get(removed.qualityId)!! - removed.level);
            }

            // Process newly equipped item (if any)
            for (const added of addedEnhancements) {
                affectedQualities.set(added.qualityId, affectedQualities.get(added.qualityId)!! + added.level);
                debug(`After addition ${added.qualityId} = ${affectedQualities.get(added.qualityId)!!}`);
            }

            debug(`Enhancements for ${slotName}`, removedEnhancements, addedEnhancements);

            for (const [qualityId, value] of affectedQualities.entries()) {
                const existingShield = this.abilityToShield.get(qualityId);
                if (!existingShield) {
                    const quality = state.getQualityById(qualityId);
                    if (!quality) {
                        continue;
                    }

                    const newShield = new SidebarShield(quality.image);
                    this.shieldWall.addShield(newShield);
                    this.abilityToShield.set(quality.qualityId, newShield);
                    newShield.setLevel(value);
                    newShield.pulse();
                    continue;
                }

                existingShield.setLevel(value);
                existingShield.pulse();
            }
            this.shieldWall.renderShields();
        });
    }

    applySettings(settings: SettingsObject): void {
        this.showShieldWall = settings.compact_ability_sidebar as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.showShieldWall) {
            return false;
        }

        return getSingletonByClassName(node, "items--list") != null;
    }

    onNodeAdded(node: HTMLElement): void {
        const firstQuality = getSingletonByClassName(node, "sidebar-quality");
        if (firstQuality && firstQuality.parentElement) {
            // TODO: Make it more elegant
            firstQuality.parentElement.parentNode?.insertBefore(this.shieldWall.getElement(), firstQuality.parentNode);
            firstQuality.parentElement.style.display = "none";
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
