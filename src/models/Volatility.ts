import { XtreamlyAPI, XtreamlyAPIPath } from "../utils/XtreamlyAPI";
import LowVolatilityPrediction from "../domains/LowVolatilityPrediction";

export class Volatility extends XtreamlyAPI {
  async lowPrediction(): Promise<LowVolatilityPrediction> {
    return this.get(XtreamlyAPIPath.volatility)
  }
}