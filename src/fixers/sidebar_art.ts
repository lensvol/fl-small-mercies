import {IMutationAware, INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IBeginStoryletRequest} from "../interfaces";
import {getSingletonByClassName} from "../utils";

const OLD_SIDEBAR_ART = new Map([
    ["Kataleptic Toxicology", "honeyjar"],
    ["Monstrous Anatomy", "tentacle"],
    ["A Player of Chess", "chesspiece"],
    ["Glasswork", "mirror"],
    ["Shapeling Arts", "amber2"],
    ["Artisan of the Red Science", "dawnmachine"],
    ["Mithridacy", "snakehead2"],
    ["Steward of the Discordance", "black"],
    ["Zeefaring", "captainhat"],
    ["Chthonosophy", "stalagmite"],
]);

export class SidebarArtFixer implements IMutationAware {
    private revertSidebarArt: boolean = false;

    applySettings(settings: SettingsObject): void {
        this.revertSidebarArt = settings.revert_sidebar_art as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.revertSidebarArt) {
            return false;
        }

        return node.getElementsByClassName("sidebar-quality").length > 0;
    }

    onNodeAdded(node: HTMLElement): void {
        const sidebarQualities = node.getElementsByClassName("sidebar-quality");
        if (sidebarQualities.length <= 0) {
            return;
        }

        for (const quality of sidebarQualities) {
            const qualityName = getSingletonByClassName(quality as HTMLElement, "item__name");
            if (!qualityName || !qualityName.textContent) {
                continue;
            }

            if (!OLD_SIDEBAR_ART.has(qualityName.textContent)) {
                continue;
            }

            const images = quality.getElementsByTagName("img");
            if (images.length == 0) {
                continue;
            }

            const itemImage = images[0] as HTMLElement;
            const imageUri = itemImage.getAttribute("src");
            if (!imageUri) {
                continue;
            }

            const parts = imageUri.split("/");
            parts[parts.length - 1] = OLD_SIDEBAR_ART.get(qualityName.textContent) + "small.png";
            itemImage.setAttribute("src", parts.join("/"));
        }
    }

    onNodeRemoved(node: HTMLElement): void {}
}
