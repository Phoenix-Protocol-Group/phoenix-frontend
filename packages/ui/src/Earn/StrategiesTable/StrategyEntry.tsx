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

export interface StrategyEntryProps {
  id: string;
  assets: Token[];
  name: string;
  description?: string;
  tvl: number;
  apr: number;
  rewardToken: Token;
  unbondTime: number;
  isMobile: boolean;
  link?: string;
  onViewDetails: (id: string) => void;
  userStake?: number;
  userRewards?: number;
  hasJoined?: boolean;
}

const BoxStyle = {
  p: spacing.md,
  borderRadius: borderRadius.md,
  background: colors.neutral[900],
  border: `1px solid ${colors.neutral[700]}`,
  position: "relative",
  overflow: "hidden",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
  marginTop: spacing.sm,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.25)",
    borderColor: colors.neutral[600],
    cursor: "pointer",
  },
};

const StrategyEntry = ({
  id,
  name,
  description,
  tvl,
  apr,
  rewardToken,
  unbondTime,
  isMobile,
  assets,
  link,
  onViewDetails,
  userStake = 0,
  userRewards = 0,
  hasJoined = false,
}: StrategyEntryProps) => {
  const theme = useTheme();

  // Format unbond time for display
  const formatUnbondTime = (time: number) => {
    if (time === 0) return "Instant";
    const days = Math.floor(time / 86400);
    const hours = Math.floor((time % 86400) / 3600);

    if (days > 0) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    return "< 1 hour";
  };

  const handleClick = () => {
    onViewDetails(id);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={handleClick}
    >
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
              width: "15%",
              height: "auto",
              opacity: 0.08,
              transform: "translateY(-50%)",
              left: `${-40 + index * 60}px`,
              filter: "grayscale(80%)",
            }}
          />
        ))}

        {/* Show "joined" chip if user has stake */}
        {hasJoined && (
          <Chip
            label="Joined"
            size="small"
            sx={{
              position: "absolute",
              top: spacing.sm,
              right: spacing.sm,
              background: colors.primary.main,
              color: colors.neutral[50],
              fontWeight: typography.fontWeights.medium,
              fontSize: typography.fontSize.xs,
            }}
          />
        )}

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
                  {(apr * 100).toFixed(1)}%
                </Typography>
              </Grid>

              {/* User stake - only show if user has joined */}
              {hasJoined && (
                <>
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        color: colors.neutral[400],
                        fontSize: typography.fontSize.xs,
                      }}
                    >
                      Your Stake
                    </Typography>
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
                    <Typography
                      sx={{
                        color: colors.neutral[400],
                        fontSize: typography.fontSize.xs,
                      }}
                    >
                      Claimable
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

            {/* View Details Link */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.primary.main,
                mt: spacing.sm,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: colors.primary.light,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                View Details
              </Typography>
              <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
            </Box>
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
            <Grid item md={hasJoined ? 2 : 3}>
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
                {(apr * 100).toFixed(1)}%
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

            {/* View Details Link */}
            <Grid item md={1} sx={{ textAlign: "right" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  color: colors.primary.main,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: colors.primary.light,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.medium,
                  }}
                >
                  Details
                </Typography>
                <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </motion.div>
  );
};

export default StrategyEntry;
