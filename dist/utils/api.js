"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
class API {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    getHeaders(headers) {
        return headers && new Headers(headers);
    }
    async request(method, path, params, headers) {
        const url = new URL(this.baseUrl + path);
        if (params) {
            Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
        }
        return fetch(url.toString(), {
            method,
            headers: this.getHeaders(headers),
        }).then(res => res.json());
    }
    async get(path, params, headers) {
        return this.request("GET", path, params, headers);
    }
}
exports.API = API;
