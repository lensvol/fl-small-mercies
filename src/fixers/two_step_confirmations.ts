import {SettingsObject} from "../settings.js";
import {INetworkAware} from "./base.js";
import {FLApiInterceptor} from "../api_interceptor.js";
import {Branch, Storylet} from "../game_components.js";

const DANGEROUS_BRANCHES = [
    9425, // "Doing the decent thing"

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

    63707,  /* Nadir: Revolutionaries */
    63708,  /* Nadir: Hell */
    63709,  /* Nadir: The Great Game */
    63710,  /* Nadir: Urchins */
    120893,  /* Noman Listen */
    120891,  /* Noman Sense of an Ending */
    119965,  /* Legendary Charisma */
    119967,  /* Invisible Eminence */
    119963,  /* Extraordinary Mind */
    119968,  /* Shattering Force */
    4858,  /* Music-Hall Singer ('borrow' money) */
    4859,  /* Music-Hall Singer (end acquaintance) */
    4939,  /* Repentent Forger */
    4943,  /* Wry Functionary */
    4947,  /* Regretful Soldier */
    11124,  /* AoB: The Conscience of Empire; An agent of the masters; Help cover up the sordid business */
    11122,  /* AoB: The Conscience of Empire; The Unionist; Join the hunt */
    11127,  /* AoB: The Conscience of Empire; Doing the rounds; Tell them the truth */
    11126,  /* AoB: The Conscience of Empire; The course of love; Help keep them together */
    11129,  /* AoB: The Conscience of Empire; A night of desperate ambushes; Wade in with the neddy men */
    11132,  /* AoB: The Conscience of Empire; Encryption of a sort; See that the messages arrive safely */
    11134,  /* AoB: The Conscience of Empire; A strong box; Tell the gentlemen in blue... */
    6787,  /* Criminals: Consult with a master thief */
    6789,  /* Docks: Fencing lessons with a Dashing Captain */
    6791,  /* Bohemians: Take tea with a Reclusive Novelist */
    6793,  /* Hell: Speak with a senior deviless */
    6796,  /* Revolutionaries: And now... bombs! */
    6798,  /* Urchins: Out you go, longshanks */
    6800,  /* Church: Attend a private lecture given by the Bishop of Southwark */
    6802,  /* Contables: Attend a class given by the Implacable Detective */
    6804,  /* Great Game: Learn more at the carnival */
    6806,  /* Tomb-Colonies: Spar with a Black Ribbon Duellist */
    6810,  /* Society: Take port with the Veteran Privy Counsellor */
    240632,  /* Loan out the Clay Sedan Chair */
    240633,  /* Loan out the Velocipede to an Importunate Borrower */
    240634,  /* Loan out the Respectable Landau */
    246248,  /* Loan out the Ratwork Velocipede */
    247983,  /* Loan out the Obdurate Stallion */
    249469,  /* Awaken from a familiar dream (Eastern Wind) */
    249478,  /* Awaken from a familiar dream (Northern Wind) */
    249503,  /* Awaken from a familiar dream (Southern Wind) */
    5059,  /* Start SEEKING in the Forgotten Quarter */
    8788,  /* Leave parties early */
    120548,  /* Convert Tears of the Bazaar into Master's Blood */
    120738,  /* Throw the Amanuensis out on his oily little ear */
    121107,  /* Don't sell your soul at Sackmas */
    205784,  /* A Reputation of Some Importance: Another Way */
    246280,  /* Adulterine Castle: Leave through the Mirror-Marches */
];

export class TwoStepConfirmationsFixer implements INetworkAware {
    private showConfirmations: boolean = true;
    private currentStoryletContents: any = {};

    applySettings(settings: SettingsObject): void {
        this.showConfirmations = settings.two_step_confirmations as boolean;
    }

    checkEligibility(_node: HTMLElement): boolean {
        return this.showConfirmations;
    }

    linkNetworkTools(interceptor: FLApiInterceptor): void {
        interceptor.onResponseReceived("/api/storylet/begin", (request, response) => {
            this.currentStoryletContents = structuredClone(response);
        });

        interceptor.onRequestSent("/api/storylet/choosebranch", (request) => {
            const confirmationStorylet = new Storylet(776_777_777, "Have you thought this through?")
                .description("I mean, really chewed it down to the bone?");

            if (DANGEROUS_BRANCHES.includes(request.branchId)) {
                const yesBranch = new Branch(776_777_778 + request.branchId, "YES.")
                    .image("well");
                const noBranch = new Branch(776_777_777, "...No?");

                confirmationStorylet.addBranch(noBranch);
                confirmationStorylet.addBranch(yesBranch);

                return {
                    actions: 42,
                    canChangeOutfit: true,
                    isSuccess: true,
                    phase: "In",
                    storylet: confirmationStorylet.build()
                }
            }

            if (request.branchId === 776_777_777) {
                return this.currentStoryletContents;
            }

            if (request.branchId > 776_777_778) {
                request.branchId -= 776_777_778;
                return null;
            }
        })
    }

}
