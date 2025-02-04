export enum XtreamlyAPIPath {
  volatility="volatility_prediction",
  volatilityHistorical="volatility_historical",
  state="state_recognize",
  stateHistorical="state_historical",
}

export class XtreamlyAPI {
  private baseUrl: string

  constructor() {
    this.baseUrl = "https://api.xtreamly.io/";
  }

  async get(path: XtreamlyAPIPath, params?: Record<string, any>): Promise<any> {
    const url = new URL(this.baseUrl + path);

    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    }

    return fetch(url.toString()).then(res => res.json())
  }
}
