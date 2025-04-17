import { getConfig } from "@xtreamly/utils/config";
import logger from "@xtreamly/utils/logger";

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function executor(
  actions: (round: number) => Promise<void>,
): Promise<void> {
  logger.info("Starting trading loop...");

  const interval = getConfig().interval;
  const rounds = getConfig().rounds;

  let i = 1;
  while (true) {
    try {
      await actions(i);
    } catch (err) {
      logger.error(`On round ${i}, ${err}`);
    }
    await sleep(interval * 1000);
    if (rounds && i >= rounds) {
      break;
    }
    i += 1;
  }

  logger.info("Trading loop ended.");
}