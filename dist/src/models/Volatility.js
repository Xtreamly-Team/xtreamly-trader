"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volatility = void 0;
const XtreamlyAPI_1 = require("../services/XtreamlyAPI");
const VolatilityPrediction_1 = require("../domains/VolatilityPrediction");
class Volatility extends XtreamlyAPI_1.XtreamlyAPI {
    async prediction(horizon = VolatilityPrediction_1.Horizons.min1, symbol = 'ETH') {
        return this.get(XtreamlyAPI_1.XtreamlyAPIPath.volatility, {
            symbol,
            horizon
        });
    }
    async historicalPrediction(startDate, endDate, horizon = VolatilityPrediction_1.Horizons.min1, symbol = 'ETH') {
        return this.get(XtreamlyAPI_1.XtreamlyAPIPath.volatilityHistorical, {
            symbol,
            horizon,
            start_date: startDate.getTime(),
            end_date: endDate.getTime(),
        });
    }
    async state(symbol = 'ETH') {
        return this.get(XtreamlyAPI_1.XtreamlyAPIPath.state, {
            symbol,
        });
    }
    async historicalState(startDate, endDate, symbol = 'ETH') {
        return this.get(XtreamlyAPI_1.XtreamlyAPIPath.stateHistorical, {
            symbol,
            start_date: startDate.getTime(),
            end_date: endDate.getTime(),
        });
    }
}
exports.Volatility = Volatility;
