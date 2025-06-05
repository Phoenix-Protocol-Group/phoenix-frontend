import React from "react";
import { Box, List, ListItem, Typography, Chip, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { CardContainer } from "../../Common/CardContainer";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";
import { Token } from "@phoenix-protocol/types";
import {
  TrendingUp,
  Security,
  Route as RouteIcon,
  Shield,
  Info,
  ArrowForward,
} from "@mui/icons-material";

interface SwapDetailsProps {
  exchangeRate: string;
  networkFee: string;
  route: string;
  slippageTolerance: string;
  fromToken?: Token;
  toToken?: Token;
}

export const SwapDetails = ({
  exchangeRate,
  networkFee,
  route,
  slippageTolerance,
  fromToken,
  toToken,
}: SwapDetailsProps) => {
  // Parse route to extract token symbols for visual display
  const parseRoute = (routeString: string) => {
    const tokens = routeString.split(" → ").map((token) => token.trim());
    return tokens;
  };

  const routeTokens = parseRoute(route);

  // Enhanced detail item component
  const DetailItem = ({
    icon,
    label,
    value,
    isHighlight = false,
    children,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    isHighlight?: boolean;
    children?: React.ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ListItem
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: `${spacing.sm} ${spacing.xs}`,
          borderRadius: borderRadius.sm,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: `${colors.neutral[800]}30`,
            transform: "translateX(2px)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: spacing.sm }}>
          <Box
            sx={{
              color: isHighlight ? colors.primary.main : colors.neutral[400],
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              transition: "color 0.2s ease",
            }}
          >
            {icon}
          </Box>
          <Typography
            sx={{
              color: colors.neutral[300],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.medium,
              fontFamily: typography.fontFamily,
            }}
          >
            {label}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {children || (
            <Typography
              sx={{
                color: isHighlight ? colors.primary.main : colors.neutral[50],
                fontSize: typography.fontSize.sm,
                fontWeight: isHighlight
                  ? typography.fontWeights.semiBold
                  : typography.fontWeights.medium,
                fontFamily: typography.fontFamily,
              }}
            >
              {value}
            </Typography>
          )}
        </Box>
      </ListItem>
    </motion.div>
  );

  // Enhanced route visualization component
  const RouteVisualization = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: spacing.xs,
        flexWrap: "wrap",
      }}
    >
      {routeTokens.map((tokenSymbol, index) => {
        // Try to find matching token for icon
        const matchingToken =
          fromToken?.name === tokenSymbol
            ? fromToken
            : toToken?.name === tokenSymbol
            ? toToken
            : null;

        return (
          <React.Fragment key={index}>
            <Chip
              icon={
                matchingToken?.icon ? (
                  <Box
                    component="img"
                    src={matchingToken.icon}
                    alt={tokenSymbol}
                    sx={{
                      width: "16px !important",
                      height: "16px !important",
                      borderRadius: "50%",
                    }}
                  />
                ) : undefined
              }
              label={tokenSymbol}
              size="small"
              sx={{
                backgroundColor: `${colors.primary.main}15`,
                color: colors.neutral[50],
                border: `1px solid ${colors.primary.main}30`,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeights.medium,
                "& .MuiChip-icon": {
                  marginLeft: "8px",
                },
              }}
            />
            {index < routeTokens.length - 1 && (
              <ArrowForward
                sx={{
                  fontSize: "14px",
                  color: colors.neutral[500],
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header with icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: spacing.sm,
          marginBottom: spacing.lg,
        }}
      >
        <Box
          sx={{
            padding: spacing.xs,
            borderRadius: borderRadius.sm,
            background: `linear-gradient(135deg, ${colors.primary.main}20, ${colors.primary.main}10)`,
            border: `1px solid ${colors.primary.main}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Info sx={{ fontSize: "18px", color: colors.primary.main }} />
        </Box>
        <Typography
          sx={{
            fontWeight: typography.fontWeights.semiBold,
            fontSize: typography.fontSize.lg,
            color: colors.neutral[50],
            fontFamily: typography.fontFamily,
          }}
        >
          Transaction Details
        </Typography>
      </Box>

      {/* Details List */}
      <List sx={{ padding: 0, margin: 0 }}>
        <DetailItem
          icon={<TrendingUp />}
          label="Exchange Rate"
          value={exchangeRate}
          isHighlight={true}
        />

        <DetailItem icon={<RouteIcon />} label="Route">
          <RouteVisualization />
        </DetailItem>

        <Divider
          sx={{
            my: spacing.sm,
            borderColor: `${colors.neutral[700]}60`,
            mx: spacing.sm,
          }}
        />

        <DetailItem
          icon={<Security />}
          label="Protocol Fee"
          value={networkFee}
        />

        <DetailItem
          icon={<Shield />}
          label="Slippage Tolerance"
          value={slippageTolerance}
        />
      </List>

      {/* Footer info */}
      <Box
        sx={{
          mt: spacing.md,
          p: spacing.sm,
          borderRadius: borderRadius.sm,
          background: `linear-gradient(135deg, ${colors.neutral[800]}60, ${colors.neutral[700]}30)`,
          border: `1px solid ${colors.neutral[700]}40`,
        }}
      >
        <Typography
          sx={{
            fontSize: typography.fontSize.xs,
            color: colors.neutral[400],
            textAlign: "center",
            fontFamily: typography.fontFamily,
          }}
        >
          Powered by Phoenix Protocol • Estimated execution time: ~5 seconds
        </Typography>
      </Box>
    </Box>
  );
};
