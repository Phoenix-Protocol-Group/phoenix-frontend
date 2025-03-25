import React from "react";
import { Box } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { Toast, ToastProps } from "./Toast";
import { spacing } from "../../Theme/styleConstants";

interface ToastContainerProps {
  toasts: ToastProps[];
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  onClose: (id: string) => void;
}

export const ToastContainer = ({ 
  toasts, 
  position = "bottom-right", 
  onClose 
}: ToastContainerProps) => {
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
        return { bottom: spacing.md, left: "50%", transform: "translateX(-50%)" };
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
        maxWidth: "100%",
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
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            {...toast} 
            onClose={onClose} 
          />
        ))}
      </AnimatePresence>
    </Box>
  );
};
