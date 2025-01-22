"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAINS = void 0;
const aave_address_book_1 = require("@bgd-labs/aave-address-book");
const chains_1 = require("viem/chains");
exports.CHAINS = {
    arbitrum: {
        sepolia: {
            viemChain: chains_1.arbitrumSepolia,
            RPC: 'https://sepolia-rollup.arbitrum.io/rpc',
            WALLET_BALANCE_PROVIDER: aave_address_book_1.AaveV3ArbitrumSepolia.WALLET_BALANCE_PROVIDER,
            POOL_ADDRESSES_PROVIDER: aave_address_book_1.AaveV3ArbitrumSepolia.POOL_ADDRESSES_PROVIDER,
            WRAPPED_TOKEN_GATEWAY: aave_address_book_1.AaveV3ArbitrumSepolia.WETH_GATEWAY,
            V3_POOL_AAVE: aave_address_book_1.AaveV3ArbitrumSepolia.POOL,
            TOKENS: {
                USDC: aave_address_book_1.AaveV3ArbitrumSepolia.ASSETS.USDC.UNDERLYING,
                WETH: aave_address_book_1.AaveV3ArbitrumSepolia.ASSETS.WETH.UNDERLYING,
                A_USDC: aave_address_book_1.AaveV3ArbitrumSepolia.ASSETS.USDC.A_TOKEN,
                A_WETH: aave_address_book_1.AaveV3ArbitrumSepolia.ASSETS.WETH.A_TOKEN,
            }
        },
        mainnet: {
            viemChain: chains_1.arbitrum,
            RPC: 'https://arb1.arbitrum.io/rpc',
            WALLET_BALANCE_PROVIDER: aave_address_book_1.AaveV3Arbitrum.WALLET_BALANCE_PROVIDER,
            POOL_ADDRESSES_PROVIDER: aave_address_book_1.AaveV3Arbitrum.POOL_ADDRESSES_PROVIDER,
            WRAPPED_TOKEN_GATEWAY: aave_address_book_1.AaveV3Arbitrum.WETH_GATEWAY,
            V3_POOL_AAVE: aave_address_book_1.AaveV3Arbitrum.POOL,
            TOKENS: {
                AAVE: aave_address_book_1.AaveV3Arbitrum.ASSETS.AAVE.UNDERLYING,
                USDC: aave_address_book_1.AaveV3Arbitrum.ASSETS.USDC.UNDERLYING,
                WETH: aave_address_book_1.AaveV3Arbitrum.ASSETS.WETH.UNDERLYING,
                A_AAVE: aave_address_book_1.AaveV3Arbitrum.ASSETS.AAVE.A_TOKEN,
                A_USDC: aave_address_book_1.AaveV3Arbitrum.ASSETS.USDC.A_TOKEN,
                A_WETH: aave_address_book_1.AaveV3Arbitrum.ASSETS.WETH.A_TOKEN,
            }
        }
    }
};
