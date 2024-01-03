import { Wallet } from "./wallet";

export interface PersistWalletActions {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  wallet: Wallet;
}
