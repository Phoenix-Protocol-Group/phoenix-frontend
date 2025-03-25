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
import { colors, typography, spacing, borderRadius } from "../../Theme/styleConstants";
import { SlippageOptionsProps } from "@phoenix-protocol/types";
import { motion, AnimatePresence } from "framer-motion";


const SlippageSettings = ({
  options,
  selectedOption,
  onClose,
  onChange,
}: SlippageOptionsProps) => {
  const [customInputValue, setCustomInputValue] = useState<number>(1);
  const [activeOption, setActiveOption] = useState<string>(selectedOption.toString());
  const [showWarning, setShowWarning] = useState(false);
  
  // Set initial custom value if the selected option is custom
  useEffect(() => {
    if (!options.includes(selectedOption.toString())) {
      setCustomInputValue(selectedOption);
      setActiveOption("custom");
    } else {
      setActiveOption(selectedOption.toString());
    }
  }, [selectedOption, options]);

  // Check if slippage is high or too high
  const evaluateSlippage = (value: string) => {
    const numValue = Number(value);
    if (numValue > 5) {
      return "high";
    } else if (numValue < 0.1) {
      return "low";
    }
    return "normal";
  };

  const slippageStatus = evaluateSlippage(
    activeOption === "custom" ? customInputValue.toString() : activeOption
  );

  const handleOptionClick = (optionValue: string) => {
    if (optionValue === "custom") {
      setActiveOption("custom");
      onChange(customInputValue.toString());
    } else {
      setActiveOption(optionValue);
      onChange(optionValue);
    }
  };

  const handleCustomInputChange = (event) => {
    const value = event.target.value;
    
    // Validate the input
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      if (Number(value) > 30) {
        setCustomInputValue(30);
        onChange("30");
        setShowWarning(true);
      } else {
        setCustomInputValue(Number(value));
        if (activeOption === "custom") {
          onChange(value.toString());
        }
        setShowWarning(Number(value) > 5);
      }
    }
  };

  const getSlippageColor = () => {
    switch(slippageStatus) {
      case "high":
        return colors.warning.main;
      case "low":
        return colors.error.main;
      default:
        return colors.success[300];
    }
  };

  const getSlippageMessage = () => {
    switch(slippageStatus) {
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
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Box
        onClick={() => onClick(value)}
        sx={{
          padding: `${spacing.xs} ${spacing.sm}`,
          borderRadius: borderRadius.md,
          background: isSelected ? `rgba(${colors.primary.gradient}, 0.1)` : colors.neutral[900],
          border: `1px solid ${isSelected ? colors.primary.main : colors.neutral[700]}`,
          cursor: "pointer",
          textAlign: "center",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: colors.primary.main,
          }
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
          <IconButton
            size="small"
            sx={{ color: colors.neutral[400] }}
          >
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
          Set the maximum price slippage you're willing to accept for your trades
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
            onClick={() => handleOptionClick("custom")}
            onFocus={() => handleOptionClick("custom")}
            placeholder="Custom"
            type="text"
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
                background: activeOption === "custom" 
                  ? `rgba(${colors.primary.gradient}, 0.05)` 
                  : "transparent",
                border: `1px solid ${activeOption === "custom" ? colors.primary.main : colors.neutral[700]}`,
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
                width: activeOption === "custom" 
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
                    color: slippageStatus === "high" ? colors.warning.main : colors.error.main
                  }
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
