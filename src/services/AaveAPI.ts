import { PROTOCOLS } from "@xtreamly/utils/aave_config";
import { API } from "@xtreamly/utils/api";

export interface AaveRate {
  timestamp: Date;
  liquidityRate_avg: number;
  variableBorrowRate_avg: number;
  utilizationRate_avg: number;
  stableBorrowRate_avg: number;
}

const HOURS_IN_MS = 60 * 60 * 1000;

export class AaveAPI extends API {
  private protocol: any;
  private protocolName: string;

  constructor(protocol: string) {
    super("https://aave-api-v2.aave.com/");
    this.protocolName = protocol;
    this.protocol = PROTOCOLS[protocol];
  }

  private static _toRates(res: any): AaveRate {
    const dt = new Date(
      res.x.year,
      res.x.month,
      res.x.date,
      res.x.hours,
    );

    return {
      timestamp: dt,
      liquidityRate_avg: parseFloat(res.liquidityRate_avg),
      variableBorrowRate_avg: parseFloat(res.variableBorrowRate_avg),
      utilizationRate_avg: parseFloat(res.utilizationRate_avg),
      stableBorrowRate_avg: parseFloat(res.stableBorrowRate_avg),
    };
  }

  async getRatesByCoin(
    coin: string,
    start: Date,
    freq: number = 1, // hours
  ): Promise<AaveRate[]> {
    const startTimestamp = Math.floor(start.getTime() / 1000); // Convert to seconds

    let reserveId = this.protocol.coins[coin];

    if (this.protocol.version === "v3") {
      reserveId = `${reserveId}${this.protocol.chainId}`;
    }

    const params: any = {
      reserveId,
      from: startTimestamp,
      resolutionInHours: freq,
    };

    const response = await this.get("data/rates-history", params);
    const records = response.map(AaveAPI._toRates);

    return records.map((record: AaveRate) => ({
      protocol: this.protocolName,
      protocol_version: this.protocol.version,
      chain_id: this.protocol.chainId,
      chain: this.protocol.chain,
      coin,
      coin_id: reserveId,
      ...record,
    }));
  }

  async getLatestRatesByCoin(coin: string): Promise<AaveRate> {
    const twoHoursAgo = new Date(Date.now() - 2 * HOURS_IN_MS);
    const rates = await this.getRatesByCoin(coin, twoHoursAgo);

    rates.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const rate = rates.pop();
    if (!rate) {
      throw new Error(`Failed to get AAVE rates for ${coin}.`);
    }
    return rate;
  }
}
