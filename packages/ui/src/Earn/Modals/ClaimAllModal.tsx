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
import { motion } from "framer-motion";
import { Strategy, StrategyMetadata } from "@phoenix-protocol/strategies";
import { formatCurrencyStatic } from "@phoenix-protocol/utils";
import { Button } from "../../Button/Button";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

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
  }, [open, claimableStrategies]); // Removed isClaiming and isComplete from dependencies

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

          // Always move to next item after processing current one
          // The useEffect dependency on isClaiming will handle stopping if needed
          setCurrentIndex((prev) => prev + 1);
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
      setCurrentIndex((prev) => prev + 1);
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
        return <HourglassEmpty sx={{ color: colors.neutral[400] }} />;
      case "claiming":
        return (
          <CircularProgress
            size={20}
            sx={{
              color: "#F97316",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        );
      case "success":
        return <CheckCircleOutline sx={{ color: "#10B981" }} />;
      case "error":
        return <ErrorOutline sx={{ color: colors.error[400] }} />;
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
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: isMobile ? "90%" : 500,
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: "20px",
          border: "1px solid rgba(71, 85, 105, 0.3)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          outline: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Subtle gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(71, 85, 105, 0.02) 0%, rgba(148, 163, 184, 0.01) 50%, rgba(71, 85, 105, 0.02) 100%)",
            borderRadius: "20px",
            zIndex: 0,
          }}
        />

        {/* Enhanced Header with premium styling */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, rgba(115, 115, 115, 0.08) 0%, rgba(148, 163, 184, 0.04) 50%, rgba(249, 115, 22, 0.02) 100%)",
            borderBottom: `1px solid ${colors.neutral[700]}`,
            borderRadius: "20px 20px 0 0",
            p: spacing.lg,
            mx: 0,
            mt: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.3) 50%, transparent 100%)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <ClaimIcon
              sx={{
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                color: colors.primary.main,
                background: "rgba(249, 115, 22, 0.1)",
                borderRadius: "50%",
                border: `2px solid ${colors.neutral[600]}`,
                p: 1,
              }}
            />
            <Box>
              <Typography
                id="claim-all-modal-title"
                sx={{
                  color: colors.neutral[50],
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeights.bold,
                  fontFamily: typography.fontFamily,
                }}
              >
                Claim All Rewards
              </Typography>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                Batch Claim • {claimableStrategies.length} Strategies
              </Typography>
            </Box>
          </Box>

          <motion.div
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              aria-label="Close claim all modal"
              sx={{
                background: "rgba(239, 68, 68, 0.1)",
                color: colors.neutral[300],
                width: 40,
                height: 40,
                border: `1px solid rgba(239, 68, 68, 0.2)`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "rgba(239, 68, 68, 0.2)",
                  color: colors.error.main,
                  borderColor: "rgba(239, 68, 68, 0.4)",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
                },
                "&:focus": {
                  outline: `2px solid ${colors.primary.main}`,
                  outlineOffset: 2,
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </motion.div>
        </Box>

        {/* Content area with padding */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "relative",
            zIndex: 1,
            padding: isMobile ? spacing.md : spacing.lg,
            flex: 1,
          }}
        >
          <Box sx={{ mb: spacing.md }}>
            <Typography
              sx={{
                mb: 0.5,
                fontSize: "0.875rem",
                fontWeight: typography.fontWeights.medium,
                color: colors.neutral[300],
              }}
            >
              Total Rewards to Claim:{" "}
              <Typography
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: "1.25rem",
                  fontWeight: typography.fontWeights.bold,
                  ml: 1,
                }}
              >
                {totalRewards} PHO
              </Typography>
            </Typography>
            {(isClaiming || isComplete) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Box sx={{ width: "100%", mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(249, 115, 22, 0.2)",
                      "& .MuiLinearProgress-bar": {
                        background:
                          "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "right",
                      mt: 0.5,
                      fontSize: "0.75rem",
                      color: colors.neutral[400],
                      fontWeight: typography.fontWeights.medium,
                    }}
                  >
                    {claimedCount + errorCount} / {items.length} processed
                  </Typography>
                </Box>
              </motion.div>
            )}
          </Box>

          <Box
            sx={{
              overflowY: "auto",
              flexGrow: 1,
              mb: spacing.md,
              background:
                "linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(251, 146, 60, 0.05) 100%)",
              backdropFilter: "blur(10px)",
              borderRadius: borderRadius.md,
              border: "1px solid rgba(249, 115, 22, 0.2)",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(249, 115, 22, 0.3)",
                borderRadius: "3px",
              },
            }}
          >
            <List dense>
              {items.map((item, index) => (
                <motion.div
                  key={item.metadata.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListItem
                    divider={index < items.length - 1}
                    sx={{
                      bgcolor:
                        currentIndex === index && isClaiming
                          ? "rgba(249, 115, 22, 0.15)"
                          : "transparent",
                      borderRadius: borderRadius.sm,
                      mb: 0.5,
                      p: spacing.sm,
                      "&:hover": {
                        bgcolor: "rgba(249, 115, 22, 0.1)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {renderStatusIcon(item.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.neutral[100],
                            fontWeight: typography.fontWeights.medium,
                            fontSize: "0.95rem",
                          }}
                        >
                          {item.metadata.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.neutral[400],
                            fontSize: "0.85rem",
                          }}
                        >
                          Rewards: {item.rewards} PHO{" "}
                          {item.status === "error" &&
                            item.error &&
                            ` - Error: ${item.error}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Box>

          {!isClaiming && !isComplete && items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={startClaiming}
                disabled={isClaiming || items.length === 0}
                startIcon={<ClaimIcon />}
                sx={{
                  background:
                    "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                  color: "white",
                  fontWeight: typography.fontWeights.semiBold,
                  fontSize: "1rem",
                  padding: "12px 24px",
                  borderRadius: borderRadius.md,
                  textTransform: "none",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(249, 115, 22, 0.4)",
                  },
                }}
              >
                Start Claiming All ({items.length})
              </Button>
            </motion.div>
          )}
          {isClaiming && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Alert
                severity="info"
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.1) 100%)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: borderRadius.md,
                  color: colors.neutral[100],
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                Please confirm each transaction in your wallet.
              </Alert>
            </motion.div>
          )}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: borderRadius.md,
                  border: "1px solid rgba(249, 115, 22, 0.2)",
                  p: spacing.md,
                }}
              >
                <Typography
                  sx={{
                    color: colors.neutral[100],
                    fontWeight: typography.fontWeights.medium,
                    mb: 1,
                  }}
                >
                  Successfully claimed: {claimedCount} strategy(s).
                </Typography>
                {errorCount > 0 && (
                  <Typography
                    sx={{
                      color: colors.error[400],
                      fontWeight: typography.fontWeights.medium,
                      mb: 2,
                    }}
                  >
                    Failed to claim: {errorCount} strategy(s).
                  </Typography>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCloseModal}
                    sx={{
                      mt: 2,
                      borderColor: "#F97316",
                      color: "#F97316",
                      fontWeight: typography.fontWeights.semiBold,
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#FB923C",
                        color: "#FB923C",
                        background: "rgba(249, 115, 22, 0.1)",
                      },
                    }}
                  >
                    Close
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          )}
          {items.length === 0 && !isClaiming && !isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  color: colors.neutral[400],
                  fontWeight: typography.fontWeights.medium,
                  py: spacing.lg,
                }}
              >
                💰 No claimable rewards available.
              </Typography>
            </motion.div>
          )}
        </motion.div>
      </Box>
    </Modal>
  );
};
