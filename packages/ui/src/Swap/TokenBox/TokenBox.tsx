import React, { useState, useMemo, useCallback } from "react";
import { Box, Button, Grid, Input, Skeleton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Token, TokenBoxProps } from "@phoenix-protocol/types";

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
        fontSize: "14px",
        padding: "4px",
        borderRadius: "8px",
        background: hideDropdownButton
          ? "none"
          : "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        display: "inline-flex",
        justifyContent: "space-between",
        color: "white",
        "&:hover": {
          background: hideDropdownButton ? "none" : "rgba(226, 87, 28, 0.08)",
        },
        cursor: hideDropdownButton ? "auto" : "pointer",
        pointerEvents: hideDropdownButton ? "none" : "auto",
        minWidth: "96px",
      }}
    >
      <Box display="flex">
        <Box
          component="img"
          src={token.icon}
          sx={{
            maxWidth: "24px",
            marginRight: "8px",
          }}
        />
        {token.name}
      </Box>
      {!hideDropdownButton && (
        <Box
          component="img"
          src="/CaretDown.svg"
          sx={{
            display: hideDropdownButton ? "none" : "block",
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
          background:
            "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
          padding: "10px 16px",
          borderRadius: "16px",
          border: "1px solid #E2621B",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container>
          {/* Token Input */}
          <Grid item xs={6}>
            {loadingValues ? (
              <Skeleton variant="text" width="80" animation="wave" />
            ) : (
              <Input
                disabled={disabled}
                value={value}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: token.amount }}
                type="number"
                placeholder="0.00"
                sx={{
                  color: "#FFF",
                  fontSize: "24px",
                  fontWeight: 700,
                  lineHeight: "140%",
                  width: "100%",
                  "&:before, &:after": {
                    content: "none",
                  },
                  "&:hover fieldset": {
                    border: "1px solid #E2621B!important",
                  },
                  "&:focus-within fieldset, &:focus-visible fieldset": {
                    border: "1px solid #E2621B!important",
                    color: "white!important",
                  },
                  "& input[type=number]": {
                    "-moz-appearance": "textfield",
                  },
                  "& input[type=number]::-webkit-outer-spin-button": {
                    "-webkit-appearance": "none",
                    margin: 0,
                  },
                  "& input[type=number]::-webkit-inner-spin-button": {
                    "-webkit-appearance": "none",
                    margin: 0,
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
              fontSize: "14px",
              color:
                "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70));",
            }}
          >
            {loadingValues ? (
              <Skeleton variant="text" width="80" animation="wave" />
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
                fontSize: "12px",
                lineHeight: "140%",
                color:
                  "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70));",
              }}
            >
              Balance {token.amount}
            </Typography>
            <Button
              onClick={handleMaxClick}
              sx={{
                color: "white",
                fontSize: "12px",
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
