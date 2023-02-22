import {SettingsSchema} from "./settings.js";

const EXTENSION_NAME = "FL Small Mercies"
const EXTENSION_ID = "FL_SM";

const MSG_TYPE_SAVE_SETTINGS = `${EXTENSION_ID}_saveSettings`;
const MSG_TYPE_CURRENT_SETTINGS = `${EXTENSION_ID}_currentSettings`;

const SETTINGS_SCHEMA: SettingsSchema = [
    {
        title: "UI Fixes",
        settings: {
            "fix_journal_navigation": {
                description: "Fix color and alignment of the navigation buttons in Journal.",
                default: true,
            },
            "discrete_scrollbars": {
                description: "Remove progress bars from discrete sidebar qualities.",
                default: true,
            },
            "maxed_out_scrollbars": {
                description: "Remove progress bars from maxed-out sidebar qualities.",
                default: true,
            },
            "scrip_icon": {
                description: "Add Hinterlands Scrip Icon to a sidebar indicator.",
                default: true,
            },
            "sort_city_mysteries": {
                description: "Sort 'Mystery of the ... City' qualities.",
                default: true,
            },
            "sort_discordance_seals": {
                description: "Sort ███████████ █████.",
                default: true,
            },
            "sort_dreams": {
                description: "Sort advanced dreams (Stormy-Eyed, Seeing in Apocyan, Haunted by Stairs) below their base qualities.",
                default: true,
            },
            "sort_neathbow_boxes": {
                description: "Sort Neathbow boxes in your inventory.",
                default: true,
            },
            "fix_empty_requirements": {
                description: "Remove empty requirements bar in social storylets.",
                default: true,
            },
        }
    },
    {
        title: "UI Improvements",
        settings: {
            "add_thousands_separator": {
                description: "Add comma after thousands in the currency indicators.",
                default: true,
            },
            "remove_mask_banner": {
                description: "Remove 'Mask of the Rose' banner.",
                default: false,
            },
            "remove_sidebar_snippets": {
                description: "Remove 'Snippets' from the right sidebar.",
                default: true,
            },
            "add_profile_link": {
                description: "Add button that points to your profile.",
                default: true,
            },
            "display_favour_tracker": {
                description: "Display Favours in the right sidebar.",
                default: true,
            },
            "auto_scroll_back": {
                description: "Auto-scroll to the storylet after choosing branch.",
                default: true,
            },
            "quick_share_button": {
                description: "Replace usual 'Share snippet' button with a quicker alternative.",
                default: true,
            },
        }
    },
    {
        title: "Whimsical stuff",
        settings: {
            "ship_saver": {
                description: "Disable storylet that lets you sell your Ship.",
                default: true,
            },
            "remove_plan_buttons": {
                description: "Remove 'Plans' button & related buttonlets",
                default: false,
            },
            "ascetic_mode": {
                description: "Remove both location banner and candles.",
                default: false,
            },
            "remove_fate_counter": {
                description: "Remove Fate counter from the sidebar.",
                default: false,
            },
            "show_af_year": {
                description: "Show After Fall years on Journal snippets.",
                default: false,
            },
            "enable_khanate_oracle": {
                description: "Show prospects for recruitment when cycling 'Airs of Khanate'.",
                default: false,
            },
            "top_exit_buttons": {
                description: "Move 'Perhaps Not' button to the top in selected storylets.",
                default: false,
            }
        }
    },
    {
        title: "Fine tuning",
        settings: {
            "show_zero_favours": {
                description: "Show factions with zero Favours.",
                default: false,
            },
            "scroll_back_behavior": {
                description: "Scroll back mode",
                default: "auto",
                choices: [
                    ["auto", "Instant"],
                    ["smooth", "Smooth"],
                ],
            },
        }
    }
]


export { EXTENSION_NAME, EXTENSION_ID, MSG_TYPE_SAVE_SETTINGS, MSG_TYPE_CURRENT_SETTINGS, SETTINGS_SCHEMA };