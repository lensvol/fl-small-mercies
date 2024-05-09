import {IMutationAware, INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IBeginStoryletRequest, IBranch, IChallenge, IQualityRequirement, IStoryletResponse} from "../interfaces";
import {getSingletonByClassName} from "../utils";

const OLD_SKILLS_ART = new Map([
    ["kataleptictoxicology", "honeyjar"],
    ["monstrousanatomy", "tentacle"],
    ["playerofchess", "chesspiece"],
    ["glasswork", "mirror"],
    ["shapelingarts", "amber2"],
    ["artisanredscience", "dawnmachine"],
    ["mithridacy", "snakehead2"],
    ["stewardofdiscordance", "black"],
    ["zeefaring", "captainhat"],
    ["cthonsosophy", "stalagmite"],
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
            const filename = parts[parts.length - 1].replace("small.png", "");

            if (OLD_SKILLS_ART.has(filename)) {
                parts[parts.length - 1] = OLD_SKILLS_ART.get(filename) + "small.png";
                itemImage.setAttribute("src", parts.join("/"));
            }
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
                    if (OLD_SKILLS_ART.has(req.image)) {
                        req.image = OLD_SKILLS_ART.get(req.image)!!;
                    }
                });

                branch.challenges.map((challenge: IChallenge) => {
                    if (OLD_SKILLS_ART.has(challenge.image)) {
                        challenge.image = OLD_SKILLS_ART.get(challenge.image)!!;
                    }
                });
            });
        };

        interceptor.onResponseReceived("/api/storylet", requirementsPatcher);
        interceptor.onResponseReceived("/api/storylet/begin", requirementsPatcher);
    }
}
