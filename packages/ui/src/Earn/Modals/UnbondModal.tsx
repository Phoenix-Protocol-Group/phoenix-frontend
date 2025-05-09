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
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "450px" },
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
              id="unbond-modal-title"
              variant="h6"
              component="h2"
              sx={{
                color: colors.neutral[50],
                fontWeight: typography.fontWeights.bold,
              }}
            >
              Unbond from {strategy.name}
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

          {showIndividualStakes ? (
            <>
              <Typography
                id="unbond-modal-description"
                sx={{ color: colors.neutral[300], mb: spacing.md }}
              >
                Select a stake to unbond its full amount.
              </Typography>
              {strategy.unbondTime > 0 && (
                <Typography
                  sx={{
                    color: colors.warning[300],
                    fontSize: "0.875rem",
                    mb: spacing.md,
                    background: "rgba(251, 191, 36, 0.1)",
                    padding: "8px 12px",
                    borderRadius: borderRadius.sm,
                  }}
                >
                  Note: Unbonding period is approximately{" "}
                  {Math.ceil(strategy.unbondTime / 86400)} days.
                </Typography>
              )}
              <List
                sx={{
                  maxHeight: 300,
                  overflow: "auto",
                  mb: spacing.md,
                  background: colors.neutral[800],
                  borderRadius: borderRadius.sm,
                }}
              >
                {strategy.userIndividualStakes!.map((stake, index) => (
                  <React.Fragment
                    key={`${stake.timestamp.toString()}-${index}`}
                  >
                    <ListItem
                      secondaryAction={
                        <Button
                          size="small"
                          onClick={() => handleConfirmSpecificStake(stake)}
                        >
                          Unbond
                        </Button>
                      }
                      sx={{ paddingRight: "100px" }} // Ensure space for button
                    >
                      <ListItemText
                        primaryTypographyProps={{
                          sx: {
                            color: colors.neutral[100],
                            fontWeight: typography.fontWeights.medium,
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: { color: colors.neutral[400] },
                        }}
                        primary={`${stake.displayAmount}`}
                        secondary={`Staked on: ${stake.displayDate}`}
                      />
                    </ListItem>
                    {index < strategy.userIndividualStakes!.length - 1 && (
                      <Divider sx={{ borderColor: colors.neutral[700] }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </>
          ) : (
            <>
              <Typography
                id="unbond-modal-description"
                sx={{ color: colors.neutral[300], mb: spacing.xs }}
              >
                Enter the amount you want to unbond.
              </Typography>
              <Typography
                sx={{ color: colors.neutral[400], fontSize: "0.875rem", mb: 1 }}
              >
                Available to unbond:{" "}
                <Link
                  component="button"
                  onClick={handleSetMax}
                  sx={{
                    color: colors.primary.main,
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "inherit",
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontFamily: "inherit",
                    "&:hover": { color: colors.primary.light },
                  }}
                >
                  {formatCurrencyStatic.format(maxAmount)}{" "}
                  {strategy.assets.map((a) => a.name).join(" / ")}
                </Link>
              </Typography>

              {strategy.unbondTime > 0 && (
                <Typography
                  sx={{
                    color: colors.warning[300],
                    fontSize: "0.875rem",
                    mb: spacing.md,
                    background: "rgba(251, 191, 36, 0.1)",
                    padding: "8px 12px",
                    borderRadius: borderRadius.sm,
                  }}
                >
                  Note: Unbonding period is approximately{" "}
                  {Math.ceil(strategy.unbondTime / 86400)} days.
                </Typography>
              )}

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
                    "& fieldset": {
                      borderColor: colors.neutral[600],
                    },
                    "&:hover fieldset": {
                      borderColor: colors.neutral[400],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                    input: { color: colors.neutral[100] },
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.neutral[400],
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary.main,
                  },
                  "& .MuiFormHelperText-root": {
                    color: colors.error[500],
                  },
                }}
              />

              <Button
                fullWidth
                onClick={handleConfirmAmount}
                disabled={
                  !amount ||
                  !!error ||
                  parseFloat(amount) <= 0 ||
                  parseFloat(amount) > maxAmount
                }
              >
                Confirm Unbond
              </Button>
            </>
          )}
        </motion.div>
      </Box>
    </Modal>
  );
};
