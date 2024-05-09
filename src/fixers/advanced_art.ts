import {IMutationAware, INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IBeginStoryletRequest, IBranch, IChallenge, IQualityRequirement, IStoryletResponse} from "../interfaces";
import {getSingletonByClassName} from "../utils";

const OLD_SKILLS_ART = new Map([
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

export class AdvancedArtFixer implements IMutationAware, INetworkAware {
    private revertAdvancedSkillsArt: boolean = false;

    applySettings(settings: SettingsObject): void {
        this.revertAdvancedSkillsArt = settings.revert_sidebar_art as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        if (!this.revertAdvancedSkillsArt) {
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

            if (!OLD_SKILLS_ART.has(qualityName.textContent)) {
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
            parts[parts.length - 1] = OLD_SKILLS_ART.get(qualityName.textContent) + "small.png";
            itemImage.setAttribute("src", parts.join("/"));
        }
    }

    onNodeRemoved(node: HTMLElement): void {}

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        const requirementsPatcher = (request: IBeginStoryletRequest, response: IStoryletResponse) => {
            if (!this.revertAdvancedSkillsArt) {
                return;
            }

            // Since /storylet response can hold either contents of the current storylet or list of available
            // storylets, we need to explicitly check which is which. We are only interested in the already started
            // storylets.
            if (!response.storylet) {
                return;
            }

            response.storylet.childBranches.map((branch: IBranch) => {
                branch.qualityRequirements.map((req: IQualityRequirement) => {
                    if (OLD_SKILLS_ART.has(req.qualityName)) {
                        req.image = OLD_SKILLS_ART.get(req.qualityName)!!;
                    }
                });

                branch.challenges.map((challenge: IChallenge) => {
                    if (OLD_SKILLS_ART.has(challenge.name)) {
                        challenge.image = OLD_SKILLS_ART.get(challenge.name)!!;
                    }
                });
            });
        };

        interceptor.onResponseReceived("/api/storylet", requirementsPatcher);
        interceptor.onResponseReceived("/api/storylet/begin", requirementsPatcher);
    }
}
