import { executor } from "@xtreamly/utils/executor";
import { getConfig } from "@xtreamly/utils/config";
import { VolatilityAPI } from "@xtreamly/services/VolatilityAPI";
import { AaveActions } from "@xtreamly/actions/AaveActions";

async function actions(round: number) {
  const config = getConfig();

  const pred = await new VolatilityAPI().prediction();
  console.log("Low volatility predicted", pred.volatility);

  const aave = new AaveActions(config.chain.viemChain, config.provider, config.wallet);
  const balances = await aave.getAaveBalances();
  console.log("You aave balance", balances);
}

executor(actions).catch(console.error)