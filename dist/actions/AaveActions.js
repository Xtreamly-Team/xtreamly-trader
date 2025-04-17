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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AaveActions = void 0;
const ethers_1 = require("ethers");
const contract_helpers_1 = require("@aave/contract-helpers");
const markets = __importStar(require("@bgd-labs/aave-address-book"));
const math_utils_1 = require("@aave/math-utils");
const dayjs_1 = __importDefault(require("dayjs"));
const utils_1 = require("../utils");
class AaveActions {
    constructor(chain, provider, signer) {
        this.signer = signer;
        this.provider = provider;
        const market = Object.entries(markets).find(([key, value]) => key.startsWith("AaveV3") && value.CHAIN_ID === chain.id);
        if (!market) {
            throw Error("Unknown Aave v3 market for chain: " + chain.name);
        }
        this.market = market[1];
        this.pool = new contract_helpers_1.Pool(provider, {
            POOL: this.market.POOL,
            SWAP_COLLATERAL_ADAPTER: this.market.SWAP_COLLATERAL_ADAPTER,
            WETH_GATEWAY: this.market.WETH_GATEWAY,
        });
    }
    getAsset(token) {
        return this.market.ASSETS[token];
    }
    async getBalance(token) {
        const t = new contract_helpers_1.WalletBalanceProvider({
            walletBalanceProviderAddress: this.market.WALLET_BALANCE_PROVIDER,
            provider: this.provider,
        });
        const asset = this.getAsset(token);
        const underlyingBalance = await t.balanceOf(this.signer.address, asset.UNDERLYING);
        const aTokenBalance = await t.balanceOf(this.signer.address, asset.A_TOKEN);
        return {
            token,
            tokenAddress: asset.UNDERLYING,
            underlyingBalance,
            balanceFormatted: ethers_1.utils.formatUnits(underlyingBalance, asset.decimals),
            aTokenBalance,
            aTokenBalanceFormatted: ethers_1.utils.formatUnits(aTokenBalance, asset.decimals),
        };
    }
    async getBalances() {
        const tokens = Object.keys(this.market.ASSETS);
        const calls = tokens.map((t) => this.getBalance(t));
        return Promise.all(calls);
    }
    async getUserSummary() {
        const currentTimestamp = (0, dayjs_1.default)().unix();
        const poolDataProviderContract = new contract_helpers_1.UiPoolDataProvider({
            uiPoolDataProviderAddress: this.market.UI_POOL_DATA_PROVIDER,
            provider: this.provider,
            chainId: this.market.CHAIN_ID,
        });
        const reserves = await poolDataProviderContract.getReservesHumanized({
            lendingPoolAddressProvider: this.market.POOL_ADDRESSES_PROVIDER,
        });
        const baseCurrencyData = reserves.baseCurrencyData;
        const userReserves = await poolDataProviderContract.getUserReservesHumanized({
            lendingPoolAddressProvider: this.market.POOL_ADDRESSES_PROVIDER,
            user: this.signer.address,
        });
        const formattedReserves = (0, math_utils_1.formatReserves)({
            reserves: reserves.reservesData,
            currentTimestamp,
            marketReferenceCurrencyDecimals: baseCurrencyData.marketReferenceCurrencyDecimals,
            marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
        });
        return (0, math_utils_1.formatUserSummary)({
            currentTimestamp,
            marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
            marketReferenceCurrencyDecimals: baseCurrencyData.marketReferenceCurrencyDecimals,
            userReserves: userReserves.userReserves,
            formattedReserves,
            userEmodeCategoryId: userReserves.userEmodeCategoryId,
        });
    }
    async getTokenReserves(token, givenUserSummary) {
        const asset = this.getAsset(token);
        const userSummary = givenUserSummary || await this.getUserSummary();
        const tokenReserves = userSummary.userReservesData.find((u) => u.underlyingAsset.toLowerCase() === asset.UNDERLYING.toLowerCase());
        if (!tokenReserves) {
            throw Error(`Unable to get token reserves for ${token}.`);
        }
        return tokenReserves;
    }
    async getAaveBalances() {
        const userSummary = await this.getUserSummary();
        return userSummary.userReservesData.map((userReserve) => {
            const tokenEntry = Object.entries(this.market.ASSETS)
                .find(([key, value]) => value.UNDERLYING.toLowerCase() === userReserve.underlyingAsset.toLowerCase());
            return {
                token: tokenEntry && tokenEntry[0],
                decimals: tokenEntry && tokenEntry[1].decimals,
                underlyingAsset: userReserve.underlyingAsset,
                scaledATokenBalance: userReserve.scaledATokenBalance,
                usageAsCollateralEnabledOnUser: userReserve.usageAsCollateralEnabledOnUser,
                scaledVariableDebt: userReserve.scaledVariableDebt,
                underlyingBalance: userReserve.underlyingBalance,
                underlyingBalanceMarketReferenceCurrency: userReserve.underlyingBalanceMarketReferenceCurrency,
                underlyingBalanceUSD: userReserve.underlyingBalanceUSD,
                variableBorrows: userReserve.variableBorrows,
                variableBorrowsMarketReferenceCurrency: userReserve.variableBorrowsMarketReferenceCurrency,
                variableBorrowsUSD: userReserve.variableBorrowsUSD,
                totalBorrows: userReserve.totalBorrows,
                totalBorrowsMarketReferenceCurrency: userReserve.totalBorrowsMarketReferenceCurrency,
                totalBorrowsUSD: userReserve.totalBorrowsUSD,
            };
        });
    }
    async getAaveBalance(token) {
        const balances = await this.getAaveBalances();
        return balances.find((b) => b.token === token);
    }
    async supply(amount, token) {
        // const token = WETH | USDCn;
        const asset = this.getAsset(token);
        const txs = await this.pool.supply({
            user: this.signer.address,
            reserve: asset.UNDERLYING,
            amount,
        });
        return await this.submitTransactions(txs);
    }
    async withdrawAll(token) {
        // const token = WETH | USDCn;
        const tokenReserves = await this.getTokenReserves(token);
        return this.withdraw(tokenReserves.underlyingBalance, token);
    }
    async withdraw(amount, token) {
        // const token = WETH | USDCn;
        const asset = this.getAsset(token);
        const txs = await this.pool.withdraw({
            user: this.signer.address,
            reserve: asset.UNDERLYING,
            amount,
            aTokenAddress: asset.A_TOKEN,
        });
        return await this.submitTransactions(txs);
    }
    async borrow(amount, token) {
        // const token = WETH | USDCn;
        const asset = this.getAsset(token);
        const txs = await this.pool.borrow({
            user: this.signer.address,
            reserve: asset.UNDERLYING,
            amount,
            interestRateMode: contract_helpers_1.InterestRate.Variable,
        });
        return await this.submitTransactions(txs);
    }
    async repay(amount, token) {
        // const token = WETH | USDCn;
        const asset = this.getAsset(token);
        const txs = await this.pool.repay({
            user: this.signer.address,
            reserve: asset.UNDERLYING,
            amount,
            interestRateMode: contract_helpers_1.InterestRate.Variable,
        });
        return await this.submitTransactions(txs);
    }
    // Throwing an error in the transactions
    // async repayWithCollateral(amount: string, token: string, collateralToken: string) {
    //   // const token = WETH | USDCn;
    //   const asset = this.getAsset(token);
    //   const collateralAsset = this.market.ASSETS[collateralToken];
    //
    //   const pool = new LendingPool(this.provider, {
    //     LENDING_POOL: this.market.POOL,
    //     REPAY_WITH_COLLATERAL_ADAPTER: this.market.REPAY_WITH_COLLATERAL_ADAPTER,
    //     WETH_GATEWAY: this.market.WETH_GATEWAY,
    //   });
    //
    //   const repayWithAmount = await this.convertTokenAmount(parseFloat(amount), token, collateralToken);
    //
    //   const txs: EthereumTransactionTypeExtended[] = await pool.repayWithCollateral({
    //     user: this.signer.address,
    //     fromAsset: collateralAsset.UNDERLYING,
    //     fromAToken: collateralAsset.A_TOKEN,
    //     assetToRepay: asset.UNDERLYING,
    //     repayWithAmount: repayWithAmount.toString(),
    //     repayAmount: amount,
    //     rateMode: InterestRate.Variable,
    //   });
    //   return await this.submitTransactions(txs);
    // }
    async convertTokenAmount(amount, fromToken, toToken) {
        const userSummary = await this.getUserSummary();
        const fromTokenReserve = await this.getTokenReserves(fromToken, userSummary);
        const toTokenReserve = await this.getTokenReserves(toToken, userSummary);
        const fromTokenUSD = parseFloat(fromTokenReserve.reserve.priceInUSD);
        const toTokenUSD = parseFloat(toTokenReserve.reserve.priceInUSD);
        const amountInUSD = amount * fromTokenUSD;
        return amountInUSD / toTokenUSD;
    }
    async submitTransactions(txs) {
        return (0, utils_1.runSerially)(txs.map((tx) => () => this.submitTransaction(tx)));
    }
    async submitTransaction(tx) {
        const txData = await tx.tx();
        const transactionResponse = await this.signer.sendTransaction({
            ...txData,
            value: txData.value ? ethers_1.BigNumber.from(txData.value) : undefined,
        });
        return await transactionResponse.wait();
    }
}
exports.AaveActions = AaveActions;
