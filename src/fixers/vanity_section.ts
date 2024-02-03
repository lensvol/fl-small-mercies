import {INetworkAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IQuality} from "../interfaces";

const VANITY_QUALITY_IDS = [
    [777, 142587], // A Historian of the Neath
    [777, 142894], // A Hunter of Zee Beasts
    [777, 144063], // A Prolific Pirate
    [777, 143869], // A Synthetic Philosopher
    [777, 144029], // Crate Conveyor
    [777, 142585], // Dedicated Brawler
    [777, 140974], // Dream-Trophies of Parabola
    [777, 142586], // Fabricator of Past Lives
    [777, 141532], // Familiarity with the Carpenter's Granddaughter
    [777, 142032], // Meals Served at Station VIII
    [777, 142565], // Oneiropomp
    [777, 142505], // Painter of Fine Art
    [777, 140888], // Palaeontologist
    [777, 141368], // Barrister of the Evenlode

    // 143753], // Palaeozoologist (does not yet have QLDs)

    [777, 143306], // Prolific Advertiser
    [777, 140904], // Record of Successful Forgery
    [777, 143573], // Scintillack Dreaming

    // 142753], // Strength of your Khaganian Network (does not yet have QLDs)

    [777, 127253], // Teaching Reputation of Your Laboratory
    [777, 127257], // The Prestige of your Laboratory

    [21, 510], // A Scholar of the Correspondence
    [21, 142865], // Twilit Smuggler
    [21, 141626], // Defender of the Public Safety
    [21, 134835], // A Poet-Laureate
    [1, 141287], // Paramount Presence of the Ancient Regime
    [1, 135060], // A Weaseller
    [1, 144550], // A Woeseller
    [1, 125026], // A Private Tattoo of your Noman, Inscribed in Gant
    [1, 144210], // Memories of a Doubled Spring
    [1, 142640], // Acquainted: The Lion Sacrificial
    [1, 143192], // A Mystery of the Fifth City
    [1, 143589], // A Purveyor of Cruel and Unusual Cheeses

    [55, 133830], // Bohemians
    [55, 121992], // Criminals
    [55, 132801], // Hell
    [55, 133832], // Revolutionaries
    [55, 126001], // Rubbery Men
    [55, 133834], // Society
    [55, 133828], // The Church
    [55, 125528], // The Docks
    [55, 133045], // The Great Game
    [55, 125787], // The Tomb-Colonies
    [55, 129666], // The Urchins
    [55, 144064], // Respected by Corsairs
];

export class VanitySectionFixer implements INetworkAware {
    showVanitySection = false;
    onlyCompletedVanities = true;

    applySettings(settings: SettingsObject): void {
        this.showVanitySection = settings.show_vanity_section as boolean;
        this.onlyCompletedVanities = settings.only_completed_vanities as boolean;
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
                    const descriptor = VANITY_QUALITY_IDS.find((descriptor) => descriptor[1] == quality.id);
                    if (!descriptor) continue;

                    const boundary = this.onlyCompletedVanities ? descriptor[0] : 1;
                    if (boundary > quality.level) continue;

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
