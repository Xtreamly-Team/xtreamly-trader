"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = sleep;
exports.executor = executor;
const config_1 = require("@xtreamly/utils/config");
(0, config_1.loadEnv)();
const config_2 = require("@xtreamly/utils/config");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function executor(actions) {
    console.log("Starting trading loop...");
    const interval = (0, config_2.getConfig)().interval;
    const rounds = (0, config_2.getConfig)().rounds;
    let i = 1;
    while (true) {
        await actions(i);
        await sleep(interval * 1000);
        if (rounds && i >= rounds) {
            break;
        }
        i += 1;
    }
    console.log("Trading loop ended.");
}
