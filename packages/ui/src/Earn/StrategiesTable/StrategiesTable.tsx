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
  cardStyles,
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Box
        sx={{
          ...cardStyles.base,
          borderRadius: borderRadius.xl,
          background: `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          backdropFilter: "blur(20px)",
          boxShadow: `0 4px 16px rgba(0, 0, 0, 0.2)`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${colors.primary.main}60, transparent)`,
            zIndex: 1,
          },
          "&:hover": {
            border: `1px solid ${colors.primary.main}40`,
            boxShadow: `0 6px 24px rgba(0, 0, 0, 0.25)`,
          },
          transition: "all 0.2s ease",
        }}
      >
        {/* Title Section */}
        <Box
          sx={{
            p: { xs: spacing.md, md: spacing.lg },
            pb: 0,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Typography
            sx={{
              color: colors.neutral[50],
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeights.bold,
              lineHeight: 1.2,
              background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[300]} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: spacing.sm,
            }}
          >
            {title}
          </Typography>
        </Box>

        {showFilters && (
          <Box sx={{ p: { xs: spacing.md, md: spacing.lg }, pt: 0 }}>
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
          </Box>
        )}

        {/* Table header - only show on desktop */}
        {!isMobile && (
          <Box
            sx={{
              px: { xs: spacing.md, md: spacing.lg },
              py: spacing.md,
              borderBottom: `1px solid ${colors.neutral[800]}`,
              background: `linear-gradient(135deg, ${colors.neutral[900]}20 0%, ${colors.neutral[800]}20 100%)`,
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
                    letterSpacing: "0.5px",
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
                    letterSpacing: "0.5px",
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
                    letterSpacing: "0.5px",
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
                      letterSpacing: "0.5px",
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
                      letterSpacing: "0.5px",
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
                      letterSpacing: "0.5px",
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
                    letterSpacing: "0.5px",
                    textAlign: "right",
                  }}
                >
                  Action
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Content Container */}
        <Box
          sx={{
            overflow: "auto",
            maxHeight: isMobile ? "auto" : "60vh",
            position: "relative",
            zIndex: 2,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: colors.neutral[800],
              borderRadius: borderRadius.md,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: colors.primary.main,
              borderRadius: borderRadius.md,
              "&:hover": {
                backgroundColor: colors.primary.light,
              },
            },
            // Styles for Firefox
            scrollbarWidth: "thin",
            scrollbarColor: `${colors.primary.main} ${colors.neutral[800]}`,
          }}
        >
          {/* Mobile strategy count */}
          {isMobile && !isLoading && filteredStrategies.length > 0 && (
            <Box sx={{ p: spacing.md, pb: 0 }}>
              <Typography
                sx={{
                  color: colors.neutral[300],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                {filteredStrategies.length} strategies found
              </Typography>
            </Box>
          )}

          {/* Loading state */}
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
                flexDirection: "column",
              }}
            >
              <CircularProgress
                sx={{
                  color: colors.primary.main,
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
          ) : filteredStrategies.length > 0 ? (
            <Box sx={{ p: { xs: spacing.sm, md: 0 } }}>
              {filteredStrategies.map((strategy, index) => (
                <motion.div
                  key={strategy.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
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
                textAlign: "center",
                p: spacing.xl,
              }}
            >
              <Box
                sx={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colors.primary.main}20 0%, ${colors.primary.main}10 100%)`,
                  border: `1px solid ${colors.primary.main}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    color: colors.primary.main,
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
                  opacity: 0.8,
                }}
              >
                {emptyStateMessage}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

// Helper function to check if any strategy has the user joined
const hasAnyUserJoined = (strategies: StrategyMetadata[]): boolean => {
  return strategies.some((strategy) => strategy.hasJoined);
};
