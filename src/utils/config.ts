import * as dotenv from 'dotenv';
import { getChainDetails } from "@xtreamly/constants/helpers";

const requiredEnvVars = [
  'CHAIN',
  'NETWORK',
  'EXECUTION_INTERVAL',
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
  interval: number
  rounds: number | undefined
}

export function getConfig(): Config {
  return {
    chain: process.env.CHAIN!,
    network: process.env.NETWORK!,
    rpc: process.env.RPC!,
    interval: parseInt(process.env.EXECUTION_INTERVAL!),
    rounds: process.env.ROUNDS && parseInt(process.env.ROUNDS) || undefined,
  }
}