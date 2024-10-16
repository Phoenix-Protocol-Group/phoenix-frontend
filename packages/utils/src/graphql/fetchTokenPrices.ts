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
    console.error("Error fetching prices:", error);
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
    console.error("Error fetching prices:", error);
    throw error;
  }
}

export async function fetchTokenPrices2(
  symbol?: string,
  tokenId?: string
): Promise<number> {
  const client = createApolloClient();

  const timestampLimit = 1440; //24 hours
  const maxEntries = 2;

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

    const oldValue = data.historicalPrices[0].usdValue;
    const newValue = data.historicalPrices[1].usdValue;

    return Number((((newValue - oldValue) / oldValue) * 100).toFixed(2));
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
    console.error("Fetch error: ", error);
    return null;
  }
}
