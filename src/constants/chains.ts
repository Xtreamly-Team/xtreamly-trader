import {
  AaveV3Arbitrum,
  AaveV3ArbitrumSepolia
} from "@bgd-labs/aave-address-book";
import {
  arbitrum,
  arbitrumSepolia,
} from 'viem/chains';
import type { Chain } from "viem/_types/types/chain";

export interface ChainDetails {
  viemChain: Chain
  RPC: string
  WALLET_BALANCE_PROVIDER: `0x${string}`
  POOL_ADDRESSES_PROVIDER: `0x${string}`
  TOKENS: {
    AAVE?: `0x${string}`
    USDC: `0x${string}`
    WETH: `0x${string}`
    A_AAVE?: `0x${string}`
    A_USDC: `0x${string}`
    A_WETH: `0x${string}`
  }
}

export const CHAINS: any = {
  arbitrum: {
    sepolia: {
      viemChain: arbitrumSepolia,
      RPC: 'https://sepolia-rollup.arbitrum.io/rpc',
      WALLET_BALANCE_PROVIDER: AaveV3ArbitrumSepolia.WALLET_BALANCE_PROVIDER,
      POOL_ADDRESSES_PROVIDER: AaveV3ArbitrumSepolia.POOL_ADDRESSES_PROVIDER,
      TOKENS: {
        USDC: AaveV3ArbitrumSepolia.ASSETS.USDC.UNDERLYING,
        WETH: AaveV3ArbitrumSepolia.ASSETS.WETH.UNDERLYING,
        A_USDC: AaveV3ArbitrumSepolia.ASSETS.USDC.A_TOKEN,
        A_WETH: AaveV3ArbitrumSepolia.ASSETS.WETH.A_TOKEN,
      }
    },
    mainnet: {
      viemChain: arbitrum,
      RPC: 'https://arb1.arbitrum.io/rpc',
      WALLET_BALANCE_PROVIDER: AaveV3Arbitrum.WALLET_BALANCE_PROVIDER,
      POOL_ADDRESSES_PROVIDER: AaveV3Arbitrum.POOL_ADDRESSES_PROVIDER,
      TOKENS: {
        AAVE: AaveV3Arbitrum.ASSETS.AAVE.UNDERLYING,
        USDC: AaveV3Arbitrum.ASSETS.USDC.UNDERLYING,
        WETH: AaveV3Arbitrum.ASSETS.WETH.UNDERLYING,
        A_AAVE: AaveV3Arbitrum.ASSETS.AAVE.A_TOKEN,
        A_USDC: AaveV3Arbitrum.ASSETS.USDC.A_TOKEN,
        A_WETH: AaveV3Arbitrum.ASSETS.WETH.A_TOKEN,
      }
    }
  }
}
