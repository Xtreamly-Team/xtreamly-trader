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
exports.getWallet = getWallet;
const dotenv = __importStar(require("dotenv"));
const helpers_1 = require("../constants/helpers");
const ethers_1 = require("ethers");
const requiredEnvVars = [
    'CHAIN',
    'NETWORK',
    'EXECUTION_INTERVAL',
    'WALLET_PRIVATE_KEY',
];
function checkEnvVars() {
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    const chainDetails = (0, helpers_1.getChainDetails)();
    if (!process.env.RPC) {
        process.env.RPC = chainDetails.RPC;
    }
}
function loadEnv() {
    dotenv.config();
    checkEnvVars();
}
function getConfig() {
    return {
        chain: process.env.CHAIN,
        network: process.env.NETWORK,
        rpc: process.env.RPC,
        walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
        interval: parseInt(process.env.EXECUTION_INTERVAL),
        rounds: process.env.ROUNDS && parseInt(process.env.ROUNDS) || undefined,
    };
}
function getWallet() {
    const config = getConfig();
    const provider = new ethers_1.ethers.JsonRpcProvider(config.rpc);
    return new ethers_1.ethers.Wallet(config.walletPrivateKey, provider);
}
