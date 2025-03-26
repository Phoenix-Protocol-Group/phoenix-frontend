import React, { useContext } from "react";
import { Box } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { Toast, ToastProps } from "./Toast";
import { spacing } from "../../Theme/styleConstants";
import { useToast } from "./useToast";

interface ToastContainerProps {
  toasts?: ToastProps[];
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  onClose?: (id: string) => void;
}

export const ToastContainer = ({
  toasts: externalToasts,
  position = "bottom-right",
  onClose: externalOnClose,
}: ToastContainerProps) => {
  // Get toasts from context if not provided externally
  const toastContext = useToast();
  const toasts = externalToasts || toastContext.toasts;
  const onClose = externalOnClose || toastContext.removeToast;

  // Define position styles
  const getPositionStyle = () => {
    switch (position) {
      case "top-right":
        return { top: spacing.md, right: spacing.md };
      case "top-left":
        return { top: spacing.md, left: spacing.md };
      case "bottom-left":
        return { bottom: spacing.md, left: spacing.md };
      case "top-center":
        return { top: spacing.md, left: "50%", transform: "translateX(-50%)" };
      case "bottom-center":
        return {
          bottom: spacing.md,
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "bottom-right":
      default:
        return { bottom: spacing.md, right: spacing.md };
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: spacing.sm,
        width: {
          xs: "calc(100% - 32px)", // On small screens, use most of the width
          sm: "400px", // On larger screens, fixed width
        },
        maxWidth: "400px", // Maximum width
        maxHeight: "100vh",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "4px",
        },
        ...getPositionStyle(),
      }}
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </Box>
  );
};
