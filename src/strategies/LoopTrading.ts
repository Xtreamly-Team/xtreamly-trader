import { providers, Wallet } from "ethers";
import type { Chain } from "viem/_types/types/chain";
import { AaveActions } from "@xtreamly/actions";
import logger from "@xtreamly/utils/logger";
import { UniswapActions } from "@xtreamly/actions/UniswapActions";
import { WETHActions } from "@xtreamly/actions/WETHActions";

export interface LoopData {
  borrowed: number;
  supplied: number;
}

export class LoopTrading {
  private loops: LoopData[];
  private readonly collateralToken: string;
  private readonly borrowedToken: string;
  private initialCollateral: number;
  private aave: AaveActions;
  private uniswap: UniswapActions;
  private wethActions: WETHActions;

  constructor(
    chain: Chain,
    provider: providers.JsonRpcProvider,
    signer: Wallet,
    collateralToken: string,
    borrowedToken: string,
  ) {
    this.aave = new AaveActions(chain, provider, signer);
    this.uniswap = new UniswapActions(chain, provider, signer);
    const wethAddress = this.aave.getAsset("WETH").UNDERLYING;
    this.wethActions = new WETHActions(wethAddress, signer);

    this.loops = [];
    this.collateralToken = collateralToken;
    this.borrowedToken = borrowedToken;
    this.initialCollateral = 0;
  }

  async init(initialCollateral: number) {
    logger.info(`Initializing your loop trading by supplying ${initialCollateral} ${this.collateralToken} as collateral...`);
    this.initialCollateral = initialCollateral;
    // await this.aave.supply(initialCollateral.toString(), this.collateralToken);
    logger.info(`Initialized your loop trading by supplying ${initialCollateral} ${this.collateralToken} as collateral.`);
  }

  async swap(amount: number, fromToken: string, toToken: string) {
    const fromAsset = this.aave.getAsset(fromToken);
    if (fromToken === "WETH") {
      await this.wethActions.wrap(amount);
    }
    const toAsset = this.aave.getAsset(toToken);
    const amountSwapped = await this.uniswap.swapV2(
      amount.toString(),
      fromAsset.UNDERLYING,
      toAsset.UNDERLYING
    );
    return parseFloat(amountSwapped);
  }

  async borrowLoop(amount: number) {
    const userSummary = await this.aave.getUserSummary();

    const ltv = parseFloat(userSummary.currentLoanToValue);

    const gasFees = 0.01;
    const ltvAdjusterAmount = amount * (ltv - gasFees);
    const amountToBorrow = await this.aave.convertTokenAmount(ltvAdjusterAmount, this.collateralToken, this.borrowedToken);

    logger.info(`Performing loop ${this.loops.length + 1} for ${amount} ${this.collateralToken}...`);

    await this.aave.borrow(amountToBorrow.toString(), this.borrowedToken);
    const swappedAmount = await this.swap(amountToBorrow, this.borrowedToken, this.collateralToken);
    await this.aave.supply(swappedAmount.toString(), this.collateralToken);

    const loop = {
      borrowed: amountToBorrow,
      supplied: swappedAmount,
    };

    this.loops.push(loop);

    logger.info(`Performed loop ${this.loops.length}, borrowed ${loop.borrowed} ${this.borrowedToken} and supplied ${loop.supplied} ${this.collateralToken}.`);

    return loop;
  }

  async borrowLoops(count: number) {
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

  async repayLast(n: number = 1) {
    if (this.loops.length === 0) {
      logger.info("Everything is repayed, nothing to repay.");
      return;
    }
    const c = Math.min(this.loops.length, n);
    const loopsToRepay = this.loops.slice(-c);

    const sum = loopsToRepay.map((l) => l.borrowed).reduce((a, b) => a + b, 0);
    logger.info(`Repaying ${c} borrowed loops ${this.loops.length} for ${sum} ${this.borrowedToken}...`);
    await this.aave.repay(sum.toString(), this.borrowedToken);
    this.loops = this.loops.slice(0, this.loops.length - c);
    logger.info(`Repayed ${c} borrowed loops ${this.loops.length} for ${sum} ${this.borrowedToken}.`);
  }

  async balanceLoopsTo(n: number) {
    if (this.loops.length > n) {
      return await this.repayLast(this.loops.length - n);
    } else if (this.loops.length < n) {
      return await this.borrowLoops(n - this.loops.length);
    } else {
      logger.info(`Loop strategy is already on loop ${n}.`);
    }
  }
}
