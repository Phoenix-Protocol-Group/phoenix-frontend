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
import { StrategyMetadata } from "@phoenix-protocol/strategies";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

export interface StrategiesTableProps {
  title: string;
  strategies: StrategyMetadata[];
  showFilters?: boolean;
  isLoading?: boolean;
  onViewDetails?: (id: string) => void;
  onBondClick: (strategy: StrategyMetadata) => void;
  onUnbondClick: (strategy: StrategyMetadata) => void;
  emptyStateMessage?: string;
}

type SortField = "tvl" | "apr" | null;
type SortDirection = "asc" | "desc";

export const StrategiesTable = ({
  title,
  strategies,
  showFilters = true,
  isLoading = false,
  onViewDetails = () => {},
  onBondClick,
  onUnbondClick,
  emptyStateMessage = "No strategies match your criteria.", // Default message
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
      // Check for userAssetMatch with correct null/undefined handling
      filtered = filtered.filter((s) => s.hasJoined !== false);
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
    isLoading,
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
              padding: spacing.lg,
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(25, 25, 25, 0.8) 100%)",
              border: "1px solid rgba(249, 115, 22, 0.1)",
              mb: 3,
              cursor: "default",
              backdropFilter: "blur(10px)",
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

              {/* Strategy Name Column - 2/12 width */}
              <Grid item md={2}>
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

              {/* Reward Token Column - 1/12 or 2/12 width */}
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

              {/* Action Column - Adjusted to md={2} */}
              <Grid item md={2}>
                <Typography
                  sx={{
                    color: colors.neutral[300],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                    textTransform: "uppercase",
                    textAlign: "right",
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
              height: "300px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(25, 25, 25, 0.8) 100%)",
              border: "1px solid rgba(249, 115, 22, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress
                sx={{
                  color: "#F97316",
                  mb: 2,
                }}
              />
              <Typography
                sx={{
                  color: colors.neutral[300],
                  fontSize: typography.fontSize.sm,
                }}
              >
                Loading strategies...
              </Typography>
            </Box>
          </Box>
        ) : filteredStrategies.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredStrategies.map((strategy, index) => (
              <motion.div
                key={strategy.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <StrategyEntry
                  strategy={strategy}
                  isMobile={isMobile}
                  onViewDetails={onViewDetails}
                  onBondClick={onBondClick}
                  onUnbondClick={onUnbondClick}
                />
              </motion.div>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(25, 25, 25, 0.8) 100%)",
              border: "1px solid rgba(115, 115, 115, 0.2)",
              textAlign: "center",
              padding: spacing.xl,
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              sx={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(249, 115, 22, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: "2rem",
                  color: "#F97316",
                }}
              >
                📊
              </Typography>
            </Box>
            <Typography
              sx={{
                color: colors.neutral[100],
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeights.medium,
                mb: 1,
              }}
            >
              No strategies found
            </Typography>
            <Typography
              sx={{
                color: colors.neutral[400],
                fontSize: typography.fontSize.sm,
                maxWidth: "400px",
              }}
            >
              {emptyStateMessage}
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

// Helper function to check if any strategy has the user joined
const hasAnyUserJoined = (strategies: StrategyMetadata[]): boolean => {
  return strategies.some((strategy) => strategy.hasJoined);
};
