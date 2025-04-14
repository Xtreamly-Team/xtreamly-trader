"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const viem_1 = require("viem");
const config_1 = require("../utils/config");
class Contract {
    constructor() {
        const chainDetails = (0, config_1.getConfig)().chain;
        this.publicClient = (0, viem_1.createPublicClient)({
            chain: chainDetails.viemChain,
            transport: (0, viem_1.http)(chainDetails.rpc),
        });
    }
    async readContract(contractAddress, functionName, args, abi) {
        return this.publicClient.readContract({
            address: contractAddress,
            abi,
            functionName,
            args,
        });
    }
    async writeContract(contractAddress, functionName, args, abi) {
        return this.publicClient.readContract({
            address: contractAddress,
            abi,
            functionName,
            args,
        });
    }
}
exports.Contract = Contract;
