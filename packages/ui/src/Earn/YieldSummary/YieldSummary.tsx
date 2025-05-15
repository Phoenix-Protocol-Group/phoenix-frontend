import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Button } from "../../Button/Button";
import { formatCurrencyStatic } from "@phoenix-protocol/utils";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

export interface YieldSummaryProps {
  totalValue: number;
  claimableRewards: number;
  onClaimAll: () => void;
}

export const YieldSummary = ({
  totalValue,
  claimableRewards,
  onClaimAll,
}: YieldSummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          borderRadius: borderRadius.lg,
          background: colors.neutral[900],
          border: `1px solid ${colors.neutral[700]}`,
          padding: spacing.lg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background graphic */}
        <Box
          sx={{
            position: "absolute",
            right: "30%",
            top: "50%",
            transform: "translateY(-50%)",
            width: "300px",
            height: "300px",
            backgroundImage: "url(/plants.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            opacity: 0.45, // Increased from 0.03 for better visibility
            zIndex: 0,
          }}
        />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[400],
                  marginBottom: spacing.xs,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                Total Value Staked
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.fontSize.xxl,
                  color: colors.neutral[50],
                  fontWeight: typography.fontWeights.bold,
                  marginBottom: spacing.md,
                }}
              >
                {formatCurrencyStatic.format(totalValue)}
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[300],
                }}
              >
                Stake your assets to earn passive income through various yield
                strategies
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[400],
                  marginBottom: spacing.xs,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                Claimable Rewards
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.fontSize.xl,
                  color: colors.neutral[50],
                  fontWeight: typography.fontWeights.bold,
                  marginBottom: spacing.md,
                }}
              >
                {formatCurrencyStatic.format(claimableRewards)}
              </Typography>
              <Button
                type="primary"
                onClick={onClaimAll}
                disabled={claimableRewards <= 0}
                sx={{
                  minWidth: "150px",
                  transition: "all 0.2s ease",
                  opacity: claimableRewards <= 0 ? 0.7 : 1,
                  "&:hover": {
                    transform:
                      claimableRewards <= 0 ? "none" : "translateY(-2px)",
                    boxShadow:
                      claimableRewards <= 0
                        ? "none"
                        : "0 4px 8px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Claim All Rewards
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};
