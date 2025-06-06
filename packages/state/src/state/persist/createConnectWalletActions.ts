import { Horizon } from "@stellar/stellar-sdk";
import { AppStore, AppStorePersist } from "@phoenix-protocol/types";
import { freighter } from "../wallet/freighter";
import { allChains, networkToActiveChain } from "../wallet/chains";
import { useAppStore, usePersistStore } from "../store";
import { xbull } from "../wallet/xbull";
import { lobstr } from "../wallet/lobstr";
import { WalletConnect } from "../wallet/wallet-connect";
import { hana } from "../wallet/hana";

// Maintain a single WalletConnect instance
let walletConnectInstance: WalletConnect | null = null;

export const initializeWalletConnect = async () => {
  if (!walletConnectInstance) {
    walletConnectInstance = new WalletConnect();
    console.log("Initialized Wallet Connect");
  }

  try {
    // This will trigger connection if no session exists
    const publicKey = await walletConnectInstance.getPublicKey();
    console.log("Wallet connected with public key:", publicKey);

    // Save the walletConnectInstance in the regular app state
    useAppStore.setState((state: AppStore) => ({
      ...state,
      walletConnectInstance,
    }));

    return walletConnectInstance;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw error;
  }
};

export const createConnectWalletActions = () => {
  return {
    wallet: {
      address: undefined,
      activeChain: undefined,
      server: undefined,
      walletType: undefined,
    },

    // This function is called when the user clicks the "Connect" button
    // in the wallet modal. It uses the Freighters SDK to get the user's
    // address and network details, and then stores them in the app state.
    connectWallet: async (wallet: string) => {
      // Get the network details from the user's wallet.
      // TODO: Make this dynamic
      const networkDetails = {
        network: "STANDALONE",
        networkPassphrase: "Public Global Stellar Network ; September 2015",
        networkUrl:
          "https://mainnet.stellar.validationcloud.io/v1/YcyPYotN_b6-_656rpr0CabDwlGgkT42NCzPVIqcZh0",
        sorobanRpcUrl:
          "https://bitter-alpha-layer.stellar-mainnet.quiknode.pro/54b50c548864e1470fd52dbd629b647d556b983e",
      };

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
      let address = "";

      switch (wallet) {
        case "freighter":
          address = await freighter().getPublicKey();
          break;
        case "xbull":
          address = await xbull().getPublicKey();
          break;
        case "lobstr":
          address = await lobstr().getPublicKey();
          break;
        case "hana":
          address = await hana().getPublicKey();
          break;
        case "wallet-connect":
          const Client = await initializeWalletConnect();
          address = await Client.getPublicKey();
          break;
        default:
          throw new Error("Wallet not supported");
      }

      // Create a server object to connect to the blockchain.
      let server =
        networkDetails &&
        new Horizon.Server(networkDetails.networkUrl, {
          allowHttp: networkDetails.networkUrl.startsWith("http://"),
        });

      // Update the state to store the wallet address and server.
      // @ts-ignore
      usePersistStore.setState((state: AppStorePersist) => ({
        ...state,
        wallet: { address, activeChain, server, walletType: wallet },
      }));

      return;
    },

    // Disconnect the wallet
    disconnectWallet: async () => {
      const currentWalletType = usePersistStore.getState().wallet.walletType;

      // If it's a WalletConnect session, properly disconnect
      if (currentWalletType === "wallet-connect" && walletConnectInstance) {
        try {
          await walletConnectInstance.disconnect();
          walletConnectInstance = null;
        } catch (error) {
          console.error("Error disconnecting WalletConnect:", error);
        }
      }

      // Update the state
      usePersistStore.setState((state: AppStorePersist) => ({
        ...state,
        wallet: {
          address: undefined,
          activeChain: undefined,
          server: undefined,
          walletType: undefined,
        },
      }));

      // Clear the app state WalletConnect instance
      useAppStore.setState((state: AppStore) => ({
        ...state,
        walletConnectInstance: null,
      }));
    },
  };
};
