import React from "react";
import { Box, Grid, Typography, Tooltip } from "@mui/material";
import { StrategyMetadata } from "@phoenix-protocol/strategies";
import { formatCurrencyStatic } from "@phoenix-protocol/utils";
import { Button } from "../../Button/Button";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

interface ProviderStrategyRowProps {
  strategy: StrategyMetadata;
  isMobile: boolean;
  onViewDetails: (strategy: StrategyMetadata) => void;
  onBondClick: (strategy: StrategyMetadata) => void;
  onUnbondClick: (strategy: StrategyMetadata) => void;
}

const ProviderStrategyRow: React.FC<ProviderStrategyRowProps> = ({
  strategy,
  isMobile,
  onViewDetails,
  onBondClick,
  onUnbondClick,
}) => {
  const {
    name,
    description,
    tvl,
    apr,
    assets,
    hasJoined,
    userStake = 0,
  } = strategy;

  if (isMobile) {
    // For mobile, use the existing StrategyEntry component
    // We'll import and use it directly
    return null; // We'll handle this differently
  }

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: borderRadius.lg,
        background: `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
        border: `1px solid ${colors.neutral[700]}50`,
        backdropFilter: "blur(20px)",
        p: spacing.lg,
        cursor: "default",
        transition: "all 0.3s ease",
        "&:hover": {},
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Strategy Column - md={3} */}
        <Grid item md={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: spacing.sm }}>
            <Box sx={{ display: "flex", gap: -1 }}>
              {assets.map((asset, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.primary.main}20 0%, ${colors.primary.main}10 100%)`,
                    border: `1px solid ${colors.primary.main}30`,
                    backdropFilter: "blur(10px)",
                    boxShadow: `0 4px 16px ${colors.primary.main}20`,
                    ml: idx > 0 ? "-8px" : 0,
                    zIndex: assets.length - idx,
                  }}
                >
                  <Box
                    component="img"
                    src={asset.icon}
                    alt={asset.name}
                    sx={{
                      width: "20px",
                      height: "20px",
                      filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))",
                    }}
                  />
                </Box>
              ))}
            </Box>
            <Box>
              <Tooltip title={description || name} arrow placement="top">
                <Typography
                  sx={{
                    color: colors.neutral[50],
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.medium,
                  }}
                >
                  {name}
                </Typography>
              </Tooltip>
              {assets.length > 0 && (
                <Typography
                  sx={{
                    color: colors.neutral[400],
                    fontSize: typography.fontSize.xs,
                  }}
                >
                  {assets.map(a => a.name).join(" / ")}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>

        {/* TVL Column - md={2} */}
        <Grid item md={2}>
          <Typography
            sx={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.medium,
              color: colors.neutral[50],
              textAlign: "center",
            }}
          >
            {formatCurrencyStatic.format(tvl)}
          </Typography>
        </Grid>

        {/* APR Column - md={2} */}
        <Grid item md={2}>
          <Typography
            sx={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.bold,
              color: colors.success[300],
              textAlign: "center",
            }}
          >
            {strategy.providerId?.includes("phoenix") ? (
              <>Up to {((apr * 100) / 2).toFixed(1)}%</>
            ) : (
              <>{(apr * 100).toFixed(3)}%</>
            )}
          </Typography>
        </Grid>

        {/* Your Position Column - md={2} */}
        <Grid item md={2}>
          <Typography
            sx={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.medium,
              color: hasJoined ? colors.primary[300] : colors.neutral[400],
              textAlign: "center",
            }}
          >
            {hasJoined ? formatCurrencyStatic.format(userStake) : "-"}
          </Typography>
        </Grid>

        {/* Actions Column - md={3} */}
        <Grid item md={3}>
          <Box sx={{ display: "flex", gap: spacing.sm, justifyContent: "center" }}>
            {hasJoined ? (
              <>
                <Button
                  size="small"
                  type="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBondClick(strategy);
                  }}
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
                >
                  Unbond
                </Button>
              </>
            ) : (
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
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProviderStrategyRow;