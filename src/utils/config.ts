import * as dotenv from 'dotenv';
import { ethers, Wallet } from "ethers";
import type { Chain } from "viem/_types/types/chain";
import * as viemChains from "viem/chains";

const requiredEnvVars = [
  'CHAIN',
  'EXECUTION_INTERVAL',
  'WALLET_PRIVATE_KEY',
];


function checkEnvVars() {
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

export function loadEnv() {
  dotenv.config()
  checkEnvVars()
}

loadEnv();

export interface Config {
  chain: ChainDetails
  provider: ethers.providers.JsonRpcProvider
  wallet: Wallet
  interval: number
  rounds: number | undefined
}

export function getConfig(): Config {
  const chain = getChainDetails()
  const rpc = process.env.RPC || chain.rpc
  const provider = new ethers.providers.JsonRpcProvider(rpc)
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!, provider)

  return {
    chain,
    provider,
    wallet,
    interval: parseInt(process.env.EXECUTION_INTERVAL!),
    rounds: process.env.ROUNDS && parseInt(process.env.ROUNDS) || undefined,
  }
}

export function getProvider(): ethers.providers.JsonRpcProvider {
  return getConfig().provider
}

export function getWallet(): Wallet {
  return getConfig().wallet
}

export interface ChainDetails {
  viemChain: Chain
  rpc: string
}

function getChainDetails(): ChainDetails {
  const chain = process.env.CHAIN!;
  const network = process.env.NETWORK!

  const cn = chain + (network === "mainnet" ? '' : `-${network}`);
  const network1 = ethers.providers.getNetwork(cn);
  const chains = Object.values(viemChains).filter((vc) => vc.id === network1.chainId)

  if (chains.length === 0) {
    throw new Error(`${chain} ${network} is not supported on yet.`);
  }

  const viemChain = chains[0]
  const rpc = viemChain.rpcUrls.default.http[0]

  return {
    viemChain,
    rpc
  }
}