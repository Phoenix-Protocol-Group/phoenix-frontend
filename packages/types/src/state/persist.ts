import { Disclaimer } from "./disclaimer";
import { Wallet } from "./wallet";

export interface PersistWalletActions {
  connectWallet: (wallet: string) => Promise<void>;
  disconnectWallet: () => void;
  wallet: Wallet;
  disclaimer: Disclaimer;
  setDisclaimerAccepted: (accepted: boolean) => Promise<void>;
}
