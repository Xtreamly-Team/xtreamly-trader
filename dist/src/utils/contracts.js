"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const helpers_1 = require("@xtreamly/constants/helpers");
const config_1 = require("@xtreamly/utils/config");
const viem_1 = require("viem");
class Contract {
    constructor() {
        const config = (0, config_1.getConfig)();
        const chainDetails = (0, helpers_1.getChainDetails)();
        this.publicClient = (0, viem_1.createPublicClient)({
            chain: chainDetails.viemChain,
            transport: (0, viem_1.http)(config.rpc),
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
