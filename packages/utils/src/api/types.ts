export type PoolReserveResponse = { amount: number };
export type ErrorResponse = {
  code: number;
  message: string;
  details?: Array<{ "@type": string }>;
};
export type TickerInfo = {
  ticker_id: string;
  base_currency: string;
  target_currency: string;
  pool_id: string;
  last_price: number;
  base_volume: number;
  target_volume: number;
  high: number;
  low: number;
  liquidity_in_usd: number;
};
export type TickersResponse = TickerInfo[];
export type PriceResponse = number;
export type MostTradedResponse = { asset: string; usdVolume: number };
export type TradeResponse = {
  trade_id: number;
  price: number;
  base_volume: number;
  target_volume: number;
  trade_timestamp: string;
  type: string;
  ticker_id: string;
};
export type TradeHistoryResponse = TradeResponse[];
export type TotalTradesResponse = { totalTrades: string };
export type TradingVolumeResponse = {
  tradingVolume: Array<{
    date?: { day: number; month: number; year: number };
    time?: { hour: number; date: { day: number; month: number; year: number } };
    week?: { year: number; week: number };
    month?: { year: number; month: number };
    tokenAVolume: string;
    tokenBVolume: string;
    usdVolume: number;
  }>;
};
export type UserActivitiesResponse = {
  user: string;
  actionType: string;
  baseCurrency: string;
  baseVolume: number;
  targetCurrency: string;
  targetVolume: number;
  timeStamp: string;
}[];
export type TotalUsersResponse = {
  totalUsers: string;
  usersLast24h: string;
};
