import {SettingsSchema} from "./settings";
import {ICustomSnippet} from "./interfaces";

const EXTENSION_NAME = "FL Small Mercies";
const EXTENSION_ID = "FL_SM";

const MSG_TYPE_SAVE_SETTINGS = `${EXTENSION_ID}_saveSettings`;
const MSG_TYPE_CURRENT_SETTINGS = `${EXTENSION_ID}_currentSettings`;

const SETTINGS_SCHEMA: SettingsSchema = [
    {
        title: "UI Fixes",
        settings: {
            fix_journal_navigation: {
                description: "Fix color and alignment of the navigation buttons in Journal.",
                default: true,
            },
            discrete_scrollbars: {
                description: "Remove progress bars from discrete sidebar qualities.",
                default: true,
            },
            maxed_out_scrollbars: {
                description: "Remove progress bars from maxed-out sidebar qualities.",
                default: true,
            },
            scrip_icon: {
                description: "Add Hinterlands Scrip Icon to a sidebar indicator.",
                default: true,
            },
            sort_city_mysteries: {
                description: "Sort 'Mystery of the ... City' qualities.",
                default: true,
            },
            sort_discordance_seals: {
                description: "Sort ███████████ █████.",
                default: true,
            },
            sort_dreams: {
                description:
                    "Sort advanced dreams (Stormy-Eyed, Seeing in Apocyan, Haunted by Stairs) below their base qualities.",
                default: true,
            },
            sort_neathbow_boxes: {
                description: "Sort Neathbow boxes in your inventory.",
                default: true,
            },
            fix_empty_requirements: {
                description: "Remove empty requirements bar in social storylets.",
                default: true,
            },
            hide_nonlocal_qualities: {
                description: "Hide qualities not appropriate for the current location.",
                default: true,
            },
            track_shop_transactions: {
                description: "Update relevant currencies on shop transactions.",
                default: true,
            },
        },
    },
    {
        title: "UI Improvements",
        settings: {
            add_thousands_separator: {
                description: "Add a comma after thousands in the currency indicators.",
                default: true,
            },
            remove_mask_banner: {
                description: "Remove the 'Mask of the Rose' banner.",
                default: false,
            },
            remove_sidebar_snippets: {
                description: "Remove 'Snippets' from the right sidebar.",
                default: true,
            },
            add_profile_link: {
                description: "Add button that points to your profile.",
                default: true,
            },
            display_favour_tracker: {
                description: "Display Favours in the right sidebar.",
                default: true,
            },
            auto_scroll_back: {
                description: "Auto-scroll to the storylet after choosing a branch.",
                default: true,
            },
            quick_share_button: {
                description: "Replace the usual 'Share snippet' button with a quicker alternative.",
                default: true,
            },
            display_more_currencies: {
                description: "Show more currencies in the left sidebar.",
                default: true,
            },
            two_step_confirmations: {
                description: "Protect certain 'dangerous' branches with a two-step confirmation process.",
                default: false,
            },
            hide_single_item_icon: {
                description: "Hide the '1' icon next to single items in your inventory.",
                default: true,
            },
            shop_price_totals: {
                description: "Display total value when hovering over 'Sell' button.",
                default: true,
            },
            shortcut_another_time: {
                description: "Shortcut 'Another time' branch in Labyrinth of Tigers.",
                default: true,
            },
            persistent_premium: {
                description: 'Move gold-framed storylets into "Fifth City Stories".',
                default: false,
            },
            shortcut_specific_branches: {
                description: "Shortcut travel between Laboratory / Port / Bone Market.",
                default: false,
            },
        },
    },
    {
        title: "Whimsical stuff",
        settings: {
            ship_saver: {
                description: "Disable storylet that lets you sell your Ship.",
                default: true,
            },
            remove_plan_buttons: {
                description: "Remove the 'Plans' button & related buttonlets",
                default: false,
            },
            ascetic_mode: {
                description: "Remove both location banner and candles.",
                default: false,
            },
            remove_fate_counter: {
                description: "Remove Fate counter from the sidebar.",
                default: false,
            },
            show_af_year: {
                description: "Show After Fall years on Journal snippets.",
                default: false,
            },
            enable_khanate_oracle: {
                description: "Show prospects for recruitment when cycling 'Airs of Khanate'.",
                default: false,
            },
            top_exit_buttons: {
                description: "Show 'Perhaps Not' button at the top in storylets that have 4 branches or more.",
                default: false,
            },
        },
    },
    {
        title: "Fine-tuning",
        settings: {
            show_zero_favours: {
                description: "Show factions with zero Favours.",
                default: false,
            },
            scroll_back_behavior: {
                description: "Scroll back mode",
                default: "auto",
                choices: [
                    ["auto", "Instant"],
                    ["smooth", "Smooth"],
                ],
            },
            top_exit_buttons_always: {
                description: "Show the button regardless of the number of branches in a storylet.",
                default: false,
            },
            display_currencies_everywhere: {
                description: "Show indicators for additional currencies regardless of location.",
                default: false,
            },
        },
    },
];

const COMMUNITY_SNIPPETS: ICustomSnippet[] = [
    {
        author: "ApprehensiveStyle289",
        link: "https://www.reddit.com/user/ApprehensiveStyle289/",
        title: "Somewhere Deeper Down",
        description:
            "<p>They say that somewhere time has forgotten is a place that can't be remembered.</p>" +
            "<p>A place that can make you forget yourself and that turns you blind to all light.</p>" +
            "<p>A place where glimpses of distant time can be seen (not seen?).</p>" +
            "<p>A place the Masters can't touch.</p>" +
            "<p>A place where the Masters dump those deemed too troublesome.</p>" +
            "<p>A place dreamed up by those of darkness.</p>" +
            "<p>But surely, that's all just madmen's ravings?</p>" +
            "<p>How could one go to such a place and remember enough to tell the tale? But, who knows, something of " +
            "this could perhaps hold an inkling of truth.</p>",
    },
    {
        author: "TheFeshy",
        link: "https://www.reddit.com/user/ApprehensiveStyle289/",
        title: "In the dark",
        description:
            "<p>Londoners used to talk about the gloomy weather. Now they talk about the gloomy darkness. " +
            "Those that have been here the longest say that when your eyes finally adjust, you can " +
            "distinguish between various shades of the dark. Some shades, they say, are even colors unto " +
            "themselves. Colors you can't find on the Surface.</p>",
    },
    {
        author: "Autherial",
        link: "https://www.reddit.com/user/Autherial/",
        title: "Spirifer Shortage",
        description:
            "<p>There was a time when being a spirifer was considered a lucrative career. However, with the " +
            "opportunities in the Hinterlands and the mad dash for all things paleontological, rumor has it that " +
            "The Brass Embassy is looking for new ways to make the trade profitable again, lest the soulplucking scum" +
            "of London move on to more lucrative, and less morally questionable, professions.</p>",
    },
    {
        author: "idlistella",
        link: "https://www.reddit.com/user/idlistella/",
        title: "Tension among the Admiralty",
        description:
            "<p>Occasionally seen at gatherings of high society are a group of naval officers hailing from a base " +
            "far to the South. Identified by their darkened glasses, they exude a presence of positivity and " +
            "reassurance. There are whispers of the Optimistic Vice Admiral paying visits to religious " +
            "establishments, and the warmth of the Commodore is a welcome presence by most. " +
            "However, despite their ties to the Admiralty, there is clear tension between the higher echelons of " +
            "the Royal Navy and this division from the south.<p>",
    },
    {
        author: "eli_aitch",
        link: "https://www.reddit.com/u/eli_aitch/",
        title: "Here we go a-weaseling",
        description:
            "<p>Who wouldn’t want a weasel? They’re playful, skilled in competitions, and surprisingly learned in " +
            "mediæval textual history. Most of them are remarkably lucky little beggars. Some are talented in the " +
            "ways of battle.</p>" +
            "<p>(Some are talented in the ways of bringing you tribulation. But why mention those?)</p><p>Why " +
            "not adopt a few, or a few hundred? Just beware of that one song. Yes, it’s very catchy. But it might be" +
            " taken a little too literally.</p>",
    },
    {
        author: "TheMultiuniverse",
        link: "https://www.reddit.com/u/TheMultiuniverse/",
        title: "Irem",
        description:
            "<p>One day, she will rise from the zee.</p>" +
            "<p>One day, you will walk her shores and wander her streets.</p>" +
            "<p>One day, you will gaze upon her splendour.</p>" +
            "<p>One day, you will know the answers, then find the questions.</p>" +
            "<p>One day, you will forgive.</p>",
    },
    {
        author: "Fjoergyn_D",
        link: "https://www.reddit.com/u/Fjoergyn_D/",
        title: "Heart's Game",
        description:
            "<p>Since Mr Iron outlawed the game of Knife-and-Candle in 1894, Mr Hearts has recently taken over the old " +
            "Gamekeeper's Cottage in Watchmaker's Hill. They say it's a delightfully dangerous game of intrigue, " +
            "poison and gambits. They say it is played purely for the love of the game. But what is that woman " +
            "leaving the cottage carrying? Is that... a butcher's hook? Oh, my.<p></p>",
    },
    {
        author: "LairdOpusFluke",
        link: "https://www.reddit.com/u/LairdOpusFluke/",
        title: "Brawling for Biscuits",
        description:
            "During the time of The Great Sink a group of Bohemian Musicians gathered together to raise the spirits " +
            " of their fellow Londoners down at the docks. Their legendary performance lead to rumours of a tour " +
            "and even a collection of sheet music. Nothing has been heard of them since but the occasional bout of " +
            "fisticuffs are still known to break out in honour of their one, and so far only, impromptu concert.",
    },
    {
        author: "MasterOfBerserker",
        link: "https://www.reddit.com/u/MasterOfBerserker/",
        title: "Cats, Rats and Bats",
        description:
            "<p>Everyone knows cats can talk, and know a great many secrets. If you can catch one, they might " +
            " even share some of those secrets with you; though cat-chasing is hardly a noble pastime.</p>" +
            "<p>Some rats are just ordinary rats; as you would find on the surface, but others are Rattus Faber. " +
            'The "L.B.\'s", as they are known to Londoners, are thieves, soldiers, merchants, gunsmiths and some ' +
            "of the Neath's finest watchmakers.</p>" +
            "<p>The bats? Bats are just bats. They don't talk, or do anything but flap about, really. Honestly, " +
            "talking bats? That would just be silly.</p>",
    },
    {
        author: "PeterchuMC",
        link: "https://www.reddit.com/u/PeterchuMC/",
        title: "Hope in the Neath",
        description:
            "<p>There have been occasional sightings of a blue box in various locations around the Neath accompanied " +
            "by small outbursts of hope. Naturally, the Masters deny the existence of such a box and the tale has " +
            "spread among the Revolutionaries.</p> <p>Unfortunately, none of the factions have yet taken that up as their " +
            "guiding principle as they have other boxes to consider and hope doesn't always flourish beneath this " +
            "sky of stone.</p>",
    },
];

export {
    EXTENSION_NAME,
    EXTENSION_ID,
    MSG_TYPE_SAVE_SETTINGS,
    MSG_TYPE_CURRENT_SETTINGS,
    SETTINGS_SCHEMA,
    COMMUNITY_SNIPPETS,
};
