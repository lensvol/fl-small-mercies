import { EXTENSION_NAME } from "./constants.js";

function debug(message: string){
    console.debug(`[${EXTENSION_NAME}] ${message}`);
}

function log(message: string){
    console.log(`[${EXTENSION_NAME}] ${message}`);
}

export { log, debug }