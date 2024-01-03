import { Horizon } from "stellar-sdk";
import { Token, WalletChain } from "../wallet/types";

export type Wallet = {
  address: string | undefined;
  activeChain: WalletChain | undefined;
  server: Horizon.Server | undefined;
};

export interface PersistWalletActions {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  wallet: Wallet;
}
