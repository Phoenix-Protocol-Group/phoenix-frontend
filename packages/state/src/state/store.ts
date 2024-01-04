import { create } from "zustand";
import { createWalletActions } from "./wallet/actions";
import { persist, createJSONStorage } from "zustand/middleware";
import { Horizon } from "stellar-sdk";
import { AppStore, AppStorePersist } from "@phoenix-protocol/types";
import { createConnectWalletActions } from "./persist/createConnectWalletActions";
import { createLayoutActions } from "./layout/actions";
import { createUserTourActions } from "./persist/createUserTourActions";

export const useAppStore = create<AppStore>()((set, get) => {
  // Create a new server instance.
  const server = new Horizon.Server("https://soroban-rpc.stellar.org");

  // The network passphrase for the test network.
  const networkPassphrase = "Test SDF Network ; September 2015";

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
      const server = new Horizon.Server("https://soroban-rpc.stellar.org");

      // The network passphrase for the test network.
      const networkPassphrase = "Test SDF Network ; September 2015";

      // Create a wallet with the given server and network passphrase.
      const walletPersist = createConnectWalletActions();

      // Create a store for user tour
      const userTour = createUserTourActions();

      return {
        server,
        networkPassphrase,
        ...walletPersist,
        ...userTour,
      };
    },
    {
      name: "app-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
