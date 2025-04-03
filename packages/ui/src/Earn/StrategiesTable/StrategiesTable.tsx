import React from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { FilterBar } from "../FilterBar/FilterBar";
import StrategyEntry from "./StrategyEntry";
import { colors, typography, spacing, borderRadius } from "../../Theme/styleConstants";

export interface StrategiesTableProps {
  title: string;
  strategies: any[];
  showFilters?: boolean;
}

export const StrategiesTable = ({ 
  title, 
  strategies, 
  showFilters = true 
}: StrategiesTableProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Sample filter states
  const [assetsFilter, setAssetsFilter] = React.useState<"Your assets" | "All Assets">("All Assets");
  const [typeFilter, setTypeFilter] = React.useState("All");
  const [platformFilter, setPlatformFilter] = React.useState("All");
  const [instantUnbondOnly, setInstantUnbondOnly] = React.useState(false);

  const types = ["LP Staking", "Single Asset Staking", "Farming"];
  const platforms = ["Phoenix", "External"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mt: 4 }}>
        <Typography 
          sx={{ 
            color: colors.neutral[50],
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeights.bold,
            mb: spacing.md
          }}
        >
          {title}
        </Typography>
        
        {showFilters && (
          <FilterBar
            assetsFilter={assetsFilter}
            onAssetsFilterChange={setAssetsFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            platformFilter={platformFilter}
            onPlatformFilterChange={setPlatformFilter}
            instantUnbondOnly={instantUnbondOnly}
            onInstantUnbondOnlyChange={setInstantUnbondOnly}
            types={types}
            platforms={platforms}
          />
        )}

        {/* Table header - only show on desktop */}
        {!isMobile && (
          <Box
            sx={{
              padding: spacing.md,
              borderRadius: borderRadius.md,
              background: colors.neutral[900],
              border: `1px solid ${colors.neutral[700]}`,
              mb: 2,
            }}
          >
            <Grid container spacing={3} alignItems="center">
              {/* Assets Column - 2/12 width */}
              <Grid item md={2}>
                <Typography 
                  sx={{ 
                    color: colors.neutral[300],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                    textTransform: "uppercase",
                  }}
                >
                  Assets
                </Typography>
              </Grid>
              
              {/* Strategy Name Column - 3/12 width */}
              <Grid item md={3}>
                <Typography 
                  sx={{ 
                    color: colors.neutral[300],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                    textTransform: "uppercase",
                  }}
                >
                  Strategy
                </Typography>
              </Grid>
              
              {/* TVL Column - 1/12 width */}
              <Grid item md={1}>
                <Typography 
                  sx={{ 
                    color: colors.neutral[300],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                    textTransform: "uppercase",
                  }}
                >
                  TVL
                </Typography>
              </Grid>
              
              {/* APR Column - 1/12 width */}
              <Grid item md={1}>
                <Typography 
                  sx={{ 
                    color: colors.neutral[300],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                    textTransform: "uppercase",
                  }}
                >
                  APR
                </Typography>
              </Grid>
              
              {/* Reward Token Column - 2/12 width */}
              <Grid item md={2}>
                <Typography 
                  sx={{ 
                    color: colors.neutral[300],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                    textTransform: "uppercase",
                  }}
                >
                  Reward
                </Typography>
              </Grid>
              
              {/* Unbond Time Column - 2/12 width */}
              <Grid item md={2}>
                <Typography 
                  sx={{ 
                    color: colors.neutral[300],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                    textTransform: "uppercase",
                  }}
                >
                  Unbond Time
                </Typography>
              </Grid>
              
              {/* Action Column - 1/12 width */}
              <Grid item md={1}>
                <Typography 
                  sx={{ 
                    color: colors.neutral[300],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                    textTransform: "uppercase",
                    textAlign: "right"
                  }}
                >
                  Action
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Mobile title for strategies - only show on mobile */}
        {isMobile && (
          <Typography
            sx={{
              color: colors.neutral[300],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.medium,
              mb: spacing.sm,
            }}
          >
            {strategies.length} strategies found
          </Typography>
        )}

        {/* Strategy entries */}
        {strategies.length > 0 ? (
          <Box>
            {strategies.map((strategy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <StrategyEntry
                  {...strategy}
                  isMobile={isMobile}
                />
              </motion.div>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              borderRadius: borderRadius.md,
              background: colors.neutral[900],
              border: `1px solid ${colors.neutral[700]}`,
            }}
          >
            <Typography sx={{ color: colors.neutral[300] }}>
              No strategies found
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};
