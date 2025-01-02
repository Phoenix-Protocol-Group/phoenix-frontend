import { create } from "zustand";
import { createWalletActions } from "./wallet/actions";
import { persist, createJSONStorage } from "zustand/middleware";
import { Horizon } from "@stellar/stellar-sdk";
import { AppStore, AppStorePersist } from "@phoenix-protocol/types";
import { createConnectWalletActions } from "./persist/createConnectWalletActions";
import { createLayoutActions } from "./layout/actions";
import { createDisclaimerAction } from "./persist/createDisclaimerActions";
import { NETWORK_PASSPHRASE, RPC_URL } from "../constants";

//@ts-ignore
export const useAppStore = create<AppStore>()((set, get) => {
  // Create a new server instance.
  const server = new Horizon.Server(RPC_URL);

  // The network passphrase for the test network.
  const networkPassphrase = NETWORK_PASSPHRASE;

  // Create some states for the app and layouting
  const layout = createLayoutActions(set, get);

  // Create a wallet with the given server and network passphrase.
  const wallet = createWalletActions(set, get);

  return {
    server,
    networkPassphrase,
    ...wallet,
    ...layout,
  };
});

export const usePersistStore = create<AppStorePersist>()(
  persist(
    (set, get) => {
      // Create a new server instance.
      const server = new Horizon.Server(RPC_URL);

      // The network passphrase for the test network.
      const networkPassphrase = NETWORK_PASSPHRASE;

      // Create a wallet with the given server and network passphrase.
      const walletPersist = createConnectWalletActions();

      //Create a store for disclaimer modal
      const disclaimer = createDisclaimerAction();

      return {
        server,
        networkPassphrase,
        ...walletPersist,
        ...disclaimer,
      };
    },
    {
      name: "app-storage", // name of the item in the storage (must be unique)
    }
  )
);
