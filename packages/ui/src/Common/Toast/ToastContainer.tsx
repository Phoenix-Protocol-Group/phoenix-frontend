import React, { useContext } from "react";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { Toast, ToastProps } from "./Toast";
import { spacing, colors, borderRadius } from "../../Theme/styleConstants";
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        zIndex: 2000,
        ...getPositionStyle(),
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.sm,
          width: {
            xs: "calc(100vw - 32px)", // On small screens, use most of the width
            sm: "400px", // On larger screens, fixed width
          },
          maxWidth: "400px", // Maximum width
          maxHeight: "100vh",
          overflowY: "auto",
          padding: spacing.xs,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
            borderRadius: borderRadius.sm,
            "&:hover": {
              background: colors.primary.light,
            },
          },
          // Enhanced scrollbar for Firefox
          scrollbarWidth: "thin",
          scrollbarColor: `${colors.primary.main} transparent`,
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay: index * 0.1,
                },
              }}
              exit={{
                opacity: 0,
                x: 300,
                scale: 0.8,
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
            >
              <Toast {...toast} onClose={onClose} />
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};
