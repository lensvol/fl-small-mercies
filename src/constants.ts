import {SettingsSchema} from "./settings";
import {ICustomSnippet} from "./interfaces";

const EXTENSION_NAME = "FL Small Mercies";
const EXTENSION_PREFIX = "FL_SM";

const MSG_TYPE_SAVE_SETTINGS = `${EXTENSION_PREFIX}_saveSettings`;
const MSG_TYPE_CURRENT_SETTINGS = `${EXTENSION_PREFIX}_currentSettings`;
const MSG_TYPE_GET_VERSION = `${EXTENSION_PREFIX}_getVersion`;
const MSG_TYPE_RED_MAGCATS = `${EXTENSION_PREFIX}_redMAGCATS`;
const MSG_TYPE_OLD_MAGCATS = `${EXTENSION_PREFIX}_oldMAGCATS`;
const MSG_TYPE_DEFAULT_MAGCATS = `${EXTENSION_PREFIX}_defaultMAGCATS`;

const SETTINGS_SCHEMA: SettingsSchema = [
    {
        title: "Branch results",
        settings: {
            branch_results_worth: {
                description: "Show detailed breakdown of net worth changes in branch results.",
                default: false,
            },
            branch_net_worth: {
                description: "Display total net worth change as a result of branch choice.",
                default: false,
            },
            colorize_worth_annotations: {
                description: "Colorize annotations about net worth in branch results.",
                default: true,
            },
            annotate_cp_changes: {
                description: "Annotate branch results with change point amounts.",
                default: true,
            },
            remove_quality_cap_msgs: {
                description: "Remove messages about quality caps from branch results.",
                default: true,
            },
            remove_simple_challenge_text: {
                description: "Remove text about challenge being simple from check results.",
                default: true,
            },
            convert_pennies_to_echoes: {
                description: "Convert Pennies to Echoes in branch results and quality requirements.",
                default: true,
            },
        },
    },
    {
        title: "Left sidebar",
        settings: {
            track_shop_transactions: {
                description: "Update relevant currencies on shop transactions.",
                default: true,
            },
            hide_nonlocal_qualities: {
                description: "Hide sidebar qualities not appropriate for the current location.",
                default: true,
            },
            ascetic_mode: {
                description: "Remove both location banner and candles.",
                default: false,
            },
            remove_fate_counter: {
                description: "Remove Fate counter from the sidebar.",
                default: false,
            },
            maxed_out_scrollbars: {
                description: "Remove progress bars from maxed-out sidebar qualities.",
                default: true,
            },
            scrip_icon: {
                description: "Add Hinterlands Scrip icon to a sidebar indicator.",
                default: true,
            },
            stuiver_icon: {
                description: "Add Stuiver icon to a sidebar indicator.",
                default: true,
            },
            shillings_icon: {
                description: "Add Rat-Shilling icon to a sidebar indicator.",
                default: true,
            },
            display_more_currencies: {
                description: "Show more currencies in the left sidebar.",
                default: true,
            },
            display_currencies_everywhere: {
                description: "Show indicators for additional currencies regardless of location.",
                default: false,
            },
            add_thousands_separator: {
                description: "Add a comma after thousands in the currency indicators.",
                default: true,
            },
            show_epa_tracker: {
                description: "Show EPA tracker in the left sidebar",
                default: false,
            },
            compact_ability_sidebar: {
                description: "Show sidebar abilities in a compact way.",
                default: false,
            },
            shield_golden_pulse: {
                description: "Highlight changed qualities in the compact sidebar with a golden 'pulse'.",
                default: true,
            },
            shield_highlight_modifier: {
                description: "Display values for qualities modified by equipment in different color.",
                default: false,
            },
            shield_counter_animation: {
                description: "Animate value changes in the compact sidebar.",
                default: true,
            },
            shield_eager_load: {
                description: "Apply changes to shield values based on changed equipment.",
                default: true,
            },
        },
    },
    {
        title: '"Possessions" tab',
        settings: {
            hide_single_item_icon: {
                description: "Hide the '1' icon next to single items in your inventory.",
                default: true,
            },
            add_worth_tooltips: {
                description: "Add item's worth in Echoes to its tooltip.",
                default: false,
            },
            sort_neathbow_boxes: {
                description: "Sort Neathbow boxes in your inventory.",
                default: true,
            },
        },
    },
    {
        title: '"Myself" tab',
        settings: {
            show_vanity_section: {
                description: "Show 'Vanities' section in your 'Myself' tab.",
                default: false,
            },
            only_completed_vanities: {
                description: "Only show completed vanities in the 'Vanities' section.",
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
        },
    },
    {
        title: "Central column",
        settings: {
            ship_saver: {
                description: "Disable storylet that lets you sell your Ship.",
                default: true,
            },
            piggy_bank_saver: {
                description: "Disable storylet that lets you break your Porcine Investment Vessel.",
                default: true,
            },
            remove_plan_buttons: {
                description: "Remove the 'Plans' button & related buttonlets",
                default: false,
            },
            add_profile_link: {
                description: "Add button that points to your profile.",
                default: true,
            },
            auto_scroll_back: {
                description: "Auto-scroll to the storylet after choosing a branch.",
                default: true,
            },
            shop_price_totals: {
                description: "Display total value when hovering over 'Sell' button.",
                default: true,
            },
            two_step_confirmations: {
                description: "Protect certain 'dangerous' branches with a two-step confirmation process.",
                default: false,
            },
            persistent_premium: {
                description: 'Move gold-framed storylets into "Fifth City Stories".',
                default: false,
            },
        },
    },
    {
        title: "Right sidebar",
        settings: {
            display_favour_tracker: {
                description: "Display Favours in the right sidebar.",
                default: true,
            },
            show_zero_favours: {
                description: "Show factions with zero Favours.",
                default: false,
            },
            remove_mask_banner: {
                description: "Remove the banner that advertises other FBG products.",
                default: false,
            },
            remove_sidebar_snippets: {
                description: "Remove 'Snippets' from the right sidebar.",
                default: true,
            },
            remove_contacts_snippet: {
                description: "Hide 'Make Contacts' snippet in the right sidebar.",
                default: true,
            },
            enable_custom_snippets: {
                description: "Show community-made snippets in the right sidebar.",
                default: false,
            },
            replace_fbg_snippets: {
                description: "Only show community-made snippets, not the FBG ones.",
                default: false,
            },
        },
    },
    {
        title: "Whimsical stuff",
        settings: {
            show_af_year: {
                description: "Show After Fall years on Journal snippets.",
                default: false,
            },
            enable_khanate_oracle: {
                description: "Show prospects for recruitment when cycling 'Airs of Khanate'.",
                default: false,
            },
            prettify_discordance_checks: {
                description: "Introduce obnoxious negation into 'Steward of the Discordance' challenges.",
                default: false,
            },
            show_treasure_marker: {
                description: "Mark location of a treasure stash on the Zee map",
                default: true,
            },
            magcats_icons: {
                description: "Icons used for Advanced Skills",
                default: "default",
                choices: [
                    ["default", "Default"],
                    ["classic", "Old"],
                    ["red", "Red"],
                ],
            },
        },
    },
    {
        title: "Miscellany",
        settings: {
            fix_empty_requirements: {
                description: "Remove empty requirements bar in social storylets.",
                default: true,
            },
        },
    },
    {
        title: "Fine-tuning",
        settings: {
            scroll_back_behavior: {
                description: "Scroll back mode",
                default: "auto",
                choices: [
                    ["auto", "Instant"],
                    ["smooth", "Smooth"],
                ],
            },
        },
    },
];

enum AdvancedSkillsArt {
    DEFAULT = "default",
    OLD = "classic",
    RED = "red",
}

export {
    EXTENSION_NAME,
    EXTENSION_PREFIX,
    MSG_TYPE_SAVE_SETTINGS,
    MSG_TYPE_CURRENT_SETTINGS,
    MSG_TYPE_GET_VERSION,
    MSG_TYPE_RED_MAGCATS,
    MSG_TYPE_OLD_MAGCATS,
    MSG_TYPE_DEFAULT_MAGCATS,
    SETTINGS_SCHEMA,
    AdvancedSkillsArt,
};
