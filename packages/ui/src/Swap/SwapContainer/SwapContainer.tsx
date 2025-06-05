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
          gap: { xs: spacing.sm, sm: spacing.md, md: spacing.lg },
          alignItems: "center",
          px: { xs: spacing.xs, sm: spacing.sm, md: spacing.md },
          mt: { xs: "70px", md: 0 }, // Account for fixed mobile AppBar
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: spacing.xs, sm: spacing.sm, md: spacing.md },
            px: { xs: spacing.sm, sm: 0 }, // Better mobile padding
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: typography.fontSize.lg,
                sm: typography.fontSize.xl,
                md: typography.fontSize.xxl,
              },
              fontWeight: typography.fontWeights.bold,
              color: colors.neutral[50],
              mb: { xs: spacing.xs, sm: spacing.sm },
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Swap tokens instantly
          </Typography>
          <Typography
            sx={{
              fontSize: {
                xs: typography.fontSize.xs,
                sm: typography.fontSize.sm,
              },
              color: colors.neutral[400],
              fontWeight: typography.fontWeights.regular,
              px: { xs: spacing.sm, sm: 0 },
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
            gap: { xs: spacing.sm, sm: spacing.md, md: spacing.lg },
            width: "100%",
            maxWidth: { xs: "100%", sm: "520px", md: "600px" },
          }}
        >
          {/* Swap Form Section */}
          <CardContainer
            sx={{
              position: "relative",
              padding: { xs: spacing.sm, sm: spacing.md },
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
            <Box
              sx={{
                position: "relative",
                width: "100%",
                p: { xs: 0, sm: spacing.lg }, // Reduced mobile padding
              }}
            >
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

                {/* Enhanced Mobile-Optimized Swap Assets Button */}
                <Box
                  sx={{
                    height: { xs: "44px", sm: "48px" },
                    width: { xs: "44px", sm: "48px" },
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
                    cursor: "pointer",
                    // Enhanced mobile touch targets
                    minHeight: { xs: "44px", sm: "48px" },
                    minWidth: { xs: "44px", sm: "48px" },
                    "&:hover": {
                      borderColor: colors.primary.main,
                      background: `linear-gradient(145deg, ${colors.primary.main}20, ${colors.neutral[700]} 100%)`,
                      transform: "translate(-50%, -50%) scale(1.05)",
                      boxShadow: `0 8px 20px rgba(249, 115, 22, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)`,
                    },
                    // Mobile-specific touch states
                    "&:active": {
                      transform: "translate(-50%, -50%) scale(0.95)",
                      transition: "all 0.1s ease",
                    },
                    // Improve touch area for mobile
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-8px",
                      left: "-8px",
                      right: "-8px",
                      bottom: "-8px",
                      borderRadius: "50%",
                      // Invisible touch area extension for mobile
                      pointerEvents: "auto",
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
                  mt: { xs: spacing.md, sm: spacing.lg },
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: spacing.sm, sm: spacing.md },
                }}
              >
                <Typography
                  onClick={onOptionsClick}
                  sx={{
                    color: colors.primary.main,
                    fontSize: {
                      xs: typography.fontSize.xs,
                      sm: typography.fontSize.sm,
                    },
                    textDecoration: "underline",
                    cursor: "pointer",
                    textAlign: "right",
                    transition: "color 0.2s ease",
                    padding: { xs: spacing.xs, sm: 0 },
                    minHeight: { xs: "32px", sm: "auto" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    "&:hover": {
                      color: colors.primary[400],
                    },
                    "&:active": {
                      color: colors.primary[500],
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
                        height: { xs: "52px", sm: "56px" },
                        fontSize: {
                          xs: typography.fontSize.sm,
                          sm: typography.fontSize.md,
                        },
                        fontWeight: typography.fontWeights.semiBold,
                        // Mobile-optimized touch targets
                        minHeight: { xs: "52px", sm: "56px" },
                        borderRadius: {
                          xs: borderRadius.md,
                          sm: borderRadius.lg,
                        },
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
                        height: { xs: "52px", sm: "56px" },
                        fontSize: {
                          xs: typography.fontSize.sm,
                          sm: typography.fontSize.md,
                        },
                        fontWeight: typography.fontWeights.semiBold,
                        // Mobile-optimized touch targets
                        minHeight: { xs: "52px", sm: "56px" },
                        borderRadius: {
                          xs: borderRadius.md,
                          sm: borderRadius.lg,
                        },
                        background: swapButtonDisabled
                          ? `linear-gradient(145deg, ${colors.neutral[700]} 0%, ${colors.neutral[800]} 100%)`
                          : `linear-gradient(135deg, ${
                              colors.primary.main
                            } 0%, ${colors.primary[600] || "#ea580c"} 100%)`,
                        border: swapButtonDisabled
                          ? `1px solid ${colors.neutral[600]}`
                          : `1px solid ${colors.primary.main}`,
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
                        // Enhanced mobile touch feedback
                        "@media (max-width: 768px)": {
                          "&:active": !swapButtonDisabled
                            ? {
                                transform: "scale(0.98)",
                                transition: "all 0.1s ease",
                              }
                            : {},
                        },
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
            <Box sx={{ p: { xs: 0, sm: spacing.lg } }}>
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
