import { Disclaimer } from "./disclaimer";
import { UserTour } from "./userTour";
import { Wallet } from "./wallet";

export interface PersistWalletActions {
  connectWallet: (wallet: string) => Promise<void>;
  disconnectWallet: () => void;
  wallet: Wallet;
  userTour: UserTour;
  disclaimer: Disclaimer;
  skipUserTour: () => Promise<void>;
  setUserTourStep: (step: number) => Promise<void>;
  setUserTourActive: (active: boolean) => Promise<void>;
  setDisclaimerAccepted: (accepted: boolean) => Promise<void>;
}
