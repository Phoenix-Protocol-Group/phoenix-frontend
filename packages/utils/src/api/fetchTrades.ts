import axios from "axios";
import { API } from "../trade_api/trade_api";
import { API as API2 } from "../api/api";
import { fetchTokenList, scaToToken } from "./fetchTokenList";
import { constants } from "..";

export async function fetchAllTrades(
  appStore: any,
  limit: number = 14,
  type?: string | undefined,
  startTime?: string | undefined,
  endTime?: string | undefined,
  personal: string | undefined = undefined,
  sortBy?: string,
  sortOrder?: "asc" | "desc"
) {
  try {
    const tradeApi = new API(constants.TRADING_API_URL);
    // Fetch tickers and token list
    const tickers = (await API2.getTickers()).map((e) => e.ticker_id);

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
        const _token = await scaToToken(token, appStore);
        tokenInfoCache[_token?.id!] = _token;
      })
    );

    // Query all trades
    const trades = await tradeApi.getAdvancedTrades({
      poolId: undefined,
      address: personal,
      limit: limit,
      startTime: startTime ? Number(startTime) : undefined,
      endTime: endTime ? Number(endTime) : undefined,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });

    // Current timestamp and 24 hours ago
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Deduce the most traded asset and calculate 24h trade count
    const assetTradeCount: Record<string, number> = {};
    let totalTradeCount24h = 0;

    const tradeList = trades.map((trade) => {
      const assetA = trade.fromToken;
      const assetB = trade.toToken;
      assetTradeCount[assetA] = (assetTradeCount[assetA] || 0) + 1;
      assetTradeCount[assetB] = (assetTradeCount[assetB] || 0) + 1;

      // Check if trade is within the last 24 hours
      const tradeTimestamp =
        new Date(Number(trade.closedAt) * 1000).getTime() / 1000;

      if (tradeTimestamp >= oneDayAgo) {
        totalTradeCount24h += 1;
      }

      // Resolve asset details from pre-fetched cache
      const assetADetails = tokenInfoCache[assetA] || {};
      const assetBDetails = tokenInfoCache[assetB] || {};

      return {
        fromAsset: {
          name: assetADetails.symbol || "Unknown",
          address: assetA,
          icon: `/cryptoIcons/${assetADetails.symbol?.toLowerCase()}.svg`,
        },
        toAsset: {
          name: assetBDetails.symbol || "Unknown",
          address: assetB,
          icon: `/cryptoIcons/${assetBDetails.symbol?.toLowerCase()}.svg`,
        },
        fromAmount: trade.fromAmount / 10 ** 7, // Trade size in token amount
        toAmount: trade.toAmount / 10 ** 7, // Trade size in token amount
        tradeValue: (trade.usdcValue / 10 ** 7).toFixed(2),
        date: trade.closedAt * 1000,
        txHash: trade.txHash,
      };
    });

    return tradeList;
  } catch (error) {
    console.log("Error fetching all trades:", error);
    throw error;
  }
}
