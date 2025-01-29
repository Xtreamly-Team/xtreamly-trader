import { XtreamlyAPI, XtreamlyAPIPath } from "../services/XtreamlyAPI";
import VolatilityPrediction from "../domains/VolatilityPrediction";

export class Volatility extends XtreamlyAPI {
  async prediction(): Promise<VolatilityPrediction> {
    return this.get(XtreamlyAPIPath.volatility)
  }
}