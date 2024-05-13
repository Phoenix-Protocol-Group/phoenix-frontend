import { AppStorePersist } from "@phoenix-protocol/types";
import { usePersistStore } from "../store";

export const createDisclaimerAction = () => {
  return {
    disclaimer: {
      accepted: false
    },
    setDisclaimerAccepted: async (accepted: boolean) => {
      usePersistStore.setState((state: AppStorePersist) => ({
        ...state,
        disclaimer: {
          ...state.disclaimer,
          accepted,
        },
      }));
    },
  };
};
