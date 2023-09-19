import { Server } from "soroban-client";
import { AppStore, SetStateType, GetStateType, AppStorePersist } from "../types";
import { allChains, networkToActiveChain } from "../wallet/chains";
import {usePersistStore} from '../store';
import { Connector } from "../wallet/types";

export const createConnectWalletActions = () => {
  return {
    wallet: {
      address: undefined,
      activeChain: undefined,
      server: undefined,
      connector: undefined
    },

    // This function is called when the user clicks the "Connect" button
    // in the wallet modal. It uses the Freighters SDK to get the user's
    // address and network details, and then stores them in the app state.
    connectWallet: async (connector: Connector) => {
      // Get the network details from the user's wallet.
      const networkDetails = await connector.getNetworkDetails();

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
      const address = await connector.getPublicKey();

      // Create a server object to connect to the blockchain.
      let server =
        networkDetails &&
        new Server(networkDetails.networkUrl, {
          allowHttp: networkDetails.networkUrl.startsWith("http://"),
        });

      // Update the state to store the wallet address and server.
      usePersistStore.setState((state: AppStorePersist) => ({
        ...state,
        wallet: { address, activeChain, server, connector, },
      }));

      return;
    },

    // Disconnect the wallet
    disconnectWallet: () => {
      // Update the state
      usePersistStore.setState((state: AppStorePersist) => ({
        ...state,
        wallet: {
          address: undefined,
          activeChain: undefined,
          server: undefined,
          connector: undefined,
        },
      }));
    },
  };
};
