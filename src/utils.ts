import {ITooltipContent} from "./interfaces";

function getSingletonByClassName(node: HTMLElement, className: string): HTMLElement | null {
    if (node.classList.contains(className)) {
        return node;
    }

    const children = node.getElementsByClassName(className);
    if (children.length > 0) {
        return children[0] as HTMLElement;
    }

    return null;
}

// Shamelessly taken from https://stackoverflow.com/a/2901298
function numberWithCommas(x: string): string {
    const result = x.replace(/\B(?=(\d{3})+(?!\d))/g, ",").trim();
    return result.endsWith(".00") ? result.slice(0, result.length - 3) : result;
}

function sumArithmeticSequence(lastTerm: number, firstTerm: number = 1) {
    // Since pyramidal progressions always start with 1 we can assume that the number of terms
    // is equal to the last term.
    return (lastTerm / 2) * (firstTerm + lastTerm);
}

function createTippyMimic(
    posX: number,
    posY: number,
    title: string,
    description: string | undefined,
    secondaryDescription: string | undefined,
    maxWidth: number = 350
) {
    const fauxTippy = document.createElement("div");
    fauxTippy.classList.add("faux-tippy-box");
    fauxTippy.dataset.tippyRoot = "";
    const dimensionsCss = `transform: translate3d(${posX.toFixed()}px, ${posY.toFixed()}px, 0px); width: ${maxWidth}px;`;
    fauxTippy.style.cssText = `pointer-events: none; z-index: 9999; visibility: visible; position: absolute; inset: 0px auto auto 0px; margin: 0px; ${dimensionsCss}`;

    const container = document.createElement("div");
    container.setAttribute("id", "fl-sm-faux-tooltip");
    container.classList.add("tippy-box");
    container.setAttribute("role", "tooltip");
    container.dataset.state = "visible";
    container.dataset.placement = "bottom";
    container.dataset.animation = "fade";
    container.style.cssText = `max-width: ${maxWidth}; transition-duration: 0ms;`;
    container.setAttribute("tabindex", "-1");

    const container2 = document.createElement("div");
    container2.classList.add("tippy-content");
    container2.dataset.state = "visible";
    container2.style.cssText = "transition-duration: 0ms;";

    const container3 = document.createElement("div");
    container3.classList.add("tippy-arrow");
    container3.style.cssText = "position: absolute; left: 0px; transform: translate3d(62px, 0px, 0px);";

    const container4 = document.createElement("div");

    const container5 = document.createElement("div");
    container5.classList.add("tooltip");

    const container6 = document.createElement("div");
    container6.classList.add("tooltip__desc__noImage");

    const textSpan = document.createElement("span");
    textSpan.classList.add("item__name");

    const textSpan2 = document.createElement("span");
    textSpan2.classList.add("item__value");

    const paragraph = document.createElement("p");

    const text = document.createTextNode(title);

    const textSpan3 = document.createElement("span");

    fauxTippy.appendChild(container);

    container.appendChild(container2);
    container.appendChild(container3);

    container2.appendChild(container4);

    container4.appendChild(container5);

    container5.appendChild(container6);

    container6.appendChild(textSpan);
    container6.appendChild(textSpan2);

    textSpan.appendChild(text);

    if (description) {
        const text3 = document.createElement("span");
        text3.innerHTML = description;
        container6.appendChild(paragraph);
        paragraph.appendChild(textSpan3);
        textSpan3.appendChild(text3);
    }

    if (secondaryDescription) {
        const container7 = document.createElement("div");
        container7.classList.add("tooltip__secondary-description");
        container7.innerHTML = secondaryDescription;

        container6.appendChild(container7);
    }

    return fauxTippy;
}

function attachTooltipToElement(node: HTMLElement, contentCallback: () => ITooltipContent, maxWidth: number = 350) {
    node.addEventListener("mouseenter", (ev) => {
        const existingTooltips = node.getElementsByClassName("faux-tippy-box");
        for (const tooltip of existingTooltips) {
            tooltip.parentElement?.removeChild(tooltip);
        }

        const content: ITooltipContent = contentCallback();

        const rect = node.getBoundingClientRect();
        let posX = rect.left + window.screenX + rect.width / 2;
        let posY = rect.top + window.scrollY + rect.height / 2;
        if (posX + maxWidth > window.innerWidth) {
            posX = rect.left + window.screenX - maxWidth;
        }

        const tooltip = createTippyMimic(posX, posY, content.title, content.text, content.secondaryText, maxWidth);
        document.body.appendChild(tooltip);
    });

    node.addEventListener("mouseleave", (_) => {
        const existingTooltips = document.body.getElementsByClassName("faux-tippy-box");
        for (const tooltip of existingTooltips) {
            tooltip.parentElement?.removeChild(tooltip);
        }
    });
}

export {getSingletonByClassName, numberWithCommas, sumArithmeticSequence, attachTooltipToElement};
