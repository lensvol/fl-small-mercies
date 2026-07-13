import {IMutationAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {getSingletonByClassName} from "../utils";
import {GameStateController} from "../game_state";
import {debug} from "../logging";

class SidebarShield {
    private level: number = 0;
    private modifier: number = 0;
    private imageName: string;
    private container: HTMLDivElement;
    private levelDisplay: HTMLSpanElement;
    private animationTimerId: number;

    constructor(image: string, level: number = 0, modifier: number = 0) {
        this.imageName = image;
        this.setLevel(level, modifier);
        this.container = this.render();
        this.levelDisplay = getSingletonByClassName(this.container, "agent-stat-level")!!;
        this.animationTimerId = 0;
    }

    setLevel(level: number, modifier: number) {
        this.level = level;
        this.modifier = modifier;
        debug(`Setting ${this.imageName} to ${level} + ${modifier}`);
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

    addShield(shield: SidebarShield) {
        this.shields.push(shield);
    }

    render(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("agent-stat-container");
        container.style.marginTop = "10px";
        container.style.gridTemplateColumns = "repeat(auto-fill,minmax(32px,1fr))";

        this.shields.forEach((shield) => container.appendChild(shield.getElement()));

        return container;
    }
}

export class SidebarShieldsFixer implements IMutationAware, IStateAware {
    private showShieldWall: boolean = false;
    private shieldWall = new SidebarShieldWall();
    private abilityToShield: Map<number, SidebarShield> = new Map();

    linkState(state: GameStateController): void {
        state.onUserDataLoaded((state) => {
            const abilityCategories = ["BasicAbility", "SidebarAbility", "Skills"];

            abilityCategories.map((categoryCode) => {
                const sidebarCategory = state.getQualityCategory(categoryCode);
                if (!sidebarCategory) {
                    return;
                }
                for (const quality of sidebarCategory) {
                    const shield = new SidebarShield(
                        quality.image,
                        quality.level,
                        quality.effectiveLevel - quality.level
                    );
                    this.abilityToShield.set(quality.qualityId, shield);
                    this.shieldWall.addShield(shield);
                }
            });
        });

        state.onQualityChanged((state, quality, _prevLevel, _curLevel) => {
            const existingShield = this.abilityToShield.get(quality.qualityId);
            if (existingShield) {
                existingShield.setLevel(quality.effectiveLevel, quality.effectiveLevel - quality.level);
                existingShield.pulse();
                debug("Quality should be updated", quality);
            }
        });

        state.onEquipmentChanged((state, slotName, previous, current) => {
            debug(`Equipment changed in slot ${slotName}: ${previous} -> ${current}`);

            // TODO: Pulse different colors for addition and removal
            const removedEnhancements = previous ? previous.enhancements : [];
            const addedEnhancements = current ? current.enhancements : [];

            for (const enhancement of [...removedEnhancements, ...addedEnhancements]) {
                const existingShield = this.abilityToShield.get(enhancement.qualityId);
                if (!existingShield) continue;

                const quality = state.getQualityById(enhancement.qualityId);
                if (!quality) {
                    debug("Something went wrong, shield was found in enhancement but quality was not", quality);
                    continue;
                }

                debug(`Updating shield for "${quality.name}"`, quality.level);
                existingShield.setLevel(quality.level, quality.effectiveLevel - quality.level);
                existingShield.pulse();
            }
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
            firstQuality.parentElement.parentNode?.insertBefore(this.shieldWall.render(), firstQuality.parentNode);
            firstQuality.parentElement.style.display = "none";
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
