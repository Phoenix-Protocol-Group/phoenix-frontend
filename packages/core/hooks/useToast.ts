// ToastHook.ts
import { useContext } from "react";
import ToastContext from "@/providers/ToastProvider";

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
