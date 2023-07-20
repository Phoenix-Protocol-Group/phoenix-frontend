import { WalletActions, Token, Wallet } from "./types";
import { Account, Server } from "soroban-client";
import { AppStore, SetStateType, GetStateType } from "../types";
import { freighter } from "./freighter";
import { allChains, networkToActiveChain } from "./chains";
import { SorobanTokenContract } from "@phoenix-protocol/contracts";

export const createWalletActions = (
  setState: SetStateType,
  getState: GetStateType
): WalletActions => {
  return {
    // The address of the wallet connected to the app
    wallet: {
      address: undefined,
      activeChain: undefined,
      server: undefined,
    },

    // This function is called when the user clicks the "Connect" button
    // in the wallet modal. It uses the Freighters SDK to get the user's
    // address and network details, and then stores them in the app state.
    connectWallet: async () => {
      // Get the network details from the user's wallet.
      const networkDetails = await freighter().getNetworkDetails();

      // Throw an error if the network is not supported.
      if (
        !allChains.find(
          (c: any) => c.networkPassphrase === networkDetails?.networkPassphrase
        )
      ) {
        const error = new Error(
          "Your Wallet network is not supported in this app"
        );
        throw error;
      }

      // Get the active chain from the network details.
      const activeChain = networkToActiveChain(networkDetails, allChains);

      // Get the user's address from the wallet.
      const address = await freighter().getPublicKey();

      // Create a server object to connect to the blockchain.
      let server =
        networkDetails &&
        new Server(networkDetails.networkUrl, {
          allowHttp: networkDetails.networkUrl.startsWith("http://"),
        });

      // Update the state to store the wallet address and server.
      setState((state: AppStore) => ({
        ...state,
        wallet: { address, activeChain, server },
      }));

      return;
    },

    // Disconnect the wallet
    disconnectWallet: () => {
      // Update the state
      setState((state: AppStore) => ({
        ...state,
        wallet: {
          address: undefined,
          activeChain: undefined,
          server: undefined,
        },
      }));
    },

    tokens: [],

    fetchTokenBalance: async (tokenId: string) => {
      // Check if account, server, and network passphrase are set
      if (
        !getState().wallet ||
        !getState().server ||
        !getState().networkPassphrase
      ) {
        throw new Error("Missing account, server, or network passphrase");
      }

      // Create Soroban token query client
      if (typeof getState().wallet.address !== "string") {
        throw new Error("Missing wallet address");
      }

      const balance = await SorobanTokenContract.balance(
        // @ts-ignore
        { id: getState().wallet.address },
        {},
        tokenId
      );

      const decimals =
        getState().tokens.find((token: Token) => token.id === tokenId)
          ?.decimals || (await SorobanTokenContract.decimals({}, tokenId));

      // Update token balance
      setState((state: AppStore) => {
        const updatedTokens = state.tokens.map((token: Token) =>
          token.id === tokenId ? { ...token, balance, decimals } : token
        );
        // If token couldnt be found, add it
        if (!updatedTokens.find((token: Token) => token.id === tokenId)) {
          updatedTokens.push({ id: tokenId, balance, decimals: decimals });
        }
        return { tokens: updatedTokens };
      });
    },
  };
};
