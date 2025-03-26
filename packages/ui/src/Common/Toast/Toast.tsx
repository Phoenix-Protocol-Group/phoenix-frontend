import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Link,
  Collapse,
} from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../Theme/styleConstants";

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  onClose: (id: string) => void;
  autoHideDuration?: number;
  transactionId?: string;
  error?: Error | string | { message: string; stack?: string }; // For collapsible error details
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
      return <InfoIcon sx={{ color: colors.primary.main }} />;
    case "loading":
      return <CircularProgress size={20} sx={{ color: colors.info.main }} />;
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
    case "loading":
      return colors.info.main;
    case "info":
    default:
      return colors.primary.main;
  }
};

// Helper function to get Explorer URL for transaction
const getExplorerUrl = (transactionId: string) => {
  return `https://stellar.expert/explorer/public/tx/${transactionId}`;
};

export const Toast = ({
  id,
  type,
  title,
  message,
  onClose,
  autoHideDuration = 5000,
  transactionId,
  error,
}: ToastProps) => {
  const [expanded, setExpanded] = useState(false);

  React.useEffect(() => {
    // Don't auto-hide loading toasts
    if (autoHideDuration && type !== "loading") {
      const timer = setTimeout(() => {
        onClose(id);
      }, autoHideDuration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [id, onClose, autoHideDuration, type]);

  // Format error details for display
  const errorMessage = React.useMemo(() => {
    if (!error) return "";
    if (typeof error === "string") return error;

    // Handle Error objects and plain objects with message/stack properties
    const errorObj = error as any;
    return errorObj.stack || errorObj.message || String(error);
  }, [error]);

  const hasErrorDetails = type === "error" && errorMessage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      layout
      style={{ width: "100%" }} // Ensure consistent width
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%", // Fix width to be consistent
          minWidth: "320px", // Set minimum width
          maxWidth: "400px",
          backgroundColor: colors.neutral[800],
          borderRadius: borderRadius.md,
          borderLeft: `4px solid ${getToastColor(type)}`,
          boxShadow: shadows.card,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            padding: spacing.md,
            width: "100%", // Ensure full width
          }}
        >
          <Box sx={{ mr: spacing.sm, mt: "2px" }}>
            {type === "loading" ? (
              <CircularProgress
                size={22}
                thickness={4}
                sx={{
                  color: colors.info.main,
                  animationDuration: "0.8s", // Speed up the animation slightly
                }}
              />
            ) : (
              getToastIcon(type)
            )}
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

            {/* Transaction Link */}
            {transactionId && (
              <Link
                href={getExplorerUrl(transactionId)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.xs,
                  color: colors.primary.main,
                  mt: spacing.xs,
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                View Transaction
                <LaunchIcon sx={{ fontSize: 12, ml: 0.5 }} />
              </Link>
            )}

            {/* Error expand/collapse button */}
            {hasErrorDetails && (
              <Box
                onClick={() => setExpanded(!expanded)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  cursor: "pointer",
                  fontSize: typography.fontSize.xs,
                  color: colors.primary.main,
                }}
              >
                <Typography sx={{ fontSize: "inherit", color: "inherit" }}>
                  {expanded ? "Hide Details" : "Show Details"}
                </Typography>
                {expanded ? (
                  <ExpandLessIcon sx={{ fontSize: 16, ml: 0.5 }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 16, ml: 0.5 }} />
                )}
              </Box>
            )}
          </Box>

          {/* Only show close button for non-loading toasts */}
          {type !== "loading" && (
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
          )}
        </Box>

        {/* Collapsible Error Details */}
        {hasErrorDetails && (
          <Collapse in={expanded}>
            <Box
              sx={{
                backgroundColor: colors.neutral[900],
                padding: spacing.md,
                mx: spacing.md,
                mb: spacing.md,
                borderRadius: borderRadius.sm,
                maxHeight: "200px",
                overflow: "auto",
                fontSize: typography.fontSize.xs,
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                color: colors.error.light,
                wordBreak: "break-word",
              }}
            >
              {errorMessage}
            </Box>
          </Collapse>
        )}
      </Box>
    </motion.div>
  );
};
