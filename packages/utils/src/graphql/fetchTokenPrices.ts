import { gql } from "@apollo/client";
import { createApolloClient } from "./apolloClient";
import { priceExport } from "./exportedPrices";

export async function fetchTokenPrices(symbol?: string, tokenId?: string) {
  const client = createApolloClient();

  if (symbol == "VCHF" || symbol == "VEUR") {
    return fetchDollarValue(symbol === "VCHF" ? "chf" : "eur");
  } else if (symbol == "USDx") {
    return 1;
  }

  const GET_PRICES = gql`
    query GetPrices($symbol: String, $tokenId: String) {
      prices(symbol: $symbol, tokenId: $tokenId) {
        symbol
        timestamp
        tokenId
        usdValue
      }
    }
  `;

  try {
    const { data } = await client.query({
      query: GET_PRICES,
      variables: {
        symbol,
        tokenId,
      },
    });

    if ((symbol || tokenId) && data) {
      return data.prices[0].usdValue;
    }

    return data.prices;
  } catch (error) {
    console.log("Error fetching prices:", error);
    throw error;
  }
}

export async function fetchHistoricalPrices(
  timestampLimit?: number,
  symbol?: string,
  tokenId?: string,
  maxEntries?: number,
  notParse?: boolean
) {
  const client = createApolloClient();

  const GET_HISTORICAL_PRICES = gql`
    query GetHistoricalPrices(
      $symbol: String
      $tokenId: String
      $timestampLimit: Int
      $maxEntries: Int
    ) {
      historicalPrices(
        symbol: $symbol
        tokenId: $tokenId
        timestampLimit: $timestampLimit
        maxEntries: $maxEntries
      ) {
        symbol
        timestamp
        tokenId
        usdValue
      }
    }
  `;

  try {
    const { data } = await client.query({
      query: GET_HISTORICAL_PRICES,
      variables: {
        symbol,
        tokenId,
        timestampLimit,
        maxEntries,
      },
    });

    if (notParse) {
      if (symbol === "PHO") {
        const res = [...priceExport, ...data.historicalPrices];
        return res.sort(
          (a: any, b: any) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      }
      return data.historicalPrices;
    }

    const parsedPrices = data.historicalPrices.map((item: any) => [
      new Date(item.timestamp).getTime(),
      item.usdValue,
    ]);

    return parsedPrices;
  } catch (error) {
    console.log("Error fetching prices:", error);
    throw error;
  }
}

export async function fetchTokenPrices2(
  symbol?: string,
  tokenId?: string,
  maxEntries = 24
): Promise<number> {
  const client = createApolloClient();

  const timestampLimit = 1440; // 24 hours

  const GET_HISTORICAL_PRICES = gql`
    query GetHistoricalPrices(
      $symbol: String
      $tokenId: String
      $timestampLimit: Int
      $maxEntries: Int
    ) {
      historicalPrices(
        symbol: $symbol
        tokenId: $tokenId
        timestampLimit: $timestampLimit
        maxEntries: $maxEntries
      ) {
        timestamp
        usdValue
      }
    }
  `;

  try {
    const { data } = await client.query({
      query: GET_HISTORICAL_PRICES,
      variables: {
        symbol,
        tokenId,
        timestampLimit,
        maxEntries,
      },
    });

    // Ensure data is mutable
    const historicalPrices = [...data.historicalPrices];

    if (historicalPrices.length < 2) {
      throw new Error("Not enough price data available for calculation.");
    }

    // Sort by timestamp to ensure chronological order
    historicalPrices.sort((a: any, b: any) => a.timestamp - b.timestamp);

    // Extract first and last values
    const oldestPrice = historicalPrices[0]?.usdValue || 0;
    const newestPrice =
      historicalPrices[historicalPrices.length - 1]?.usdValue || 0;

    // Calculate average of the last N prices for stability
    const recentPrices = historicalPrices.slice(
      -Math.min(5, historicalPrices.length)
    );
    const recentAverage =
      recentPrices.reduce(
        (sum: number, entry: any) => sum + (entry.usdValue || 0),
        0
      ) / recentPrices.length;

    // Calculate average of the first N prices for stability
    const oldPrices = historicalPrices.slice(
      0,
      Math.min(5, historicalPrices.length)
    );
    const oldAverage =
      oldPrices.reduce(
        (sum: number, entry: any) => sum + (entry.usdValue || 0),
        0
      ) / oldPrices.length;

    // Use averages for primary calculation
    let percentageChange = Number(
      (((recentAverage - oldAverage) / oldAverage) * 100).toFixed(2)
    );

    // Optional: Cross-check with direct oldest and newest prices
    if (Math.abs(percentageChange) > 50) {
      // If change seems too volatile, fallback to direct oldest vs newest
      percentageChange = Number(
        (((newestPrice - oldestPrice) / oldestPrice) * 100).toFixed(2)
      );
    }

    return percentageChange;
  } catch (error) {
    console.error("Error fetching prices:", error);
    throw error;
  }
}

/**
 * Hacky solution until API is updated
 * @param currency
 * @returns
 */
async function fetchDollarValue(
  currency: "chf" | "eur"
): Promise<number | null> {
  try {
    const response = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`
    );
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return data[currency].usd;
  } catch (error) {
    console.log("Fetch error: ", error);
    return null;
  }
}
