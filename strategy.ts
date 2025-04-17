import { executor } from "@xtreamly/utils/executor";
import { getConfig } from "@xtreamly/utils/config";
import { VolatilityAPI } from "@xtreamly/services/VolatilityAPI";
import { AaveAPI } from "@xtreamly/services/AaveAPI";
import { AaveActions } from "@xtreamly/actions/AaveActions";
import logger from "@xtreamly/utils/logger";
import { LoopTrading } from "./src/strategies/LoopTrading";

// Performing loop trading strategy using AAVE as described here:
// https://medium.com/contango-xyz/what-is-looping-78421c8a1367

const MIN_LOOPS = 4;
const MAX_LOOPS = 10;
const APPLY_ON_VOL_HIGH = false;
const AMOUNT_TOKEN_COLLATERAL = 10;
const LIMIT_RATE_UTILIZATION = 0.9;
const COLLATERAL_TOKEN = "USDCn";
const BORROWED_TOKEN = "WETH";

const config = getConfig();
const aave = new AaveActions(config.chain.viemChain, config.provider, config.wallet);
const loopTrading = new LoopTrading(config.chain.viemChain, config.provider, config.wallet, COLLATERAL_TOKEN, BORROWED_TOKEN);
const volatilityApi = new VolatilityAPI();
const aaveApi = new AaveAPI(`aave_v3_${config.chain.name}`);

async function init() {
  await loopTrading.init(AMOUNT_TOKEN_COLLATERAL);
}

async function actions(round: number) {
  const aaveUserSummary = await aave.getUserSummary();
  const collateralReserve = await aave.getTokenReserves(COLLATERAL_TOKEN);
  const borrowReserve = await aave.getTokenReserves(BORROWED_TOKEN);

  const ethRate = await aaveApi.getLatestRatesByCoin("Wrapped Ether");
  const usdcRate = await aaveApi.getLatestRatesByCoin("USD Coin");

  const rateSupplyUsdc = collateralReserve.reserve.supplyAPY;
  const rateBorrowEth = borrowReserve.reserve.variableBorrowAPY;
  const rateUtilizationUsdc = usdcRate.utilizationRate_avg;
  const rateUtilizationEth = ethRate.utilizationRate_avg;

  // HEALTH check if rates allow for loop trading
  if (rateSupplyUsdc >= rateBorrowEth) {
    logger.info(`${COLLATERAL_TOKEN} supply rate ${rateSupplyUsdc} > ${BORROWED_TOKEN} borrow rate ${rateBorrowEth}, getting out...`);
    return await loopTrading.repayAll();
  }

  const hasHealthyRates = rateUtilizationUsdc < LIMIT_RATE_UTILIZATION && rateUtilizationEth < LIMIT_RATE_UTILIZATION;
  // HEALTH check on utilization rate
  if (!hasHealthyRates) {
    logger.info(`Unhealthy rates detected for ${COLLATERAL_TOKEN} or ${BORROWED_TOKEN} > ${LIMIT_RATE_UTILIZATION}, getting out...`);
    return await loopTrading.repayAll();
  }

  const healthFactor = parseFloat(aaveUserSummary.healthFactor);
  // apply reducing loops on health factor check
  if (healthFactor > 0 && healthFactor <= 1.01) {
    logger.info(`Health factor ${healthFactor} dropped below 1.01, repaying last loop.`);
    return await loopTrading.repayLast();
  }

  const marketStatus = (await volatilityApi.state()).classification;
  if (marketStatus == "lowvol") {
    logger.info(`Market volatility status is ${marketStatus}, balancing loops to ${MIN_LOOPS}...`);
    return await loopTrading.balanceLoopsTo(MIN_LOOPS);
  } else if (!APPLY_ON_VOL_HIGH) {
    logger.info(`Market volatility status is ${marketStatus}, getting out...`);
    return await loopTrading.repayAll();
  } else if (APPLY_ON_VOL_HIGH) {
    logger.info(`Market volatility status is ${marketStatus}, balancing loops to ${MAX_LOOPS}...`);
    return await loopTrading.balanceLoopsTo(MAX_LOOPS);
  }
}

init().then(() => executor(actions)).catch(logger.error);
