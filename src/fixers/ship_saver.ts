import {IMercyFixer} from "./base.js";

export class ShipSaverFixer implements IMercyFixer {
    private observer: MutationObserver

    constructor() {
        this.observer = new MutationObserver((mutations, observer) => {
            for (let m = 0; m < mutations.length; m++) {
                const mutation = mutations[m];

                for (let n = 0; n < mutation.addedNodes.length; n++) {
                    const node = mutation.addedNodes[n] as HTMLElement;

                    if (node.nodeName.toLowerCase() !== "div") {
                        continue;
                    }

                    let shipStorylet = node.querySelector("div[data-branch-id='251811']");
                    // @ts-ignore
                    if (!shipStorylet && node.hasAttribute("data-branch-id") && node.attributes["data-branch-id"].value == 251811) {
                        shipStorylet = node;
                    }

                    if (shipStorylet) {
                        const description = shipStorylet.querySelector("div[class='media__body branch__body'] > div > p") as HTMLElement;
                        const labelNode = document.createElement("b");
                        labelNode.innerText = "This branch was disabled for your own good.";

                        description.appendChild(document.createElement("br"));
                        description.appendChild(document.createElement("br"));
                        description.appendChild(labelNode);

                        shipStorylet.classList.add("media--locked");
                        shipStorylet
                            .querySelectorAll("button")
                            .forEach((b) => b.remove());

                        const actionButton = shipStorylet.querySelector("div[class*='buttons']");
                        if (actionButton) {
                            actionButton.remove();
                        }
                    }
                }
            }
        });
    }

    disable(): void {
        this.observer.disconnect();
    }

    enable(): void {
        this.observer.observe(document, {childList: true, subtree: true});
    }
}
