import { XtreamlyAPI } from "../services/XtreamlyAPI";
import { VolatilityPrediction, StatePrediction, Horizons } from "../domains/VolatilityPrediction";
export declare class Volatility extends XtreamlyAPI {
    prediction(horizon?: Horizons, symbol?: string): Promise<VolatilityPrediction>;
    historicalPrediction(startDate: Date, endDate: Date, horizon?: Horizons, symbol?: string): Promise<VolatilityPrediction[]>;
    state(symbol?: string): Promise<StatePrediction>;
    historicalState(startDate: Date, endDate: Date, symbol?: string): Promise<VolatilityPrediction[]>;
}
//# sourceMappingURL=Volatility.d.ts.map