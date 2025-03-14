import axios from "axios";
import { API } from "./api";
import { fetchTokenList, scaToToken } from "./fetchTokenList";

export async function fetchAllTrades(
  appStore: any,
  limit: number = 14,
  type?: string | undefined,
  startTime?: string | undefined,
  endTime?: string | undefined,
  personal: string | undefined = undefined
) {
  try {
    // Fetch tickers and token list
    const tickers = (await API.getTickers()).map((e) => e.ticker_id);

    // Collect all unique tokens across tickers
    const uniqueTokens = new Set<string>();
    tickers.forEach((tickerId: string) => {
      const [assetA, assetB] = tickerId.split("_");
      uniqueTokens.add(assetA);
      uniqueTokens.add(assetB);
    });

    // Pre-fetch token information for all unique tokens
    const tokenInfoCache: Record<string, any> = {};
    await Promise.all(
      Array.from(uniqueTokens).map(async (token: any) => {
        tokenInfoCache[token] = await scaToToken(token, appStore);
      })
    );

    // Query all trades
    const trades = await API.getTradeHistory(
      undefined,
      type,
      limit,
      startTime,
      endTime,
      personal
    );

    // Current timestamp and 24 hours ago
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Deduce the most traded asset and calculate 24h trade count
    const assetTradeCount: Record<string, number> = {};
    let totalTradeCount24h = 0;

    const tradeList = trades.map((trade) => {
      const [assetA, assetB] = trade.ticker_id.split("_");
      assetTradeCount[assetA] = (assetTradeCount[assetA] || 0) + 1;
      assetTradeCount[assetB] = (assetTradeCount[assetB] || 0) + 1;

      // Check if trade is within the last 24 hours
      const tradeTimestamp =
        new Date(Number(trade.trade_timestamp) * 1000).getTime() / 1000;

      if (tradeTimestamp >= oneDayAgo) {
        totalTradeCount24h += 1;
      }

      // Resolve asset details from pre-fetched cache
      const assetADetails = tokenInfoCache[assetA] || {};
      const assetBDetails = tokenInfoCache[assetB] || {};

      return {
        type: trade.type,
        assets: [
          {
            name: assetADetails.symbol || "Unknown",
            address: assetA,
            icon: `/cryptoIcons/${assetADetails.symbol?.toLowerCase()}.svg`,
          },
          {
            name: assetBDetails.symbol || "Unknown",
            address: assetB,
            icon: `/cryptoIcons/${assetBDetails.symbol?.toLowerCase()}.svg`,
          },
        ],
        tradeSize: trade.base_volume.toString(), // Trade size in token amount
        tradeValue: (trade.price * trade.base_volume).toString(), // Trade value in USD
        date: trade.trade_timestamp, // Timestamp
        txHash: null, // Ignored for now
      };
    });

    return tradeList;
  } catch (error) {
    console.log("Error fetching all trades:", error);
    throw error;
  }
}
