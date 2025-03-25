import React from "react";
import { Box, List, ListItem, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { TokenBox } from "../TokenBox/TokenBox";
import { Button } from "../../Button/Button";
import { SwapContainerProps } from "@phoenix-protocol/types";
import { SwapAssetsButton } from "./SwapAssetsButton";
import { CardContainer } from "../../Common/CardContainer";
import { SwapDetails } from "./SwapDetails";
import { colors, typography, spacing, borderRadius } from "../../Theme/styleConstants";

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
          gap: spacing.md,
          alignItems: "center",
        }}
      >
        {/* Header Section */}
        <CardContainer
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: spacing.md,
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: typography.fontSize.xxl,
              fontWeight: typography.fontWeights.medium,
              color: colors.neutral[50],
            }}
          >
            Swap tokens instantly
          </Typography>
        </CardContainer>

        {/* Main Content Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: spacing.xl,
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {/* Swap Form Section */}
          <Box sx={{ position: "relative", width: "100%" }}>
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
                  height: "36px",
                  width: "36px",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                  marginTop: spacing.sm,
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
            <Typography
              onClick={onOptionsClick}
              sx={{
                color: colors.primary.main,
                fontSize: typography.fontSize.sm,
                textDecoration: "underline",
                cursor: "pointer",
                textAlign: "right",
                mt: spacing.xs,
              }}
            >
              Adjust maximum spread
            </Typography>
            {trustlineButtonActive ? (
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
                  marginTop: spacing.md,
                  width: "100%",
                }}
              />
            ) : (
              <Button
                onClick={onSwapButtonClick}
                disabled={swapButtonDisabled}
                type="primary"
                label="Swap"
                sx={{
                  marginTop: spacing.md,
                  width: "100%",
                }}
              />
            )}
          </Box>

          {/* Swap Details Section */}
          <SwapDetails 
            exchangeRate={exchangeRate}
            networkFee={networkFee}
            route={route}
            slippageTolerance={slippageTolerance}
          />
        </Box>
      </Box>
    </motion.div>
  );
};

export { SwapContainer };
