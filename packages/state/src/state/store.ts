import { create } from "zustand";
import { createWalletActions } from "./wallet/actions";
import { Server } from "soroban-client";
import { AppStore } from "./types";

export const useAppStore = create<AppStore>()((set, get) => {
  const server = new Server("https://soroban-rpc.stellar.org");
  const networkPassphrase = "Test SDF Network ; September 2015";
  const wallet = createWalletActions(set, get);

  return {
    server,
    networkPassphrase,
    ...wallet,
  };
});
