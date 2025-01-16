import { getChainDetails } from "@xtreamly/constants/helpers";
import { Contract } from "@xtreamly/utils/contracts";
import WalletBalanceProvider from '@artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WalletBalanceProvider.sol/WalletBalanceProvider.json';

export async function getTokenBalance(
  user: `0x${string}`,
  token: `0x${string}`
): Promise<bigint> {
  const chainDetails = getChainDetails()

  return await new Contract().readContract(
    chainDetails.WALLET_BALANCE_PROVIDER,
    'balanceOf',
    [user, token],
    WalletBalanceProvider.abi
  ) as bigint
}

export async function getBalances(
  user: `0x${string}`,
): Promise<{
  token: `0x${string}`,
  balance: bigint
}[]> {
  const chainDetails = getChainDetails()

  const balances = await new Contract().readContract(
    chainDetails.WALLET_BALANCE_PROVIDER,
    'getUserWalletBalances',
    [chainDetails.POOL_ADDRESSES_PROVIDER, user],
    WalletBalanceProvider.abi
  ) as [
    `0x${string}`[],
    bigint[]
  ];

  if (!balances.length) {
    return []
  }

  return balances[0].map((token, i) => ({
    token,
    balance: balances[1][i]
  }))
}
