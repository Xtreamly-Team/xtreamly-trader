import * as dotenv from 'dotenv';
import { getChainDetails } from "@xtreamly/constants/helpers";
import { ethers, Wallet } from "ethers";

const requiredEnvVars = [
  'CHAIN',
  'NETWORK',
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

  const chainDetails = getChainDetails()

  if (!process.env.RPC) {
    process.env.RPC = chainDetails.RPC
  }
}

export function loadEnv() {
  dotenv.config()
  checkEnvVars()
}

export interface Config {
  chain: string
  network: string
  rpc: string
  walletPrivateKey: string
  interval: number
  rounds: number | undefined
}

export function getConfig(): Config {
  return {
    chain: process.env.CHAIN!,
    network: process.env.NETWORK!,
    rpc: process.env.RPC!,
    walletPrivateKey: process.env.WALLET_PRIVATE_KEY!,
    interval: parseInt(process.env.EXECUTION_INTERVAL!),
    rounds: process.env.ROUNDS && parseInt(process.env.ROUNDS) || undefined,
  }
}

export function getWallet(): Wallet {
  const config = getConfig()

  const provider = new ethers.JsonRpcProvider(config.rpc);
  return new ethers.Wallet(config.walletPrivateKey, provider);
}