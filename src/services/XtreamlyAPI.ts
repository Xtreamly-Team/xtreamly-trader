export enum XtreamlyAPIPath {
  volatility="volatility"
}

export class XtreamlyAPI {
  private baseUrl: string

  constructor() {
    this.baseUrl = "https://api.xtreamly.io/";
  }

  async get(path: XtreamlyAPIPath): Promise<any> {
    return fetch(this.baseUrl + path).then(res => res.json())
  }
}
