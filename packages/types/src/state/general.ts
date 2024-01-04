import { Server } from "soroban-client";
import { PersistWalletActions } from "./persist";
import { LayoutActions } from "./layout";
import { Horizon } from "stellar-sdk";
import { WalletActions } from "./wallet";

interface GeneralStore {
  server: Horizon.Server;
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
