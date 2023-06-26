import { Server } from "soroban-client";
import { WalletActions } from "./wallet/types";

interface GeneralStore {
  server: Server;
  networkPassphrase: string;
}

export type AppStore = WalletActions & GeneralStore;

export type SetStateType = (
  partial:
    | AppStore
    | Partial<AppStore>
    | ((state: AppStore) => AppStore | Partial<AppStore>),
  replace?: boolean | undefined
) => void;

export type GetStateType = () => AppStore;
