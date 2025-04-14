"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSerially = runSerially;
async function runSerially(promiseFactories) {
    const results = [];
    for (const factory of promiseFactories) {
        const result = await factory(); // wait for each one before continuing
        results.push(result);
    }
    return results;
}
