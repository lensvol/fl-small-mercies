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

export {getSingletonByClassName};
