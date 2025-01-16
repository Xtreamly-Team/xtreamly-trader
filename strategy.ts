import { Volatility } from "@xtreamly/models/Volatility";
import { executor } from "@xtreamly/utils/executor";
import { getChainDetails } from "@xtreamly/constants/helpers";
import {
  getTokenBalance,
  getBalances,
} from "@xtreamly/actions";

const EXECUTION_INTERVAL = 1 // SECONDS
const MAX_ROUNDS = 1
const wallet = '0xf2873F92324E8EC98a82C47AFA0e728Bd8E41665'

async function actions(round: number) {
  const chainDetails = getChainDetails()

  const volatility = new Volatility()
  const pred = await volatility.lowPrediction()

  const balance = await getTokenBalance(wallet, chainDetails.TOKENS.USDC)
  const balances = await getBalances(wallet)

  console.log("Round", round);
  console.log("USDC balance", balance);
  console.log("Balance", balances);
  console.log("Low volatility predicted", pred.low_volatility_signal);
}

executor(actions, EXECUTION_INTERVAL, MAX_ROUNDS).catch(console.error)