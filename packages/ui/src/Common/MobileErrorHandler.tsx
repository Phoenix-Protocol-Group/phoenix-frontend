import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  AlertTitle,
  Snackbar,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  ErrorOutline,
  Refresh,
  Close,
  WifiOff,
  Warning,
  Info,
} from "@mui/icons-material";
import { useMobileLayout } from "./useMobileLayout";

interface MobileErrorHandlerProps {
  error?: Error | string | null;
  type?: "network" | "transaction" | "validation" | "generic";
  variant?: "inline" | "toast" | "fullscreen";
  onRetry?: () => void;
  onDismiss?: () => void;
  retryLabel?: string;
  dismissible?: boolean;
  autoHideDuration?: number;
}

export type { MobileErrorHandlerProps };

export const MobileErrorHandler: React.FC<MobileErrorHandlerProps> = ({
  error,
  type = "generic",
  variant = "inline",
  onRetry,
  onDismiss,
  retryLabel = "Try Again",
  dismissible = true,
  autoHideDuration = 6000,
}) => {
  const { isMobile, spacing } = useMobileLayout();
  const [open, setOpen] = React.useState(!!error);

  React.useEffect(() => {
    setOpen(!!error);
  }, [error]);

  const handleClose = () => {
    setOpen(false);
    onDismiss?.();
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    handleClose();
  };

  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return <WifiOff />;
      case "transaction":
        return <Warning />;
      case "validation":
        return <Info />;
      default:
        return <ErrorOutline />;
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case "network":
        return "Connection Error";
      case "transaction":
        return "Transaction Failed";
      case "validation":
        return "Invalid Input";
      default:
        return "Something went wrong";
    }
  };

  const getErrorMessage = () => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;

    switch (type) {
      case "network":
        return "Please check your internet connection and try again.";
      case "transaction":
        return "The transaction could not be completed. Please try again.";
      case "validation":
        return "Please check your input and try again.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const getSeverity = () => {
    switch (type) {
      case "network":
        return "warning";
      case "transaction":
        return "error";
      case "validation":
        return "info";
      default:
        return "error";
    }
  };

  if (!error || !open) return null;

  // Toast variant for mobile
  if (variant === "toast") {
    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          top: { xs: 80, md: 24 }, // Account for mobile AppBar
          left: { xs: spacing.sm, md: 24 },
          right: { xs: spacing.sm, md: 24 },
        }}
      >
        <Alert
          severity={getSeverity() as any}
          variant="filled"
          action={
            <Stack direction="row" spacing={0.5}>
              {onRetry && (
                <IconButton
                  size="small"
                  onClick={handleRetry}
                  sx={{
                    color: "inherit",
                    minHeight: { xs: "44px", sm: "auto" },
                    minWidth: { xs: "44px", sm: "auto" },
                  }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              )}
              {dismissible && (
                <IconButton
                  size="small"
                  onClick={handleClose}
                  sx={{
                    color: "inherit",
                    minHeight: { xs: "44px", sm: "auto" },
                    minWidth: { xs: "44px", sm: "auto" },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Stack>
          }
          sx={{
            width: "100%",
            "& .MuiAlert-message": {
              width: "100%",
            },
          }}
        >
          <AlertTitle>{getErrorTitle()}</AlertTitle>
          <Typography variant="body2">{getErrorMessage()}</Typography>
        </Alert>
      </Snackbar>
    );
  }

  // Fullscreen variant for critical errors
  if (variant === "fullscreen") {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "background.default",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: spacing.lg, md: spacing.xl },
        }}
      >
        <Stack spacing={4} alignItems="center" textAlign="center" maxWidth="sm">
          <Box
            sx={{
              p: 3,
              borderRadius: "50%",
              bgcolor: "error.light",
              color: "error.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {React.cloneElement(getErrorIcon(), {
              sx: { fontSize: { xs: 48, md: 64 } },
            })}
          </Box>

          <Stack spacing={2} textAlign="center">
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
              {getErrorTitle()}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: "400px" }}
            >
              {getErrorMessage()}
            </Typography>
          </Stack>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            width="100%"
          >
            {onRetry && (
              <Button
                variant="contained"
                size="large"
                onClick={handleRetry}
                startIcon={<Refresh />}
                fullWidth={isMobile}
                sx={{
                  minHeight: { xs: "48px", sm: "auto" },
                }}
              >
                {retryLabel}
              </Button>
            )}
            {dismissible && (
              <Button
                variant="outlined"
                size="large"
                onClick={handleClose}
                fullWidth={isMobile}
                sx={{
                  minHeight: { xs: "48px", sm: "auto" },
                }}
              >
                Dismiss
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    );
  }

  // Inline variant (default)
  return (
    <Collapse in={open}>
      <Alert
        severity={getSeverity() as any}
        icon={getErrorIcon()}
        action={
          <Stack direction="row" spacing={0.5}>
            {onRetry && (
              <IconButton
                size="small"
                onClick={handleRetry}
                color="inherit"
                sx={{
                  minHeight: { xs: "44px", sm: "auto" },
                  minWidth: { xs: "44px", sm: "auto" },
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            )}
            {dismissible && (
              <IconButton
                size="small"
                onClick={handleClose}
                color="inherit"
                sx={{
                  minHeight: { xs: "44px", sm: "auto" },
                  minWidth: { xs: "44px", sm: "auto" },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </Stack>
        }
        sx={{
          mb: { xs: spacing.sm, md: spacing.md },
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
      >
        <AlertTitle>{getErrorTitle()}</AlertTitle>
        <Typography variant="body2">{getErrorMessage()}</Typography>
      </Alert>
    </Collapse>
  );
};

// Hook for easier error handling
export const useMobileErrorHandler = () => {
  const [error, setError] = React.useState<Error | string | null>(null);
  const [errorType, setErrorType] = React.useState<
    "network" | "transaction" | "validation" | "generic"
  >("generic");

  const showError = React.useCallback(
    (
      errorMessage: Error | string,
      type: "network" | "transaction" | "validation" | "generic" = "generic"
    ) => {
      setError(errorMessage);
      setErrorType(type);
    },
    []
  );

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const retry = React.useCallback(
    (retryFn: () => void) => {
      clearError();
      retryFn();
    },
    [clearError]
  );

  return {
    error,
    errorType,
    showError,
    clearError,
    retry,
  };
};

export default MobileErrorHandler;
