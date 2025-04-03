import React, { ReactNode, FC } from "react";
import {
  ToastProvider as UIToastProvider,
  ToastContainer,
} from "@phoenix-protocol/ui/src/Common/Toast";

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <UIToastProvider>
      {children as any}
      {/* ToastContainer will now automatically use toasts from context */}
      <ToastContainer position="top-right" />
    </UIToastProvider>
  );
};

export { useToast } from "@phoenix-protocol/ui/src/Common/Toast";
export default ToastProvider;
