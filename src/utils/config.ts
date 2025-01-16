import * as dotenv from 'dotenv';
import { getChainDetails } from "@xtreamly/constants/helpers";

const requiredEnvVars = [
  'CHAIN',
  'NETWORK',
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
}

export function getConfig(): Config {
  return {
    chain: process.env.CHAIN!,
    network: process.env.NETWORK!,
    rpc: process.env.RPC!,
  }
}