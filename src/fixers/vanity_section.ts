import {INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IQuality} from "../interfaces";

const VANITY_QUALITY_IDS = [
    142587, // A Historian of the Neath
    142894, // A Hunter of Zee Beasts
    144063, // A Prolific Pirate
    143869, // A Synthetic Philosopher
    144029, // Crate Conveyor
    142585, // Dedicated Brawler
    140974, // Dream-Trophies of Parabola
    142586, // Fabricator of Past Lives
    141532, // Familiarity with the Carpenter's Granddaughter
    142032, // Meals Served at Station VIII
    142565, // Oneiropomp
    142505, // Painter of Fine Art
    140888, // Palaeontologist

    // 143753, // Palaeozoologist (does not yet have QLDs)

    143306, // Prolific Advertiser
    140904, // Record of Successful Forgery
    143573, // Scintillack Dreaming

    // 142753, // Strength of your Khaganian Network (does not yet have QLDs)

    127253, // Teaching Reputation of Your Laboratory
    127257, // The Prestige of your Laboratory
];

export class VanitySectionFixer implements INetworkAware {
    showVanitySection = false;

    applySettings(settings: SettingsObject): void {
        this.showVanitySection = settings.show_vanity_section as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/app/categories", (request, response) => {
            if (!this.showVanitySection) {
                return;
            }

            response.status.push("Vanity");

            response.categories.push({
                displayName: "Vanity",
                isExclusive: false,
                category: "Vanity",
                nature: "Status",
                shouldDisplayLevel: true,
            });
        });

        interceptor.onResponseReceived("/api/character/myself", (request, response) => {
            if (!this.showVanitySection) {
                return;
            }

            const extractedVanities: IQuality[] = [];

            for (const category of response.possessions) {
                for (const quality of category.possessions) {
                    if (VANITY_QUALITY_IDS.indexOf(quality.id) === -1) {
                        continue;
                    }

                    // FIXME: Also remove the quality from the original category (make it configurable?).
                    extractedVanities.push(quality);
                }
            }

            response.possessions.push({
                categories: ["Vanity"],
                name: "Vanities",
                possessions: extractedVanities,
            });

            return;
        });
    }
}
