import React from "react";
import { Box, Grid, Typography, Tooltip, useTheme, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { formatCurrencyStatic } from "@phoenix-protocol/utils";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";
import { Token } from "@phoenix-protocol/types";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Button } from "../../Button/Button"; // Import Button
import { StrategyMetadata } from "@phoenix-protocol/strategies"; // Import StrategyMetadata

export interface StrategyEntryProps {
  // Use StrategyMetadata directly for clarity
  strategy: StrategyMetadata;
  isMobile: boolean;
  onViewDetails: (id: string) => void; // Keep for potential future use or different click areas
  onBondClick: (strategy: StrategyMetadata) => void; // Callback for Bond action
  onUnbondClick: (strategy: StrategyMetadata) => void; // Callback for Unbond action
}

const BoxStyle = {
  p: { xs: spacing.md, md: spacing.lg },
  borderRadius: "16px",
  background:
    "linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(25, 25, 25, 0.9) 100%)",
  border: "1px solid rgba(249, 115, 22, 0.1)",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  marginTop: spacing.md,
  transition: "all 0.4s ease",
  backdropFilter: "blur(10px)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 32px rgba(249, 115, 22, 0.2)",
    borderColor: "rgba(249, 115, 22, 0.3)",
  },
};

const StrategyEntry = ({
  strategy, // Use the full metadata object
  isMobile,
  onViewDetails, // Keep if needed elsewhere
  onBondClick,
  onUnbondClick,
}: StrategyEntryProps) => {
  const theme = useTheme();
  const {
    id,
    name,
    description,
    tvl,
    apr,
    rewardToken,
    unbondTime,
    assets,
    userStake = 0,
    userRewards = 0,
    hasJoined = false,
  } = strategy; // Destructure metadata

  // Format unbond time for display
  const formatUnbondTime = (time: number) => {
    if (time === 0) return "Instant";
    const days = Math.floor(time / 86400);
    const hours = Math.floor((time % 86400) / 3600);

    if (days > 0) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    return "< 1 hour";
  };

  return (
    // Removed motion.div and onClick from the outer Box to avoid conflicting clicks
    <Box sx={BoxStyle}>
      {/* Background asset graphics */}
      {assets.map((asset, index) => (
        <Box
          key={index}
          component="img"
          src={asset.icon}
          alt={asset.name}
          sx={{
            position: "absolute",
            top: "50%",
            width: "20%",
            height: "auto",
            opacity: 0.12,
            transform: "translateY(-50%)",
            right: `${-20 + index * 80}px`,
            filter: "grayscale(60%) brightness(1.2)",
            zIndex: 0,
          }}
        />
      ))}

      {/* Content wrapper with z-index */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Mobile Layout */}
        {isMobile ? (
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: spacing.md }}
          >
            {/* Header with assets and name */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: spacing.sm }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                {assets.map((asset, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={asset.icon}
                    alt={asset.name}
                    sx={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  />
                ))}
              </Box>
              <Typography
                sx={{
                  color: colors.neutral[50],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.bold,
                  flex: 1,
                }}
              >
                {name}
              </Typography>
            </Box>

            {/* Description if available */}
            {description && (
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontSize: typography.fontSize.xs,
                  marginBottom: spacing.xs,
                }}
              >
                {description}
              </Typography>
            )}

            {/* Strategy details */}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    color: colors.neutral[400],
                    fontSize: typography.fontSize.xs,
                  }}
                >
                  TVL
                </Typography>
                <Typography
                  sx={{
                    color: colors.neutral[300],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.medium,
                  }}
                >
                  {formatCurrencyStatic.format(tvl)}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography
                  sx={{
                    color: colors.neutral[400],
                    fontSize: typography.fontSize.xs,
                  }}
                >
                  APR
                </Typography>
                <Typography
                  sx={{
                    color: colors.success[300],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                  }}
                >
                  up to {(apr * 100).toFixed(1)}%
                </Typography>
              </Grid>

              {/* User stake - only show if user has joined */}
              {hasJoined && (
                <>
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        color: colors.primary[300],
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeights.medium,
                      }}
                    >
                      {formatCurrencyStatic.format(userStake)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        component="img"
                        src={rewardToken.icon}
                        alt={rewardToken.name}
                        sx={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography
                        sx={{
                          color:
                            userRewards > 0
                              ? colors.success[300]
                              : colors.neutral[300],
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeights.medium,
                        }}
                      >
                        {userRewards.toFixed(2)} {rewardToken.name}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}

              {!hasJoined && (
                <>
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        color: colors.neutral[400],
                        fontSize: typography.fontSize.xs,
                      }}
                    >
                      Reward
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        component="img"
                        src={rewardToken.icon}
                        alt={rewardToken.name}
                        sx={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography
                        sx={{
                          color: colors.neutral[300],
                          fontSize: typography.fontSize.xs,
                        }}
                      >
                        {rewardToken.name}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        color: colors.neutral[400],
                        fontSize: typography.fontSize.xs,
                      }}
                    >
                      Unbond Time
                    </Typography>
                    <Typography
                      sx={{
                        color:
                          unbondTime === 0
                            ? colors.success[300]
                            : colors.neutral[300],
                        fontSize: typography.fontSize.xs,
                      }}
                    >
                      {formatUnbondTime(unbondTime)}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>

            {/* Action Button - Updated for mobile */}
            {hasJoined ? (
              <Box sx={{ display: "flex", gap: spacing.sm, mt: spacing.md }}>
                <Button
                  size="small"
                  type="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBondClick(strategy);
                  }}
                  sx={{ flex: 1 }}
                >
                  Bond More
                </Button>
                <Button
                  size="small"
                  type="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnbondClick(strategy);
                  }}
                  sx={{ flex: 1 }}
                >
                  Unbond
                </Button>
              </Box>
            ) : (
              <Button
                size="small"
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onBondClick(strategy);
                }}
                sx={{ width: "100%", mt: spacing.md }}
              >
                Bond
              </Button>
            )}
          </Box>
        ) : (
          /* Desktop Layout */
          <Grid container alignItems="center" spacing={3}>
            {/* Assets Column */}
            <Grid item md={2}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {assets.map((asset, idx) => (
                  <Box key={idx} sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="img"
                      src={asset.icon}
                      alt={asset.name}
                      sx={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                    <Typography
                      sx={{
                        color: colors.neutral[300],
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeights.bold,
                        marginLeft: spacing.xs,
                      }}
                    >
                      {asset.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Strategy Name */}
            <Grid item md={2}>
              <Tooltip title={description || name} arrow placement="top">
                <Typography
                  sx={{
                    color: colors.neutral[50],
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeights.medium,
                  }}
                >
                  {name}
                </Typography>
              </Tooltip>
            </Grid>

            {/* TVL */}
            <Grid item md={1}>
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.regular,
                  color: colors.neutral[300],
                }}
              >
                {formatCurrencyStatic.format(tvl)}
              </Typography>
            </Grid>

            {/* APR */}
            <Grid item md={1}>
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.bold,
                  color: colors.success[300],
                }}
              >
                Up to {(apr * 100).toFixed(1)}%
              </Typography>
            </Grid>

            {/* Reward Token */}
            <Grid
              item
              md={hasJoined ? 1 : 2}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box
                component="img"
                src={rewardToken.icon}
                alt={rewardToken.name}
                sx={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
              <Typography
                sx={{
                  color: colors.neutral[300],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                  marginLeft: spacing.xs,
                }}
              >
                {rewardToken.name}
              </Typography>
            </Grid>

            {/* Your Stake - only show if joined */}
            {hasJoined && (
              <Grid item md={1}>
                <Typography
                  sx={{
                    color: colors.neutral[400],
                    fontSize: typography.fontSize.xs,
                    mb: 0.5,
                  }}
                >
                  Your Stake
                </Typography>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.medium,
                    color: colors.primary[300],
                  }}
                >
                  {formatCurrencyStatic.format(userStake)}
                </Typography>
              </Grid>
            )}

            {/* Claimable rewards - only show if joined */}
            {hasJoined && (
              <Grid item md={2}>
                <Typography
                  sx={{
                    color: colors.neutral[400],
                    fontSize: typography.fontSize.xs,
                    mb: 0.5,
                  }}
                >
                  Claimable
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    component="img"
                    src={rewardToken.icon}
                    alt={rewardToken.name}
                    sx={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeights.medium,
                      color:
                        userRewards > 0
                          ? colors.success[300]
                          : colors.neutral[300],
                    }}
                  >
                    {userRewards.toFixed(2)} {rewardToken.name}
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Unbond Time - only show if not joined */}
            {!hasJoined && (
              <Grid item md={2}>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.regular,
                    color:
                      unbondTime === 0
                        ? colors.success[300]
                        : colors.neutral[300],
                  }}
                >
                  {formatUnbondTime(unbondTime)}
                </Typography>
              </Grid>
            )}

            {/* Action Button Column - Updated for desktop */}
            <Grid item md={2} sx={{ textAlign: "right" }}>
              {hasJoined ? (
                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <Button
                    size="small"
                    type="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBondClick(strategy);
                    }}
                  >
                    Bond
                  </Button>
                  <Button
                    size="small"
                    type="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnbondClick(strategy);
                    }}
                  >
                    Unbond
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <Button
                    size="small"
                    type="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBondClick(strategy);
                    }}
                  >
                    Bond
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default StrategyEntry;
