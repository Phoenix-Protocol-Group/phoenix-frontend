interface TokenPairs {
  [key: string]: string;
}

// Set an array of available tokens for this strategy
// @TODO For new tokens, we need to check if they're listed on a supported exchange, otherwise we need to add a new strategy
// Check https://www.bitstamp.net/api/v2/currencies/ and https://www.bitstamp.net/api/v2/ticker/{market_symbol}/
const tokensAvailableAndPaired: TokenPairs = {
  XLM: "xlmusd",
  USDC: "usdcusd", // TODO, for testing
};

// Function to fetch prices for a given token
export async function fetchTokenPrices(tokenSymbol: string): Promise<number> {
  if (tokenSymbol === "PHO") {
    return await fetch("/api/pho-price").then((res) => res.json());
  }


  if (tokenSymbol === "USDC") {
    return 1;
  }
  const tokenPair = tokensAvailableAndPaired[tokenSymbol.toUpperCase()];
  if (!tokenPair) {
    throw new Error(`Token ${tokenSymbol} not supported`);
  }
  const targetUrl = `https://www.bitstamp.net/api/v2/ticker/${tokenPair}/`;
  const response = await fetch("/api/proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ targetUrl }),
  });
  const data = await response.json();
  return data.data.last;
}

export async function fetchTokenPrices2(tokenSymbol: string): Promise<number> {
  const tokenPair = tokensAvailableAndPaired[tokenSymbol.toUpperCase()];
  if (!tokenPair) {
    throw new Error(`Token ${tokenSymbol} not supported`);
  }
  const targetUrl = `https://www.bitstamp.net/api/v2/ticker/${tokenPair}/`;
  const response = await fetch("/api/proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ targetUrl }),
  });
  const data = await response.json();
  return data.data.percent_change_24;
}
// Function to check biggest winner and loser in the last 24 hours
// Fetch all prices and return biggest loser and winner symbol by percent_change_24
export async function fetchBiggestWinnerAndLoser(): Promise<{
  winner: {
    symbol: string;
    percent_change_24: number;
    price: number;
  };
  loser: {
    symbol: string;
    percent_change_24: number;
    price: number;
  };
}> {
  const prices = await Promise.all(
    Object.keys(tokensAvailableAndPaired).map(async (token) => {
      const price = await fetchTokenPrices(token);
      const percent_change_24 = await fetchTokenPrices2(token);
      return {
        symbol: token,
        price,
        percent_change_24,
      };
    })
  );
  const sortedPrices = prices
    .filter((price) => price.percent_change_24 !== null) // Filter out null values
    .sort((a, b) => a.percent_change_24 - b.percent_change_24);

  return {
    winner: {
      symbol: sortedPrices[sortedPrices.length - 1].symbol,
      percent_change_24:
        sortedPrices[sortedPrices.length - 1].percent_change_24,
      price: sortedPrices[sortedPrices.length - 1].price,
    },
    loser: {
      symbol: sortedPrices[0].symbol,
      percent_change_24: sortedPrices[0].percent_change_24,
      price: sortedPrices[0].price,
    },
  };
}

// Functions to format currency
export const formatCurrency = (
  currency: string,
  amount: string,
  language = "en-US"
) => {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }).format(Number(amount));
};

export const formatCurrencyStatic = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
});

export const formatCryptoCurrency = new Intl.NumberFormat();
