import { create } from "zustand";
import { createWalletActions } from "./wallet/actions";
import { Server } from "soroban-client";

export const useAppStore = create<AppStore>()((set, get) => ({
  server: new Server("https://soroban-rpc.stellar.org"),
  ...createWalletActions(set, get),
}));
