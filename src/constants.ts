import {SettingsSchema} from "./settings";

const EXTENSION_NAME: string = "FL Small Mercies"
const EXTENSION_ID: string = "FL_SM";

const MSG_TYPE_SAVE_SETTINGS = `${EXTENSION_ID}_saveSettings`;
const MSG_TYPE_CURRENT_SETTINGS = `${EXTENSION_ID}_currentSettings`;

const SETTINGS_SCHEMA: SettingsSchema = {
    "fix_journal_navigation": {
        description: "Fix color and alignment of the navigation buttons in Journal.",
        default: true
    },
    "add_thousands_separator": {
        description: "Add comma after thousands in the currency indicators.",
        default: true,
    },
    "auto_scroll_back": {
        description: "Auto-scroll to the storylet after choosing branch.",
        default: true
    },
    "discrete_scrollbars": {
        description: "Remove scrollbars from discrete sidebar qualities.",
        default: true
    },
    "scrip_icon": {
        description: "Add Hinterlands Scrip Icon to a sidebar indicator.",
        default: true
    },
    "ship_saver": {
        description: "Disable storylet that lets you sell your Ship.",
        default: true
    },
    "remove_mask_banner": {
        description: "Remove 'Mask of the Rose' banner.",
        default: false,
    },
    "remove_sidebar_snippets": {
        description: "Remove 'Snippets' from the right sidebar.",
        default: true,
    },
    "remove_plan_buttons": {
        description: "Remove 'Plans' button & related buttonlets",
        default: true
    },
    "sort_city_mysteries": {
        description: "Sort 'Mystery of the ... City' qualities.",
        default: true,
    },
    "sort_discordance_seals": {
        description: "Sort ███████████ █████.",
        default: true,
    },
    "sort_neathbow_boxes": {
        description: "Sort Neathbow boxes in your inventory.",
        default: true,
    }
}


export { EXTENSION_NAME, EXTENSION_ID, MSG_TYPE_SAVE_SETTINGS, MSG_TYPE_CURRENT_SETTINGS, SETTINGS_SCHEMA };