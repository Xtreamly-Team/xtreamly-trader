"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volatility = void 0;
const XtreamlyAPI_1 = require("../services/XtreamlyAPI");
class Volatility extends XtreamlyAPI_1.XtreamlyAPI {
    async lowPrediction() {
        return this.get(XtreamlyAPI_1.XtreamlyAPIPath.volatility);
    }
}
exports.Volatility = Volatility;
