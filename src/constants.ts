import {SettingsSchema} from "./settings";
import {ICustomSnippet} from "./interfaces";

const EXTENSION_NAME = "FL Small Mercies";
const EXTENSION_PREFIX = "FL_SM";

const MSG_TYPE_SAVE_SETTINGS = `${EXTENSION_PREFIX}_saveSettings`;
const MSG_TYPE_CURRENT_SETTINGS = `${EXTENSION_PREFIX}_currentSettings`;
const MSG_TYPE_GET_VERSION = `${EXTENSION_PREFIX}_getVersion`;

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
            revert_sidebar_art: {
                description: "Use old art for icons of Advanced Skills.",
                default: false,
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
                description: "Remove the banner that advertises other FBG products.",
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
            persistent_premium: {
                description: 'Move gold-framed storylets into "Fifth City Stories".',
                default: false,
            },
            enable_custom_snippets: {
                description: "Show community-made snippets in the right sidebar.",
                default: false,
            },
            show_vanity_section: {
                description: "Show 'Vanities' section in your 'Myself' tab.",
                default: false,
            },
            convert_pennies_to_echoes: {
                description: "Convert Pennies to Echoes in branch results and quality requirements.",
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
            show_treasure_marker: {
                description: "Mark location of a treasure stash on the Zee map",
                default: false,
            },
            show_epa_tracker: {
                description: "Show EPA tracker in the left sidebar",
                default: false,
            },
            remove_contacts_snippet: {
                description: "Hide 'Make Contacts' snippet in the right sidebar.",
                default: true,
            },
            compact_ability_sidebar: {
                description: "Show sidebar abilities in a compact way.",
                default: false,
            },
            add_worth_tooltips: {
                description: "Add item's worth in Echoes to its tooltip.",
                default: false,
            },
            branch_results_worth: {
                description: "Show detailed breakdown of net worth changes in branch results.",
                default: false,
            },
            branch_net_worth: {
                description: "Display total net worth change as a result of branch choice.",
                default: false,
            },
            annotate_cp_changes: {
                description: "Annotate branch results with change point amounts.",
                default: true,
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
            piggy_bank_saver: {
                description: "Disable storylet that lets you break your Porcine Investment Vessel.",
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
            prettify_discordance_checks: {
                description: "Introduce obnoxious negation into 'Steward of the Discordance' challenges.",
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
            replace_fbg_snippets: {
                description: "Only show community-made snippets, not the FBG ones.",
                default: false,
            },
            only_completed_vanities: {
                description: "Only show completed vanities in the 'Vanities' section.",
                default: true,
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
            colorize_worth_annotations: {
                description: "Colorize annotations about net worth in branch results.",
                default: true,
            },
        },
    },
];

export {
    EXTENSION_NAME,
    EXTENSION_PREFIX,
    MSG_TYPE_SAVE_SETTINGS,
    MSG_TYPE_CURRENT_SETTINGS,
    MSG_TYPE_GET_VERSION,
    SETTINGS_SCHEMA,
};
