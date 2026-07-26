import {INetworkAware, IStateAware} from "./base";
import {SettingsObject} from "../settings";
import {FLApiInterceptor} from "../api_interceptor";
import {IChooseBranchResponse} from "../interfaces";
import {GameState, GameStateController, Quality} from "../game_state";
import {sumArithmeticSequence} from "../utils";
import {debug} from "../logging";
import {PYRAMIDAL_QUALITY_IDS} from "../datasets/qualities";

const CHANGE_POINTS_REGEX = /(\d+) change points, (\d+) more needed to reach level (\d+)/;

function calculatePyramidalChangePoints(quality: Quality): number {
    return (
        sumArithmeticSequence(quality.level) + Math.round((quality.level + 1) * (quality.progressAsPercentage / 100))
    );
}

export class ChangePointsAnnotationFixer implements INetworkAware, IStateAware {
    private qualityChangePoints: Map<number, number> = new Map();

    applySettings(settings: SettingsObject): void {}

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/choosebranch", (_, response: IChooseBranchResponse) => {
            for (const message of response.messages || []) {
                if (message.type !== "PyramidQualityChangeMessage") {
                    // For the moment we are only concerned with the change of existing pyramidal qualities.
                    continue;
                }
            }
        });
    }

    linkState(state: GameStateController): void {
        state.onCharacterDataLoaded((state: GameState) => {
            for (const quality of state.enumerateQualities()) {
                if (quality.progressAsPercentage === -1) {
                    // This quality is not progressing via change points.
                    continue;
                }

                if (PYRAMIDAL_QUALITY_IDS.includes(quality.qualityId)) {
                    const calculatedPoints = calculatePyramidalChangePoints(quality);
                    this.qualityChangePoints.set(quality.qualityId, calculatedPoints);
                    debug(`CP points for ${quality.name}: ${calculatedPoints}`, quality);
                } else {
                    this.qualityChangePoints.set(quality.qualityId, quality.level);
                    debug(`CP points for ${quality.name}: ${quality.level}`, quality);
                }
            }
        });

        state.onQualityChanged((_state: GameState, _previous, quality) => {
            if (quality.progressAsPercentage === -1) {
                return;
            }

            const oldPoints = this.qualityChangePoints.get(quality.qualityId) || 0;
            if (PYRAMIDAL_QUALITY_IDS.includes(quality.qualityId)) {
                const calculatedPoints = calculatePyramidalChangePoints(quality);
                this.qualityChangePoints.set(quality.qualityId, calculatedPoints);
                debug(
                    `Delta for quality ${quality.name}: ${calculatedPoints} - ${oldPoints} = ${
                        calculatedPoints - oldPoints
                    } CP`
                );
            } else {
                this.qualityChangePoints.set(quality.qualityId, quality.level);
                debug(
                    `Delta for quality ${quality.name}: ${quality.level} - ${oldPoints} = ${
                        quality.level - oldPoints
                    } CP`
                );
            }
        });
    }
}
