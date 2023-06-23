import { SorobanTokenQueryClient } from "../../clients/Token.client";
import { WalletActions, Token } from "./types";

export const createWalletActions = (
  setState: SetStateType,
  getState: GetStateType
): WalletActions => {
  return {
    // The address of the wallet connected to the app
    account: undefined,

    // Connects a wallet to the app
    connectWallet: (account) => {
      try {
        // Update the state to store the wallet address
        setState((state: AppStore) => ({ ...state, account }));
      } catch (error) {
        // Handle error
      }
    },

    tokens: [],
    fetchTokenBalance: async (tokenId: string) => {
      try {
        if (
          !getState().account ||
          !getState().server ||
          !getState().networkPassphrase
        ) {
          throw new Error("Missing account, server, or network passphrase");
        }

        const queryClient = new SorobanTokenQueryClient(
          getState().server,
          getState().networkPassphrase,
          tokenId,
          getState().account
        );

        // Fetch token balance
        const balance = await queryClient.balance(
          getState().account.accountId()
        );

        setState((state: AppStore) => {
          const updatedTokens = state.tokens.map((token: Token) =>
            token.id === tokenId ? { ...token, balance } : token
          );
          return { tokens: updatedTokens };
        });
      } catch (error) {
        // Handle error
      }
    },
  };
};
