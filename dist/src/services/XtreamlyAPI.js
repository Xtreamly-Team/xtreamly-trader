"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XtreamlyAPI = exports.XtreamlyAPIPath = void 0;
var XtreamlyAPIPath;
(function (XtreamlyAPIPath) {
    XtreamlyAPIPath["volatility"] = "volatility";
})(XtreamlyAPIPath || (exports.XtreamlyAPIPath = XtreamlyAPIPath = {}));
class XtreamlyAPI {
    constructor() {
        this.baseUrl = "https://api.xtreamly.io/";
    }
    async get(path) {
        return fetch(this.baseUrl + path).then(res => res.json());
    }
}
exports.XtreamlyAPI = XtreamlyAPI;
