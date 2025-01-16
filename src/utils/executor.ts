import { loadEnv } from "@xtreamly/utils/config";

loadEnv()


export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function executor(
  actions: (round: number) => Promise<void>,
  interval: number = 60, // Seconds
  round?: number
): Promise<void> {
  console.log("Starting trading loop...");

  let i = 1
  while (true) {
    await actions(i)
    await sleep(interval * 1000)
    if (round && i >= round) {
      break
    }
    i += 1
  }

  console.log("Trading loop ended.");
}