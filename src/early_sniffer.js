DONE = 4;

/*
  This thing is so mental that I will probably need to take a shower
  afterwards... Although who does not love a horribly overengineered
  solution to a niche problem?

  So the problem we are trying to solve here is that due to the main content
  script using ECMA modules sometimes it takes just enough time starting up to
  miss a response to initial /myself request sent out by FL UI.

  This matters because that response contains basically all the game state
  we need to know even before the user makes first click! One of the more
  visible things that suffers is "Favours" panel in the right sidebar,
  where no information being displayed because of us not knowing those values.

  Of course all of that will be rectified during course of the game as /myself
  will be requested again depending on some conditions (I have no wish to dig
  into FL UI code to list them here)... But UX will suffer in those edge cases
  and my OCD tendencies require me to fix that.

  This script will start as a separate content script being started in the
  page context (world: "MAIN") and being a simple JS is just fast enough
  to capture what we need and pass it back to the main content script.

  Right now we only need /myself response, but why would I not implement
  a much more complex solution for shit and giggles? For shame.
*/

let responses = new Map();
let reportInRealTime = false;
let continueCapturing = true;

function sendResponseToMain(url, responseText) {
    window.postMessage(
        {
            action: "FL_SM_stashedResponse",
            url: url,
            response: responseText,
        },
        "https://www.fallenlondon.com"
    );
}

function modifyResponse(response) {
    if (this.readyState === DONE && continueCapturing) {
        if (/\/api\/character\/myself\/?$/.test(response.currentTarget.responseURL)) {
            console.debug(`[FL Small Mercies] Intercepted /api/character/myself/ response!`);
            if (!reportInRealTime) {
                responses.set(response.currentTarget.responseURL, response.target.responseText);
            } else {
                sendResponseToMain(response.currentTarget.responseURL, response.target.responseText);
            }
        }
    }
}

function openBypass(originalFunction) {
    return function (method, url, async) {
        this.addEventListener("readystatechange", modifyResponse);
        return originalFunction.apply(this, arguments);
    };
}
XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);
console.debug("[FL Small Mercies] Installed early traffic interceptor.");

window.addEventListener(
    "FL_SM_divulgeStash",
    (event) => {
        console.debug("[FL Small Mercies] Divulging stashed responses...");
        responses.forEach((url, capturedResponse) => {
            sendResponseToMain(url, capturedResponse);
        });

        responses.clear();
        console.debug("[FL Small Mercies] No more stashing, reporting directly.");
        reportInRealTime = true;
    },
    false
);
window.addEventListener(
    "FL_SM_stopSniffing",
    (event) => {
        console.debug("[FL Small Mercies] Stopping early response sniffer...");
        reportInRealTime = false;
        continueCapturing = false;
        responses.clear();
    },
    false
);
