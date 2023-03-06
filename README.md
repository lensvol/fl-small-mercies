# FL Small Mercies

[![License](https://img.shields.io/github/license/lensvol/fl-small-mercies)](https://github.com/lensvol/fl-small-mercies/blob/master/LICENSE) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/lensvol/fl-small-mercies) [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/efcjeepmkepahpaodagjlioagpganblf)](https://chrome.google.com/webstore/detail/fl-small-mercies/efcjeepmkepahpaodagjlioagpganblf) [![Mozilla Add-on](https://img.shields.io/amo/v/fl-small-mercies)](https://addons.mozilla.org/en-US/firefox/addon/fl-small-mercies/) ![User count](https://badges.lensvol.dev/extensions/users/fl_small_mercies.svg?bogus-cache-buster=yes)

![screenshot](https://raw.githubusercontent.com/lensvol/fl-small-mercies/master/screenshot.png)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/L4L0D1FN6)

Set of small "fixers" for the Fallen London UI. Each of them can be disabled or enabled individually via the "Extensions" section on the "Account" screen.

Current features:
* Display Favours in the right sidebar.
* Quicker sharing of storylet snippets.
* Remove "Plans" button and related UI.
* Fix color and alignment of the navigation buttons in Journal.
* Add comma after thousands in the currency indicators.
* Auto-scroll to the storylet after choosing branch.
* Remove progress bars from discrete sidebar qualities.
* Add Hinterlands Scrip Icon to a sidebar indicator.
* Disable storylet that lets you sell your Ship.
* Remove various UI elements (MotR banner, candles, Fate counter etc.)
* Remove empty requirements bar from social storylets.
* Sort various in-game things according to canonical order.
* Add "Profile" button to the top bar.

_NB: This extension is **not** (yet) whitelisted by Failbetter Games. Use at your own risk!_

## Development

### Basics
_First,_ install **Node.js** and **npm** >= 8.5.1.

_Second_, install necessary packages:
```shell
npm install --save-dev typescript ts-loader '@types/chrome'
```
_Third,_ compile JS version of the plugin: 
```shell
make build_dist
```

**Enjoy hacking!**

### Changing Hinterland Scrip icon

Due to the issues with accessing files within extensions from CSS on Firefox,
we are forced to inline SVG file itself into the CSS file.

How to do it:

1. Run `src/images/icon_scrip.svg` through [svgo](https://github.com/svg/svgo)
2. Encode contents of that SVG using [data URI encoder](https://yoksel.github.io/url-encoder/)
3. Replace contents of `src/css/extension.css` with the following:
```css
.scrip:before {
    content: "";
    {{ contents of the "Ready for CSS field" }} -6px 1px no-repeat;
    display: inline-block;
    width: 1.2em;
    height: 1.8em;
    margin: 0 0 -0.8em;
    background-size: 1.75em;
}
```

## Manual installation

### Chrome

1. Download **.ZIP** file from the "Releases" page.
2. Unzip that file somewhere on your computer.
3. Open _Chrome_.
4. Go to **chrome://extensions** and
5. Check the box for "Developer Mode" (top right corner).
6. Click **Load unpacked extension** and select the folder where you unzipped the file.

### Mozilla Firefox

1. Download **.ZIP** file from the "Releases" page.
2. Unzip that file somewhere on your computer.
3. Open **about:debugging** page.
4. Click **Load Temporary Add-On**
5. Select any file in the folder where you unzipped the archive.

### Opera

1. Download **.ZIP** file from the "Releases" page.
2. Unzip that file somewhere on your computer.
3. Open **opera:extensions** page.
4. Enable "Developer Mode" (top right corner).
6. Click **Load unpacked** and select the folder where you unzipped the file.

## Special thanks

* [rahv7](https://www.reddit.com/user/rahv7/) - for having the nerve to goad me into writing this.
* [idyl](https://www.reddit.com/user/idyl/) - for suggesting idea with thousands separator.
* [RagCall](https://fallenlondon.wiki/wiki/User:RagCall) - for suggesting idea with removing progress bars on discrete qualities.
* [Saklad5](https://github.com/Saklad5) - for finding the appropriate graphic for Hinterlands Scrip icon.
