export interface Trade {
  txHash: string;
  ledgerSequence: number;
  closedAt: number;
  contractAddress: string;
  sourceAccount: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  spreadAmount: number;
  usdcValue: number;
}

export interface MostTradedResponse {
  asset: string;
  usdVolume: number;
}

export interface TokenPriceResp {
  id: string;
  price: number;
  txHash: string;
  txTime: string;
}

export interface TokenPricesResponse {
  prices: TokenPriceResp[];
}

export interface TradeHistoryResponse {
  trades: Trade[];
}

export interface TotalTradesResponse {
  totalTrades: string;
}
export interface TradingVolumeDate {
  day?: number;
  month?: number;
  week?: number;
  year: number;
}

export interface TradingVolumeTime {
  date: TradingVolumeDate;
  hour: number;
}

export interface TradingVolume {
  date?: TradingVolumeDate;
  time?: TradingVolumeTime;
  tokenAVolume: string;
  tokenBVolume: string;
  usdVolume: number;
}

export interface TradingVolumeResponse {
  tradingVolume: TradingVolume[];
}

export interface UsersTotalResponse {
  totalUsers: string;
  usersLast24h: string;
}

export interface AdvancedTradesParams {
  poolId?: string;
  address?: string;
  limit?: number;
  startTime?: number;
  endTime?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TradeHistoryParams {
  from?: number;
  to?: number;
  page?: number;
  pageSize?: number;
}

export interface HistoricalTradesParams {
  limit?: number;
  startTime?: number;
  endTime?: number;
}
