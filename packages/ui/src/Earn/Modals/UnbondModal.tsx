import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  useMediaQuery,
  useTheme,
  Link,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Button } from "../../Button/Button";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";
import {
  StrategyMetadata,
  IndividualStake,
} from "@phoenix-protocol/strategies";
import CloseIcon from "@mui/icons-material/Close";
import { formatCurrencyStatic } from "@phoenix-protocol/utils"; // Assuming you have this utility

interface UnbondModalProps {
  open: boolean;
  onClose: () => void;
  strategy: StrategyMetadata | null;
  maxAmount: number; // User's current total stake in this strategy (USD value)
  onConfirm: (params: number | { lpAmount: bigint; timestamp: bigint }) => void;
}

export const UnbondModal = ({
  open,
  onClose,
  strategy,
  maxAmount,
  onConfirm,
}: UnbondModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Reset state when modal opens or strategy changes
    if (open) {
      setAmount("");
      setError("");
    }
  }, [open, strategy]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      const numericValue = parseFloat(value);
      if (numericValue > maxAmount) {
        setError(`Maximum unbond amount is ${maxAmount}`);
      } else {
        setError("");
      }
    }
  };

  const handleSetMax = () => {
    setAmount(maxAmount.toString());
    setError(""); // Clear error when setting max
  };

  const handleConfirmAmount = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    if (numericAmount > maxAmount) {
      setError(`Maximum unbond amount is ${maxAmount}`);
      return;
    }
    onConfirm(numericAmount);
    onClose(); // Close after confirmation
  };

  const handleConfirmSpecificStake = (stake: IndividualStake) => {
    onConfirm({ lpAmount: stake.lpAmount, timestamp: stake.timestamp });

    // Reload page
    window.location.reload();
    // Optionally close modal immediately or wait for parent component to do so after transaction
    // onClose();
  };

  const handleClose = () => {
    setAmount("");
    setError("");
    onClose();
  };

  if (!strategy) return null;

  const showIndividualStakes =
    strategy.contractType === "pair" &&
    strategy.userIndividualStakes &&
    strategy.userIndividualStakes.length > 0;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="unbond-modal-title"
      aria-describedby="unbond-modal-description"
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
          width: { xs: "90%", sm: "450px" },
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
              src={strategy?.assets[0]?.icon || "/cryptoIcons/default.svg"}
              alt={`${strategy?.name || "Strategy"} icon`}
              sx={{
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                borderRadius: "50%",
                border: `2px solid ${colors.neutral[600]}`,
              }}
            />
            <Box>
              <Typography
                id="unbond-modal-title"
                sx={{
                  color: colors.neutral[50],
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeights.bold,
                  fontFamily: typography.fontFamily,
                }}
              >
                {strategy?.name || "Strategy"}
              </Typography>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                Withdraw Stake • {strategy?.category || "Yield Farming"}
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
              aria-label="Close unbond modal"
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
          {showIndividualStakes ? (
            <>
              <Typography
                id="unbond-modal-description"
                sx={{
                  color: colors.neutral[300],
                  mb: spacing.md,
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                Select a stake to unbond its full amount.
              </Typography>
              {strategy.unbondTime > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Typography
                    sx={{
                      color: "#FB923C",
                      fontSize: "0.875rem",
                      mb: spacing.md,
                      background:
                        "linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(254, 215, 170, 0.1) 100%)",
                      backdropFilter: "blur(10px)",
                      padding: "12px 16px",
                      borderRadius: borderRadius.md,
                      border: "1px solid rgba(251, 146, 60, 0.3)",
                      fontWeight: typography.fontWeights.medium,
                    }}
                  >
                    ⏱️ Unbonding period: approximately{" "}
                    {Math.ceil(strategy.unbondTime / 86400)} days
                  </Typography>
                </motion.div>
              )}
              <List
                sx={{
                  maxHeight: 300,
                  overflow: "auto",
                  mb: spacing.md,
                  background:
                    "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%)",
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
                {strategy.userIndividualStakes!.map((stake, index) => (
                  <React.Fragment
                    key={`${stake.timestamp.toString()}-${index}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem
                        secondaryAction={
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="small"
                              onClick={() => handleConfirmSpecificStake(stake)}
                              sx={{
                                background:
                                  "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                                color: "white",
                                fontWeight: typography.fontWeights.semiBold,
                                "&:hover": {
                                  background:
                                    "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
                                  transform: "translateY(-1px)",
                                  boxShadow:
                                    "0 4px 12px rgba(249, 115, 22, 0.4)",
                                },
                              }}
                            >
                              Unbond
                            </Button>
                          </motion.div>
                        }
                        sx={{
                          paddingRight: "100px",
                          borderRadius: borderRadius.sm,
                          mb: 1,
                          "&:hover": {
                            background: "rgba(249, 115, 22, 0.1)",
                          },
                        }}
                      >
                        <ListItemText
                          primaryTypographyProps={{
                            sx: {
                              color: colors.neutral[100],
                              fontWeight: typography.fontWeights.medium,
                              fontSize: "0.95rem",
                            },
                          }}
                          secondaryTypographyProps={{
                            sx: {
                              color: colors.neutral[400],
                              fontSize: "0.85rem",
                            },
                          }}
                          primary={`${stake.displayAmount}`}
                          secondary={`Staked on: ${stake.displayDate}`}
                        />
                      </ListItem>
                    </motion.div>
                    {index < strategy.userIndividualStakes!.length - 1 && (
                      <Divider
                        sx={{ borderColor: "rgba(249, 115, 22, 0.2)", mx: 2 }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </>
          ) : (
            <>
              <Typography
                id="unbond-modal-description"
                sx={{
                  color: colors.neutral[300],
                  mb: spacing.xs,
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                Enter the amount you want to unbond.
              </Typography>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontSize: "0.875rem",
                  mb: 1,
                  "& .max-link": {
                    color: "#F97316",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "inherit",
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontFamily: "inherit",
                    fontWeight: typography.fontWeights.medium,
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "#FB923C",
                    },
                  },
                }}
              >
                Available to unbond:{" "}
                <Link
                  component="button"
                  onClick={handleSetMax}
                  className="max-link"
                >
                  {formatCurrencyStatic.format(maxAmount)}{" "}
                  {strategy.assets.map((a) => a.name).join(" / ")}
                </Link>
              </Typography>

              {strategy.unbondTime > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Typography
                    sx={{
                      color: "#FB923C",
                      fontSize: "0.875rem",
                      mb: spacing.md,
                      background:
                        "linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(254, 215, 170, 0.1) 100%)",
                      backdropFilter: "blur(10px)",
                      padding: "12px 16px",
                      borderRadius: borderRadius.md,
                      border: "1px solid rgba(251, 146, 60, 0.3)",
                      fontWeight: typography.fontWeights.medium,
                    }}
                  >
                    ⏱️ Unbonding period: approximately{" "}
                    {Math.ceil(strategy.unbondTime / 86400)} days
                  </Typography>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label={`Amount to Unbond`}
                  value={amount}
                  onChange={handleAmountChange}
                  type="text"
                  inputMode="decimal"
                  error={!!error}
                  helperText={error}
                  sx={{
                    mb: spacing.md,
                    "& .MuiOutlinedInput-root": {
                      background:
                        "linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(251, 146, 60, 0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      "& fieldset": {
                        borderColor: "rgba(249, 115, 22, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(249, 115, 22, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#F97316",
                        borderWidth: "2px",
                      },
                      input: {
                        color: colors.neutral[100],
                        fontSize: "1rem",
                        fontWeight: typography.fontWeights.medium,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: colors.neutral[400],
                      fontWeight: typography.fontWeights.medium,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#F97316",
                    },
                    "& .MuiFormHelperText-root": {
                      color: colors.error[500],
                      fontWeight: typography.fontWeights.medium,
                    },
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  fullWidth
                  onClick={handleConfirmAmount}
                  disabled={
                    !amount ||
                    !!error ||
                    parseFloat(amount) <= 0 ||
                    parseFloat(amount) > maxAmount
                  }
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
                    "&:disabled": {
                      background: "rgba(249, 115, 22, 0.3)",
                      color: "rgba(255, 255, 255, 0.5)",
                    },
                  }}
                >
                  Confirm Unbond
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>
      </Box>
    </Modal>
  );
};
