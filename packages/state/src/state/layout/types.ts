export interface LayoutActions {
  walletModalOpen: boolean;
  setWalletModalOpen: (open: boolean) => void;
  tourRunning: boolean;
  setTourRunning: (running: boolean) => void;
  tourStep: number;
  setTourStep: (step: number) => void;
}
