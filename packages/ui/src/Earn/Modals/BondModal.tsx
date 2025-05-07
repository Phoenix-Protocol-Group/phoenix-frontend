import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Modal, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { Button } from "../../Button/Button";
import { TokenBox } from "../../Swap"; // Import TokenBox from Swap components
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";
import { StrategyMetadata } from "@phoenix-protocol/strategies";
import CloseIcon from "@mui/icons-material/Close";
import { Token } from "@phoenix-protocol/types";

interface BondModalProps {
  open: boolean;
  onClose: () => void;
  strategy: StrategyMetadata | null;
  onConfirm: (amounts: { token: Token; amount: number }[]) => void;
}

export const BondModal = ({
  open,
  onClose,
  strategy,
  onConfirm,
}: BondModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Track amounts for all assets with an object keyed by token index
  const [amounts, setAmounts] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string>("");

  const isPairStrategy =
    strategy?.contractType === "pair" && strategy.assets.length > 1;

  // Reset state when modal opens or strategy changes
  useEffect(() => {
    if (open && strategy) {
      const initialAmounts = {};
      strategy.assets.forEach((_, index) => {
        initialAmounts[index] = "";
      });
      setAmounts(initialAmounts);
      setError("");
    }
  }, [open, strategy]);

  // Calculate token ratios for pair strategies
  const tokenRatios = useMemo(() => {
    if (!isPairStrategy || !strategy?.assets || strategy.assets.length <= 1) {
      return {};
    }

    // Calculate ratios relative to the first token
    const ratios = {};
    const baseValue = strategy.assets[0].usdValue || 1;

    strategy.assets.forEach((asset, index) => {
      if (index === 0) {
        ratios[index] = 1; // Base asset has ratio 1
      } else {
        // Calculate how many of this token equals 1 of the base token
        ratios[index] = baseValue / (asset.usdValue || 1);
      }
    });

    return ratios;
  }, [isPairStrategy, strategy?.assets]);

  // Handle amount changes and maintain ratios for pair strategies
  const handleAmountChange = useCallback(
    (index: number, value: string) => {
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        [index]: value,
      }));

      // If it's a pair strategy and we have valid ratios, maintain them
      if (isPairStrategy && Object.keys(tokenRatios).length > 0) {
        const numValue = parseFloat(value);

        if (!isNaN(numValue)) {
          const newAmounts = { ...amounts };

          // Update all other token amounts based on their ratio to this token
          Object.keys(tokenRatios).forEach((tokenIndexStr) => {
            const tokenIndex = parseInt(tokenIndexStr);
            if (tokenIndex !== index) {
              // Determine the new amount for this token based on the ratio
              // (value * ratio between the changed token and this token)
              const ratio = tokenRatios[index] / tokenRatios[tokenIndex];
              newAmounts[tokenIndex] = (numValue * ratio).toFixed(6);
            }
          });

          setAmounts(newAmounts);
        }
      }

      setError(""); // Clear error when user types
    },
    [isPairStrategy, tokenRatios, amounts]
  );

  const handleConfirm = () => {
    // Validate all required amounts are provided
    const tokenAmounts =
      strategy?.assets.map((token, index) => {
        const amount = amounts[index];
        const numericAmount = parseFloat(amount);
        return {
          token,
          amount: isNaN(numericAmount) ? 0 : numericAmount,
        };
      }) || [];

    // Check if any required amount is missing or invalid
    const invalidAmount = tokenAmounts.some(
      ({ amount }, index) => amount <= 0 && (isPairStrategy || index === 0) // For single asset, only first token required
    );

    if (invalidAmount) {
      setError("Please enter valid positive amounts for all required tokens.");
      return;
    }

    // Call the onConfirm handler with the token amounts
    onConfirm(tokenAmounts);

    // Reset state
    const resetAmounts = {};
    strategy?.assets.forEach((_, index) => {
      resetAmounts[index] = "";
    });
    setAmounts(resetAmounts);
    setError("");

    onClose();
  };

  const handleClose = () => {
    // Reset state
    const resetAmounts = {};
    strategy?.assets.forEach((_, index) => {
      resetAmounts[index] = "";
    });
    setAmounts(resetAmounts);
    setError("");
    onClose();
  };

  // Check if the form is valid for submission
  const isFormValid = useMemo(() => {
    if (!strategy) return false;

    // For pair strategies, all assets must have valid amounts
    if (isPairStrategy) {
      return strategy.assets.every((_, index) => {
        const amount = parseFloat(amounts[index] || "0");
        return !isNaN(amount) && amount > 0;
      });
    }
    // For single asset strategies, only the first asset needs a valid amount
    else {
      const primaryAmount = parseFloat(amounts[0] || "0");
      return !isNaN(primaryAmount) && primaryAmount > 0;
    }
  }, [strategy, amounts, isPairStrategy]);

  if (!strategy) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="bond-modal-title"
      aria-describedby="bond-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "450px" },
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: colors.neutral[900],
          border: `1px solid ${colors.neutral[700]}`,
          borderRadius: borderRadius.lg,
          boxShadow: 24,
          p: spacing.lg,
          outline: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: spacing.md,
            }}
          >
            <Typography
              id="bond-modal-title"
              variant="h6"
              component="h2"
              sx={{
                color: colors.neutral[50],
                fontWeight: typography.fontWeights.bold,
              }}
            >
              {isPairStrategy ? "Provide Liquidity" : "Bond to"} {strategy.name}
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
                onClick={handleClose}
              >
                <CloseIcon />
              </Box>
            </motion.div>
          </Box>

          <Typography
            id="bond-modal-description"
            sx={{ color: colors.neutral[300], mb: spacing.md }}
          >
            {isPairStrategy
              ? `Enter the amount of tokens you want to provide as liquidity.`
              : `Enter the amount of ${
                  strategy.assets[0]?.name || "tokens"
                } you want to bond.`}
          </Typography>

          {/* Token inputs for all assets */}
          {strategy.assets.map((asset, index) => (
            <Box key={asset.name} sx={{ mt: index > 0 ? spacing.md : 0 }}>
              <TokenBox
                value={amounts[index] || ""}
                onChange={(value) => handleAmountChange(index, value)}
                token={asset}
                hideDropdownButton
              />
            </Box>
          ))}

          {isPairStrategy && (
            <Typography
              sx={{
                fontSize: typography.fontSize.xs,
                color: colors.neutral[400],
                textAlign: "center",
                mt: spacing.sm,
                mb: spacing.md,
              }}
            >
              The ratio of tokens will be automatically maintained.
            </Typography>
          )}

          {error && (
            <Typography
              sx={{
                color: colors.error[500],
                fontSize: typography.fontSize.xs,
                mb: spacing.sm,
                mt: 1,
                textAlign: "center",
              }}
            >
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            onClick={handleConfirm}
            disabled={!isFormValid}
            sx={{ mt: spacing.md }}
          >
            {isPairStrategy ? "Provide Liquidity" : "Confirm Bond"}
          </Button>
        </motion.div>
      </Box>
    </Modal>
  );
};
