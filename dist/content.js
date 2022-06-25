"use strict";
const script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL('dist/inject.js'));
script.onload = function () {
    script.remove();
};
(document.head || document.documentElement).appendChild(script);
console.log(`[FL Small Mercies] Inserting interceptor...`);
