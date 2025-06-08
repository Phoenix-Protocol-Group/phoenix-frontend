import React, { useState, useCallback, useContext, createContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastProps, ToastType } from "./Toast";

// Import enhanced error resolver
import { resolveContractErrorEnhanced } from "@phoenix-protocol/utils/src/enhancedErrorResolver";

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (options: Omit<ToastProps, "id" | "onClose">) => string;
  removeToast: (id: string) => void;
  removeAll: () => void;
  success: (
    message: string,
    options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>
  ) => string;
  error: (
    message: string,
    options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>
  ) => string;
  warning: (
    message: string,
    options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>
  ) => string;
  info: (
    message: string,
    options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>
  ) => string;
  loading: (
    message: string,
    options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>
  ) => string;
  addAsyncToast: (
    promise: Promise<any>,
    loadingMessage: string,
    options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>
  ) => Promise<any>;
  updateToast: (
    id: string,
    options: Partial<Omit<ToastProps, "id" | "onClose">>
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (options: Omit<ToastProps, "id" | "onClose">) => {
      const id = uuidv4();
      setToasts((prev) => [...prev, { ...options, id, onClose: removeToast }]);
      return id;
    },
    [removeToast]
  );

  const updateToast = useCallback(
    (id: string, options: Partial<Omit<ToastProps, "id" | "onClose">>) => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, ...options } : toast
        )
      );
    },
    []
  );

  const removeAll = useCallback(() => {
    setToasts([]);
  }, []);

  const createToastWithType = useCallback(
    (type: ToastType) =>
      (
        message: string,
        options?: Partial<
          Omit<ToastProps, "id" | "onClose" | "message" | "type">
        >
      ) => {
        return addToast({ message, type, ...options });
      },
    [addToast]
  );

  // Add async toast handling
  const addAsyncToast = useCallback(
    async (
      promise: Promise<any>,
      loadingMessage: string,
      options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>
    ) => {
      const toastId = addToast({
        message: loadingMessage,
        type: "loading",
        ...options,
      });

      try {
        const result = await promise;

        // Extract transaction ID if available in the result
        const transactionId = result?.transactionId || undefined;

        updateToast(toastId, {
          type: "success",
          message: options?.title
            ? `${options.title} succeeded`
            : "Operation completed successfully!",
          transactionId,
        });

        // Auto remove success toasts after 5 seconds
        setTimeout(() => {
          removeToast(toastId);
        }, 5000);

        return result;
      } catch (error) {
        // Enhanced error processing using the new error resolver
        const errorString =
          error instanceof Error
            ? error.message
            : typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : String(error);

        // Use enhanced error resolver to get user-friendly message
        const errorResult = resolveContractErrorEnhanced(errorString);

        // Create a serializable error object with enhanced details
        const errorObj =
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                userFriendlyMessage: errorResult.userFriendlyMessage,
                errorCode: errorResult.errorCode,
                contractType: errorResult.contractType,
              }
            : typeof error === "object" && error !== null
            ? {
                ...error,
                userFriendlyMessage: errorResult.userFriendlyMessage,
                errorCode: errorResult.errorCode,
                contractType: errorResult.contractType,
              }
            : {
                message: String(error),
                userFriendlyMessage: errorResult.userFriendlyMessage,
                errorCode: errorResult.errorCode,
                contractType: errorResult.contractType,
              };

        updateToast(toastId, {
          type: "error",
          message: errorResult.userFriendlyMessage, // Use user-friendly message as primary
          error: errorObj, // Store enhanced error details for "Show Details" functionality
        });

        // Auto remove error toasts after 10 seconds
        setTimeout(() => {
          removeToast(toastId);
        }, 10000);

        throw error;
      }
    },
    [addToast, updateToast, removeToast]
  );

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAll,
    updateToast,
    addAsyncToast,
    success: createToastWithType("success"),
    error: createToastWithType("error"),
    warning: createToastWithType("warning"),
    info: createToastWithType("info"),
    loading: createToastWithType("loading"),
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
