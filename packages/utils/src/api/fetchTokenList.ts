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
  console.log(tokenList);
  const contractAddress = tokenList.find(
    (token) => token.token == scaAddress
  )?.soroban_contract;
  if (!contractAddress) {
    throw new Error("No token with given address found!");
  }

  return appStore.fetchTokenInfo(contractAddress);
}
