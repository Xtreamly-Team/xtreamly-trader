export enum XtreamlyAPIPath {
  volatility="volatility_prediction",
  volatilityHistorical="volatility_historical",
  state="state_recognize",
  stateHistorical="state_historical",
}

export class XtreamlyAPI {
  private baseUrl: string
  private headers: Headers

  constructor() {
    this.baseUrl = "https://api.xtreamly.io/";

    const XTREAMLY_API_KEY = process.env.XTREAMLY_API_KEY;

    if (!XTREAMLY_API_KEY) {
      throw new Error(`
        Missing environment variables: XTREAMLY_API_KEY.
        Request your API key here: https://xtreamly.io/api 
      `);
    }

    this.headers = new Headers({
      "Content-Type": "application/json",
      "x-api-key": XTREAMLY_API_KEY,
    });
  }

  async get(path: XtreamlyAPIPath, params?: Record<string, any>): Promise<any> {
    const url = new URL(this.baseUrl + path);

    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    }

    return fetch(url.toString(),{
      method: "GET",
      headers: this.headers,
    }).then(res => res.json())
  }
}
