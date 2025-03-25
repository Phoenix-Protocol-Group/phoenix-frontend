import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Slider,
  Tooltip,
} from "@mui/material";
import { KeyboardArrowLeft, InfoOutlined } from "@mui/icons-material";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";
import { SlippageOptionsProps } from "@phoenix-protocol/types";
import { motion, AnimatePresence } from "framer-motion";

const SlippageSettings = ({
  options,
  selectedOption,
  onClose,
  onChange,
}: SlippageOptionsProps) => {
  const [customInputValue, setCustomInputValue] = useState<number | null>(
    selectedOption
  );
  const [activeOption, setActiveOption] = useState<number | null>(
    options.includes(selectedOption) ? selectedOption : null
  );
  const [customValue, setCustomValue] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Set initial values on component mount or when selectedOption changes
  useEffect(() => {
    setCustomInputValue(selectedOption);
    setActiveOption(options.includes(selectedOption) ? selectedOption : null);
  }, [selectedOption, options]);

  // Check if slippage is high or too low
  const evaluateSlippage = (value: number) => {
    if (value > 5) {
      return "high";
    } else if (value < 0.5) {
      return "low";
    }
    return "normal";
  };

  const slippageStatus = evaluateSlippage(customInputValue);

  const handleOptionClick = (optionValue: number) => {
    setActiveOption(optionValue);
    setCustomInputValue(optionValue);
    onChange(optionValue);
  };

  const handleCustomInputChange = (event) => {
    const value = event.target.value;

    // Validate the input - allow both commas and dots
    if (value === "" || /^\d*[.,]?\d*$/.test(value)) {
      // Convert commas to dots for proper number parsing
      const normalizedValue = value.replace(",", ".");
      const numericValue = Number(normalizedValue);

      // If input matches an option, highlight that option
      const matchedOption = options.includes(numericValue)
        ? numericValue
        : null;
      setActiveOption(matchedOption);

      if (numericValue > 30) {
        setCustomInputValue(30);
        onChange(30);
        setShowWarning(true);
      } else {
        // Set the input field to show the original input (with comma or dot)
        setCustomInputValue(normalizedValue === "" ? null : numericValue);
        onChange(numericValue || 0);
        setShowWarning(numericValue > 5);
      }
    }
  };

  const getSlippageColor = () => {
    switch (slippageStatus) {
      case "high":
        return colors.warning.main;
      case "low":
        return colors.error.main;
      default:
        return colors.success[300];
    }
  };

  const getSlippageMessage = () => {
    switch (slippageStatus) {
      case "high":
        return "High slippage tolerance may lead to unfavorable trades";
      case "low":
        return "Transaction may fail due to price movements";
      default:
        return null;
    }
  };

  const slippageMessage = getSlippageMessage();

  const OptionButton = ({ value, isSelected, onClick }) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Box
        onClick={() => onClick(value)}
        sx={{
          padding: `${spacing.xs} ${spacing.sm}`,
          borderRadius: borderRadius.md,
          background: isSelected
            ? `rgba(${colors.primary.gradient}, 0.1)`
            : colors.neutral[900],
          border: `1px solid ${
            isSelected ? colors.primary.main : colors.neutral[700]
          }`,
          cursor: "pointer",
          textAlign: "center",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: colors.primary.main,
          },
        }}
      >
        <Typography
          sx={{
            color: isSelected ? colors.primary.main : colors.neutral[300],
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeights.medium,
          }}
        >
          {value}
        </Typography>
      </Box>
    </motion.div>
  );

  return (
    <Box
      sx={{
        width: "100%",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: spacing.md,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            maxWidth: "32px",
            maxHeight: "32px",
            mr: spacing.sm,
            borderRadius: borderRadius.sm,
            color: colors.neutral[300],
            background: colors.neutral[900],
            border: `1px solid ${colors.neutral[700]}`,
            "&:hover": {
              background: colors.neutral[800],
            },
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <Typography
          sx={{
            color: colors.neutral[50],
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeights.bold,
          }}
        >
          Slippage Settings
        </Typography>
      </Box>
      <Box
        sx={{
          borderRadius: borderRadius.lg,
          background: colors.neutral[900],
          border: `1px solid ${colors.neutral[700]}`,
          padding: spacing.lg,
          mb: spacing.md,
        }}
      >
        <Typography
          sx={{
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeights.medium,
            color: colors.neutral[50],
            mb: spacing.sm,
            display: "flex",
            alignItems: "center",
            gap: spacing.xs,
          }}
        >
          Slippage Tolerance
          <Tooltip
            title="Slippage tolerance is the maximum price difference you are willing to accept for your trade"
            placement="top"
          >
            <IconButton size="small" sx={{ color: colors.neutral[400] }}>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Typography
          sx={{
            color: colors.neutral[400],
            fontSize: typography.fontSize.sm,
            mb: spacing.md,
          }}
        >
          Set the maximum price slippage you're willing to accept for your
          trades
        </Typography>

        {/* Slippage options */}
        <Grid container spacing={2} sx={{ mb: spacing.md }}>
          {options.map((option) => (
            <Grid item key={option} xs={4}>
              <OptionButton
                value={option}
                isSelected={activeOption === option}
                onClick={handleOptionClick}
              />
            </Grid>
          ))}
        </Grid>

        {/* Custom option */}
        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            value={customInputValue}
            onChange={handleCustomInputChange}
            onClick={() => setCustomValue(true)}
            onFocus={() => setCustomValue(true)}
            placeholder="Custom"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography color={colors.neutral[300]}>%</Typography>
                </InputAdornment>
              ),
              sx: {
                color: colors.neutral[50],
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeights.medium,
                borderRadius: borderRadius.md,
                background: customValue
                  ? `rgba(${colors.primary.gradient}, 0.05)`
                  : "transparent",
                border: `1px solid ${
                  customValue ? colors.primary.main : colors.neutral[700]
                }`,
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover": {
                  borderColor: colors.primary.main,
                },
                transition: "all 0.2s ease",
              },
            }}
          />

          {/* Visual slippage indicator */}
          <Box
            sx={{
              mt: spacing.md,
              height: "4px",
              width: "100%",
              background: colors.neutral[800],
              borderRadius: borderRadius.lg,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                height: "100%",
                width: customValue
                  ? `${Math.min(Number(customInputValue || 0) * 3.33, 100)}%`
                  : `${Math.min(Number(activeOption) * 3.33, 100)}%`,
                background: getSlippageColor(),
                transition: "all 0.3s ease",
              }}
            />
          </Box>
        </Box>

        {/* Warning message */}
        <AnimatePresence>
          {slippageMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                severity={slippageStatus === "high" ? "warning" : "error"}
                sx={{
                  mt: spacing.md,
                  borderRadius: borderRadius.md,
                  "& .MuiAlert-icon": {
                    color:
                      slippageStatus === "high"
                        ? colors.warning.main
                        : colors.error.main,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[50],
                  }}
                >
                  {slippageMessage}
                </Typography>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export { SlippageSettings };
