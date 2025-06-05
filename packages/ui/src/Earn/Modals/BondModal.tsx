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
import { Token, StateToken } from "@phoenix-protocol/types";
import { useAppStore } from "@phoenix-protocol/state";

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
  const appStore = useAppStore();

  // Track amounts for all assets with an object keyed by token index
  const [amounts, setAmounts] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string>("");
  // Track user token balances with actual wallet amounts
  const [userTokenBalances, setUserTokenBalances] = useState<{
    [key: string]: StateToken;
  }>({});

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

  // Fetch user token balances when modal opens
  useEffect(() => {
    const fetchUserBalances = async () => {
      if (open && strategy?.assets) {
        const balances: { [key: string]: StateToken } = {};

        // For each asset in the strategy, fetch the user's actual token balance
        await Promise.all(
          strategy.assets.map(async (asset) => {
            // Use the asset name/symbol to identify the token
            const tokenIdentifier = asset.name;

            try {
              // Fetch the user's actual token balance from their wallet
              const userToken = await appStore.fetchTokenInfo(tokenIdentifier);
              if (userToken) {
                balances[tokenIdentifier] = userToken;
              }
            } catch (error) {
              console.log(asset);
              console.error(
                `Error fetching user balance for ${asset.name}:`,
                error
              );
            }
          })
        );

        setUserTokenBalances(balances);
      }
    };

    fetchUserBalances();
  }, [open, strategy, appStore]);

  // Create tokens with user balances for display
  const tokensWithUserBalances = useMemo(() => {
    if (!strategy?.assets) return [];

    return strategy.assets.map((asset) => {
      const userToken = userTokenBalances[asset.name];

      if (userToken) {
        // Convert StateToken balance to displayable amount
        const userBalance =
          Number(userToken.balance) / 10 ** userToken.decimals;

        // Create a Token object with user's actual balance
        const tokenWithUserBalance: Token = {
          ...asset,
          amount: userBalance, // Use actual user balance instead of pool amount
        };

        return tokenWithUserBalance;
      }

      // Fallback to original asset if user balance not found, but set amount to 0
      return {
        ...asset,
        amount: 0,
      };
    });
  }, [strategy?.assets, userTokenBalances]);

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
    (changedIndex: number, newValue: string) => {
      const updatedAmounts = { ...amounts };
      updatedAmounts[changedIndex] = newValue;

      if (
        isPairStrategy &&
        strategy?.assets &&
        Object.keys(tokenRatios).length > 0
      ) {
        const numValue = parseFloat(newValue);

        if (!isNaN(numValue) && numValue > 0) {
          strategy.assets.forEach((_asset, tokenIdx) => {
            if (tokenIdx !== changedIndex) {
              // Calculate N_j = N_k * (ratios_j / ratios_k)
              // N_k is numValue (amount of asset k, at changedIndex)
              // N_j is amount of asset j (at tokenIdx)
              // ratios_k is tokenRatios[changedIndex]
              // ratios_j is tokenRatios[tokenIdx]
              if (
                tokenRatios[changedIndex] != null &&
                tokenRatios[changedIndex] !== 0 &&
                tokenRatios[tokenIdx] != null
              ) {
                const relativeRatio =
                  tokenRatios[tokenIdx] / tokenRatios[changedIndex];
                updatedAmounts[tokenIdx] = (numValue * relativeRatio).toFixed(
                  6
                );
              } else {
                // Fallback if ratios are not available or division by zero would occur
                updatedAmounts[tokenIdx] = "";
              }
            }
          });
        } else if (newValue === "" || numValue === 0) {
          // If the input is cleared or set to 0, clear other fields in a pair strategy
          strategy.assets.forEach((_asset, tokenIdx) => {
            if (tokenIdx !== changedIndex) {
              updatedAmounts[tokenIdx] = "";
            }
          });
        }
      }

      setAmounts(updatedAmounts);
      setError(""); // Clear error when user types
    },
    [amounts, isPairStrategy, strategy?.assets, tokenRatios]
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

    // Validate that user has sufficient balance for each token
    const insufficientBalance = tokenAmounts.some(({ amount }, index) => {
      const tokenWithBalance = tokensWithUserBalances[index];
      return tokenWithBalance && amount > tokenWithBalance.amount;
    });

    if (insufficientBalance) {
      setError("Insufficient balance for one or more tokens.");
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
          width: { xs: "90%", sm: "500px" },
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
          border: "1px solid rgba(71, 85, 105, 0.3)",
          padding: { xs: spacing.lg, md: "2rem" },
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          outline: "none",
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: spacing.lg,
            }}
          >
            <Typography
              id="bond-modal-title"
              variant="h6"
              component="h2"
              sx={{
                color: colors.neutral[50],
                fontWeight: typography.fontWeights.bold,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                background: "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {isPairStrategy ? "Provide Liquidity" : "Bond to"} {strategy.name}
            </Typography>
            <motion.div
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  opacity: 0.7,
                  color: colors.neutral[300],
                  p: 1,
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    opacity: 1,
                    backgroundColor: "rgba(71, 85, 105, 0.2)",
                    color: colors.neutral[100],
                  },
                }}
                onClick={handleClose}
              >
                <CloseIcon />
              </Box>
            </motion.div>
          </Box>

          <Typography
            id="bond-modal-description"
            sx={{
              color: colors.neutral[300],
              mb: spacing.lg,
              fontSize: typography.fontSize.md,
              lineHeight: 1.5,
            }}
          >
            {isPairStrategy
              ? `Enter the amount of tokens you want to provide as liquidity to earn rewards.`
              : `Enter the amount of ${
                  strategy.assets[0]?.name || "tokens"
                } you want to bond to start earning.`}
          </Typography>

          {/* Token inputs for all assets */}
          {tokensWithUserBalances.map((tokenWithBalance, index) => (
            <Box
              key={tokenWithBalance.name}
              sx={{
                mt: index > 0 ? spacing.md : 0,
                mb: spacing.sm,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TokenBox
                  value={amounts[index] || ""}
                  onChange={(value) => handleAmountChange(index, value)}
                  token={tokenWithBalance}
                  hideDropdownButton
                />
              </motion.div>
            </Box>
          ))}

          {isPairStrategy && (
            <Box
              sx={{
                background: "rgba(71, 85, 105, 0.1)",
                border: "1px solid rgba(71, 85, 105, 0.3)",
                borderRadius: "12px",
                p: spacing.md,
                mt: spacing.md,
                mb: spacing.md,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.5) 50%, transparent 100%)",
                  borderRadius: "12px 12px 0 0",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[300],
                  textAlign: "center",
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                💡 The ratio of tokens will be automatically maintained for
                optimal liquidity provision.
              </Typography>
            </Box>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "12px",
                  p: spacing.md,
                  mb: spacing.md,
                }}
              >
                <Typography
                  sx={{
                    color: "#EF4444",
                    fontSize: typography.fontSize.sm,
                    textAlign: "center",
                    fontWeight: typography.fontWeights.medium,
                  }}
                >
                  {error}
                </Typography>
              </Box>
            </motion.div>
          )}

          <Button
            fullWidth
            onClick={handleConfirm}
            disabled={!isFormValid}
            sx={{
              mt: spacing.lg,
              height: "48px",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              background: isFormValid
                ? "linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                : "rgba(115, 115, 115, 0.3)",
              border: isFormValid
                ? "1px solid rgba(249, 115, 22, 0.3)"
                : "1px solid rgba(115, 115, 115, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: isFormValid ? "translateY(-2px)" : "none",
                boxShadow: isFormValid
                  ? "0 8px 25px rgba(249, 115, 22, 0.3)"
                  : "none",
                background: isFormValid
                  ? "linear-gradient(135deg, #EA580C 0%, #F97316 100%)"
                  : "rgba(115, 115, 115, 0.3)",
              },
            }}
          >
            {isPairStrategy ? "Provide Liquidity" : "Confirm Bond"}
          </Button>
        </motion.div>
      </Box>
    </Modal>
  );
};
