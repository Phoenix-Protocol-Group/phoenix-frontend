import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  IconButton,
  Paper,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  CheckCircleOutline,
  ErrorOutline,
  HourglassEmpty,
  Close as CloseIcon,
  PlayCircleOutline as ClaimIcon,
} from "@mui/icons-material";
import { Strategy, StrategyMetadata } from "@phoenix-protocol/strategies";
import { formatCurrencyStatic } from "@phoenix-protocol/utils";
import { Button } from "../../Button/Button";

type ClaimStatus = "pending" | "claiming" | "success" | "error";

interface ClaimableStrategyItem {
  strategy: Strategy;
  metadata: StrategyMetadata;
  rewards: number;
  status: ClaimStatus;
  error?: string;
}

interface ClaimAllModalProps {
  open: boolean;
  onClose: () => void;
  claimableStrategies: {
    strategy: Strategy;
    metadata: StrategyMetadata;
    rewards: number;
  }[];
  onClaimStrategy: (
    strategy: Strategy,
    metadata: StrategyMetadata
  ) => Promise<void>; // Function to execute the claim transaction
}

export const ClaimAllModal = ({
  open,
  onClose,
  claimableStrategies,
  onClaimStrategy,
}: ClaimAllModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [items, setItems] = useState<ClaimableStrategyItem[]>([]);
  const itemsRef = useRef<ClaimableStrategyItem[]>([]);

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      // Only re-initialize fully if not in an active claim cycle AND not in a "completed" state.
      // A "completed" state should persist until the modal is closed or a new claim cycle is started.
      if (!isClaiming && !isComplete) {
        const initialItems = claimableStrategies.map((s) => ({
          ...s,
          status: "pending" as ClaimStatus,
          error: undefined,
        }));
        setItems(initialItems);
        itemsRef.current = initialItems;
        setCurrentIndex(-1);
        // isClaiming is false, isComplete is false, so no need to set them here.
        // If opening for the first time or after a full close and reopen, isComplete would be false.
      }
    } else {
      // When modal is closed, ensure all states are reset for the next opening.
      // This helps if the modal is closed mid-operation or in a completed state.
      setIsClaiming(false);
      setIsComplete(false);
      setCurrentIndex(-1);
      // setItems([]); // Optionally clear items, or let the open condition repopulate.
      // itemsRef.current = [];
    }
  }, [open, claimableStrategies, isClaiming, isComplete]); // Added isComplete to the dependency array

  const handleCloseModal = () => {
    setIsClaiming(false); // Stop any ongoing claiming process
    onClose();
  };

  useEffect(() => {
    if (!isClaiming || currentIndex < 0) {
      return;
    }

    const currentCycleItems = itemsRef.current; // Use the ref for the logical list

    if (currentIndex >= currentCycleItems.length) {
      if (currentCycleItems.length > 0 || currentIndex > 0) {
        setIsComplete(true);
      }
      setIsClaiming(false); // All items processed or list was empty
      return;
    }

    const itemToProcess = currentCycleItems[currentIndex];
    let mounted = true;

    if (itemToProcess && itemToProcess.status === "pending") {
      const doClaim = async (indexBeingProcessed: number) => {
        // Update UI state to 'claiming' for the item at indexBeingProcessed
        setItems((prevUIItems) =>
          prevUIItems.map((uiItem, idx) => {
            // Ensure we are matching by a stable ID if prevUIItems could be from a different source than itemsRef.current
            // However, with the revised first useEffect, prevUIItems should be consistent with itemsRef for statuses.
            if (uiItem.metadata.id === itemToProcess.metadata.id) {
              // Match by ID
              return { ...uiItem, status: "claiming" };
            }
            return uiItem;
          })
        );
        // Update ref status to 'claiming'
        if (itemsRef.current[indexBeingProcessed]) {
          // Check bounds
          itemsRef.current[indexBeingProcessed].status = "claiming";
        }

        let finalStatus: ClaimStatus;
        let finalError: string | undefined;

        try {
          await onClaimStrategy(itemToProcess.strategy, itemToProcess.metadata);
          finalStatus = "success";
        } catch (error: any) {
          finalStatus = "error";
          finalError = error?.message || "An unknown error occurred";
        }

        if (mounted) {
          // Update UI state with final status for the item at indexBeingProcessed
          setItems((prevUIItems) =>
            prevUIItems.map((uiItem, idx) => {
              if (uiItem.metadata.id === itemToProcess.metadata.id) {
                // Match by ID
                return { ...uiItem, status: finalStatus, error: finalError };
              }
              return uiItem;
            })
          );
          // Update ref with final status
          if (itemsRef.current[indexBeingProcessed]) {
            // Check bounds
            itemsRef.current[indexBeingProcessed].status = finalStatus;
            itemsRef.current[indexBeingProcessed].error = finalError;
          }

          if (isClaiming) {
            setCurrentIndex((prev) => prev + 1);
          }
        }
      };
      doClaim(currentIndex);
    } else if (
      itemToProcess &&
      itemToProcess.status !== "claiming" &&
      isClaiming
    ) {
      // If item is not 'pending' (e.g. already success/error from a previous attempt in this cycle, or bad state)
      // and not currently 'claiming', skip to next.
      if (mounted) {
        setCurrentIndex((prev) => prev + 1);
      }
    }

    return () => {
      mounted = false;
    };
  }, [isClaiming, currentIndex, onClaimStrategy]);

  const startClaiming = useCallback(() => {
    // This re-initializes itemsRef.current and items state for a *new* claiming cycle
    const freshCycleItems = claimableStrategies.map((s) => ({
      ...s,
      status: "pending" as ClaimStatus,
      error: undefined,
    }));
    itemsRef.current = freshCycleItems;
    setItems(freshCycleItems); // Also update UI state to reflect the fresh list

    if (itemsRef.current.length === 0) {
      setIsComplete(true);
      setIsClaiming(false); // Ensure isClaiming is false if nothing to claim
      return;
    }
    // Do not proceed if already claiming from a previous click.
    // This check might be redundant if button is disabled, but good for safety.
    if (isClaiming) return;

    setIsComplete(false);
    setCurrentIndex(0); // Start from the first item
    setIsClaiming(true); // This will trigger the processing useEffect
  }, [claimableStrategies, isClaiming]); // isClaiming is a dependency for the safety check

  const totalRewards = items.reduce((sum, item) => sum + item.rewards, 0);
  const claimedCount = items.filter((item) => item.status === "success").length;
  const errorCount = items.filter((item) => item.status === "error").length;
  const progress =
    items.length > 0 ? ((claimedCount + errorCount) / items.length) * 100 : 0;

  const renderStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case "pending":
        return <HourglassEmpty sx={{ color: theme.palette.text.secondary }} />;
      case "claiming":
        return (
          <CircularProgress size={20} sx={{ color: theme.palette.info.main }} />
        );
      case "success":
        return (
          <CheckCircleOutline sx={{ color: theme.palette.success.main }} />
        );
      case "error":
        return <ErrorOutline sx={{ color: theme.palette.error.main }} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="claim-all-modal-title"
      aria-describedby="claim-all-modal-description"
    >
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "90%" : 500,
          bgcolor: "var(--background-paper, #1E1E1E)",
          color: "var(--text-primary, #FFFFFF)",
          border: "1px solid var(--divider, rgba(255, 255, 255, 0.12))",
          boxShadow: 24,
          p: isMobile ? 2 : 3,
          borderRadius: "8px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            id="claim-all-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontFamily: "Ubuntu", fontWeight: 700 }}
          >
            {isComplete
              ? "Claiming Complete"
              : isClaiming
              ? currentIndex >= 0 && currentIndex < itemsRef.current.length // Use itemsRef for name consistency during cycle
                ? `Claiming: ${
                    itemsRef.current[currentIndex]?.metadata.name || // Get name from ref
                    `Item ${currentIndex + 1}`
                  }`
                : "Claiming Rewards..."
              : "Claim All Rewards"}
          </Typography>
          <IconButton onClick={handleCloseModal} size="small">
            <CloseIcon sx={{ color: "var(--text-secondary)" }} />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{  mb: 0.5, fontFamily: "Ubuntu", fontSize: 12, fontWeight: 500, color: "#D4D4D4" }}>
            Total Rewards to Claim:{" "}
            <Typography component="span" sx={{ color: "#F97316", fontSize: 18, fontWeight: 800, ml: 3}}>
              {formatCurrencyStatic.format(totalRewards)}
            </Typography>
          </Typography>
          {(isClaiming || isComplete) && (
            <Box sx={{ width: "100%", mt: 1 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography
                variant="body2"
                sx={{
                  textAlign: "right",
                  mt: 0.5,
                  fontFamily: "Ubuntu, sans-serif",
                }}
              >
                {claimedCount + errorCount} / {items.length} processed
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ overflowY: "auto", flexGrow: 1, mb: 2 }}>
          <List dense>
            {items.map((item, index) => (
              <ListItem
                key={item.metadata.id}
                divider
                sx={{
                  bgcolor:
                    currentIndex === index && isClaiming
                      ? "rgba(255,255,255,0.05)"
                      : "transparent",
                  borderRadius: "4px",
                  mb: 0.5,
                  p: 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {renderStatusIcon(item.status)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                      {item.metadata.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "Inter, sans-serif",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Rewards: {formatCurrencyStatic.format(item.rewards)}
                      {item.status === "error" &&
                        item.error &&
                        ` - Error: ${item.error}`}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {!isClaiming && !isComplete && items.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={startClaiming}
            disabled={isClaiming || items.length === 0} // items.length for button disable is fine
            startIcon={<ClaimIcon />}
            sx={{
              fontFamily: "Ubuntu",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Start Claiming All ({items.length})
          </Button>
        )}
        {isClaiming && !isComplete && (
          <Alert severity="info" sx={{ fontFamily: "Inter, sans-serif" }}>
            Please confirm each transaction in your wallet.
          </Alert>
        )}
        {isComplete && (
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontFamily: "Inter, sans-serif" }}>
              Successfully claimed: {claimedCount} strategy(s).
            </Typography>
            {errorCount > 0 && (
              <Typography
                color="error"
                sx={{ fontFamily: "Inter, sans-serif" }}
              >
                Failed to claim: {errorCount} strategy(s).
              </Typography>
            )}
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              sx={{ mt: 2, fontFamily: "Ubuntu", textTransform: "none" }}
            >
              Close
            </Button>
          </Box>
        )}
        {items.length === 0 && !isClaiming && !isComplete && (
          <Typography
            sx={{
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              color: theme.palette.text.secondary,
            }}
          >
            No claimable rewards available.
          </Typography>
        )}
      </Paper>
    </Modal>
  );
};
