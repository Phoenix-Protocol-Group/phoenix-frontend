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
  claimableRewards: { token: string; icon: string; amount: number }[];
  onClaimAll: () => void;
}

export const YieldSummary = ({
  totalValue,
  claimableRewards,
  onClaimAll,
}: YieldSummaryProps) => {
  const totalRewards = claimableRewards.reduce(
    (sum, reward) => sum + reward.amount,
    0
  );
  const hasRewards = totalRewards > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          padding: { xs: spacing.lg, md: "2rem 0" },
          position: "relative",
          overflow: "hidden",
          mb: 2,
        }}
      >
        {/* Background graphic - more subtle */}
        <Box
          sx={{
            position: "absolute",
            right: "-10%",
            top: "50%",
            transform: "translateY(-50%)",
            width: "300px",
            height: "300px",
            backgroundImage: "url(/plants.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            opacity: 0.08,
            zIndex: 0,
            filter: "hue-rotate(10deg) saturate(1.2)",
          }}
        />

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[400],
                  marginBottom: spacing.xs,
                  fontWeight: typography.fontWeights.medium,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Your Staked Assets
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  color: colors.neutral[50],
                  fontWeight: typography.fontWeights.bold,
                  marginBottom: spacing.sm,
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {formatCurrencyStatic.format(totalValue)}
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.fontSize.md,
                  color: colors.neutral[300],
                  lineHeight: 1.5,
                  maxWidth: "600px",
                }}
              >
                Track and manage your active positions across all yield
                strategies
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { xs: "center", md: "flex-end" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-end" },
                position: "relative",
                zIndex: 1,
                textAlign: { xs: "center", md: "right" },
              }}
            >
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[400],
                  marginBottom: spacing.xs,
                  fontWeight: typography.fontWeights.medium,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Claimable Rewards
              </Typography>

              {/* Multiple reward tokens display */}
              <Box sx={{ mb: spacing.md }}>
                {claimableRewards.length === 0 ? (
                  <Typography
                    sx={{
                      fontSize: { xs: "1.5rem", md: "1.75rem" },
                      color: colors.neutral[50],
                      fontWeight: typography.fontWeights.bold,
                      background:
                        "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    No rewards available
                  </Typography>
                ) : (
                  claimableRewards.map((reward, index) => (
                    <Box
                      key={reward.token}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: { xs: "center", md: "flex-end" },
                        gap: 1,
                        mb:
                          index < claimableRewards.length - 1 ? spacing.xs : 0,
                      }}
                    >
                      <Box
                        component="img"
                        src={reward.icon}
                        alt={`${reward.token} Icon`}
                        sx={{
                          height: "24px",
                          width: "24px",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: "1.25rem", md: "1.5rem" },
                          color:
                            reward.amount > 0 ? "#F97316" : colors.neutral[50],
                          fontWeight: typography.fontWeights.bold,
                          background:
                            reward.amount > 0
                              ? "linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                              : "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {reward.amount.toFixed(2)} {reward.token}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>

              <Button
                type="primary"
                onClick={onClaimAll}
                disabled={!hasRewards}
                sx={{
                  minWidth: "160px",
                  height: "44px",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textTransform: "none",
                  background: hasRewards
                    ? "linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                    : "rgba(115, 115, 115, 0.3)",
                  border: hasRewards
                    ? "1px solid rgba(249, 115, 22, 0.3)"
                    : "1px solid rgba(115, 115, 115, 0.3)",
                  color: hasRewards ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
                  boxShadow: hasRewards
                    ? "0 4px 16px rgba(249, 115, 22, 0.3)"
                    : "none",
                  opacity: hasRewards ? 1 : 0.5,
                  transform: hasRewards ? "translateY(0)" : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: hasRewards ? "translateY(-2px)" : "none",
                    boxShadow: hasRewards
                      ? "0 6px 24px rgba(249, 115, 22, 0.4)"
                      : "none",
                    background: hasRewards
                      ? "linear-gradient(135deg, #EA580C 0%, #F97316 100%)"
                      : "rgba(115, 115, 115, 0.3)",
                  },
                  "&:disabled": {
                    background: "rgba(115, 115, 115, 0.3)",
                    border: "1px solid rgba(115, 115, 115, 0.3)",
                    color: "rgba(255, 255, 255, 0.5)",
                    cursor: "not-allowed",
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
