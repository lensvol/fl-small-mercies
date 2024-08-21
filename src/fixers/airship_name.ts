import {IMutationAware} from "./base";
import {SettingsObject} from "../settings";
import {getSingletonByClassName} from "../utils";

export class AirshipNameFixer implements IMutationAware {
    private fixOldAirshipName = false;

    applySettings(settings: SettingsObject): void {
        this.fixOldAirshipName = settings.old_airship_fix as boolean;
    }

    checkEligibility(node: HTMLElement): boolean {
        const needFixAnything = this.fixOldAirshipName;
        if (!needFixAnything) {
            return false;
        }

        return node.getElementsByClassName("quality-group").length > 0;
    }

    onNodeAdded(node: HTMLElement): void {
        const qualityGroups = node.getElementsByClassName("quality-group");
        // if found, we are on the "Myself" tab
        if (qualityGroups.length < 0) {
            return;
        }

        for (const element of qualityGroups) {
            const group = element as HTMLElement;

            const qualityIcons = group.getElementsByClassName("quality-item__icon");
            const oldAirshipQualityIcon = Array.from(qualityIcons).find(
                (icon) => (icon as HTMLElement).dataset.branchId === "144464"
            );

            if (!oldAirshipQualityIcon || !oldAirshipQualityIcon.parentElement) {
                continue;
            }

            const qualityName = getSingletonByClassName(oldAirshipQualityIcon.parentElement, "quality-item__name");
            if (!qualityName) {
                continue;
            }

            // Even though backend returns proper HTML in the "name" field, frontend sanitizes it with prejudice.
            qualityName.innerHTML = qualityName.innerHTML.replace("&lt;i&gt;", "<i>").replace("&lt;/i&gt;", "</i>");
        }
    }

    onNodeRemoved(_node: HTMLElement): void {
        // Do nothing if DOM node is removed.
    }
}
