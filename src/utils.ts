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

export {getSingletonByClassName, numberWithCommas, sumArithmeticSequence};
