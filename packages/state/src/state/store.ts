import { create } from "zustand";
import { createWalletActions } from "./wallet/actions";
import { Server } from "soroban-client";
import { AppStore } from "./types";

export const useAppStore = create<AppStore>()((set, get) => {
  // Create a new server instance.
  const server = new Server("https://soroban-rpc.stellar.org");

  // The network passphrase for the test network.
  const networkPassphrase = "Test SDF Network ; September 2015";

  // Create a wallet with the given server and network passphrase.
  const wallet = createWalletActions(set, get);

  return {
    server,
    networkPassphrase,
    ...wallet,
  };
});
