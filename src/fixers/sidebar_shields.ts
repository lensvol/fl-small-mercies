import {IMutationAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {getSingletonByClassName} from "../utils";
import {GameStateController} from "../game_state";

class SidebarShield {
    private level: number = 0;
    private modifier: number = 0;
    private imageName: string;

    constructor(image: string, level: number = 0, modifier: number = 0) {
        this.imageName = image;
        this.level = level;
        this.modifier = modifier;
    }

    render(): HTMLDivElement {
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
        textSpan.classList.add("agent-stat-level");

        const text = document.createTextNode((this.level + this.modifier).toString());

        container.appendChild(container2);

        container2.appendChild(img);
        container2.appendChild(textSpan);

        textSpan.appendChild(text);

        return container;
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

        this.shields.forEach((shield) => container.appendChild(shield.render()));

        return container;
    }
}

export class SidebarShieldsFixer implements IMutationAware, IStateAware {
    private showShieldWall: boolean = false;
    private shieldWall = new SidebarShieldWall();

    linkState(state: GameStateController): void {
        state.onUserDataLoaded((state) => {
            const abilityCategories = ["BasicAbility", "SidebarAbility", "Skills", "SidebarTransient"];

            abilityCategories.map((categoryCode) => {
                const sidebarCategory = state.getQualityCategory(categoryCode);
                if (!sidebarCategory) {
                    return;
                }
                for (const quality of sidebarCategory) {
                    this.shieldWall.addShield(new SidebarShield(quality.image, quality.effectiveLevel, 0));
                }
            });
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
