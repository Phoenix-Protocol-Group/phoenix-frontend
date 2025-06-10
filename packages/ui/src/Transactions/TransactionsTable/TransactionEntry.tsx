import React from "react";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import LaunchIcon from "@mui/icons-material/Launch";
import { motion } from "framer-motion";
import { TransactionTableEntryProps } from "@phoenix-protocol/types";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  cardStyles,
} from "../../Theme/styleConstants";

const TransactionEntry = (
  props: TransactionTableEntryProps & { isMobile: boolean }
) => {
  const { isMobile } = props;

  // Format date with time
  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
  };

  // Format transaction hash for display
  const formatTxHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  // Format amount for better display
  const formatAmount = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return amount;

    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  const { date, time } = formatDateTime(props.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.005 }}
    >
      <Box
        sx={{
          ...cardStyles.base,
          p: spacing.md,
          mb: spacing.sm,
          background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[750]} 100%)`,
            border: `1px solid ${colors.primary.main}30`,
            transform: "translateY(-1px)",
            boxShadow: `0 4px 20px ${colors.primary.main}15`,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${colors.primary.main}30, transparent)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover::before": {
            opacity: 1,
          },
        }}
      >
        <Grid container spacing={2} sx={{ position: "relative", zIndex: 1 }}>
          {/* Date/Time Column */}
          <Grid item xs={12} sm={2}>
            {isMobile && (
              <Typography
                sx={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.bold,
                  textTransform: "uppercase",
                  color: colors.neutral[400],
                  mb: spacing.xs,
                  letterSpacing: "0.5px",
                }}
              >
                Date & Time
              </Typography>
            )}
            <Box>
              <Typography
                sx={{
                  color: colors.neutral[100],
                  fontSize: isMobile
                    ? typography.fontSize.sm
                    : typography.fontSize.md,
                  fontWeight: typography.fontWeights.medium,
                  fontFamily: typography.fontFamily,
                  lineHeight: 1.2,
                }}
              >
                {date}
              </Typography>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.regular,
                  fontFamily: "monospace",
                  mt: 0.5,
                }}
              >
                {time}
              </Typography>
            </Box>
          </Grid>

          {/* Swap Details Column */}
          <Grid item xs={12} sm={5}>
            {isMobile && (
              <Typography
                sx={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.bold,
                  textTransform: "uppercase",
                  color: colors.neutral[400],
                  mb: spacing.xs,
                  letterSpacing: "0.5px",
                }}
              >
                Swap Details
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: spacing.md,
                width: "100%",
              }}
            >
              {/* From Asset */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.xs,
                  minWidth: "120px",
                  flex: "0 0 auto",
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.primary.main}20, ${colors.primary.dark}10)`,
                    border: `1px solid ${colors.primary.main}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={props.fromAsset.icon}
                    alt={props.fromAsset.name}
                    sx={{
                      width: 20,
                      height: 20,
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: colors.neutral[50],
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeights.semiBold,
                      lineHeight: 1.2,
                      fontFamily: "monospace",
                    }}
                  >
                    {formatAmount(props.fromAmount)}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.neutral[400],
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeights.regular,
                      textTransform: "uppercase",
                    }}
                  >
                    {props.fromAsset.name}
                  </Typography>
                </Box>
              </Box>

              {/* Arrow */}
              <ArrowForward
                sx={{
                  fontSize: 18,
                  color: colors.primary.main,
                  opacity: 0.8,
                  flexShrink: 0,
                }}
              />

              {/* To Asset */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.xs,
                  minWidth: "120px",
                  flex: "0 0 auto",
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.success.main}20, ${colors.success.dark}10)`,
                    border: `1px solid ${colors.success.main}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={props.toAsset.icon}
                    alt={props.toAsset.name}
                    sx={{
                      width: 20,
                      height: 20,
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: colors.neutral[50],
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeights.semiBold,
                      lineHeight: 1.2,
                      fontFamily: "monospace",
                    }}
                  >
                    {formatAmount(props.toAmount)}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.neutral[400],
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeights.regular,
                      textTransform: "uppercase",
                    }}
                  >
                    {props.toAsset.name}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Trade Value Column */}
          <Grid item xs={12} sm={2}>
            {isMobile && (
              <Typography
                sx={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.bold,
                  textTransform: "uppercase",
                  color: colors.neutral[400],
                  mb: spacing.xs,
                  letterSpacing: "0.5px",
                }}
              >
                Trade Value (USD)
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: spacing.xs,
              }}
            >
              <Typography
                sx={{
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeights.semiBold,
                  color: colors.neutral[100],
                  fontFamily: "monospace",
                }}
              >
                ${formatAmount(props.tradeValue)}
              </Typography>
            </Box>
          </Grid>

          {/* Transaction ID Column */}
          <Grid item xs={12} sm={3}>
            {isMobile && (
              <Typography
                sx={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.bold,
                  textTransform: "uppercase",
                  color: colors.neutral[400],
                  mb: spacing.xs,
                  letterSpacing: "0.5px",
                }}
              >
                Transaction ID
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: spacing.xs,
                p: `${spacing.xs} ${spacing.sm}`,
                borderRadius: borderRadius.md,
                background: `linear-gradient(135deg, ${colors.neutral[800]} 0%, ${colors.neutral[850]} 100%)`,
                border: `1px solid ${colors.neutral[600]}`,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.primary.dark}08 100%)`,
                  border: `1px solid ${colors.primary.main}40`,
                  transform: "scale(1.02)",
                },
              }}
              onClick={() =>
                window.open(
                  `https://stellar.expert/explorer/public/tx/${props.txHash}`,
                  "_blank"
                )
              }
            >
              <LaunchIcon
                sx={{
                  fontSize: 16,
                  color: colors.primary.main,
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                  color: colors.primary.main,
                  fontFamily: "monospace",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {formatTxHash(props.txHash)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default TransactionEntry;
