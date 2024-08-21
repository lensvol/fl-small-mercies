import {EXTENSION_NAME} from "./constants";

function debug(message: string, ...args: any[]) {
    console.debug(`[${EXTENSION_NAME}] ${message}`, ...args);
}

function log(message: string) {
    console.log(`[${EXTENSION_NAME}] ${message}`);
}

function error(message: string) {
    console.error(`[${EXTENSION_NAME}] ${message}`);
}

export {log, debug, error};
