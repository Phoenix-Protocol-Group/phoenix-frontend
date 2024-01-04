import { UserTour } from "./userTour";
import { Wallet } from "./wallet";

export interface PersistWalletActions {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  wallet: Wallet;
  userTour: UserTour;
  skipUserTour: () => Promise<void>;
  setUserTourStep: (step: number) => Promise<void>;
  setUserTourActive: (active: boolean) => Promise<void>;
}
