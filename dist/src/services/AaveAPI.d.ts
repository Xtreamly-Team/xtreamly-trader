export interface AaveRate {
    timestamp: Date;
    liquidityRate_avg: number;
    variableBorrowRate_avg: number;
    utilizationRate_avg: number;
    stableBorrowRate_avg: number;
}
export declare class AaveAPI {
    private readonly baseUrl;
    constructor();
    private static _toRates;
    getRatesByCoin(protocol: string, coin: string, start: Date, freq?: number): Promise<AaveRate[]>;
    getLatestRatesByCoin(protocol: string, coin: string): Promise<AaveRate | undefined>;
}
//# sourceMappingURL=AaveAPI.d.ts.map