import { XtreamlyAPI, XtreamlyAPIPath } from "../services/XtreamlyAPI";
import LowVolatilityPrediction from "../domains/LowVolatilityPrediction";

export class Volatility extends XtreamlyAPI {
  async lowPrediction(): Promise<LowVolatilityPrediction> {
    return this.get(XtreamlyAPIPath.volatility)
  }
}