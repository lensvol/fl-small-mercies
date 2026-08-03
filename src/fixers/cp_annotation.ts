import {INetworkAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IChooseBranchResponse} from "../interfaces";
import {GameState, GameStateController, Quality} from "../game_state";
import {sumArithmeticSequence} from "../utils";
import {debug} from "../logging";
import {PYRAMIDAL_QUALITY_IDS} from "../datasets/qualities";

const CHANGE_POINTS_REGEX = /(\d+) change points*, (\d+) more needed to reach level (\d+)/;

function calculateChangePoints(quality: Quality): number {
    if (PYRAMIDAL_QUALITY_IDS.includes(quality.qualityId)) {
        return sumArithmeticSequence(quality.level);
    } else {
        return quality.effectiveLevel;
    }
}

export class ChangePointsAnnotationFixer implements INetworkAware, IStateAware {
    private qualityChangePoints: Map<number, number> = new Map();
    private approximatedQualities: Set<number> = new Set();

    applySettings(settings: SettingsObject): void {}

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/choosebranch", (_, response: IChooseBranchResponse) => {
            for (const message of response.messages || []) {
                if (message.type === "PyramidQualityChangeMessage" || message.type === "StandardQualityChangeMessage") {
                    if (message.possession.nature === "Thing") {
                        continue;
                    }

                    if (message.possession.allowedOn === "World") {
                        continue;
                    }

                    let extractedPoints = 0;
                    const matches = message.tooltip?.match(CHANGE_POINTS_REGEX);
                    if (matches) {
                        const [_, currentCP, _pointsNeeded, _nextLevel] = matches;
                        extractedPoints = Number.parseInt(currentCP);
                    }

                    const quality = Quality.fromJson(message.possession);
                    const calculatedPoints = calculateChangePoints(quality);
                    const oldPoints = this.qualityChangePoints.get(quality.qualityId) || 0;
                    const delta = calculatedPoints + extractedPoints - oldPoints;

                    if (oldPoints !== calculatedPoints + extractedPoints) {
                        this.qualityChangePoints.set(message.possession.id, calculatedPoints + extractedPoints);

                        // Displaying changes when they are already noted is superfluous
                        if (
                            !message.message.startsWith("You've gained") &&
                            !message.message.startsWith("You now have")
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
                if (message.type === "QualityExplicitlySetMessage") {
                    const calculatedPoints = calculateChangePoints(Quality.fromJson(message.possession));
                    this.qualityChangePoints.set(message.possession.id, calculatedPoints);
                }
            }

            return response;
        });
    }

    linkState(state: GameStateController): void {
        state.onCharacterDataLoaded((state: GameState) => {
            for (const quality of state.enumerateQualities()) {
                let calculatedPoints = calculateChangePoints(quality);

                if (quality.progressAsPercentage === -1) {
                    // Sadly /myself response does not provide any information about the progress to the next level,
                    // so we will have to explicitly inform user of the fact that we approximate initial value.
                    this.approximatedQualities.add(quality.qualityId);
                } else if (quality.progressAsPercentage > 0 && PYRAMIDAL_QUALITY_IDS.includes(quality.qualityId)) {
                    calculatedPoints += Math.round((quality.level + 1) * (quality.progressAsPercentage / 100));
                }

                this.qualityChangePoints.set(quality.qualityId, calculatedPoints);
            }
        });
    }
}
