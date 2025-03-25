import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { Button } from "../../Button/Button";
import { formatCurrencyStatic } from "@phoenix-protocol/utils";
import { colors, typography, spacing, borderRadius } from "../../Theme/styleConstants";

type assetDisplay = {
  name: string;
  address: string;
  icon: string;
};

export interface StrategyEntryProps {
  assets: assetDisplay[];
  name: string;
  tvl: number;
  apr: number;
  rewardToken: assetDisplay;
  unbondTime: number;
  isMobile: boolean;
  bond: () => void;
  unbond: () => void;
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
    cursor: "pointer"
  }
};

const StrategyEntry = ({
  name,
  tvl,
  apr,
  rewardToken,
  unbondTime,
  isMobile,
  assets,
  bond
}: StrategyEntryProps) => {
  const theme = useTheme();
  
  // Format unbond time for display
  const formatUnbondTime = (time: number) => {
    if (time === 0) return "Instant";
    const days = Math.floor(time / 86400);
    return days > 0 ? `${days} days` : "< 1 day";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
              left: `${-40 + (index * 60)}px`,
              filter: "grayscale(80%)"
            }}
          />
        ))}

        {/* Mobile Layout */}
        {isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
            {/* Header with assets and name */}
            <Box sx={{ display: "flex", alignItems: "center", gap: spacing.sm }}>
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
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }}
                  />
                ))}
              </Box>
              <Typography
                sx={{
                  color: colors.neutral[50],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.bold,
                  flex: 1
                }}
              >
                {name}
              </Typography>
            </Box>
            
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
                      borderRadius: "50%"
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
                    color: unbondTime === 0 ? colors.success[300] : colors.neutral[300],
                    fontSize: typography.fontSize.xs,
                  }}
                >
                  {formatUnbondTime(unbondTime)}
                </Typography>
              </Grid>
            </Grid>
            
            {/* Join button */}
            <Button 
              type="secondary"
              onClick={bond}
              fullWidth
              sx={{
                fontSize: typography.fontSize.xs,
                padding: `${spacing.xs} ${spacing.sm}`,
                borderRadius: borderRadius.md,
                marginTop: spacing.xs,
                transition: "all 0.2s ease"
              }}
            >
              Join Strategy
            </Button>
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
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
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
            <Grid item md={3}>
              <Typography
                sx={{
                  color: colors.neutral[50],
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                {name}
              </Typography>
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
            <Grid item md={2} sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                src={rewardToken.icon}
                alt={rewardToken.name}
                sx={{ 
                  width: "24px", 
                  height: "24px",
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
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

            {/* Unbond Time */}
            <Grid item md={2}>
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.regular,
                  color: unbondTime === 0 ? colors.success[300] : colors.neutral[300],
                }}
              >
                {formatUnbondTime(unbondTime)}
              </Typography>
            </Grid>

            {/* Action Button */}
            <Grid item md={1} sx={{ textAlign: "right" }}>
              <Button 
                type="secondary"
                onClick={bond}
                sx={{
                  fontSize: typography.fontSize.xs,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: borderRadius.md,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                  },
                  transition: "all 0.2s ease"
                }}
              >
                Join
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </motion.div>
  );
};

export default StrategyEntry;
