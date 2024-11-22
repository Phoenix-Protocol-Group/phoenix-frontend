import { RestoreModal } from "@/components/RestoreModal";
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from "react";

interface RestoreModalContextProps {
  isRestoreModalOpen: boolean;
  openRestoreModal: (onRestore: () => void) => void;
  closeRestoreModal: () => void;
  restoreTransactionFunction: (() => void) | null;
}

export const RestoreModalContext = createContext<
  RestoreModalContextProps | undefined
>(undefined);
export const RestoreModalProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restoreTransactionFunction, setRestoreTransactionFunction] = useState<
    () => void
  >(() => {});

  const openRestoreModal = (onRestore: () => void) => {
    setRestoreTransactionFunction(() => onRestore);
    setIsRestoreModalOpen(true);
  };

  const closeRestoreModal = () => {
    setIsRestoreModalOpen(false);
    setRestoreTransactionFunction(() => {});
  };

  return (
    <RestoreModalContext.Provider
      value={{
        isRestoreModalOpen,
        openRestoreModal,
        closeRestoreModal,
        restoreTransactionFunction,
      }}
    >
      {children}
      <RestoreModal
        isOpen={isRestoreModalOpen}
        onClose={closeRestoreModal}
        onRestore={restoreTransactionFunction}
      />
    </RestoreModalContext.Provider>
  );
};

export const useRestoreModal = () => {
  const context = useContext(RestoreModalContext);
  if (!context) {
    throw new Error(
      "useRestoreModal must be used within a RestoreModalProvider"
    );
  }
  return context;
};
