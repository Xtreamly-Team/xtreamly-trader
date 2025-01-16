import { loadEnv } from "@xtreamly/utils/config";
loadEnv()

import { getConfig } from "@xtreamly/utils/config";

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function executor(
  actions: (round: number) => Promise<void>,
): Promise<void> {
  console.log("Starting trading loop...");

  const interval = getConfig().interval
  const rounds = getConfig().rounds

  let i = 1
  while (true) {
    await actions(i)
    await sleep(interval * 1000)
    if (rounds && i >= rounds) {
      break
    }
    i += 1
  }

  console.log("Trading loop ended.");
}