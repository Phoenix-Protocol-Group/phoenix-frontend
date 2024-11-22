import axios from "axios";

const BASE_URL = "https://api-phoenix.decentrio.ventures";
const TOKEN_LIST_URL =
  "https://raw.githubusercontent.com/decentrio/token-list/refs/heads/main/token_lists.json";

async function fetchTickers() {
  try {
    const response = await axios.get(`${BASE_URL}/tickers`);
    return response.data.map((ticker: any) => ticker.ticker_id);
  } catch (error) {
    console.log("Error fetching tickers:", error);
    throw error;
  }
}

async function fetchTokenList() {
  try {
    const response = await axios.get(TOKEN_LIST_URL);
    return response.data.reduce((acc: Record<string, any>, token: any) => {
      acc[token.token] = {
        symbol: token.symbol,
        soroban_contract: token.soroban_contract,
        decimals: token.decimals,
      };
      return acc;
    }, {});
  } catch (error) {
    console.log("Error fetching token list:", error);
    throw error;
  }
}

export async function fetchAllTrades(appStore: any) {
  try {
    // Fetch tickers and token list
    const tickers = await fetchTickers();
    const tokenList = await fetchTokenList();

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
      Array.from(uniqueTokens).map(async (token) => {
        const tokenData = tokenList[token];
        if (tokenData) {
          const sorobanContract = tokenData.soroban_contract;
          tokenInfoCache[token] = await appStore.fetchTokenInfo(
            sorobanContract
          );
        }
      })
    );

    // Query all trades for each ticker
    const trades = await Promise.all(
      tickers.map(async (tickerId: string) => {
        const response = await axios.get(`${BASE_URL}/historical_trades`, {
          params: { tickerId, limit: 5000 },
        });
        return response.data.map((trade: any) => ({
          ...trade,
          tickerId,
        }));
      })
    );

    // Flatten the trades array
    const allTrades = trades.flat();

    // Current timestamp and 24 hours ago
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Deduce the most traded asset and calculate 24h trade count
    const assetTradeCount: Record<string, number> = {};
    let totalTradeCount24h = 0;

    const tradeList = allTrades.map((trade: any) => {
      const [assetA, assetB] = trade.ticker_id.split("_");
      assetTradeCount[assetA] = (assetTradeCount[assetA] || 0) + 1;
      assetTradeCount[assetB] = (assetTradeCount[assetB] || 0) + 1;

      // Check if trade is within the last 24 hours
      const tradeTimestamp =
        new Date(trade.trade_timestamp * 1000).getTime() / 1000;

      if (tradeTimestamp >= oneDayAgo) {
        totalTradeCount24h += 1;
      }

      // Resolve asset details from pre-fetched cache
      const assetADetails = tokenInfoCache[assetA] || {};
      const assetBDetails = tokenInfoCache[assetB] || {};

      return {
        type: "Success", // Static
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

    const mostTradedAsset = Object.entries(assetTradeCount).reduce(
      (max, [asset, count]) => (count > max.count ? { asset, count } : max),
      { asset: "", count: 0 }
    ).asset;

    return {
      totalTradeCount: allTrades.length,
      totalTradeCount24h, // Count of trades in the last 24 hours
      mostTradedAsset,
      tradeList,
    };
  } catch (error) {
    console.log("Error fetching all trades:", error);
    throw error;
  }
}
