import React from "react";
import { Box, List, ListItem, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { TokenBox } from "../TokenBox/TokenBox";
import { Button } from "../../Button/Button";
import { SwapContainerProps } from "@phoenix-protocol/types";
import { SwapAssetsButton } from "./SwapAssetsButton";
import { CardContainer } from "../../Common/CardContainer";
import { SwapDetails } from "./SwapDetails";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: { xs: spacing.lg, md: spacing.xl },
          alignItems: "center",
          px: { xs: spacing.md, sm: spacing.lg },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: spacing.sm, md: spacing.md },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: typography.fontSize.xl,
                md: typography.fontSize.xxl,
              },
              fontWeight: typography.fontWeights.bold,
              color: colors.neutral[50],
              mb: spacing.xs,
              letterSpacing: "-0.02em",
            }}
          >
            Swap tokens instantly
          </Typography>
          <Typography
            sx={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral[400],
              fontWeight: typography.fontWeights.regular,
            }}
          >
            Trade tokens with minimal slippage and low fees
          </Typography>
        </Box>

        {/* Main Content Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: spacing.lg, md: spacing.xl },
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {/* Swap Form Section */}
          <CardContainer
            sx={{
              position: "relative",
              background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[850]} 100%)`,
              border: `1px solid ${colors.neutral[700]}`,
              boxShadow: `0 8px 25px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.1)`,
              backdropFilter: "blur(20px)",
              "&:hover": {
                border: `1px solid ${colors.neutral[600]}`,
                boxShadow: `0 12px 35px rgba(0, 0, 0, 0.2), 0 4px 15px rgba(0, 0, 0, 0.1)`,
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Box sx={{ position: "relative", width: "100%", p: spacing.lg }}>
              <div
                className="token-box"
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <TokenBox
                  value={fromTokenValue}
                  token={fromToken}
                  onAssetClick={() => onTokenSelectorClick(true)}
                  onChange={(value) => onInputChange(true, value)}
                />

                {/* Improved Swap Assets Button */}
                <Box
                  sx={{
                    height: "48px",
                    width: "48px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                    background: `linear-gradient(145deg, ${colors.neutral[700]} 0%, ${colors.neutral[800]} 100%)`,
                    borderRadius: "50%",
                    border: `2px solid ${colors.neutral[600]}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2)`,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      borderColor: colors.primary.main,
                      background: `linear-gradient(145deg, ${colors.primary.main}20, ${colors.neutral[700]} 100%)`,
                      transform: "translate(-50%, -50%) scale(1.05)",
                      boxShadow: `0 8px 20px rgba(249, 115, 22, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)`,
                    },
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

              {/* Settings and Action Buttons */}
              <Box
                sx={{
                  mt: spacing.lg,
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing.md,
                }}
              >
                <Typography
                  onClick={onOptionsClick}
                  sx={{
                    color: colors.primary.main,
                    fontSize: typography.fontSize.sm,
                    textDecoration: "underline",
                    cursor: "pointer",
                    textAlign: "right",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: colors.primary[400],
                    },
                  }}
                >
                  Adjust maximum spread
                </Typography>

                {trustlineButtonActive ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
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
                        width: "100%",
                        height: "56px",
                        fontSize: typography.fontSize.md,
                        fontWeight: typography.fontWeights.semiBold,
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      onClick={onSwapButtonClick}
                      disabled={swapButtonDisabled}
                      type="primary"
                      label="Swap"
                      sx={{
                        width: "100%",
                        height: "56px",
                        fontSize: typography.fontSize.md,
                        fontWeight: typography.fontWeights.semiBold,
                        background: swapButtonDisabled
                          ? `linear-gradient(145deg, ${colors.neutral[700]} 0%, ${colors.neutral[800]} 100%)`
                          : `linear-gradient(135deg, ${
                              colors.primary.main
                            } 0%, ${colors.primary[600] || "#ea580c"} 100%)`,
                        border: swapButtonDisabled
                          ? `1px solid ${colors.neutral[600]}`
                          : `1px solid ${colors.primary.main}`,
                        borderRadius: borderRadius.lg,
                        boxShadow: swapButtonDisabled
                          ? "none"
                          : `0 4px 15px rgba(249, 115, 22, 0.3), 0 2px 8px rgba(249, 115, 22, 0.2)`,
                        color: swapButtonDisabled
                          ? colors.neutral[400]
                          : colors.neutral[50],
                        "&:hover": !swapButtonDisabled
                          ? {
                              background: `linear-gradient(135deg, ${
                                colors.primary[400] || "#fb923c"
                              } 0%, ${colors.primary.main} 100%)`,
                              transform: "translateY(-2px)",
                              boxShadow: `0 8px 25px rgba(249, 115, 22, 0.4), 0 4px 15px rgba(249, 115, 22, 0.2)`,
                              borderColor: colors.primary[400] || "#fb923c",
                            }
                          : {},
                        "&:active": !swapButtonDisabled
                          ? {
                              transform: "translateY(0px)",
                              boxShadow: `0 4px 15px rgba(249, 115, 22, 0.3), 0 2px 8px rgba(249, 115, 22, 0.2)`,
                            }
                          : {},
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </motion.div>
                )}
              </Box>
            </Box>
          </CardContainer>

          {/* Swap Details Section */}
          <CardContainer
            sx={{
              background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[850]} 100%)`,
              border: `1px solid ${colors.neutral[700]}`,
              boxShadow: `0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)`,
              backdropFilter: "blur(15px)",
              "&:hover": {
                border: `1px solid ${colors.neutral[600]}`,
                boxShadow: `0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)`,
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Box sx={{ p: spacing.lg }}>
              <SwapDetails
                exchangeRate={exchangeRate}
                networkFee={networkFee}
                route={route}
                slippageTolerance={slippageTolerance}
                fromToken={fromToken}
                toToken={toToken}
              />
            </Box>
          </CardContainer>
        </Box>
      </Box>
    </motion.div>
  );
};

export { SwapContainer };
