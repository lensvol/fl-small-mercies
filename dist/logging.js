import { EXTENSION_NAME } from "./constants.js";
function debug(message) {
    console.debug(`[${EXTENSION_NAME}] ${message}`);
}
function log(message) {
    console.log(`[${EXTENSION_NAME}] ${message}`);
}
export { log, debug };
//# sourceMappingURL=logging.js.map