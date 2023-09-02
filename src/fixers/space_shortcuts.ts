import {INetworkAware, IStateAware} from "./base.js";
import {SettingsObject} from "../settings.js";
import {DO_NOT_CARE, FLApiInterceptor, setFakeXhrResponse, SPECIAL_HANDLING} from "../api_interceptor.js";
import {FLApiClient} from "../api_client.js";
import {IBeginStoryletRequest} from "../interfaces.js";
import {GameStateController, StoryletPhases} from "../game_state.js";

const LEAVE_LAB_WITH_CAMP_STORYLET_ID = 322853;
const LEAVE_LAB_WITHOUT_CAMP_STORYLET_ID = 321488;
// FIXME: Replace with reserverd IDs when they are implemented
const FAKE_LEAVE_WITH_CAMP_STORYLET_ID = 778_777_777;
const FAKE_LEAVE_WITHOUT_STORYLET_ID = 778_777_778;

const STORYLET_TO_BRANCH_SHORTCUTS: Map<number, number> = new Map([
    // Put to Zee! -> Into the captain's cabin
    [335704, 246387],
    // The Back Stair to the Bone Market -> Take the door on the left
    [325618, 239296],
    // Leave the Bone Market -> Relatively unnoticed
    [330284, 242571],
    // Stop by your Laboratory -> Go on in
    [321218, 236273],
    // Leave Your Lab -> See the rest of the city for a change (with Base-Camp)
    [LEAVE_LAB_WITH_CAMP_STORYLET_ID, 237415],
    // Leave Your Lab -> See the rest of the city for a change (w/o Base-Camp)
    [LEAVE_LAB_WITHOUT_CAMP_STORYLET_ID, 236471],
    // The Rat Market -> Enter the Rat Market again
    [343815, 253288],
    // Leave the Rat Market -> Back to the Flit
    [343819, 252247],
]);

export class SpaceShortcutFixer implements INetworkAware, IStateAware {
    shortcutSpecificBranches = false;
    apiClient: FLApiClient | null = null;

    hasBaseCamp = false;
    inLaboratory = false;

    applySettings(settings: SettingsObject): void {
        this.shortcutSpecificBranches = settings.shortcut_specific_branches as boolean;
    }

    createBackToCityStorylet() {
        return {
            name: "See the rest of the city for a change",
            // FIXME: Vary description based on the "Number of Workers" quality value
            teaser: "Your research will just have to do without you for a week.",
            category: "Unspecialised",
            qualityRequirements: [],
            deckType: "Always",
            image: "door",
            id: this.hasBaseCamp ? FAKE_LEAVE_WITH_CAMP_STORYLET_ID : FAKE_LEAVE_WITHOUT_STORYLET_ID,
        };
    }

    modifyLaboratoryStorylet(response: Record<string, any>) {
        if (response.phase === StoryletPhases.Available) {
            response.storylets.push(this.createBackToCityStorylet());
        } else if (response.phase === StoryletPhases.In) {
            response.storylet.childBranches = response.storylet.childBranches.filter((branch: Record<string, any>) => branch.id !== 237415 && branch.id !== 236471);
        }
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        this.apiClient = new FLApiClient();

        interceptor.onRequestSent("/api/storylet/begin", (request, data) => {
            if (!this.shortcutSpecificBranches) {
                return DO_NOT_CARE;
            }

            const beginRequest = data as unknown as IBeginStoryletRequest;
            const branchShortcut = STORYLET_TO_BRANCH_SHORTCUTS.get(beginRequest.eventId);

            let eventId = beginRequest.eventId;
            if (eventId === FAKE_LEAVE_WITH_CAMP_STORYLET_ID) {
                eventId = LEAVE_LAB_WITH_CAMP_STORYLET_ID;
            } else if (eventId === FAKE_LEAVE_WITHOUT_STORYLET_ID) {
                eventId = LEAVE_LAB_WITHOUT_CAMP_STORYLET_ID;
            }

            if (branchShortcut) {
                this.apiClient?.beginStorylet(beginRequest.eventId).then((_) => {
                    this.apiClient?.chooseBranch(branchShortcut).then((json) => {
                        setFakeXhrResponse(request, 200, json);
                    });
                });

                return SPECIAL_HANDLING;
            }

            return DO_NOT_CARE;
        });

        const laboratoryModifier = (_request: XMLHttpRequest, response: any) => {
            if (!this.shortcutSpecificBranches) {
                return;
            }

            if (this.inLaboratory) {
                this.modifyLaboratoryStorylet(response);
            }
        };

        interceptor.onResponseReceived("/api/storylet", laboratoryModifier);
        interceptor.onResponseReceived("/api/storylet/goback", laboratoryModifier);
        interceptor.onResponseReceived("/api/storylet/begin", laboratoryModifier);
    }

    linkState(state: GameStateController): void {
        state.onCharacterDataLoaded((state) => {
            this.hasBaseCamp = state.hasQuality("Story", "Access to a Parabolan Base-Camp");
        });

        state.onLocationChanged((_state, location) => {
            this.inLaboratory = location.setting.name === "Science Laboratory";
        });
    }
}
