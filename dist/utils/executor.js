"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = sleep;
exports.executor = executor;
const config_1 = require("../utils/config");
const logger_1 = __importDefault(require("../utils/logger"));
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function executor(actions) {
    logger_1.default.info("Starting trading loop...");
    const interval = (0, config_1.getConfig)().interval;
    const rounds = (0, config_1.getConfig)().rounds;
    let i = 1;
    while (true) {
        try {
            await actions(i);
        }
        catch (err) {
            logger_1.default.error(`On round ${i}, ${err}`);
        }
        await sleep(interval * 1000);
        if (rounds && i >= rounds) {
            break;
        }
        i += 1;
    }
    logger_1.default.info("Trading loop ended.");
}
