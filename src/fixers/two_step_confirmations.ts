import {SettingsObject} from "../settings.js";
import {INetworkAware, IStateAware} from "./base.js";
import {FLApiInterceptor} from "../api_interceptor.js";
import {Branch, Storylet} from "../game_components.js";
import {GameStateController} from "../game_state.js";

const FAKE_BRANCH_ID_THRESHOLD = 77_000_000;
const FAKE_BRANCH_ID_CEILING = 87_000_000;
const CONFIRMATION_BRANCH_ID = FAKE_BRANCH_ID_THRESHOLD - 1;

const DANGEROUS_BRANCHES = [
    252104, // Dismissing the Grizzled Veteran
    252056, // Abandoning Khaganian Intrigue

    // Various storylets concerned with placement of the Tracklayers City
    251105,
    251107,
    251108,
    251109,
    251110,
    251111,
    251112,

    63707 /* Nadir: Revolutionaries */,
    63708 /* Nadir: Hell */,
    63709 /* Nadir: The Great Game */,
    63710 /* Nadir: Urchins */,
    120893 /* Noman Listen */,
    120891 /* Noman Sense of an Ending */,
    119965 /* Legendary Charisma */,
    119967 /* Invisible Eminence */,
    119963 /* Extraordinary Mind */,
    119968 /* Shattering Force */,
    4858 /* Music-Hall Singer ('borrow' money) */,
    4859 /* Music-Hall Singer (end acquaintance) */,
    4939 /* Repentent Forger */,
    4943 /* Wry Functionary */,
    4947 /* Regretful Soldier */,
    11124 /* AoB: The Conscience of Empire; An agent of the masters; Help cover up the sordid business */,
    11122 /* AoB: The Conscience of Empire; The Unionist; Join the hunt */,
    11127 /* AoB: The Conscience of Empire; Doing the rounds; Tell them the truth */,
    11126 /* AoB: The Conscience of Empire; The course of love; Help keep them together */,
    11129 /* AoB: The Conscience of Empire; A night of desperate ambushes; Wade in with the neddy men */,
    11132 /* AoB: The Conscience of Empire; Encryption of a sort; See that the messages arrive safely */,
    11134 /* AoB: The Conscience of Empire; A strong box; Tell the gentlemen in blue... */,
    6787 /* Criminals: Consult with a master thief */,
    6789 /* Docks: Fencing lessons with a Dashing Captain */,
    6791 /* Bohemians: Take tea with a Reclusive Novelist */,
    6793 /* Hell: Speak with a senior deviless */,
    6796 /* Revolutionaries: And now... bombs! */,
    6798 /* Urchins: Out you go, longshanks */,
    6800 /* Church: Attend a private lecture given by the Bishop of Southwark */,
    6802 /* Contables: Attend a class given by the Implacable Detective */,
    6804 /* Great Game: Learn more at the carnival */,
    6806 /* Tomb-Colonies: Spar with a Black Ribbon Duellist */,
    6810 /* Society: Take port with the Veteran Privy Counsellor */,
    240632 /* Loan out the Clay Sedan Chair */,
    240633 /* Loan out the Velocipede to an Importunate Borrower */,
    240634 /* Loan out the Respectable Landau */,
    246248 /* Loan out the Ratwork Velocipede */,
    247983 /* Loan out the Obdurate Stallion */,
    249469 /* Awaken from a familiar dream (Eastern Wind) */,
    249478 /* Awaken from a familiar dream (Northern Wind) */,
    249503 /* Awaken from a familiar dream (Southern Wind) */,
    5059 /* Start SEEKING in the Forgotten Quarter */,
    8788 /* Leave parties early */,
    120548 /* Convert Tears of the Bazaar into Master's Blood */,
    120738 /* Throw the Amanuensis out on his oily little ear */,
    121107 /* Don't sell your soul at Sackmas */,
    205784 /* A Reputation of Some Importance: Another Way */,
    246280 /* Adulterine Castle: Leave through the Mirror-Marches */,

    // TODO: Re-enable it when support for protecting cards is added
    // 18162,  /* A Flash of White */
    // 18164,  /* The Mournfully Rubbery Instrument */
    // 18165,  /* A Raggedy Creature */
    // 13368,  /* A Little Omen (mood) */
    // 13373,  /* A Dusty Bookshop (mood) */
    // 15360,  /* Disgraceful Spectacle */
    // 18168,  /* The Skin of the Bazaar */
    // 21762,  /* A Visit */
    // 99374,  /* An Unsigned Message */
    // 122163,  /* A Dream of Blood */
    // 311724,  /* A Dream of Roses */
    // 7490,  /* Your sprouting companion */
    // 7493,  /* Your green lodger */
    // 7496,  /* Your green project */
    // 7687,  /* Is it fruiting? */
    // 7690,  /* Taking care of your green friend */
    // 7693,  /* A well-rooted plant */
    // 7696,  /* As big as your head */
    // 7699,  /* Sleep is becoming a problem */
    // 7702,  /* Your plant is singing */
];

const CHOICE_HAS_BEEN_MADE_TEXT = "Okay, well, sure.<br><br><b><i>Select this option to proceed with your original choice.</i></b>";

const RAINCHECK_TEXT = "That's okay, no pressure, time is on your side. Rain check?<br><br>" +
    "<b><i>Choosing this option will take you back to the original storylet.</i></b>";

const JOHN_WICK_QUOTE_TEXT: string = "<i>" +
    "\"Have you thought this through? I mean, chewed down to the bone? You got out once. You dip so much " +
    "as a pinky back into this pond... you may well find something reaches out... and drags you back " +
    "into its depths.\"</i><br><br><b><i>\"Small Mercies\" extension has detected that you chose a branch which may cost you " +
    "actions and/or resources if played unintentionally. Do you really want to do this?</i></b>";

export class TwoStepConfirmationsFixer implements INetworkAware, IStateAware {
    private showConfirmations = true;
    private currentStoryletContents: any = {};
    private currentActions = 0;

    applySettings(settings: SettingsObject): void {
        this.showConfirmations = settings.two_step_confirmations as boolean;
    }

    linkState(state: GameStateController): void {
        state.onActionsChanged((state, actions) => {
            this.currentActions = actions;
        });
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/begin", (request, response) => {
            this.currentStoryletContents = structuredClone(response);
        });

        interceptor.onResponseReceived("/api/storylet", (request, response) => {
            this.currentStoryletContents = structuredClone(response);
        });

        interceptor.onRequestSent("/api/storylet/choosebranch", (request) => {
            if (!this.showConfirmations) {
                return null;
            }

            const confirmationStorylet = new Storylet(CONFIRMATION_BRANCH_ID, "<i>Book of Wick</i>, John 41:53")
                .description(JOHN_WICK_QUOTE_TEXT)
                .image("candleblack")
                .category("SinisterZee");

            if (DANGEROUS_BRANCHES.includes(request.branchId)) {
                const yesBranch = new Branch(FAKE_BRANCH_ID_THRESHOLD + request.branchId, "YES!")
                    .description(CHOICE_HAS_BEEN_MADE_TEXT)
                    .image("well")
                    .actionCost(0);
                const noBranch = new Branch(CONFIRMATION_BRANCH_ID, "...No.")
                    .description(RAINCHECK_TEXT)
                    .image("eye")
                    .actionCost(0);

                confirmationStorylet.addBranch(noBranch);
                confirmationStorylet.addBranch(yesBranch);

                return {
                    actions: this.currentActions,
                    canChangeOutfit: true,
                    isSuccess: true,
                    phase: "In",
                    storylet: confirmationStorylet.build(),
                };
            }

            if (request.branchId === CONFIRMATION_BRANCH_ID) {
                return this.currentStoryletContents;
            }

            if (request.branchId > FAKE_BRANCH_ID_THRESHOLD && request.branchId < FAKE_BRANCH_ID_CEILING) {
                request.branchId -= FAKE_BRANCH_ID_THRESHOLD;
                return null;
            }
        });
    }
}
