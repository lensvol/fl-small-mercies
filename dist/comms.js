function sendToServiceWorker(action, detail) {
    const event = new CustomEvent(action, {
        detail: Object.assign({}, detail)
    });
    window.dispatchEvent(event);
}
export { sendToServiceWorker };
//# sourceMappingURL=comms.js.map