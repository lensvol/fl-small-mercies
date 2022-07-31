# FL Small Mercies

[![License](https://img.shields.io/github/license/lensvol/fl-small-mercies)](https://github.com/lensvol/fl-small-mercies/blob/master/LICENSE) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/lensvol/fl-small-mercies)

![screenshot](https://raw.githubusercontent.com/lensvol/fl-small-mercies/master/screenshot.png)

Set of small "fixers" for the Fallen London UI. Each of them can be disabled or enabled individually via the "Extensions" section on the "Account" screen.

Current features:
* Fix color and alignment of the navigation buttons in Journal.
* Add comma after thousands in the currency indicators.
* Auto-scroll to the storylet after choosing branch.
* Remove scrollbars from discrete sidebar qualities.
* Add Hinterlands Scrip Icon to a sidebar indicator.
* Disable storylet that lets you sell your Ship.

_NB: This extension is **not** (yet) whitelisted by Failbetter Games. Use at your own risk!_

## Development

_First,_ install **Node.js** and **npm** >= 8.5.1.

_Second_, install necessary packages:
```shell
npm install --save-dev typescript ts-loader '@types/chrome'
```
_Third,_ compile JS version of the plugin: 
```shell
make build_dist
```

To build a release version of the extension:


**Enjoy hacking!**

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
* **RagCall** - for suggesting idea with removing scrollbars on discrete qualities.
* [Saklad5](https://github.com/Saklad5) - for finding the appropriate graphic for Hinterlands Scrip icon.