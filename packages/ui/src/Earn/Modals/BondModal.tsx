import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
    [key: string]: Token;
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
        const balances: { [key: string]: Token } = {};

        // Use unified token storage from appStore.tokens
        const allAssets = appStore.tokens;
        // For each asset in the strategy, fetch the user's actual token balance

        strategy.assets.forEach((asset) => {
          const userToken = allAssets.find(
            (token) => token.name === asset.name
          );
          if (userToken) {
            balances[asset.name] = userToken;
          }
        });

        setUserTokenBalances(balances);
        console.log(balances);
      }
    };

    fetchUserBalances();
  }, [open, strategy, appStore.tokens]);

  // Create tokens with user balances for display
  const tokensWithUserBalances = useMemo(() => {
    if (!strategy?.assets) return [];

    return strategy.assets.map((asset) => {
      const userToken = userTokenBalances[asset.name];

      if (userToken) {
        // Convert StateToken balance to displayable amount
        const userBalance = Number(userToken.amount);

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
        ratios[index] = strategy.assets[1].amount / strategy.assets[0].amount;
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
          border: "1px solid rgba(71, 85, 105, 0.3)",
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
            <Box
              component="img"
              src={strategy.assets[0]?.icon || "/cryptoIcons/default.svg"}
              alt={`${strategy.name || "Strategy"} icon`}
              sx={{
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                borderRadius: "50%",
                border: `2px solid ${colors.neutral[600]}`,
              }}
            />
            <Box>
              <Typography
                id="bond-modal-title"
                sx={{
                  color: colors.neutral[50],
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeights.bold,
                  fontFamily: typography.fontFamily,
                }}
              >
                {strategy.name || "Strategy"}
              </Typography>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                {isPairStrategy ? "Provide Liquidity" : "Bond Strategy"} •{" "}
                {strategy.category || "Yield Farming"}
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
              onClick={handleClose}
              aria-label="Close bond modal"
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "relative",
            zIndex: 1,
            padding: isMobile ? spacing.lg : "2rem",
          }}
        >
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
