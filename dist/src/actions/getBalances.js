"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenBalance = getTokenBalance;
exports.getBalances = getBalances;
const helpers_1 = require("../constants/helpers");
const contracts_1 = require("../utils/contracts");
const WalletBalanceProvider_json_1 = __importDefault(require("../../artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WalletBalanceProvider.sol/WalletBalanceProvider.json"));
async function getTokenBalance(user, token) {
    const chainDetails = (0, helpers_1.getChainDetails)();
    return await new contracts_1.Contract().readContract(chainDetails.WALLET_BALANCE_PROVIDER, 'balanceOf', [user, token], WalletBalanceProvider_json_1.default.abi);
}
async function getBalances(user) {
    const chainDetails = (0, helpers_1.getChainDetails)();
    const balances = await new contracts_1.Contract().readContract(chainDetails.WALLET_BALANCE_PROVIDER, 'getUserWalletBalances', [chainDetails.POOL_ADDRESSES_PROVIDER, user], WalletBalanceProvider_json_1.default.abi);
    if (!balances.length) {
        return [];
    }
    return balances[0].map((token, i) => ({
        token,
        balance: balances[1][i]
    }));
}
