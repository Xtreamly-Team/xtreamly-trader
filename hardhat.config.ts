import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-tracer";

// This is a default API Key, nothing of value or risk is exposed here.
// Also Deployer Private Key is a default value, nothing of value or risk is exposed here.
const providerApiKey = process.env.CHAINSTACK_API_KEY;
const providerApiKeyArbitrum = process.env.CHAINSTACK_API_KEY_ARBITRUM;
const providerApiKeyArbitrumSepolia = process.env.CHAINSTACK_API_KEY_ARBITRUM_SEPOLIA;
const providerApiKeySEPOLIA = process.env.CHAINSTACK_API_KEY_SEPOLIA;
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;



        // Arbitrum Fork settings
        // url: `https://nd-551-943-624.p2pify.com/${providerApiKeyArbitrum}`,
        // enabled: process.env.ARBITRUM_FORKING_ENABLED === "true",
        // blockNumber: 270938268

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "mainnet",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        // url: `https://ethereum-mainnet.core.chainstack.com/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
        // blockNumber: 20999740
        blockNumber: 21124746
        // blockNumber: 274990945
      },
      gas: "auto",
      gasPrice: "auto",
      maxFeePerGas: "80000000000", // 80 gwei in wei
      maxPriorityFeePerGas: "2000000000", // 2 gwei in wei

    },
    mainnet: {
      url: `https://ethereum-mainnet.core.chainstack.com/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      gas: "auto",
      gasPrice: "auto",
    },
    sepolia: {
      url: `https://ethereum-sepolia.core.chainstack.com/${providerApiKeySEPOLIA}`,
      accounts: [deployerPrivateKey],
    },
    arbitrum: {
      url: `https://arb1.arbitrum.io/rpc`,
      accounts: [deployerPrivateKey],
    },
    arbitrumSepolia: {
      url: `https://sepolia-rollup.arbitrum.io/rpc`,
      accounts: [deployerPrivateKey],
    },
    /*
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimismSepolia: {
      url: `https://opt-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvm: {
      url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvmTestnet: {
      url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: [deployerPrivateKey],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      accounts: [deployerPrivateKey],
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [deployerPrivateKey],
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [deployerPrivateKey],
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    scroll: {
      url: "https://rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    pgn: {
      url: "https://rpc.publicgoods.network",
      accounts: [deployerPrivateKey],
    },
    pgnTestnet: {
      url: "https://sepolia.publicgoods.network",
      accounts: [deployerPrivateKey],
    },
    */
  },
  // configuration for harhdat-verify plugin
  etherscan: {
    apiKey: `${etherscanApiKey}`,
  },
  // configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
    },
  },
  sourcify: {
    enabled: false,
  },
      paths: {
        sources: './contracts',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
};

export default config;
