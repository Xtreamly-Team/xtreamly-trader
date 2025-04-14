"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
exports.getConfig = getConfig;
exports.getProvider = getProvider;
exports.getWallet = getWallet;
const dotenv = __importStar(require("dotenv"));
const ethers_1 = require("ethers");
const viemChains = __importStar(require("viem/chains"));
const requiredEnvVars = [
    'CHAIN',
    'EXECUTION_INTERVAL',
    'WALLET_PRIVATE_KEY',
];
function checkEnvVars() {
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
}
function loadEnv() {
    dotenv.config();
    checkEnvVars();
}
loadEnv();
function getConfig() {
    const chain = getChainDetails();
    const rpc = process.env.RPC || chain.rpc;
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(rpc);
    const wallet = new ethers_1.ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    return {
        chain,
        provider,
        wallet,
        interval: parseInt(process.env.EXECUTION_INTERVAL),
        rounds: process.env.ROUNDS && parseInt(process.env.ROUNDS) || undefined,
    };
}
function getProvider() {
    return getConfig().provider;
}
function getWallet() {
    return getConfig().wallet;
}
function getChainDetails() {
    const chain = process.env.CHAIN;
    const network = process.env.NETWORK;
    const cn = chain + (network === "mainnet" ? '' : `-${network}`);
    const network1 = ethers_1.ethers.providers.getNetwork(cn);
    const chains = Object.values(viemChains).filter((vc) => vc.id === network1.chainId);
    if (chains.length === 0) {
        throw new Error(`${chain} ${network} is not supported on yet.`);
    }
    const viemChain = chains[0];
    const rpc = viemChain.rpcUrls.default.http[0];
    return {
        viemChain,
        rpc
    };
}
