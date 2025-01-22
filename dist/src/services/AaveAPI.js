"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AaveAPI = void 0;
const aave_config_1 = require("@xtreamly/utils/aave_config");
const HOURS_IN_MS = 60 * 60 * 1000;
class AaveAPI {
    constructor() {
        this.baseUrl = "https://aave-api-v2.aave.com/";
    }
    static _toRates(res) {
        const dt = new Date(res.x.year, res.x.month, res.x.date, res.x.hours);
        return {
            timestamp: dt,
            liquidityRate_avg: parseFloat(res.liquidityRate_avg),
            variableBorrowRate_avg: parseFloat(res.variableBorrowRate_avg),
            utilizationRate_avg: parseFloat(res.utilizationRate_avg),
            stableBorrowRate_avg: parseFloat(res.stableBorrowRate_avg),
        };
    }
    async getRatesByCoin(protocol, coin, start, freq = 1 // hours
    ) {
        const startTimestamp = Math.floor(start.getTime() / 1000); // Convert to seconds
        const prot = aave_config_1.PROTOCOLS[protocol];
        let reserveId = prot.coins[coin];
        if (prot.version === "v3") {
            reserveId = `${reserveId}${prot.chainId}`;
        }
        const params = {
            reserveId,
            from: startTimestamp,
            resolutionInHours: freq,
        };
        const queryParams = new URLSearchParams(params).toString();
        const url = `${this.baseUrl}data/rates-history?${queryParams}`;
        const response = await fetch(url).then(res => res.json());
        const records = response.map(AaveAPI._toRates);
        return records.map((record) => ({
            protocol,
            protocol_version: prot.version,
            chain_id: prot.chainId,
            chain: prot.chain,
            coin,
            coin_id: reserveId,
            ...record,
        }));
    }
    async getLatestRatesByCoin(protocol, coin) {
        const twoHoursAgo = new Date(Date.now() - 2 * HOURS_IN_MS);
        const rates = await this.getRatesByCoin(protocol, coin, twoHoursAgo);
        rates.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        return rates.pop();
    }
}
exports.AaveAPI = AaveAPI;
