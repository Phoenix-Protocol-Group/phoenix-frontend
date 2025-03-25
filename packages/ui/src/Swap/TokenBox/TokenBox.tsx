import React, { useState, useMemo, useCallback } from "react";
import { Box, Button, Grid, Input, Skeleton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Token, TokenBoxProps } from "@phoenix-protocol/types";
import { colors, borderRadius, typography, spacing } from "../../Theme/styleConstants";

/**
 * AssetButton
 * Displays a button for selecting a token with its icon and name.
 *
 * @param {Object} props
 * @param {Token} props.token - The token object.
 * @param {() => void} [props.onClick] - Callback for button click.
 * @param {boolean} [props.hideDropdownButton=false] - Whether to hide the dropdown caret.
 * @returns {JSX.Element}
 */
const AssetButton = ({
  token,
  onClick,
  hideDropdownButton = false,
}: {
  token: Token;
  onClick?: () => void;
  hideDropdownButton?: boolean;
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        fontSize: typography.fontSize.xs,
        padding: spacing.xs,
        borderRadius: borderRadius.sm,
        background: hideDropdownButton ? "none" : colors.neutral[900],
        border: hideDropdownButton
          ? "none"
          : `1px solid ${colors.neutral[700]}`,
        color: colors.neutral[300],
        "&:hover": {
          background: hideDropdownButton
            ? "none"
            : colors.neutral[800],
        },
        cursor: hideDropdownButton ? "auto" : "pointer",
        pointerEvents: hideDropdownButton ? "none" : "auto",
        minWidth: "96px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.xs,
      }}
    >
      {token.icon && (
        <Box
          component="img"
          src={token.icon}
          alt={token.name}
          sx={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
          }}
        />
      )}
      
      <Box sx={{ fontWeight: typography.fontWeights.medium }}>
        {token.name}
      </Box>
      
      {!hideDropdownButton && (
        <Box
          component="img"
          src="/CaretDown.svg"
          sx={{
            display: hideDropdownButton ? "none" : "block",
            opacity: 0.6,
            ml: 0.5,
            width: "12px",
            height: "12px",
          }}
        />
      )}
    </Button>
  );
};

/**
 * TokenBox
 * Displays a box for token details including balance, input, and selection.
 *
 * @param {TokenBoxProps} props - Props containing token details and handlers.
 * @returns {JSX.Element}
 */
const TokenBox = ({
  token,
  onAssetClick,
  onChange,
  value,
  hideDropdownButton = false,
  disabled = false,
  loadingValues = false,
}: TokenBoxProps) => {
  const usdPrice = useMemo(() => {
    return Number(value) * Number(token.usdValue) || 0;
  }, [value, token.usdValue]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (inputValue.split(".")[1]?.length > 7) return;

      onChange(inputValue);
    },
    [onChange]
  );

  const handleMaxClick = useCallback(() => {
    onChange(token.amount.toString());
  }, [onChange, token.amount]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Box
        sx={{
          background: "var(--neutral-900, #171717)", // Adjusted background
          padding: "8px 12px", // Adjusted padding
          borderRadius: "12px", // Adjusted border radius
          border: "1px solid var(--neutral-700, #404040)", // Adjusted border
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", // Adjusted shadow
        }}
      >
        <Grid container>
          {/* Token Input */}
          <Grid item xs={6}>
            {loadingValues ? (
              <Skeleton
                variant="text"
                width="60"
                animation="wave"
                sx={{ bgcolor: "var(--neutral-700, #404040)" }}
              /> // Adjusted color
            ) : (
              <Input
                disabled={disabled}
                value={value}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: token.amount }}
                type="number"
                placeholder="0.00"
                sx={{
                  color: "var(--neutral-300, #D4D4D4)", // Adjusted color
                  fontSize: "18px", // Adjusted font size
                  fontWeight: 500, // Adjusted font weight
                  lineHeight: "140%",
                  width: "100%",
                  "&:before, &:after": {
                    content: "none",
                  },
                  "& .MuiInput-input": {
                    padding: "4px 0", // Adjusted padding
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                    /* Firefox */
                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                      {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                    /* Chrome, Safari, Edge, Opera */
                    "-moz-appearance": "textfield",
                  },
                }}
              />
            )}
          </Grid>

          {/* Asset Button */}
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <AssetButton
              hideDropdownButton={hideDropdownButton}
              token={token}
              onClick={onAssetClick}
            />
          </Grid>

          {/* USD Price */}
          <Grid
            item
            xs={6}
            sx={{
              fontSize: "12px", // Adjusted font size
              color: "var(--neutral-400, #A3A3A3)", // Adjusted color
            }}
          >
            {loadingValues ? (
              <Skeleton
                variant="text"
                width="60"
                animation="wave"
                sx={{ bgcolor: "var(--neutral-700, #404040)" }}
              /> // Adjusted color
            ) : (
              usdPrice.toFixed(2)
            )}
          </Grid>

          {/* Balance and Max Button */}
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Typography
              sx={{
                fontSize: "10px", // Adjusted font size
                lineHeight: "140%",
                color: "var(--neutral-400, #A3A3A3)", // Adjusted color
              }}
            >
              Balance {token.amount}
            </Typography>
            <Button
              onClick={handleMaxClick}
              sx={{
                color: "#F97316", // Adjusted color
                fontSize: "10px", // Adjusted font size
                lineHeight: "140%",
                minWidth: "unset",
                padding: 0,
                marginLeft: 1,
                "&:hover": {
                  background: "transparent",
                },
              }}
            >
              Max
            </Button>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export { TokenBox };
