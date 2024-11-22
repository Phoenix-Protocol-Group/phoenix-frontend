// ToastProvider.tsx
import React, { createContext, useState, ReactNode, FC } from "react";
import { Box } from "@mui/material";
import { Toast } from "@/components/Toast";

// Define Toast type
interface ToastType {
  id: number;
  type: "success" | "error" | "loading";
  message: string;
  transactionId?: string;
}

// Define context value type
interface ToastContextType {
  addToast: (
    message: string,
    type: "success" | "error" | "loading",
    transactionId?: string
  ) => void;
  addAsyncToast: (
    promise: Promise<{ transactionId?: string }>,
    loadingMessage: string
  ) => void;
}

// Create Toast Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (
    message: string,
    type: "success" | "error" | "loading",
    transactionId?: string
  ) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, type, message, transactionId },
    ]);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Function to add async toast
  const addAsyncToast = async (
    promise: Promise<{ transactionId?: string }>,
    loadingMessage: string
  ) => {
    const id = Date.now();
    // Show loading toast
    addToast(loadingMessage, "loading");
    try {
      const result = await promise;
      // Update toast to success with transaction ID if present in the result
      removeToast(id);
      addToast(
        "Transaction completed successfully!",
        "success",
        result.transactionId
      );
    } catch (error: any) {
      // Update toast to error
      removeToast(id);
      addToast(
        error.message ? error.message : "Something went wrong.",
        "error"
      );
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, addAsyncToast }}>
      {children}
      <Box
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </Box>
    </ToastContext.Provider>
  );
};

export default ToastContext;
