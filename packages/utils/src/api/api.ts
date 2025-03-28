import axios, { AxiosInstance } from "axios";
import {
  PoolReserveResponse,
  PriceResponse,
  TickersResponse,
  TradingVolumeResponse,
  UserActivitiesResponse,
  TotalTradesResponse,
  TotalUsersResponse,
  MostTradedResponse,
  TradeHistoryResponse,
  RatioResponse,
  PriceHistoryResponse,
  TickerInfo,
} from "./types";
import { constants } from "..";

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: constants.DECENTRIO_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to sum up trading volumes
const sumTradingVolumesByBucket = (
  volumes: TradingVolumeResponse[]
): TradingVolumeResponse => {
  const bucketedVolumes: Record<
    string,
    {
      tokenAVolume: string;
      tokenBVolume: string;
      usdVolume: number;
      date?: { day: number; month: number; year: number };
      time?: {
        hour: number;
        date: { day: number; month: number; year: number };
      };
      week?: { year: number; week: number };
      month?: { year: number; month: number };
    }
  > = {};

  volumes.forEach((volume) => {
    volume.tradingVolume.forEach((entry) => {
      // Create a unique key for grouping based on the time bucket
      const key = JSON.stringify({
        date: entry.date,
        time: entry.time,
        week: entry.week,
        month: entry.month,
      });

      if (!bucketedVolumes[key]) {
        // Initialize bucket if it doesn't exist
        bucketedVolumes[key] = {
          tokenAVolume: "0",
          tokenBVolume: "0",
          usdVolume: 0,
          date: entry.date,
          time: entry.time,
          week: entry.week,
          month: entry.month,
        };
      }

      // Aggregate values into the bucket
      const bucket = bucketedVolumes[key];
      bucket.tokenAVolume = (
        parseFloat(bucket.tokenAVolume) + parseFloat(entry.tokenAVolume)
      ).toString();
      bucket.tokenBVolume = (
        parseFloat(bucket.tokenBVolume) + parseFloat(entry.tokenBVolume)
      ).toString();
      bucket.usdVolume += entry.usdVolume;
    });
  });

  // Convert the bucketed volumes back into the TradingVolumeResponse format
  return {
    tradingVolume: Object.values(bucketedVolumes),
  };
};
// Define API methods
export const API = {
  async getPoolReserveA(contractId: string): Promise<PoolReserveResponse> {
    const { data } = await apiClient.get(
      `/liquidity/${contractId}/pool_reserve_a`
    );
    return data;
  },
  async getPoolReserveB(contractId: string): Promise<PoolReserveResponse> {
    const { data } = await apiClient.get(
      `/liquidity/${contractId}/pool_reserve_b`
    );
    return data;
  },
  async getPoolShares(contractId: string): Promise<PoolReserveResponse> {
    const { data } = await apiClient.get(
      `/liquidity/${contractId}/pool_shares`
    );
    return data;
  },
  async getPrice(name: string): Promise<PriceResponse> {
    const { data } = await apiClient.get(`/price/${name}`);
    return data;
  },
  /**
   * Fetches the historical prices for a given item name within a specified date range.
   * @param {string} name - The name of the item to fetch historical prices for.
   * @param {string} from - The start date of the date range in ISO 8601 format.
   * @param {string} to - The end date of the date range in ISO 8601 format.
   * @returns {Promise<Array<Record<string, any>>} A promise that resolves to the historical prices.
   * @throws {Error} If the API request fails.
   */
  async getHistoricalPrices(
    name: string,
    from?: string,
    to?: string
  ): Promise<PriceHistoryResponse> {
    try {
      const params: Record<string, string | undefined> = {};
      if (from) params.from = from;
      if (to) params.to = to;

      const { data } = await apiClient.get(`/assets/price/${name}`, {
        params,
      });
      return data.prices;
    } catch (e) {
      console.error(`Error fetching historical prices for ${name}:`, e);
      return [];
    }
  },
  async getTickers(): Promise<TickersResponse> {
    const { data } = await apiClient.get(`/tickers`);

    // Sort out double entries
    const uniqueTickers = data.filter(
      (ticker: TickerInfo, index: number, self: TickerInfo[]) =>
        index ===
        self.findIndex((t: TickerInfo) => t.pool_id === ticker.pool_id)
    );

    return uniqueTickers;
  },
  async getMostTraded(): Promise<MostTradedResponse> {
    const { data } = await apiClient.get(`/assets/most-traded`);
    return data;
  },
  async getTradeHistory(
    tickerId?: string,
    type?: string,
    limit?: number,
    startTime?: string,
    endTime?: string,
    userAddress?: string
  ): Promise<TradeHistoryResponse> {
    const params = { tickerId, type, limit, startTime, endTime };
    const { data } = await apiClient.get(
      userAddress ? `/trade-history/${userAddress}` : `/trades`,
      { params }
    );

    // If data is array, return it as is.
    if (Array.isArray(data)) {
      return data;
    } else {
      // If data is object, return the trades array.
      return data.trades;
    }
  },
  async getTotalTrades(): Promise<TotalTradesResponse> {
    const { data } = await apiClient.get(`/trades/total`);
    return data;
  },
  async getTradingVolumePerDay(
    contractId: string,
    from?: string,
    to?: string
  ): Promise<TradingVolumeResponse> {
    const params = { from, to };
    const { data } = await apiClient.get(`/trading-vol/${contractId}/perday`, {
      params,
    });
    return data;
  },
  async getTradingVolumePerHour(
    contractId: string,
    from?: string,
    to?: string
  ): Promise<TradingVolumeResponse> {
    const params = { from, to };
    const { data } = await apiClient.get(`/trading-vol/${contractId}/perhour`, {
      params,
    });
    return data;
  },
  async getTradingVolumePerWeek(
    contractId: string,
    from?: string,
    to?: string
  ): Promise<TradingVolumeResponse> {
    const params = { from, to };
    const { data } = await apiClient.get(`/trading-vol/${contractId}/perweek`, {
      params,
    });
    return data;
  },
  async getTradingVolumePerMonth(
    contractId: string,
    from?: string,
    to?: string
  ): Promise<TradingVolumeResponse> {
    const params = { from, to };
    const { data } = await apiClient.get(
      `/trading-vol/${contractId}/permonth`,
      { params }
    );
    return data;
  },
  async getUserActivities(
    address: string,
    from?: string,
    to?: string,
    page?: number,
    pageSize?: number
  ): Promise<UserActivitiesResponse> {
    const params = { from, to, page, pageSize };
    const { data } = await apiClient.get(`/activities/${address}`, { params });
    return data;
  },
  async getTotalUsers(): Promise<TotalUsersResponse> {
    const { data } = await apiClient.get(`/users/total`);
    return data;
  },

  async getAllTradingVolumePerDay(
    from?: string,
    to?: string
  ): Promise<TradingVolumeResponse> {
    const tickers = await this.getTickers();
    const volumes = await Promise.all(
      tickers.map((ticker) =>
        this.getTradingVolumePerDay(ticker.pool_id, from, to)
      )
    );
    return sumTradingVolumesByBucket(volumes);
  },

  async getAllTradingVolumePerHour(
    from?: string,
    to?: string
  ): Promise<TradingVolumeResponse> {
    const tickers = await this.getTickers();
    const volumes = await Promise.all(
      tickers.map((ticker) =>
        this.getTradingVolumePerHour(ticker.pool_id, from, to)
      )
    );
    return sumTradingVolumesByBucket(volumes);
  },

  async getAllTradingVolumePerWeek(
    from?: string,
    to?: string
  ): Promise<TradingVolumeResponse> {
    const tickers = await this.getTickers();
    const volumes = await Promise.all(
      tickers.map((ticker) =>
        this.getTradingVolumePerWeek(ticker.pool_id, from, to)
      )
    );
    return sumTradingVolumesByBucket(volumes);
  },

  async getAllTradingVolumePerMonth(
    from?: string,
    to?: string
  ): Promise<TradingVolumeResponse> {
    const tickers = await this.getTickers();
    const volumes = await Promise.all(
      tickers.map((ticker) =>
        this.getTradingVolumePerMonth(ticker.pool_id, from, to)
      )
    );
    return sumTradingVolumesByBucket(volumes);
  },
  async getRatioGraph(
    contractId: string,
    from?: string,
    to?: string
  ): Promise<RatioResponse> {
    const params = { from, to };
    const { data } = await apiClient.get(`/ratio/${contractId}`, { params });
    return data;
  },

  async getRatioGraphLastMonth(contractId: string): Promise<RatioResponse> {
    const { data } = await apiClient.get(`/ratio/${contractId}/lastmonth`);
    return data;
  },

  async getRatioGraphLastWeek(contractId: string): Promise<RatioResponse> {
    const { data } = await apiClient.get(`/ratio/${contractId}/lastweek`);
    return data;
  },

  async getRatioGraphLastYear(contractId: string): Promise<RatioResponse> {
    const { data } = await apiClient.get(`/ratio/${contractId}/lastyear`);
    return data;
  },
};
