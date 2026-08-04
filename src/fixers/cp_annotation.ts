import {INetworkAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IChooseBranchResponse} from "../interfaces";
import {GameState, GameStateController, Quality} from "../game_state";
import {sumArithmeticSequence} from "../utils";
import {PYRAMIDAL_QUALITY_IDS} from "../datasets/qualities";

const CHANGE_POINTS_REGEX = /(\d+) change points*, (\d+) more needed to reach level (\d+)/;
// TODO: Move it to qualities.ts
const BASE_QUALITIES_IDS = [
    209, // Watchful
    210, // Shadowy
    211, // Dangerous
    212, // Persuasive
];

function calculateChangePoints(level: number, cap: number = 50): number {
    if (level > cap) {
        return sumArithmeticSequence(cap) + (level - cap) * cap;
    }

    return sumArithmeticSequence(level);
}

export class ChangePointsAnnotationFixer implements INetworkAware, IStateAware {
    private qualityChangePoints: Map<number, number> = new Map();
    private approximatedQualities: Set<number> = new Set();
    private annotateChangePoints: boolean = false;

    applySettings(settings: SettingsObject): void {
        this.annotateChangePoints = settings.annotate_cp_changes as boolean;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/choosebranch", (_, response: IChooseBranchResponse) => {
            if (!this.annotateChangePoints) {
                return;
            }

            for (const message of response.messages || []) {
                if (message.type === "PyramidQualityChangeMessage") {
                    let extractedPoints = 0;
                    const matches = message.tooltip?.match(CHANGE_POINTS_REGEX);
                    if (matches) {
                        const [_, currentCP, _pointsNeeded, _nextLevel] = matches;
                        extractedPoints = Number.parseInt(currentCP);
                    }

                    const quality = Quality.fromJson(message.possession);
                    const cap = BASE_QUALITIES_IDS.includes(quality.qualityId) ? 70 : 50;
                    const calculatedPoints = calculateChangePoints(quality.level, cap);
                    let oldPoints = this.qualityChangePoints.get(quality.qualityId) || 0;
                    if (!oldPoints) {
                        oldPoints =
                            calculateChangePoints(message.progressBar.leftScore, cap) +
                            Math.round(
                                (quality.level > cap ? cap : quality.level + 1) *
                                    (message.progressBar.startPercentage / 100)
                            );
                    }

                    const delta = calculatedPoints + extractedPoints - oldPoints;

                    if (oldPoints !== calculatedPoints + extractedPoints) {
                        this.qualityChangePoints.set(message.possession.id, calculatedPoints + extractedPoints);

                        if (
                            // Displaying changes when they are already noted is superfluous
                            message.message.startsWith("You've gained a new quality") ||
                            (!message.message.startsWith("You've gained") &&
                                !message.message.startsWith("You now have"))
                        ) {
                            let approx = "";
                            if (this.approximatedQualities.has(quality.qualityId)) {
                                approx = "approximately ";
                                this.approximatedQualities.delete(quality.qualityId);
                            }
                            const annotation = `(${approx}${delta > 0 ? "+" : "-"}${Math.abs(delta)} CP)`;
                            message.message = `${message.message} <em>${annotation}</em>`;
                        }
                    }
                }
                if (
                    message.type === "QualityExplicitlySetMessage" &&
                    PYRAMIDAL_QUALITY_IDS.has(message.possession.id)
                ) {
                    const cap = BASE_QUALITIES_IDS.includes(message.possession.id) ? 70 : 50;
                    const calculatedPoints = calculateChangePoints(message.possession.level, cap);
                    this.qualityChangePoints.set(message.possession.id, calculatedPoints);
                }
            }

            return response;
        });
    }

    linkState(state: GameStateController): void {
        state.onCharacterDataLoaded((state: GameState) => {
            if (!this.annotateChangePoints) {
                return;
            }

            for (const quality of state.enumerateQualities()) {
                // If we know of that value already, then we also probably now it with more precision
                if (this.qualityChangePoints.has(quality.qualityId)) {
                    continue;
                }

                if (!PYRAMIDAL_QUALITY_IDS.has(quality.qualityId)) {
                    continue;
                }

                const cap = BASE_QUALITIES_IDS.includes(quality.qualityId) ? 70 : 50;
                let calculatedPoints = calculateChangePoints(quality.level, cap);

                if (quality.progressAsPercentage === -1) {
                    // Sadly /myself response does not provide any information about the progress to the next level,
                    // so we will have to explicitly inform user of the fact that we approximate initial value.
                    this.approximatedQualities.add(quality.qualityId);
                } else if (quality.progressAsPercentage > 0) {
                    calculatedPoints += Math.round(
                        (quality.level > cap ? cap : quality.level + 1) * (quality.progressAsPercentage / 100)
                    );
                }

                this.qualityChangePoints.set(quality.qualityId, calculatedPoints);
            }
        });
    }
}
