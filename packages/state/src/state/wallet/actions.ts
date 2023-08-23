import { WalletActions, Token } from "./types";
import { AppStore, SetStateType, GetStateType } from "../types";
import { SorobanTokenContract } from "@phoenix-protocol/contracts";
import { usePersistStore } from "../store";

export const createWalletActions = (
  setState: SetStateType,
  getState: GetStateType
): WalletActions => {
  return {
    tokens: [],

    fetchTokenInfo: async (tokenId: string) => {
      let updatedTokenInfo: Token | undefined;
      // Check if account, server, and network passphrase are set
      if (!getState().server || !getState().networkPassphrase) {
        throw new Error("Missing account, server, or network passphrase");
      }

      let balance: bigint;
      try {
        balance = BigInt(
          await SorobanTokenContract.balance(
            {
              id: usePersistStore.getState().wallet.address as string,
            },
            tokenId
          )
        );
      } catch (e) {
        balance = BigInt(0);
        console.log(e, "User has no balance");
      }

      const symbol: string =
        getState().tokens.find((token: Token) => token.id === tokenId)
          ?.symbol || (await SorobanTokenContract.symbol(tokenId));

      const decimals =
        getState().tokens.find((token: Token) => token.id === tokenId)
          ?.decimals || Number(await SorobanTokenContract.decimals(tokenId));

      // Update token balance
      setState((state: AppStore) => {
        const updatedTokens = state.tokens.map((token: Token) =>
          token.id === tokenId ? { ...token, balance, decimals, symbol } : token
        );
        // If token couldnt be found, add it
        if (!updatedTokens.find((token: Token) => token.id === tokenId)) {
          updatedTokens.push({
            id: tokenId,
            balance,
            decimals: decimals,
            symbol: symbol,
          });
        }
        updatedTokenInfo = updatedTokens.find(
          (token: Token) => token.id === tokenId
        );
        return { tokens: updatedTokens };
      });
      return updatedTokenInfo;
    },
  };
};
