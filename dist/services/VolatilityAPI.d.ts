import { XtreamlyAPI } from "../services/XtreamlyAPI";
import { Horizons, StatePrediction, Symbols, VolatilityPrediction } from "../domains/VolatilityPrediction";
export declare class VolatilityAPI extends XtreamlyAPI {
    prediction(horizon?: Horizons, symbol?: Symbols): Promise<VolatilityPrediction>;
    historicalPrediction(startDate: Date, endDate: Date, horizon?: Horizons, symbol?: Symbols): Promise<VolatilityPrediction[]>;
    state(symbol?: Symbols): Promise<StatePrediction>;
    historicalState(startDate: Date, endDate: Date, symbol?: Symbols): Promise<VolatilityPrediction[]>;
}
//# sourceMappingURL=VolatilityAPI.d.ts.map