"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AaveAPI = void 0;
const aave_config_1 = require("../utils/aave_config");
const api_1 = require("../utils/api");
const HOURS_IN_MS = 60 * 60 * 1000;
class AaveAPI extends api_1.API {
    constructor(protocol) {
        super("https://aave-api-v2.aave.com/");
        this.protocolName = protocol;
        this.protocol = aave_config_1.PROTOCOLS[protocol];
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
    async getRatesByCoin(coin, start, freq = 1) {
        const startTimestamp = Math.floor(start.getTime() / 1000); // Convert to seconds
        let reserveId = this.protocol.coins[coin];
        if (this.protocol.version === "v3") {
            reserveId = `${reserveId}${this.protocol.chainId}`;
        }
        const params = {
            reserveId,
            from: startTimestamp,
            resolutionInHours: freq,
        };
        const response = await this.get("data/rates-history", params);
        const records = response.map(AaveAPI._toRates);
        return records.map((record) => ({
            protocol: this.protocolName,
            protocol_version: this.protocol.version,
            chain_id: this.protocol.chainId,
            chain: this.protocol.chain,
            coin,
            coin_id: reserveId,
            ...record,
        }));
    }
    async getLatestRatesByCoin(coin) {
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
exports.AaveAPI = AaveAPI;
