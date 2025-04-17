import { API } from "../utils/api";
export interface AaveRate {
    timestamp: Date;
    liquidityRate_avg: number;
    variableBorrowRate_avg: number;
    utilizationRate_avg: number;
    stableBorrowRate_avg: number;
}
export declare class AaveAPI extends API {
    private protocol;
    private protocolName;
    constructor(protocol: string);
    private static _toRates;
    getRatesByCoin(coin: string, start: Date, freq?: number): Promise<AaveRate[]>;
    getLatestRatesByCoin(coin: string): Promise<AaveRate>;
}
//# sourceMappingURL=AaveAPI.d.ts.map