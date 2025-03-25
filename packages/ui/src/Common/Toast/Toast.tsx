import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { colors, typography, spacing, borderRadius, shadows } from "../../Theme/styleConstants";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  onClose: (id: string) => void;
  autoHideDuration?: number;
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon sx={{ color: colors.success.main }} />;
    case "error":
      return <ErrorIcon sx={{ color: colors.error.main }} />;
    case "warning":
      return <WarningIcon sx={{ color: colors.warning.main }} />;
    case "info":
    default:
      return <InfoIcon sx={{ color: colors.primary.main }} />;
  }
};

const getToastColor = (type: ToastType) => {
  switch (type) {
    case "success":
      return colors.success.main;
    case "error":
      return colors.error.main;
    case "warning":
      return colors.warning.main;
    case "info":
    default:
      return colors.primary.main;
  }
};

export const Toast = ({ 
  id, 
  type, 
  title, 
  message, 
  onClose, 
  autoHideDuration = 5000 
}: ToastProps) => {
  React.useEffect(() => {
    if (autoHideDuration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, autoHideDuration);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [id, onClose, autoHideDuration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      layout
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
          maxWidth: "400px",
          padding: spacing.md,
          backgroundColor: colors.neutral[800],
          borderRadius: borderRadius.md,
          borderLeft: `4px solid ${getToastColor(type)}`,
          boxShadow: shadows.card,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box sx={{ mr: spacing.sm, mt: "2px" }}>
          {getToastIcon(type)}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          {title && (
            <Typography
              sx={{
                fontFamily: typography.fontFamily,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.bold,
                color: colors.neutral[50],
                mb: "2px",
              }}
            >
              {title}
            </Typography>
          )}
          
          <Typography
            sx={{
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.regular,
              color: colors.neutral[300],
              wordBreak: "break-word",
            }}
          >
            {message}
          </Typography>
        </Box>
        
        <IconButton
          size="small"
          onClick={() => onClose(id)}
          sx={{
            padding: "4px",
            color: colors.neutral[400],
            "&:hover": {
              color: colors.neutral[200],
              backgroundColor: "transparent",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </motion.div>
  );
};
