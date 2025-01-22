"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkChainDetails = checkChainDetails;
exports.getChainDetails = getChainDetails;
const chains_1 = require("@xtreamly/constants/chains");
function checkChainDetails() {
    const chainName = process.env.CHAIN;
    const network = process.env.NETWORK;
    const chain = chains_1.CHAINS[chainName];
    if (!chain) {
        throw new Error(`
      Chain ${chainName} is not supported yet.
      Supported chains: ${Object.keys(chains_1.CHAINS)}
      `);
    }
    if (!chain[network]) {
        throw new Error(`
      Network ${network} is not supported on ${chainName} yet.
      Supported networks: ${Object.keys(chain)}
      `);
    }
}
function getChainDetails() {
    checkChainDetails();
    const chain = process.env.CHAIN;
    const network = process.env.NETWORK;
    return chains_1.CHAINS[chain][network];
}
