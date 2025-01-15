import { ethers } from "ethers";
import { AaveV3Ethereum,  AaveV3Arbitrum, AaveV3Sepolia, AaveV3ArbitrumSepolia } from "@bgd-labs/aave-address-book";

export const ADMIN_ADDRESS = '0x3195B95682581c88767F6b77a3B01f78517B5390';

export const PAUSER_ROLE = '0x3195B95682581c88767F6b77a3B01f78517B5390'
export const MINTER_ROLE = '0x3195B95682581c88767F6b77a3B01f78517B5390'
export const EXECUTOR_ROLE = '0x3195B95682581c88767F6b77a3B01f78517B5390'

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
/********************/
/***** Mainnet ******/
/********************/
// RAND ADDRESS ATM 
export const DEX_ADDRESS = '0x3195B95682581c88767F6b77a3B01f78517B5390'

// Pool
export const AAVE_POOL_MAINNET = AaveV3Ethereum.POOL
export const ETH_V3_POOL_AAVE = AaveV3Ethereum.POOL;

export const WETH_MAINNET_WHALE = "0xB13aa2d0345b0439b064f26B82D8dCf3f508775d";
export const USDT_MAINNET_WHALE = "0x3a3C006053a9B40286B9951A11bE4C5808c11dc8";

// Token Addresses
export const DAI_ADDRESS = AaveV3Ethereum.ASSETS.DAI.UNDERLYING;
export const USDC_ADDRESS = AaveV3Ethereum.ASSETS.USDC.UNDERLYING;
export const USDT_ADDRESS = AaveV3Ethereum.ASSETS.USDT.UNDERLYING;
export const WETH_ADDRESS = AaveV3Ethereum.ASSETS.WETH.UNDERLYING;
export const WBTC_ADDRESS = AaveV3Ethereum.ASSETS.WBTC.UNDERLYING;

// Mainnet A-Token
export const A_DAI_ADDRESS = AaveV3Ethereum.ASSETS.DAI.A_TOKEN;
export const A_USDC_ADDRESS = AaveV3Ethereum.ASSETS.USDC.A_TOKEN;
export const A_USDT_ADDRESS = AaveV3Ethereum.ASSETS.USDT.A_TOKEN;
export const A_WETH_ADDRESS = AaveV3Ethereum.ASSETS.WETH.A_TOKEN;
export const A_WBTC_ADDRESS = AaveV3Ethereum.ASSETS.WBTC.A_TOKEN;

/**********************/
/**  ArbitrumMainnet **/
/**********************/
export const ARB_V3_POOL_AAVE = AaveV3Arbitrum.POOL;
export const USDT_WHALE_ARB = '0x3931dAb967C3E2dbb492FE12460a66d0fe4cC857';

// Token Addresses Arbitrum
export const USDT_ADDRESS_ARB = AaveV3Arbitrum.ASSETS.USDT.UNDERLYING;
export const USDC_ADDRESS_ARB = AaveV3Arbitrum.ASSETS.USDC.UNDERLYING;
export const DAI_ADDRESS_ARB = AaveV3Arbitrum.ASSETS.DAI.UNDERLYING;
export const WETH_ADDRESS_ARB = AaveV3Arbitrum.ASSETS.WETH.UNDERLYING;
export const WBTC_ADDRESS_ARB = AaveV3Arbitrum.ASSETS.WBTC.UNDERLYING; 

// Arbitrum A-Token Address 
export const A_WETH_ADDRESS_ARB = AaveV3Arbitrum.ASSETS.WETH.A_TOKEN;
export const A_USDT_ADDRESS_ARB = AaveV3Arbitrum.ASSETS.USDT.A_TOKEN;
export const A_USDC_ADDRESS_ARB = AaveV3Arbitrum.ASSETS.USDC.A_TOKEN;
export const A_DAI_ADDRESS_ARB = AaveV3Arbitrum.ASSETS.DAI.A_TOKEN;
export const A_WBTC_ADDRESS_ARB = AaveV3Arbitrum.ASSETS.WBTC.A_TOKEN;



/**********************/
// ArbitrumSepolia ****/
/**********************/
export const ARB_SEP_V3_POOL_AAVE = AaveV3ArbitrumSepolia.POOL;
export const ARB_SEP_WALLET_BALANCE_PROVIDER = AaveV3ArbitrumSepolia.WALLET_BALANCE_PROVIDER;
export const ARB_SEP_V3_UIPOOL_DATA_Provider = AaveV3ArbitrumSepolia.UI_POOL_DATA_PROVIDER;
export const ARB_SEP_POOL_ADDRESSES_PROVIDER = AaveV3ArbitrumSepolia.POOL_ADDRESSES_PROVIDER;
export const ARB_SEP_WRAPPED_TOKEN_GATEWAY = AaveV3ArbitrumSepolia.WETH_GATEWAY;
export const ARB_SEP_POOL_ADDRESS_PROVIDER = AaveV3ArbitrumSepolia.POOL_ADDRESSES_PROVIDER;
export const ARB_SEP_AAVE_PROTOCOL_DATA_PROVIDER = AaveV3ArbitrumSepolia.AAVE_PROTOCOL_DATA_PROVIDER;
export const ARB_SEP_UI_POOL_DATA_PROVIDER = AaveV3ArbitrumSepolia.UI_POOL_DATA_PROVIDER;
// Token Addresses Arbitrum Sepolia 
export const DAI_ADDRESS_SEP = ""
export const USDC_ADDRESS_SEP = AaveV3ArbitrumSepolia.ASSETS.USDC.UNDERLYING;
export const USDC_ADDRESS_SEP_ID = AaveV3ArbitrumSepolia.ASSETS.USDC.id;
export const WETH_ADDRESS_SEP = AaveV3ArbitrumSepolia.ASSETS.WETH.UNDERLYING;
export const WETH_ADDRESS_SEP_ID = AaveV3ArbitrumSepolia.ASSETS.WETH.id;

// Atrbitrum Sepolia A-Token Address
export const A_WETH_ADDRESS_SEP = AaveV3ArbitrumSepolia.ASSETS.WETH.A_TOKEN;
export const A_USDC_ADDRESS_SEP = AaveV3ArbitrumSepolia.ASSETS.USDC.A_TOKEN;
// Arbitrum DebtToken Addresses
export const ARB_SEP_VARIABLE_DEBT_WETH = AaveV3ArbitrumSepolia.DEFAULT_VARIABLE_DEBT_TOKEN_IMPL_REV_1;


/**********************/
// Uniswap V3 *********/
// ArbitrumSepolia ****/
/**********************/

export const ARB_SEP_UNI_WETH_ADDRESS = '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73'
export const ARB_SEP_UNISWAPV3FACTORY = '0x248AB79Bbb9bC29bB72f7Cd42F17e054Fc40188e'
export const ARB_SEP_QUOTERV2 = '0x2779a0CC1c3e0E44D2542EC3e79e3864Ae93Ef0B'
export const ARB_SEP_SWAPROUTER02 = '0x101F443B4d1b059569D643917553c771E1b9663E'

