import {IMutationAware, INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IQuality} from "../interfaces";
import {VANITY_QUALITY_IDS} from "../datasets/qualities";

export class VanitySectionFixer implements INetworkAware, IMutationAware {
    showVanitySection = false;
    onlyCompletedVanities = true;
    incompleteVanities: number[] = [];

    applySettings(settings: SettingsObject): void {
        this.showVanitySection = settings.show_vanity_section as boolean;
        this.onlyCompletedVanities = settings.only_completed_vanities as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/character/myself", (request, response) => {
            if (!this.showVanitySection) {
                return;
            }

            const extractedVanities: IQuality[] = [];
            this.incompleteVanities = [];

            for (const category of response.possessions) {
                for (const quality of category.possessions) {
                    const descriptor = VANITY_QUALITY_IDS.find((descriptor) => descriptor[1] == quality.id);
                    if (!descriptor) continue;

                    const boundary = this.onlyCompletedVanities ? descriptor[0] : 1;
                    if (boundary > quality.level) {
                        this.incompleteVanities.push(quality.id);
                    }

                    extractedVanities.push(quality);
                }
            }

            response.possessions.push({
                appearance: "Default",
                categories: ["Venture"],
                name: "Vanities",
                possessions: extractedVanities,
            });

            return;
        });
    }

    onNodeAdded(node: HTMLElement): void {
        if (!this.onlyCompletedVanities) {
            return;
        }

        const qualityGroups = node.getElementsByClassName("quality-group");
        if (qualityGroups.length == 0) {
            return;
        }

        // Since /myself endpoint is only queried once, we need to manually hide the incomplete vanities
        // using UI trickery.
        for (const element of qualityGroups) {
            const group = element as HTMLElement;
            if (group.dataset.groupName !== "Vanities") {
                continue;
            }

            for (const qualityIcon of group.getElementsByClassName("icon")) {
                const iconElement = qualityIcon as HTMLElement;

                if (!iconElement || !iconElement.parentElement) {
                    continue;
                }

                // FL UI reuses "data-branch-id" for quality IDs on "Myself" tab.
                const qualityId = parseInt(iconElement.dataset.branchId || "0");

                if (this.incompleteVanities.includes(qualityId)) {
                    // We need to hide the parent element, not the icon itself.
                    iconElement.parentElement.style.cssText = "display: none";
                } else {
                    iconElement.parentElement.style.cssText = "";
                }
            }
        }
    }

    onNodeRemoved(node: HTMLElement): void {}

    checkEligibility(node: HTMLElement): boolean {
        if (!this.showVanitySection || !this.onlyCompletedVanities) {
            return false;
        }

        return node.getElementsByClassName("quality-group").length > 0;
    }
}
