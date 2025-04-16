import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  TableSortLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import { FilterBar } from "../FilterBar/FilterBar";
import StrategyEntry from "./StrategyEntry";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

export interface StrategiesTableProps {
  title: string;
  strategies: any[];
  showFilters?: boolean;
  isLoading?: boolean;
  onViewDetails?: (id: string) => void;
}

type SortField = "tvl" | "apr" | null;
type SortDirection = "asc" | "desc";

export const StrategiesTable = ({
  title,
  strategies,
  showFilters = true,
  isLoading = false,
  onViewDetails = () => {},
}: StrategiesTableProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Filter states
  const [assetsFilter, setAssetsFilter] = useState<
    "Your assets" | "All Assets"
  >("All Assets");
  const [typeFilter, setTypeFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [instantUnbondOnly, setInstantUnbondOnly] = useState(false);

  // Sort states
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const types = ["LP Staking", "Single Asset Staking", "Farming"];
  const platforms = ["Phoenix", "External"];

  // Apply filters and sorting
  const filteredStrategies = useMemo(() => {
    if (isLoading || !strategies.length) return [];

    let filtered = [...strategies];

    // Asset filter (would need to be implemented based on user assets)
    if (assetsFilter === "Your assets") {
      // In a real app, you'd filter to only show strategies with assets the user owns
      // This is just a placeholder
      filtered = filtered.filter((s) => s.userAssetMatch || true);
    }

    // Type filter
    if (typeFilter !== "All") {
      filtered = filtered.filter(
        (s) => s.category === typeFilter.toLowerCase()
      );
    }

    // Platform filter
    if (platformFilter !== "All") {
      filtered = filtered.filter(
        (s) => s.providerId === platformFilter.toLowerCase()
      );
    }

    // Instant unbond only
    if (instantUnbondOnly) {
      filtered = filtered.filter((s) => s.unbondTime === 0);
    }

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        const valueA = a[sortField] || 0;
        const valueB = b[sortField] || 0;

        if (sortDirection === "asc") {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      });
    }

    return filtered;
  }, [
    strategies,
    assetsFilter,
    typeFilter,
    platformFilter,
    instantUnbondOnly,
    sortField,
    sortDirection,
  ]);

  // Helper function for table headers
  const renderSortableHeader = (
    field: SortField,
    label: string,
    width: number
  ) => (
    <Grid item md={width}>
      <TableSortLabel
        active={sortField === field}
        direction={sortField === field ? sortDirection : "asc"}
        onClick={() => handleSort(field)}
        sx={{
          color: colors.neutral[300],
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeights.bold,
          textTransform: "uppercase",
          "& .MuiTableSortLabel-icon": {
            color: `${colors.neutral[300]} !important`,
          },
        }}
      >
        {label}
      </TableSortLabel>
    </Grid>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mt: 4 }}>
        {showFilters && (
          <FilterBar
            assetsFilter={assetsFilter}
            onAssetsFilterChange={setAssetsFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            platformFilter={platformFilter}
            onPlatformFilterChange={setPlatformFilter}
            instantUnbondOnly={instantUnbondOnly}
            onInstantUnbondOnlyChange={(value) => setInstantUnbondOnly(value)}
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
              cursor: "default",
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

              {/* Strategy Name Column - 2-3/12 width (depends on if user has joined) */}
              <Grid item md={hasAnyUserJoined(strategies) ? 2 : 3}>
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

              {/* TVL Column - sortable, 1/12 width */}
              {renderSortableHeader("tvl", "TVL", 1)}

              {/* APR Column - sortable, 1/12 width */}
              {renderSortableHeader("apr", "APR", 1)}

              {/* Reward Token Column - 1-2/12 width (depends on if user has joined) */}
              <Grid item md={hasAnyUserJoined(strategies) ? 1 : 2}>
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

              {/* Your Stake Column - only show if any strategy has user joined */}
              {hasAnyUserJoined(strategies) && (
                <Grid item md={1}>
                  <Typography
                    sx={{
                      color: colors.neutral[300],
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeights.bold,
                      textTransform: "uppercase",
                    }}
                  >
                    Your Stake
                  </Typography>
                </Grid>
              )}

              {/* Claimable Rewards Column - only show if any strategy has user joined */}
              {hasAnyUserJoined(strategies) && (
                <Grid item md={2}>
                  <Typography
                    sx={{
                      color: colors.neutral[300],
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeights.bold,
                      textTransform: "uppercase",
                    }}
                  >
                    Claimable
                  </Typography>
                </Grid>
              )}

              {/* Unbond Time Column - only show if no strategy has user joined */}
              {!hasAnyUserJoined(strategies) && (
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
              )}

              {/* Details Column - 1/12 width */}
              <Grid item md={1}>
                <Typography
                  sx={{
                    color: colors.neutral[300],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                    textTransform: "uppercase",
                    textAlign: "right",
                  }}
                >
                  Details
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
            {filteredStrategies.length} strategies found
          </Typography>
        )}

        {/* Loading state */}
        {isLoading ? (
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
            <CircularProgress sx={{ color: colors.primary.main }} />
          </Box>
        ) : filteredStrategies.length > 0 ? (
          <Box>
            {filteredStrategies.map((strategy, index) => (
              <motion.div
                key={strategy.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <StrategyEntry
                  {...strategy}
                  isMobile={isMobile}
                  onViewDetails={onViewDetails}
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

// Helper function to check if any strategy has the user joined
const hasAnyUserJoined = (strategies: any[]): boolean => {
  return strategies.some((strategy) => strategy.hasJoined);
};
