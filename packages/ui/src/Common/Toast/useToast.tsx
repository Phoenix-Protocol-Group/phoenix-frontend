import React, { useState, useCallback, useContext, createContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastProps, ToastType } from "./Toast";

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (options: Omit<ToastProps, "id" | "onClose">) => string;
  removeToast: (id: string) => void;
  removeAll: () => void;
  success: (message: string, options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>) => string;
  error: (message: string, options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>) => string;
  warning: (message: string, options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>) => string;
  info: (message: string, options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((options: Omit<ToastProps, "id" | "onClose">) => {
    const id = uuidv4();
    setToasts(prev => [...prev, { ...options, id, onClose: removeToast }]);
    return id;
  }, [removeToast]);

  const removeAll = useCallback(() => {
    setToasts([]);
  }, []);

  const createToastWithType = useCallback(
    (type: ToastType) => (message: string, options?: Partial<Omit<ToastProps, "id" | "onClose" | "message" | "type">>) => {
      return addToast({ message, type, ...options });
    },
    [addToast]
  );

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAll,
    success: createToastWithType("success"),
    error: createToastWithType("error"),
    warning: createToastWithType("warning"),
    info: createToastWithType("info"),
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
