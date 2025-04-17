"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopTrading = void 0;
const actions_1 = require("../actions");
const logger_1 = __importDefault(require("../utils/logger"));
const UniswapActions_1 = require("../actions/UniswapActions");
const WETHActions_1 = require("../actions/WETHActions");
class LoopTrading {
    constructor(chain, provider, signer, collateralToken, borrowedToken) {
        this.aave = new actions_1.AaveActions(chain, provider, signer);
        this.uniswap = new UniswapActions_1.UniswapActions(chain, provider, signer);
        const wethAddress = this.aave.getAsset("WETH").UNDERLYING;
        this.wethActions = new WETHActions_1.WETHActions(wethAddress, signer);
        this.loops = [];
        this.collateralToken = collateralToken;
        this.borrowedToken = borrowedToken;
        this.initialCollateral = 0;
    }
    async init(initialCollateral) {
        logger_1.default.info(`Initializing your loop trading by supplying ${initialCollateral} ${this.collateralToken} as collateral...`);
        this.initialCollateral = initialCollateral;
        // await this.aave.supply(initialCollateral.toString(), this.collateralToken);
        logger_1.default.info(`Initialized your loop trading by supplying ${initialCollateral} ${this.collateralToken} as collateral.`);
    }
    async swap(amount, fromToken, toToken) {
        const fromAsset = this.aave.getAsset(fromToken);
        if (fromToken === "WETH") {
            await this.wethActions.wrap(amount);
        }
        const toAsset = this.aave.getAsset(toToken);
        const amountSwapped = await this.uniswap.swapV2(amount.toString(), fromAsset.UNDERLYING, toAsset.UNDERLYING);
        return parseFloat(amountSwapped);
    }
    async borrowLoop(amount) {
        const userSummary = await this.aave.getUserSummary();
        const ltv = parseFloat(userSummary.currentLoanToValue);
        const gasFees = 0.01;
        const ltvAdjusterAmount = amount * (ltv - gasFees);
        const amountToBorrow = await this.aave.convertTokenAmount(ltvAdjusterAmount, this.collateralToken, this.borrowedToken);
        logger_1.default.info(`Performing loop ${this.loops.length + 1} for ${amount} ${this.collateralToken}...`);
        await this.aave.borrow(amountToBorrow.toString(), this.borrowedToken);
        const swappedAmount = await this.swap(amountToBorrow, this.borrowedToken, this.collateralToken);
        await this.aave.supply(swappedAmount.toString(), this.collateralToken);
        const loop = {
            borrowed: amountToBorrow,
            supplied: swappedAmount,
        };
        this.loops.push(loop);
        logger_1.default.info(`Performed loop ${this.loops.length}, borrowed ${loop.borrowed} ${this.borrowedToken} and supplied ${loop.supplied} ${this.collateralToken}.`);
        return loop;
    }
    async borrowLoops(count) {
        let collateralAmount = this.initialCollateral;
        if (this.loops.length > 0) {
            collateralAmount = this.loops[this.loops.length - 1].supplied;
        }
        for (let i = 0; i < count; i++) {
            const loop = await this.borrowLoop(collateralAmount);
            collateralAmount = loop.supplied;
        }
    }
    async repayAll() {
        await this.repayLast(this.loops.length);
    }
    async repayLast(n = 1) {
        if (this.loops.length === 0) {
            logger_1.default.info("Everything is repayed, nothing to repay.");
            return;
        }
        const c = Math.min(this.loops.length, n);
        const loopsToRepay = this.loops.slice(-c);
        const sum = loopsToRepay.map((l) => l.borrowed).reduce((a, b) => a + b, 0);
        logger_1.default.info(`Repaying ${c} borrowed loops ${this.loops.length} for ${sum} ${this.borrowedToken}...`);
        await this.aave.repay(sum.toString(), this.borrowedToken);
        this.loops = this.loops.slice(0, this.loops.length - c);
        logger_1.default.info(`Repayed ${c} borrowed loops ${this.loops.length} for ${sum} ${this.borrowedToken}.`);
    }
    async balanceLoopsTo(n) {
        if (this.loops.length > n) {
            return await this.repayLast(this.loops.length - n);
        }
        else if (this.loops.length < n) {
            return await this.borrowLoops(n - this.loops.length);
        }
        else {
            logger_1.default.info(`Loop strategy is already on loop ${n}.`);
        }
    }
}
exports.LoopTrading = LoopTrading;
