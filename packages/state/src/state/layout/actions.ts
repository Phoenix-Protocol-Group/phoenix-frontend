import {
  LayoutActions,
  AppStore,
  GetStateType,
  SetStateType,
} from "@phoenix-protocol/types";

export const createLayoutActions = (
  setState: SetStateType,
  getState: GetStateType
): LayoutActions => {
  return {
    walletModalOpen: false,
    tourRunning: false,
    loading: true,
    setTourRunning: (running: boolean) => {
      setState((state: AppStore) => {
        return { ...state, tourRunning: running };
      });
    },
    setLoading: (loading: boolean) => {
      setState((state: AppStore) => {
        return { ...state, loading };
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
