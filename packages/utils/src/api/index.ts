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
} from "./types";

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: "https://api.example.com", // Replace with the actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

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
  async getTickers(): Promise<TickersResponse> {
    const { data } = await apiClient.get(`/tickers`);
    return data;
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
    endTime?: string
  ): Promise<TradeHistoryResponse> {
    const params = { tickerId, type, limit, startTime, endTime };
    const { data } = await apiClient.get(`/trades`, { params });
    return data;
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
};

// Export Axios instance for custom configurations if needed
export { apiClient };
