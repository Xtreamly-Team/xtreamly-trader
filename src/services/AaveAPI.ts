import { PROTOCOLS } from "@xtreamly/utils/aave_config";

export interface AaveRate {
  timestamp: Date;
  liquidityRate_avg: number;
  variableBorrowRate_avg: number;
  utilizationRate_avg: number;
  stableBorrowRate_avg: number;
}

const HOURS_IN_MS = 60 * 60 * 1000;

export class AaveAPI {
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = "https://aave-api-v2.aave.com/";
  }

  private static _toRates(res: any): AaveRate {
    const dt = new Date(
      res.x.year,
      res.x.month,
      res.x.date,
      res.x.hours
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
    protocol: string,
    coin: string,
    start: Date,
    freq: number = 1 // hours
  ): Promise<AaveRate[]> {
    const startTimestamp = Math.floor(start.getTime() / 1000); // Convert to seconds
    const prot: any = PROTOCOLS[protocol];

    let reserveId = prot.coins[coin];

    if (prot.version === "v3") {
      reserveId = `${reserveId}${prot.chainId}`;
    }

    const params: any = {
      reserveId,
      from: startTimestamp,
      resolutionInHours: freq,
    };

    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}data/rates-history?${queryParams}`

    const response = await fetch(url).then(res => res.json())
    const records = response.map(AaveAPI._toRates);

    return records.map((record: AaveRate) => ({
      protocol,
      protocol_version: prot.version,
      chain_id: prot.chainId,
      chain: prot.chain,
      coin,
      coin_id: reserveId,
      ...record,
    }));
  }

  async getLatestRatesByCoin(
    protocol: string,
    coin: string,
  ): Promise<AaveRate | undefined> {
    const twoHoursAgo = new Date(Date.now() - 2 * HOURS_IN_MS);
    const rates = await this.getRatesByCoin(protocol, coin, twoHoursAgo)

    rates.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return rates.pop()
  }
}
