import { AppStore } from "@phoenix-protocol/types";
import axios from "axios";

interface apiToken {
  symbol: string;
  token: string;
  soroban_contract: string;
  decimals: number;
}

export async function fetchTokenList(): Promise<apiToken[]> {
  try {
    return (
      await axios.get(
        "https://raw.githubusercontent.com/decentrio/token-list/refs/heads/main/token_lists.json"
      )
    ).data;
  } catch (error) {
    console.log("Error fetching token list:", error);
    throw error;
  }
}

export async function scaToToken(scaAddress: string, appStore: AppStore) {
  const tokenList = await fetchTokenList();

  let contractAddress = tokenList.find(
    (token) =>
      token.token.toUpperCase() == scaAddress.toUpperCase() ||
      token.symbol.toUpperCase() == scaAddress.toUpperCase()
  )?.soroban_contract;
  if (!contractAddress) {
    const dashIndex = scaAddress.indexOf("-");
    contractAddress = dashIndex === -1 ? "" : scaAddress.slice(dashIndex + 1);
  }

  return appStore.fetchTokenInfo(contractAddress);
}

export async function symbolToToken(symbol: string, appStore: AppStore) {
  const tokenList = await fetchTokenList();
  // If symbol is a contractAddress, return token info directly. A contract address always starts with uppercase C
  if (symbol[0] === "C" && symbol.length > 6) {
    return appStore.fetchTokenInfo(symbol);
  }
  const contractAddress = tokenList.find(
    (token) => token.symbol == symbol
  )?.soroban_contract;
  if (!contractAddress) {
    throw new Error(`No token with given address ${symbol} found!`);
  }

  return appStore.fetchTokenInfo(contractAddress);
}
