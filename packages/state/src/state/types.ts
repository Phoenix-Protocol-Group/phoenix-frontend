import { Horizon } from "stellar-sdk";
import { WalletActions } from "./wallet/types";
import { PersistWalletActions } from "./persist/types";

interface GeneralStore {
  server: Horizon.Server;
  networkPassphrase: string;
}

export type AppStore = WalletActions & GeneralStore;

export type AppStorePersist = PersistWalletActions;

export type SetStateType = (
  partial:
    | AppStore
    | Partial<AppStore>
    | ((state: AppStore) => AppStore | Partial<AppStore>),
  replace?: boolean | undefined
) => void;

export type GetStateType = () => AppStore;
