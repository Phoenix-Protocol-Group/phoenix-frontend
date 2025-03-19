import React, { useState } from "react";
import { Box, IconButton, List, ListItem, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { TokenBox } from "../TokenBox/TokenBox";
import { Button } from "../../Button/Button";
import { SwapContainerProps } from "@phoenix-protocol/types";

const listItemContainer = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
};

const listItemNameStyle = {
  color: "var(--neutral-400, #A3A3A3)", // Adjusted color
  fontSize: "14px",
  lineHeight: "140%",
  marginBottom: 0,
};

const listItemContentStyle = {
  color: "var(--neutral-50, #FAFAFA)", // Adjusted color
  fontSize: "14px",
  fontWeight: "500", // Adjusted font weight
  lineHeight: "140%",
};

const SwapAssetsButton = ({ onClick }: { onClick: () => void }) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    if (!isSpinning) {
      onClick();
      setIsSpinning(true);
      setTimeout(() => setIsSpinning(false), 1000); // Reset spinning animation after 1 second
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="swap-assets-button"
      sx={{
        padding: "4px",
        borderRadius: "0.5rem",
        minWidth: 0,
        top: "25%",
        position: "absolute",
        background:
          "linear-gradient(137deg, #F97316 0%, #F97316 17.08%, #F97316 42.71%, #F97316 100%), #F97316", // Adjusted color
        transform: "translate(-50%, -50%)",
        left: "50%",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
        transition: "transform 0.3s ease-in-out", // Add smooth transition for transform
        "&:hover": {
          transform: "translate(-50%, -50%) scale(1.15)", // Scale up on hover
        },
      }}
    >
      <motion.img
        src="/ArrowsDownUp.svg"
        alt="Swap"
        animate={{ rotate: isSpinning ? 360 : 0 }} // Spin animation
        transition={{
          duration: 1,
          ease: "linear",
          repeat: isSpinning ? Infinity : 0,
        }}
      />
    </Button>
  );
};

const SwapContainer = ({
  fromToken,
  toToken,
  exchangeRate,
  networkFee,
  route,
  slippageTolerance,
  fromTokenValue,
  toTokenValue,
  onOptionsClick,
  onSwapTokensClick,
  onSwapButtonClick,
  onTrustlineButtonClick,
  onInputChange,
  swapButtonDisabled,
  onTokenSelectorClick,
  loadingSimulate = false,
  trustlineButtonActive = false,
  trustlineButtonDisabled = false,
  trustlineAssetName,
}: SwapContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--neutral-900, #171717)", // Added background
            borderRadius: "12px", // Added border radius
            padding: "16px", // Added padding
          }}
        >
          <Typography
            sx={{
              fontSize: "24px", // Adjusted font size
              fontWeight: 500, // Adjusted font weight
              color: "var(--neutral-50, #FAFAFA)", // Adjusted color
            }}
          >
            Swap tokens instantly
          </Typography>
          <IconButton
            onClick={onOptionsClick}
            className="slippage-button"
            sx={{
              borderRadius: "50%",
              background: "var(--neutral-900, #171717)",
              border: "1px solid var(--neutral-700, #404040)",
              padding: "10px",
              color: "var(--neutral-300, #D4D4D4)",
              "&:hover": {
                background: "var(--neutral-800, #262626)",
              },
            }}
          >
            <img src="/GearSix.svg" alt="Options" />
          </IconButton>
        </Box>

        {/* Main Content Section */}
        <Box
          sx={{
            display: "flex",
            gap: "24px",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "stretch", // Adjust to stretch both areas to full height
          }}
        >
          {/* Swap Form Section */}
          <Box sx={{ flex: 1, position: "relative", width: "100%" }}>
            <div
              className="token-box"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <TokenBox
                value={fromTokenValue}
                token={fromToken}
                onAssetClick={() => onTokenSelectorClick(true)}
                onChange={(value) => onInputChange(true, value)}
              />
              <Box
                sx={{
                  height: "36px", // Set fixed height for the ellipsis button
                  width: "36px", // Set fixed width for the ellipsis button
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                  marginTop: "8px", // Add slight margin to separate input boxes
                }}
              >
                <SwapAssetsButton onClick={onSwapTokensClick} />
              </Box>
              <TokenBox
                value={toTokenValue}
                token={toToken}
                onAssetClick={() => onTokenSelectorClick(false)}
                onChange={(value) => onInputChange(false, value)}
                disabled={true}
                loadingValues={loadingSimulate}
              />
            </div>
            {trustlineButtonActive ? (
              <>
                <Button
                  onClick={onTrustlineButtonClick}
                  disabled={trustlineButtonDisabled}
                  type="primary"
                  label={
                    trustlineButtonDisabled
                      ? `You need more than 0.5 XLM on your wallet`
                      : `Add ${trustlineAssetName} trustline`
                  }
                  sx={{
                    marginTop: "16px",
                    width: "100%",
                  }}
                />
              </>
            ) : (
              <Button
                onClick={onSwapButtonClick}
                disabled={swapButtonDisabled}
                type="primary"
                label="Swap"
                sx={{
                  marginTop: "16px",
                  width: "100%",
                }}
              />
            )}
          </Box>

          {/* Swap Details Section */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid var(--neutral-700, #404040)", // Added border
              background: "var(--neutral-900, #171717)",
            }}
          >
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: "18px",
                color: "var(--neutral-50, #FAFAFA)",
                marginBottom: "12px",
              }}
            >
              Swap Details
            </Typography>
            <List
              sx={{
                padding: 0,
                margin: 0,
              }}
            >
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>Exchange rate</Typography>
                <Typography sx={listItemContentStyle}>
                  {exchangeRate}
                </Typography>
              </ListItem>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>Protocol fee</Typography>
                <Typography sx={listItemContentStyle}>{networkFee}</Typography>
              </ListItem>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>Route</Typography>
                <Typography sx={listItemContentStyle}>{route}</Typography>
              </ListItem>
              <ListItem sx={listItemContainer}>
                <Typography sx={listItemNameStyle}>
                  Slippage tolerance
                </Typography>
                <Typography sx={listItemContentStyle}>
                  {slippageTolerance}
                </Typography>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export { SwapContainer };
