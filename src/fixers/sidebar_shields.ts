import {IMutationAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {getSingletonByClassName} from "../utils";
import {Enhancement, GameStateController, Quality} from "../game_state";
import {debug} from "../logging";

const QUALITY_ID_ORDER = [
    // Watchful
    209,
    // Shadowy
    210,
    // Dangerous
    211,
    // Persuasive
    212,
    // Wounds
    214,
    // Scandal
    215,
    // Suspicion
    216,
    // Nightmares
    217,
    // Troubled Waters
    808,
    // Unaccountably Peckish
    462,
    // Respectable
    950,
    // Dreaded
    957,
    // Bizzare
    958,
    // Making Waves
    545,
    // Notability
    101305,
    // Savage!
    18736,
    // Elusive!
    18737,
    // Baroque!
    18738,
    // A Player of Chess
    140873,
    // Artisan of the Red Science
    140969,
    // Chthonosophy
    144818,
    // Glasswork
    140896,
    // Kataleptic Toxicology
    140826,
    // Mithridacy
    140998,
    // Monstrous Anatomy
    140830,
    // Shapeling Arts
    140897,
    // Steward of the Discordance
    141623,
    // Zeefaring
    142291,
    // Inerrant
    144845,
    // Insubstantial
    144846,
    // Neathproofed
    142591,
];

function createTippyMimic(
    posX: number,
    posY: number,
    title: string,
    description: string,
    secondaryDescription: string | undefined
) {
    const fauxTippy = document.createElement("div");
    fauxTippy.classList.add("faux-tippy-box");
    fauxTippy.dataset.dataTippyRoot = "";
    fauxTippy.style.cssText = `pointer-events: none; z-index: 9999; visibility: visible; position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(${posX.toFixed()}px, ${posY.toFixed()}px, 0px); width: 350px;`;

    const container = document.createElement("div");
    container.setAttribute("id", "fl-sm-faux-tooltip");
    container.classList.add("tippy-box");
    container.setAttribute("role", "tooltip");
    container.dataset.dataState = "visible";
    container.dataset.dataPlacement = "bottom";
    container.dataset.dataAnimation = "fade";
    container.style.cssText = "max-width: 500px; transition-duration: 0ms;";
    container.setAttribute("tabindex", "-1");

    const container2 = document.createElement("div");
    container2.classList.add("tippy-content");
    container2.dataset.dataState = "visible";
    container2.style.cssText = "transition-duration: 0ms;";

    const container3 = document.createElement("div");
    container3.classList.add("tippy-arrow");
    container3.style.cssText = "position: absolute; left: 0px; transform: translate3d(62px, 0px, 0px);";

    const container4 = document.createElement("div");

    const container5 = document.createElement("div");
    container5.classList.add("tooltip");

    const container6 = document.createElement("div");
    container6.classList.add("tooltip__desc__noImage");

    const textSpan = document.createElement("span");
    textSpan.classList.add("item__name");

    const textSpan2 = document.createElement("span");
    textSpan2.classList.add("item__value");

    const paragraph = document.createElement("p");

    const container7 = document.createElement("div");
    container7.classList.add("tooltip__secondary-description");

    const text = document.createTextNode(title);

    const textSpan3 = document.createElement("span");

    const text3 = document.createElement("span");
    text3.innerHTML = description;

    fauxTippy.appendChild(container);

    container.appendChild(container2);
    container.appendChild(container3);

    container2.appendChild(container4);

    container4.appendChild(container5);

    container5.appendChild(container6);

    container6.appendChild(textSpan);
    container6.appendChild(textSpan2);
    container6.appendChild(paragraph);
    container6.appendChild(container7);

    textSpan.appendChild(text);

    paragraph.appendChild(textSpan3);

    if (secondaryDescription) {
        const text2 = document.createElement("span");
        container7.innerHTML = secondaryDescription;
    }

    textSpan3.appendChild(text3);

    return fauxTippy;
}

class SidebarShield {
    readonly linkedQuality: Quality;
    private previousLevel: number = 0;
    private level: number = 0;
    private container: HTMLDivElement;
    private levelDisplay: HTMLSpanElement;
    private animationTimerId: number;

    constructor(quality: Quality, level: number = 0) {
        this.linkedQuality = quality;
        this.container = this.render();
        this.levelDisplay = getSingletonByClassName(this.container, "agent-stat-level")!!;
        this.setLevel(level);
        this.animationTimerId = 0;
    }

    getQualityId(): number {
        return this.linkedQuality.qualityId;
    }

    getLevel(): number {
        return this.level;
    }

    setLevel(level: number) {
        this.previousLevel = this.level;
        this.level = level;
    }

    enableHighlight() {
        this.levelDisplay.classList.add("item__adjust");
    }

    disableHighlight() {
        this.levelDisplay.classList.remove("item__adjust");
    }

    display() {
        if (this.levelDisplay) {
            if (this.previousLevel !== this.level) {
                this.levelDisplay.style.setProperty("--num", this.previousLevel.toString());
                setTimeout(() => {
                    this.levelDisplay.style.setProperty("--num", this.level.toString());
                    this.previousLevel = this.level;
                }, 100);
            } else {
                this.levelDisplay.style.setProperty("--num", this.level.toString());
            }
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
        container.setAttribute("id", `shield-quality-${this.linkedQuality.qualityId}`);
        container.setAttribute("aria-label", this.linkedQuality.image);

        const container2 = document.createElement("div");
        container2.classList.add("agent-stat");
        // TODO: Move into our own CSS
        container2.style.cssText = "border: 1px solid rgb(29 29 29)";

        const img = document.createElement("img");
        img.classList.add("cursor-default");
        img.setAttribute("src", `//images.fallenlondon.com/icons/${this.linkedQuality.image}small.png`);

        const textSpan = document.createElement("span");
        textSpan.classList.add("agent-stat-level", "shield-value");

        this.levelDisplay = textSpan;

        container.appendChild(container2);

        container2.appendChild(img);
        container2.appendChild(textSpan);

        container.addEventListener("mouseenter", (ev) => {
            const rect = container.getBoundingClientRect();
            const tooltip = createTippyMimic(
                ev.x + window.screenX - rect.width,
                ev.y + window.scrollY - rect.height,
                `${this.linkedQuality.name} ${this.level}` +
                    (this.linkedQuality.cap ? ` / ${this.linkedQuality.cap}` : ""),
                this.linkedQuality.description,
                this.linkedQuality.availableAt
            );
            container.appendChild(tooltip);
        });

        container.addEventListener("mouseleave", (ev) => {
            const existingTooltips = container.getElementsByClassName("faux-tippy-box");
            for (const tooltip of existingTooltips) {
                tooltip.parentElement?.removeChild(tooltip);
            }
        });

        return container;
    }

    getElement(): HTMLDivElement {
        return this.container;
    }
}

class SidebarShieldWall {
    private shields: SidebarShield[] = [];
    private wall: HTMLDivElement;
    private predicate: (shield: SidebarShield) => boolean = (shield) => true;

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

    filterBy(predicate: (shield: SidebarShield) => boolean): void {
        this.predicate = predicate;
    }

    renderShields() {
        while (this.wall.firstChild) {
            this.wall.removeChild(this.wall.lastChild as Node);
        }

        this.shields
            .filter(this.predicate)
            .filter((shield) => shield.getLevel() > 0)
            .sort((a, b) => {
                const pos1 = QUALITY_ID_ORDER.findIndex((qid) => qid === a.getQualityId());
                const pos2 = QUALITY_ID_ORDER.findIndex((qid) => qid === b.getQualityId());

                return (pos1 >= 0 ? pos1 : 777 + a.getQualityId()) - (pos2 >= 0 ? pos2 : 777 + b.getQualityId());
            })
            .forEach((shield) => {
                this.wall.appendChild(shield.getElement());
                shield.display();
            });
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
    private currentSettingId: number = 0;

    constructor() {
        this.shieldWall.filterBy((shield: SidebarShield) => {
            if (!shield.linkedQuality.sidebarSettingId) {
                return true;
            }

            return shield.linkedQuality.sidebarSettingId === this.currentSettingId;
        });
    }

    linkState(state: GameStateController): void {
        state.onLocationChanged((_state, location) => {
            this.currentSettingId = location.setting.settingId;
            this.shieldWall.renderShields();
        });

        state.onCharacterDataLoaded((state) => {
            const abilityCategories = ["SidebarTransient", "Menace"];
            const relevantQualityIds: number[] = [...QUALITY_ID_ORDER];

            abilityCategories.map((categoryCode) => {
                const sidebarCategory = state.getQualityCategory(categoryCode);
                if (!sidebarCategory) {
                    return;
                }

                for (const quality of sidebarCategory) {
                    if (QUALITY_ID_ORDER.includes(quality.qualityId)) {
                        continue;
                    }

                    relevantQualityIds.push(quality.qualityId);
                }
            });

            // TODO: We should probably filter out things by setting?
            for (const qualityId of relevantQualityIds) {
                const quality = state.getQualityById(qualityId);
                const existingShield = this.abilityToShield.get(qualityId);

                // TODO: Streamline this logic
                if (!existingShield && quality) {
                    const newShield = new SidebarShield(quality, quality.effectiveLevel);
                    this.abilityToShield.set(quality.qualityId, newShield);
                    this.shieldWall.addShield(newShield);
                    if (!this.firstLoad) {
                        newShield.pulse();
                    }
                    if (quality.bonusOrPenaltyDisplay) {
                        newShield.enableHighlight();
                    }
                } else if (existingShield) {
                    if (quality) {
                        existingShield.setLevel(quality.effectiveLevel);
                        if (quality.bonusOrPenaltyDisplay) {
                            existingShield.enableHighlight();
                        } else {
                            existingShield.disableHighlight();
                        }
                    } else if (existingShield.getLevel() > 0 && !quality) {
                        // If no quality found, then we assume that it has been lost the associated quality and that
                        // is equivalent to it dropping to zero for our purposes. Special case for this is qualities
                        // that are negative right now (e.g. after equipping Woesel), since we will need to recalculate
                        // them later.
                        existingShield.setLevel(0);
                    }
                }
            }

            this.shieldWall.renderShields();
        });

        state.onOutfitContentsLoaded((_state, _current) => {
            this.firstLoad = false;
        });

        state.onQualityChanged((_state, quality, _prevLevel, currentLevel) => {
            if (!QUALITY_ID_ORDER.includes(quality.qualityId) && quality.category != "SidebarTransient") {
                return;
            }

            // Some qualities can also change as a result of your branch choices.
            let shield = this.abilityToShield.get(quality.qualityId);
            if (!shield) {
                shield = new SidebarShield(quality, currentLevel);
                this.shieldWall.addShield(shield);
                this.abilityToShield.set(quality.qualityId, shield);
            }

            shield.setLevel(currentLevel);
            shield.pulse();
            this.shieldWall.renderShields();
        });

        state.onEquipmentChanged((state, slotName, previous, current) => {
            if (this.firstLoad) {
                // Usually the sequence of operations is "equip", then "myself" to reload character state. But on the
                // first load it is actually backwards ("outfit" => "myself")! To prevent us from adding all the
                // modifiers again to the existing values we will use this very hackish way to avoid that scenario.
                return;
            }

            debug(`Equipment changed in slot ${slotName}: ${previous?.name} -> ${current?.name}`);

            // This filter is needed since build-up affecting enhancements for Menaces are coded using
            // "level" field, which screws up our level tracking.
            const notMenace = (enhancement: Enhancement) => {
                return enhancement.category !== "Menace";
            };
            // TODO: Pulse different colors for addition and removal
            const removedEnhancements = (previous ? previous.enhancements : []).filter(notMenace);
            const addedEnhancements = (current ? current.enhancements : []).filter(notMenace);

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

            for (const [qualityId, value] of affectedQualities.entries()) {
                let shield = this.abilityToShield.get(qualityId);
                if (!shield) {
                    const quality = state.getQualityById(qualityId);
                    if (!quality) {
                        continue;
                    }

                    shield = new SidebarShield(quality, value);
                    this.shieldWall.addShield(shield);
                    this.abilityToShield.set(quality.qualityId, shield);
                }
                shield.setLevel(value);
                shield.pulse();
                if (shield.getLevel() != state.getQualityById(qualityId)?.level) {
                    shield.enableHighlight();
                } else {
                    shield.disableHighlight();
                }
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
