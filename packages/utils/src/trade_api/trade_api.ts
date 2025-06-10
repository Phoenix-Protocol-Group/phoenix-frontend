import {
  AdvancedTradesParams,
  HistoricalTradesParams,
  MostTradedResponse,
  TokenPricesResponse,
  TotalTradesResponse,
  Trade,
  TradeHistoryParams,
  TradeHistoryResponse,
  TradingVolume,
  TradingVolumeDate,
  TradingVolumeResponse,
  TradingVolumeTime,
  UsersTotalResponse,
} from "./types";

import { API as API2 } from "../api/api";

export class API {
  constructor(private baseUrl: string) {}

  private async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    const response = await fetch(url.toString());
    // if endpoint is /price/{name} and response is not JSON, return 0
    if (endpoint.startsWith("/price/") && !response.ok) {
      return 0 as any;
    }
    // Try again if the response is not JSON
    if (!response.ok) {
      return this.get<T>(endpoint, params);
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getPrice(name: string): Promise<number> {
    if (
      name === "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75" ||
      name === "CDIKURWHYS4FFTR5KOQK6MBFZA2K3E26WGBQI6PXBYWZ4XIOPJHDFJKP"
    ) {
      return 1;
    }
    return this.get<number>(`/price/${name}`);
  }

  async getMostTraded(): Promise<MostTradedResponse> {
    return this.get<MostTradedResponse>(`/assets/most-traded`);
  }

  async getTokenPrices(
    id: string,
    from?: number,
    to?: number
  ): Promise<TokenPricesResponse> {
    return this.get<TokenPricesResponse>(`/assets/price/${id}`, { from, to });
  }

  async getHistoricalTrades(params?: HistoricalTradesParams): Promise<Trade[]> {
    return this.get<Trade[]>(`/historical_trades`, params);
  }

  async getTradeHistory(
    address: string,
    params?: TradeHistoryParams
  ): Promise<TradeHistoryResponse> {
    return this.get<TradeHistoryResponse>(`/trade-history/${address}`, params);
  }

  sumTradingVolumesByBucket(
    volumes: TradingVolumeResponse[]
  ): TradingVolumeResponse {
    const bucketedVolumes: Record<
      string,
      {
        tokenAVolume: number;
        tokenBVolume: number;
        usdVolume: number;
        bucket: { date?: TradingVolumeDate; time?: TradingVolumeTime };
      }
    > = {};

    volumes.forEach((volumeResp) => {
      volumeResp.tradingVolume.forEach((entry) => {
        const bucketKey = entry.time
          ? JSON.stringify({ time: entry.time })
          : JSON.stringify({ date: entry.date });
        if (!bucketedVolumes[bucketKey]) {
          bucketedVolumes[bucketKey] = {
            tokenAVolume: 0,
            tokenBVolume: 0,
            usdVolume: 0,
            bucket: entry.time ? { time: entry.time } : { date: entry.date },
          };
        }
        bucketedVolumes[bucketKey].tokenAVolume += parseFloat(
          entry.tokenAVolume
        );
        bucketedVolumes[bucketKey].tokenBVolume += parseFloat(
          entry.tokenBVolume
        );
        bucketedVolumes[bucketKey].usdVolume += entry.usdVolume;
      });
    });

    const aggregatedVolumes: TradingVolume[] = Object.values(
      bucketedVolumes
    ).map((bucket) => {
      if (bucket.bucket.time) {
        return {
          time: bucket.bucket.time,
          tokenAVolume: bucket.tokenAVolume.toString(),
          tokenBVolume: bucket.tokenBVolume.toString(),
          usdVolume: bucket.usdVolume,
        };
      } else {
        return {
          date: bucket.bucket.date,
          tokenAVolume: bucket.tokenAVolume.toString(),
          tokenBVolume: bucket.tokenBVolume.toString(),
          usdVolume: bucket.usdVolume,
        };
      }
    });

    return { tradingVolume: aggregatedVolumes };
  }

  async getAllTradingVolumePerDay(
    from?: number,
    to?: number
  ): Promise<TradingVolumeResponse> {
    const tickers = await API2.getTickers();
    const volumes = await Promise.all(
      tickers.map((ticker) =>
        this.getTradingVolumePerDay(ticker.pool_id, from, to)
      )
    );
    return this.sumTradingVolumesByBucket(volumes);
  }

  async getAllTradingVolumePerHour(
    from?: number,
    to?: number
  ): Promise<TradingVolumeResponse> {
    const tickers = await API2.getTickers();
    const volumes = await Promise.all(
      tickers.map((ticker) =>
        this.getTradingVolumePerHour(ticker.pool_id, from, to)
      )
    );
    return this.sumTradingVolumesByBucket(volumes);
  }

  async getAllTradingVolumePerWeek(
    from?: number,
    to?: number
  ): Promise<TradingVolumeResponse> {
    const tickers = await API2.getTickers();
    const volumes = await Promise.all(
      tickers.map((ticker) =>
        this.getTradingVolumePerWeek(ticker.pool_id, from, to)
      )
    );
    return this.sumTradingVolumesByBucket(volumes);
  }

  async getAllTradingVolumePerMonth(
    from?: number,
    to?: number
  ): Promise<TradingVolumeResponse> {
    const tickers = await API2.getTickers();
    const volumes = await Promise.all(
      tickers.map((ticker) =>
        this.getTradingVolumePerMonth(ticker.pool_id, from, to)
      )
    );
    return this.sumTradingVolumesByBucket(volumes);
  }

  async getTradeHistoryLastMonth(
    address: string
  ): Promise<TradeHistoryResponse> {
    return this.get<TradeHistoryResponse>(
      `/trade-history/${address}/lastmonth`
    );
  }

  async getTradeHistoryLastWeek(
    address: string
  ): Promise<TradeHistoryResponse> {
    return this.get<TradeHistoryResponse>(`/trade-history/${address}/lastweek`);
  }

  async getTradeHistoryLastYear(
    address: string
  ): Promise<TradeHistoryResponse> {
    return this.get<TradeHistoryResponse>(`/trade-history/${address}/lastyear`);
  }

  async getAdvancedTrades(params?: AdvancedTradesParams): Promise<Trade[]> {
    return this.get<Trade[]>(`/trades`, params);
  }

  async getTotalTrades(): Promise<TotalTradesResponse> {
    return this.get<TotalTradesResponse>(`/trades/total`);
  }

  async getTradingVolumePerDay(
    contractId: string,
    from?: number,
    to?: number
  ): Promise<TradingVolumeResponse> {
    const result = await this.get<TradingVolumeResponse>(
      `/trading-vol/${contractId}/perday`,
      { from, to }
    );
    if (!result.tradingVolume) {
      return { tradingVolume: [] };
    }
    // Iterate to calculate usdcVolume
    result.tradingVolume.forEach((entry) => {
      entry.usdVolume = entry.usdVolume / 10 ** 7;
    });
    return result;
  }

  async getTradingVolumePerHour(
    contractId: string,
    from?: number,
    to?: number
  ): Promise<TradingVolumeResponse> {
    const result = await this.get<TradingVolumeResponse>(
      `/trading-vol/${contractId}/perhour`,
      { from, to }
    );

    if (!result.tradingVolume) {
      return { tradingVolume: [] };
    }
    // Iterate to calculate usdcVolume
    result.tradingVolume.forEach((entry) => {
      entry.usdVolume = entry.usdVolume / 10 ** 7;
    });
    return result;
  }

  async getTradingVolumePerMonth(
    contractId: string,
    from?: number,
    to?: number
  ): Promise<TradingVolumeResponse> {
    const result = await this.get<TradingVolumeResponse>(
      `/trading-vol/${contractId}/permonth`,
      { from, to }
    );

    if (!result.tradingVolume) {
      return { tradingVolume: [] };
    }
    // Iterate to calculate usdcVolume
    result.tradingVolume.forEach((entry) => {
      entry.usdVolume = entry.usdVolume / 10 ** 7;
    });
    return result;
  }

  async getTradingVolumePerWeek(
    contractId: string,
    from?: number,
    to?: number
  ): Promise<TradingVolumeResponse> {
    const result = await this.get<TradingVolumeResponse>(
      `/trading-vol/${contractId}/perweek`,
      { from, to }
    );
    if (!result.tradingVolume) {
      return { tradingVolume: [] };
    }
    // Iterate to calculate usdcVolume
    result.tradingVolume.forEach((entry) => {
      entry.usdVolume = entry.usdVolume / 10 ** 7;
    });
    return result;
  }

  async getTotalUsers(): Promise<UsersTotalResponse> {
    return this.get<UsersTotalResponse>(`/users/total`);
  }
}
