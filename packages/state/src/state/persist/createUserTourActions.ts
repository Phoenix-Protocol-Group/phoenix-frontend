import { AppStorePersist } from "@phoenix-protocol/types";
import { usePersistStore } from "../store";

export const createUserTourActions = () => {
  return {
    userTour: {
      active: false,
      step: 0,
      skipped: false,
    },
    skipUserTour: async () => {
      usePersistStore.setState((state: AppStorePersist) => ({
        ...state,
        userTour: {
          ...state.userTour,
          skipped: true,
        },
      }));
    },
    setUserTourStep: async (step: number) => {
      usePersistStore.setState((state: AppStorePersist) => ({
        ...state,
        userTour: {
          ...state.userTour,
          step,
        },
      }));
    },
    setUserTourActive: async (active: boolean) => {
      usePersistStore.setState((state: AppStorePersist) => ({
        ...state,
        userTour: {
          ...state.userTour,
          active,
        },
      }));
    },
  };
};
