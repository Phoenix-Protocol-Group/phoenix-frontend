import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Modal,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../Button/Button";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";
import { Strategy, StrategyMetadata } from "@phoenix-protocol/strategies";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { formatCurrencyStatic } from "@phoenix-protocol/utils";

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
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      // Initialize items with pending status when modal opens
      setItems(
        claimableStrategies.map((s) => ({
          ...s,
          status: "pending",
        }))
      );
      setCurrentIndex(-1);
      setIsClaiming(false);
      setIsComplete(false);
    }
  }, [open, claimableStrategies]);

  const startClaiming = useCallback(async () => {
    if (isClaiming || items.length === 0) return;
    setIsClaiming(true);
    setIsComplete(false);
    setCurrentIndex(0); // Start with the first item
  }, [isClaiming, items.length]);

  useEffect(() => {
    // Process the current strategy when currentIndex changes and claiming is active
    const processClaim = async () => {
      if (!isClaiming || currentIndex < 0 || currentIndex >= items.length) {
        if (isClaiming && currentIndex >= items.length) {
          setIsComplete(true); // All items processed
          setIsClaiming(false);
        }
        return;
      }

      const currentItem = items[currentIndex];

      // Update status to 'claiming'
      setItems((prev) =>
        prev.map((item, index) =>
          index === currentIndex ? { ...item, status: "claiming" } : item
        )
      );

      try {
        // Call the provided claim function (which uses useContractTransaction)
        await onClaimStrategy(currentItem.strategy, currentItem.metadata);

        // Update status to 'success'
        setItems((prev) =>
          prev.map((item, index) =>
            index === currentIndex ? { ...item, status: "success" } : item
          )
        );
      } catch (error: any) {
        console.error("Claiming error:", error);
        // Update status to 'error'
        setItems((prev) =>
          prev.map((item, index) =>
            index === currentIndex
              ? {
                  ...item,
                  status: "error",
                  error: error.message || "An unknown error occurred",
                }
              : item
          )
        );
      } finally {
        // Move to the next item after a short delay for visual feedback
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
        }, 500); // Adjust delay as needed
      }
    };

    processClaim();
  }, [currentIndex, isClaiming, items, onClaimStrategy]);

  const totalRewards = items.reduce((sum, item) => sum + item.rewards, 0);
  const claimedCount = items.filter((item) => item.status === "success").length;
  const errorCount = items.filter((item) => item.status === "error").length;

  const renderStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case "pending":
        return <HourglassTopIcon sx={{ color: colors.neutral[500] }} />;
      case "claiming":
        return (
          <CircularProgress size={20} sx={{ color: colors.primary.main }} />
        );
      case "success":
        return <CheckCircleIcon sx={{ color: colors.success[500] }} />;
      case "error":
        return <ErrorIcon sx={{ color: colors.error[500] }} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="claim-all-modal-title"
      aria-describedby="claim-all-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "500px" },
          maxHeight: "90vh",
          bgcolor: colors.neutral[900],
          border: `1px solid ${colors.neutral[700]}`,
          borderRadius: borderRadius.lg,
          boxShadow: 24,
          p: spacing.lg,
          outline: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: spacing.md,
              flexShrink: 0,
            }}
          >
            <Typography
              id="claim-all-modal-title"
              variant="h6"
              component="h2"
              sx={{
                color: colors.neutral[50],
                fontWeight: typography.fontWeights.bold,
              }}
            >
              Claim All Rewards
            </Typography>
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  opacity: 0.7,
                  color: colors.neutral[300],
                  "&:hover": { opacity: 1 },
                }}
                onClick={onClose}
              >
                <CloseIcon />
              </Box>
            </motion.div>
          </Box>

          <Typography
            id="claim-all-modal-description"
            sx={{ color: colors.neutral[300], mb: spacing.md, flexShrink: 0 }}
          >
            {isComplete
              ? `Claiming process complete. ${claimedCount} succeeded, ${errorCount} failed.`
              : isClaiming
              ? `Claiming rewards sequentially... (${currentIndex + 1} / ${
                  items.length
                })`
              : `You have rewards available from ${items.length} strategies. Claim them one by one.`}
          </Typography>

          <Box sx={{ overflowY: "auto", flexGrow: 1, mb: spacing.md }}>
            <List disablePadding>
              {items.map((item, index) => (
                <React.Fragment key={item.metadata.id}>
                  <ListItem
                    sx={{
                      opacity: isClaiming && index !== currentIndex ? 0.6 : 1,
                      transition: "opacity 0.3s ease",
                      borderLeft:
                        isClaiming && index === currentIndex
                          ? `3px solid ${colors.primary.main}`
                          : "none",
                      pl: isClaiming && index === currentIndex ? 1.5 : 2,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "40px" }}>
                      {renderStatusIcon(item.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            color: colors.neutral[100],
                            fontWeight: typography.fontWeights.medium,
                          }}
                        >
                          {item.metadata.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            color:
                              item.status === "error"
                                ? colors.error[300]
                                : colors.neutral[400],
                            fontSize: "0.8rem",
                          }}
                        >
                          {item.status === "error"
                            ? item.error
                            : `${formatCurrencyStatic.format(item.rewards)} ${
                                item.metadata.rewardToken.name
                              }`}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < items.length - 1 && (
                    <Divider
                      component="li"
                      sx={{ borderColor: colors.neutral[800], ml: 2, mr: 2 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>

          <Box sx={{ mt: "auto", flexShrink: 0 }}>
            {isComplete ? (
              <Button fullWidth onClick={onClose} type="secondary">
                Close
              </Button>
            ) : (
              <Button
                fullWidth
                onClick={startClaiming}
                disabled={isClaiming || items.length === 0}
              >
                {isClaiming ? "Claiming..." : `Claim All (${items.length})`}
              </Button>
            )}
          </Box>
        </motion.div>
      </Box>
    </Modal>
  );
};
