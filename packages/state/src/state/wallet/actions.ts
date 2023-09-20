import { WalletActions, Token } from "./types";
import { AppStore, SetStateType, GetStateType } from "../types";
import { SorobanTokenContract } from "@phoenix-protocol/contracts";
import { usePersistStore } from "../store";
import { Address } from "soroban-client";
import { constants } from "@phoenix-protocol/utils";

export const createWalletActions = (
  setState: SetStateType,
  getState: GetStateType
): WalletActions => {
  return {
    tokens: [],

    fetchTokenInfo: async (tokenAddress: Address) => {
      let updatedTokenInfo: Token | undefined;
      // Check if account, server, and network passphrase are set
      if (!getState().server || !getState().networkPassphrase) {
        throw new Error("Missing account, server, or network passphrase");
      }

      const TokenContract = new SorobanTokenContract.Contract({
        contractId: tokenAddress.toString(),
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      });

      let balance: bigint;
      try {
        balance = BigInt(
          await TokenContract.balance({
            id: Address.fromString(usePersistStore.getState().wallet.address!),
          })
        );
      } catch (e) {
        balance = BigInt(0);
        console.log(e, "User has no balance");
      }

      const symbol: string =
        getState().tokens.find(
          (token: Token) => token.id === tokenAddress.toString()
        )?.symbol || (await TokenContract.symbol());

      const decimals =
        getState().tokens.find(
          (token: Token) => token.id === tokenAddress.toString()
        )?.decimals || Number(await TokenContract.decimals());

      // Update token balance
      setState((state: AppStore) => {
        const updatedTokens = state.tokens.map((token: Token) =>
          token.id === tokenAddress.toString()
            ? { ...token, balance, decimals, symbol }
            : token
        );
        // If token couldnt be found, add it
        if (
          !updatedTokens.find(
            (token: Token) => token.id === tokenAddress.toString()
          )
        ) {
          updatedTokens.push({
            id: tokenAddress.toString(),
            balance,
            decimals: decimals,
            symbol: symbol,
          });
        }
        updatedTokenInfo = updatedTokens.find(
          (token: Token) => token.id === tokenAddress.toString()
        );
        return { tokens: updatedTokens };
      });
      return updatedTokenInfo;
    },
  };
};
