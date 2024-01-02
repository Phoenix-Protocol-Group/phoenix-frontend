import { AppStore, GetStateType, SetStateType } from "../types";
import { LayoutActions } from "./types";

export const createLayoutActions = (
  setState: SetStateType,
  getState: GetStateType
): LayoutActions => {
  return {
    walletModalOpen: false,
    tourRunning: false,
    setTourRunning: (running: boolean) => {
      setState((state: AppStore) => {
        return { ...state, tourRunning: running };
      });
    },
    tourStep: 0,
    setTourStep: (step: number) => {
      setState((state: AppStore) => {
        return { ...state, tourStep: step };
      });
    },
    setWalletModalOpen: (open: boolean) => {
      setState((state: AppStore) => {
        return { ...state, walletModalOpen: open };
      });
    },
  };
};
