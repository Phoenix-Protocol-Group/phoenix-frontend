import { Server } from "soroban-client";
import { WalletActions } from "./wallet/types";
import { PersistWalletActions } from "./persist/types";
import { LayoutActions } from "./layout/types";

interface GeneralStore {
  server: Server;
  networkPassphrase: string;
}

export type AppStore = WalletActions & LayoutActions & GeneralStore;

export type AppStorePersist = PersistWalletActions;

export type SetStateType = (
  partial:
    | AppStore
    | Partial<AppStore>
    | ((state: AppStore) => AppStore | Partial<AppStore>),
  replace?: boolean | undefined
) => void;

export type GetStateType = () => AppStore;
