import { executor } from "@xtreamly/utils/executor";
import { getChainDetails } from "@xtreamly/constants/helpers";
import { Volatility } from "@xtreamly/models";
import { getTokenBalance, } from "@xtreamly/actions";

const wallet = '0xABC'

async function actions(round: number) {
  const chainDetails = getChainDetails()
  console.log("Round", round);

  const pred = await new Volatility().lowPrediction()
  console.log("Low volatility predicted", pred.low_volatility_signal);

  const balance = await getTokenBalance(wallet, chainDetails.TOKENS.USDC)
  console.log("USDC balance", balance);
}

executor(actions).catch(console.error)