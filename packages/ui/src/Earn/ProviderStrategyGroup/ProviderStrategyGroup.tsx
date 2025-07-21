import React from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { StrategyMetadata } from "@phoenix-protocol/strategies";
import StrategyEntry from "../StrategiesTable/StrategyEntry";
import ProviderStrategyRow from "./ProviderStrategyRow";
import { formatCurrencyStatic } from "@phoenix-protocol/utils";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

export interface ProviderStrategyGroupProps {
  providerId: string;
  providerName: string;
  providerIcon: string;
  providerDescription?: string;
  strategies: StrategyMetadata[];
  totalTVL: number;
  rewardTokens: { token: string; icon: string; amount: number }[];
  onBondClick: (strategy: StrategyMetadata) => void;
  onUnbondClick: (strategy: StrategyMetadata) => void;
  onViewDetails?: (strategy: StrategyMetadata) => void;
}

export const ProviderStrategyGroup = ({
  providerId,
  providerName,
  providerIcon,
  providerDescription,
  strategies,
  totalTVL,
  rewardTokens,
  onBondClick,
  onUnbondClick,
  onViewDetails = () => {},
}: ProviderStrategyGroupProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Calculate provider stats
  const totalUserStake = strategies.reduce(
    (sum, strategy) => sum + (strategy.userStake || 0),
    0
  );
  const avgApr =
    strategies.reduce((sum, strategy) => sum + (strategy.apr || 0), 0) /
    strategies.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box sx={{ mb: spacing.xl }}>
        {/* Provider Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: spacing.lg,
            p: spacing.lg,
            borderRadius: borderRadius.lg,
            background: `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
            border: `1px solid ${colors.neutral[700]}`,
            backdropFilter: "blur(20px)",
            boxShadow: `0 4px 16px rgba(0, 0, 0, 0.15)`,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${colors.primary.main}60, transparent)`,
              zIndex: 1,
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: spacing.md }}>
            <Box
              component="img"
              src={providerIcon}
              alt={`${providerName} logo`}
              sx={{
                width: isMobile ? "40px" : "48px",
                height: isMobile ? "40px" : "48px",
                borderRadius: "50%",
                background: colors.neutral[800],
                padding: "8px",
                border: `1px solid ${colors.neutral[600]}`,
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3)`,
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: isMobile
                    ? typography.fontSize.lg
                    : typography.fontSize.xl,
                  fontWeight: typography.fontWeights.bold,
                  color: colors.neutral[50],
                  mb: spacing.xs,
                }}
              >
                {providerName}
              </Typography>
              {providerDescription && (
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[300],
                    maxWidth: "400px",
                  }}
                >
                  {providerDescription}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Provider Stats */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: spacing.lg,
              }}
            >
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[400],
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    mb: spacing.xs,
                  }}
                >
                  Total TVL
                </Typography>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeights.bold,
                    color: colors.neutral[50],
                  }}
                >
                  {formatCurrencyStatic.format(totalTVL)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[400],
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    mb: spacing.xs,
                  }}
                >
                  Avg APR
                </Typography>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeights.bold,
                    color: colors.primary.main,
                  }}
                >
                  {(avgApr * 100).toFixed(3)}%
                </Typography>
              </Box>

              {totalUserStake > 0 && (
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    sx={{
                      fontSize: typography.fontSize.xs,
                      color: colors.neutral[400],
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      mb: spacing.xs,
                    }}
                  >
                    Your Stake
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: typography.fontSize.md,
                      fontWeight: typography.fontWeights.bold,
                      color: colors.primary.main,
                    }}
                  >
                    {formatCurrencyStatic.format(totalUserStake)}
                  </Typography>
                </Box>
              )}

              {rewardTokens.length > 0 && (
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    sx={{
                      fontSize: typography.fontSize.xs,
                      color: colors.neutral[400],
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      mb: spacing.xs,
                    }}
                  >
                    Rewards
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: spacing.xs,
                    }}
                  >
                    {rewardTokens.map((reward) => (
                      <Box
                        key={reward.token}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: spacing.xs,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Box
                          component="img"
                          src={reward.icon}
                          alt={`${reward.token} icon`}
                          sx={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeights.medium,
                            color: colors.neutral[50],
                          }}
                        >
                          {reward.amount.toFixed(2)} {reward.token}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Table Headers - Desktop Only */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: spacing.lg,
              py: spacing.md,
              mb: spacing.sm,
              borderRadius: borderRadius.md,
              background: `linear-gradient(135deg, ${colors.neutral[800]}20 0%, ${colors.neutral[900]}30 100%)`,
              border: `1px solid ${colors.neutral[700]}50`,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item md={3}>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.medium,
                    color: colors.neutral[300],
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Strategy
                </Typography>
              </Grid>
              <Grid item md={2}>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.medium,
                    color: colors.neutral[300],
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "center",
                  }}
                >
                  TVL
                </Typography>
              </Grid>
              <Grid item md={2}>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.medium,
                    color: colors.neutral[300],
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "center",
                  }}
                >
                  APR
                </Typography>
              </Grid>
              <Grid item md={2}>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.medium,
                    color: colors.neutral[300],
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "center",
                  }}
                >
                  Your Position
                </Typography>
              </Grid>
              <Grid item md={3}>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.medium,
                    color: colors.neutral[300],
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "center",
                  }}
                >
                  Actions
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Strategy List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: spacing.sm }}>
          {strategies.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {isMobile ? (
                <StrategyEntry
                  strategy={strategy}
                  isMobile={isMobile}
                  onViewDetails={(id) => onViewDetails?.(strategy)}
                  onBondClick={onBondClick}
                  onUnbondClick={onUnbondClick}
                />
              ) : (
                <ProviderStrategyRow
                  strategy={strategy}
                  isMobile={isMobile}
                  onViewDetails={onViewDetails || (() => {})}
                  onBondClick={onBondClick}
                  onUnbondClick={onUnbondClick}
                />
              )}
            </motion.div>
          ))}
        </Box>

        {strategies.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: spacing.xl,
              color: colors.neutral[400],
            }}
          >
            <Typography>No strategies available for {providerName}</Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};
