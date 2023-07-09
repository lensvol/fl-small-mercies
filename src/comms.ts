function sendToServiceWorker(action: string, detail: object) {
    const event = new CustomEvent(action, {
        detail: {...detail},
    });
    window.dispatchEvent(event);
}

export {sendToServiceWorker};
