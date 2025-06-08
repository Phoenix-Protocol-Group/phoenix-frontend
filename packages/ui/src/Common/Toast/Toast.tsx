import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Link,
  Collapse,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LaunchIcon from "@mui/icons-material/Launch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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
      return (
        <CircularProgress
          size={20}
          thickness={3}
          sx={{
            color: colors.info.main,
            animationDuration: "0.8s",
            filter: `drop-shadow(0 0 8px ${colors.info.main}40)`,
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      );
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

// Helper function to convert hex color to rgb values for gradient usage
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "249, 115, 22"; // Fallback to primary color RGB
};

// Helper function to get RGB from toast color
const getToastColorRgb = (type: ToastType) => {
  return hexToRgb(getToastColor(type));
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
  autoHideDuration = type === "error" ? 10000 : 5000, // Error toasts stay 10 seconds, others 5 seconds
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
  const errorDetails = React.useMemo(() => {
    if (!error) return { display: "", technical: "", hasTechnical: false };

    if (typeof error === "string") {
      return { display: error, technical: error, hasTechnical: false };
    }

    // Handle enhanced error objects with user-friendly messages
    const errorObj = error as any;

    // If we have enhanced error details, format them nicely
    if (errorObj.userFriendlyMessage && errorObj.errorCode !== undefined) {
      const technicalInfo = [
        `Error Code: ${errorObj.errorCode}`,
        errorObj.contractType
          ? `Contract Type: ${errorObj.contractType}`
          : null,
        `Technical Details: ${
          errorObj.message || errorObj.stack || "Unknown error"
        }`,
        errorObj.stack ? `Stack Trace:\n${errorObj.stack}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      return {
        display: errorObj.stack || errorObj.message || String(error),
        technical: technicalInfo,
        hasTechnical: true,
      };
    }

    // Fallback to original behavior
    return {
      display: errorObj.stack || errorObj.message || String(error),
      technical: errorObj.stack || errorObj.message || String(error),
      hasTechnical: Boolean(errorObj.stack),
    };
  }, [error]);

  const hasErrorDetails = type === "error" && errorDetails.display;

  // Copy technical details to clipboard
  const copyErrorDetails = React.useCallback(async () => {
    if (errorDetails.technical) {
      try {
        await navigator.clipboard.writeText(errorDetails.technical);
      } catch (err) {
        console.error("Failed to copy error details:", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = errorDetails.technical;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    }
  }, [errorDetails.technical]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minWidth: "320px",
        maxWidth: "400px",
        background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[850]} 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: borderRadius.lg,
        border: `1px solid ${getToastColor(type)}60`,
        borderLeft: `3px solid ${getToastColor(type)}`,
        boxShadow: `
          0 12px 40px rgba(0, 0, 0, 0.4), 
          0 6px 20px rgba(0, 0, 0, 0.2),
          0 0 0 1px ${getToastColor(type)}40,
          inset 0 1px 0 rgba(255, 255, 255, 0.08)
        `,
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, rgba(${getToastColorRgb(
            type
          )}, 0.08) 0%, transparent 50%, rgba(${getToastColorRgb(
            type
          )}, 0.08) 100%)`,
          pointerEvents: "none",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${getToastColor(
            type
          )}60 50%, transparent 100%)`,
          pointerEvents: "none",
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          padding: spacing.md,
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            mr: spacing.sm,
            mt: "2px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background:
              type === "loading"
                ? `radial-gradient(circle, rgba(${hexToRgb(
                    colors.info.main
                  )}, 0.15) 0%, transparent 70%)`
                : `radial-gradient(circle, rgba(${getToastColorRgb(
                    type
                  )}, 0.15) 0%, transparent 70%)`,
            "&::before":
              type !== "loading"
                ? {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, rgba(${getToastColorRgb(
                      type
                    )}, 0.1) 0%, transparent 50%)`,
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 0.3, transform: "scale(1)" },
                      "50%": { opacity: 0.6, transform: "scale(1.1)" },
                    },
                  }
                : {},
          }}
        >
          {type === "loading" ? (
            <CircularProgress
              size={20}
              thickness={3}
              sx={{
                color: colors.info.main,
                animationDuration: "0.8s",
                filter: `drop-shadow(0 0 8px ${colors.info.main}40)`,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
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
            <Box sx={{ mt: spacing.xs }}>
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
                  cursor: "pointer",
                  textDecoration: "none",
                  padding: "4px 8px",
                  borderRadius: borderRadius.sm,
                  background: `linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)`,
                  border: `1px solid rgba(249, 115, 22, 0.2)`,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    textDecoration: "none",
                    background: `linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)`,
                    border: `1px solid rgba(249, 115, 22, 0.4)`,
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 12px rgba(249, 115, 22, 0.2)`,
                  },
                }}
              >
                View Transaction
                <LaunchIcon sx={{ fontSize: 12, ml: 0.5 }} />
              </Link>
            </Box>
          )}

          {/* Error expand/collapse and copy buttons */}
          {hasErrorDetails && (
            <Box sx={{ mt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  onClick={() => setExpanded(!expanded)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: typography.fontSize.xs,
                    color: colors.primary.main,
                    padding: "4px 8px",
                    borderRadius: borderRadius.sm,
                    background: `linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)`,
                    border: `1px solid rgba(249, 115, 22, 0.2)`,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background: `linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)`,
                      border: `1px solid rgba(249, 115, 22, 0.4)`,
                      transform: "translateY(-1px)",
                      boxShadow: `0 4px 12px rgba(249, 115, 22, 0.2)`,
                    },
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

                {errorDetails.hasTechnical && (
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                    onClick={copyErrorDetails}
                    sx={{
                      fontSize: typography.fontSize.xs,
                      color: colors.neutral[400],
                      textTransform: "none",
                      minWidth: "auto",
                      padding: "4px 8px",
                      borderRadius: borderRadius.sm,
                      background: `linear-gradient(135deg, rgba(115, 115, 115, 0.1) 0%, rgba(115, 115, 115, 0.05) 100%)`,
                      border: `1px solid rgba(115, 115, 115, 0.2)`,
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        color: colors.neutral[200],
                        background: `linear-gradient(135deg, rgba(115, 115, 115, 0.2) 0%, rgba(115, 115, 115, 0.1) 100%)`,
                        border: `1px solid rgba(115, 115, 115, 0.4)`,
                        transform: "translateY(-1px)",
                        boxShadow: `0 4px 12px rgba(115, 115, 115, 0.2)`,
                      },
                    }}
                  >
                    Copy Details
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Only show close button for non-loading toasts */}
        {type !== "loading" && (
          <IconButton
            size="small"
            onClick={() => onClose(id)}
            sx={{
              padding: "6px",
              color: colors.neutral[400],
              borderRadius: "50%",
              background: `linear-gradient(135deg, rgba(115, 115, 115, 0.1) 0%, rgba(115, 115, 115, 0.05) 100%)`,
              border: `1px solid rgba(115, 115, 115, 0.2)`,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                color: colors.neutral[200],
                background: `linear-gradient(135deg, rgba(115, 115, 115, 0.2) 0%, rgba(115, 115, 115, 0.1) 100%)`,
                border: `1px solid rgba(115, 115, 115, 0.4)`,
                boxShadow: `0 4px 12px rgba(115, 115, 115, 0.2)`,
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
              background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
              backdropFilter: "blur(10px)",
              padding: spacing.md,
              mx: spacing.md,
              mb: spacing.md,
              borderRadius: borderRadius.md,
              border: `1px solid ${colors.neutral[700]}`,
              maxHeight: "200px",
              overflow: "auto",
              fontSize: typography.fontSize.xs,
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              color: colors.error.light,
              wordBreak: "break-word",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, rgba(229, 115, 115, 0.03) 0%, transparent 50%, rgba(229, 115, 115, 0.03) 100%)`,
                pointerEvents: "none",
                borderRadius: borderRadius.md,
              },
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: colors.neutral[800],
                borderRadius: borderRadius.sm,
              },
              "&::-webkit-scrollbar-thumb": {
                background: `linear-gradient(135deg, ${colors.error.main} 0%, ${colors.error.dark} 100%)`,
                borderRadius: borderRadius.sm,
                "&:hover": {
                  background: colors.error.light,
                },
              },
            }}
          >
            {errorDetails.display}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};
