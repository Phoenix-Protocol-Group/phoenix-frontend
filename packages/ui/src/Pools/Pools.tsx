"use client";

import {
  Box,
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  Pool,
  PoolsFilter as Filter,
  PoolsProps,
} from "@phoenix-protocol/types";
import { motion } from "framer-motion";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../Theme/styleConstants";

/**
 * Button Component for Pool Filter
 */
const FilterButton = React.memo(
  ({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onClick}
          sx={{
            borderRadius: borderRadius.lg,
            border: selected
              ? `2px solid ${colors.primary.main}`
              : `2px solid ${colors.neutral[700]}`,
            background: selected
              ? `linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.08) 100%)`
              : `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
            color: selected ? colors.primary.main : colors.neutral[300],
            padding: "10px 20px",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: selected
                ? `linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.12) 100%)`
                : `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
              borderColor: selected
                ? colors.primary.light
                : colors.neutral[600],
              color: selected ? colors.primary.light : colors.neutral[200],
              boxShadow: selected
                ? `0 4px 20px rgba(249, 115, 22, 0.25)`
                : "0 4px 12px rgba(0, 0, 0, 0.3)",
            },
            "&:before": selected
              ? {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(45deg, transparent 30%, rgba(249, 115, 22, 0.1) 50%, transparent 70%)`,
                  animation: "shimmer 2s infinite",
                  "@keyframes shimmer": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                  },
                }
              : {},
          }}
        >
          <Typography
            sx={{
              fontSize: typography.fontSize.sm,
              fontWeight: selected
                ? typography.fontWeights.semiBold
                : typography.fontWeights.medium,
              lineHeight: "20px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {label}
          </Typography>
        </Button>
      </motion.div>
    );
  }
);

/**
 * Pool Item Component
 */
export const PoolItem = React.memo(
  ({
    pool,
    filter,
    onAddLiquidityClick,
    onShowDetailsClick,
  }: {
    pool: Pool;
    filter: Filter;
    onAddLiquidityClick: (pool: Pool) => void;
    onShowDetailsClick: (pool: Pool) => void;
  }) => {
    return (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onShowDetailsClick(pool)}
      >
        <Box
          sx={{
            padding: { xs: spacing.md, sm: spacing.lg, md: spacing.xl },
            borderRadius: borderRadius.xl,
            background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
            border: `1px solid ${colors.neutral[700]}`,
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              border: `1px solid ${colors.primary.main}`,
              boxShadow: `0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px ${colors.primary.main}`,
              background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
            },
          }}
        >
          {/* Animated Background Glow */}
          <Box
            sx={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: `radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 50%)`,
              opacity: 0,
              transition: "opacity 0.3s ease",
              ".MuiGrid-item:hover &": {
                opacity: 1,
              },
            }}
          />

          {/* Background Token Icons */}
          <Box
            sx={{
              position: "absolute",
              top: "-20%",
              left: "-20%",
              width: "140px",
              height: "140px",
              opacity: 0.03,
              background: `url(${pool.tokens[0].icon}) center / cover no-repeat`,
              filter: "grayscale(100%)",
              borderRadius: "50%",
              transform: "rotate(-15deg)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "-20%",
              right: "-20%",
              width: "140px",
              height: "140px",
              opacity: 0.03,
              background: `url(${pool.tokens[1].icon}) center / cover no-repeat`,
              filter: "grayscale(100%)",
              borderRadius: "50%",
              transform: "rotate(15deg)",
            }}
          />

          {/* Pool Information */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: spacing.md,
              marginBottom: spacing.lg,
              zIndex: 1,
              position: "relative",
            }}
          >
            {/* Token Icons Stack */}
            <Box sx={{ position: "relative", minWidth: "56px" }}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "32px",
                    height: "32px",
                    padding: "2px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[700]} 100%)`,
                    border: `2px solid ${colors.neutral[600]}`,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: `url(${pool.tokens[0].icon}) transparent 50% / cover no-repeat`,
                    }}
                  />
                </Box>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "32px",
                    height: "32px",
                    padding: "2px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[700]} 100%)`,
                    border: `2px solid ${colors.neutral[600]}`,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: `url(${pool.tokens[1].icon}) transparent 50% / cover no-repeat`,
                    }}
                  />
                </Box>
              </motion.div>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontWeight: typography.fontWeights.semiBold,
                  fontSize: typography.fontSize.lg,
                  color: colors.neutral[50],
                  mb: 0.5,
                  lineHeight: 1.2,
                }}
              >
                {`${pool.tokens[0].name}-${pool.tokens[1].name}`}
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.fontSize.xs,
                  color: colors.neutral[400],
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Liquidity Pool
              </Typography>
            </Box>
          </Box>

          {/* Pool Stats with enhanced styling */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              background: `linear-gradient(145deg, rgba(${colors.neutral[800].slice(
                1
              )}, 0.3) 0%, rgba(${
                colors.neutral[750]?.slice(1) || "2a2a2a"
              }, 0.2) 100%)`,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              mb: spacing.md,
              backdropFilter: "blur(10px)",
              border: `1px solid rgba(${colors.neutral[600].slice(1)}, 0.3)`,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    color: colors.neutral[400],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.medium,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    mb: 0.5,
                  }}
                >
                  TVL
                </Typography>
                <Typography
                  sx={{
                    color: colors.neutral[50],
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeights.bold,
                    lineHeight: 1,
                  }}
                >
                  {pool.tvl}
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography
                  sx={{
                    color: colors.neutral[400],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.medium,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    mb: 0.5,
                  }}
                >
                  Max APR
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: colors.primary.main,
                      fontSize: typography.fontSize.md,
                      fontWeight: typography.fontWeights.bold,
                      lineHeight: 1,
                    }}
                  >
                    {pool.maxApr}
                  </Typography>
                  {parseFloat(pool.maxApr.replace("%", "")) > 50 && (
                    <Box
                      sx={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: colors.primary.main,
                        boxShadow: `0 0 8px ${colors.primary.main}`,
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": {
                          "0%, 100%": { opacity: 1 },
                          "50%": { opacity: 0.5 },
                        },
                      }}
                    />
                  )}
                </Box>
              </Grid>
              {filter === "MY" && (
                <>
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        color: colors.neutral[400],
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeights.medium,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        mb: 0.5,
                      }}
                    >
                      My Liquidity
                    </Typography>
                    <Typography
                      sx={{
                        color: colors.neutral[50],
                        fontSize: typography.fontSize.md,
                        fontWeight: typography.fontWeights.bold,
                        lineHeight: 1,
                      }}
                    >
                      ${pool.userLiquidity.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>

          {/* Action Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onShowDetailsClick(pool);
              }}
              sx={{
                width: "100%",
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: borderRadius.md,
                background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
                color: colors.neutral[50],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.semiBold,
                textTransform: "none",
                border: "none",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
                  boxShadow: `0 4px 20px rgba(249, 115, 22, 0.4)`,
                  transform: "translateY(-1px)",
                },
                "&:before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transition: "left 0.5s",
                },
                "&:hover:before": {
                  left: "100%",
                },
              }}
            >
              View Details
            </Button>
          </motion.div>
        </Box>
      </Grid>
    );
  }
);

/**
 * Pools Component
 */
const Pools = ({
  pools,
  onAddLiquidityClick,
  onShowDetailsClick,
  filter,
  sort,
  onSortSelect,
  onFilterClick,
}: PoolsProps) => {
  const [searchValue, setSearchValue] = useState<string>("");

  // Filtered and sorted pools based on search, filter, and sort criteria
  const filteredAndSortedPools = useMemo(() => {
    let filteredPools = pools.filter(
      (pool) =>
        pool.tokens.some((token) =>
          token.name.toLowerCase().includes(searchValue.toLowerCase())
        ) &&
        (filter === "ALL" || (filter === "MY" && pool.userLiquidity > 0))
    );

    // Sort pools based on the selected sorting criteria
    const sortedPools = [...filteredPools];
    switch (sort) {
      case "HighTVL":
        sortedPools.sort(
          (a, b) =>
            parseFloat(b.tvl.replace(/[^0-9.-]+/g, "")) -
            parseFloat(a.tvl.replace(/[^0-9.-]+/g, ""))
        );
        break;
      case "LowTVL":
        sortedPools.sort(
          (a, b) =>
            parseFloat(a.tvl.replace(/[^0-9.-]+/g, "")) -
            parseFloat(b.tvl.replace(/[^0-9.-]+/g, ""))
        );
        break;
      case "HighAPR":
        sortedPools.sort(
          (a, b) =>
            parseFloat(b.maxApr.replace(/[^0-9.-]+/g, "")) -
            parseFloat(a.maxApr.replace(/[^0-9.-]+/g, ""))
        );
        break;
      case "LowAPR":
        sortedPools.sort(
          (a, b) =>
            parseFloat(a.maxApr.replace(/[^0-9.-]+/g, "")) -
            parseFloat(b.maxApr.replace(/[^0-9.-]+/g, ""))
        );
        break;
      default:
        break;
    }

    return sortedPools;
  }, [pools, searchValue, filter, sort]);

  return (
    <Box sx={{ flex: 1, px: 2 }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 3,
        }}
      >
        <Typography
          sx={{
            color: colors.neutral[50],
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeights.bold,
          }}
        >
          All Pools ({filteredAndSortedPools.length})
        </Typography>

        {/* Filter Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <FilterButton
            onClick={() => onFilterClick("ALL")}
            label="All Pools"
            selected={filter === "ALL"}
          />
          <FilterButton
            onClick={() => onFilterClick("MY")}
            label="My Pools"
            selected={filter === "MY"}
          />
        </Box>
      </Box>

      {/* Search and Sort Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: spacing.md,
          marginBottom: spacing.xl,
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Input
          placeholder="Search pools by token name..."
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            flex: 1,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.neutral[700]}`,
            background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
            padding: `${spacing.sm} ${spacing.md}`,
            lineHeight: "1.5",
            fontSize: typography.fontSize.sm,
            color: colors.neutral[50],
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: colors.neutral[600],
              background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
            },
            "&:focus-within": {
              borderColor: colors.primary.main,
              boxShadow: `0 0 0 3px rgba(249, 115, 22, 0.1)`,
            },
            "&:before": {
              content: "none",
            },
            "&:after": {
              content: "none",
            },
          }}
          startAdornment={
            <Box
              component="img"
              src="/MagnifyingGlass.svg"
              alt="search"
              sx={{
                marginRight: spacing.sm,
                opacity: 0.6,
                width: "18px",
                height: "18px",
              }}
            />
          }
        />
        <FormControl sx={{ minWidth: "180px" }}>
          <InputLabel
            sx={{
              fontSize: `${typography.fontSize.sm} !important`,
              paddingBottom: spacing.sm,
              top: "-4px",
              color: `${colors.neutral[400]} !important`,
              "&.Mui-focused": {
                color: `${colors.primary.main} !important`,
              },
            }}
          >
            Sort by
          </InputLabel>
          <Select
            onChange={(event) =>
              onSortSelect(
                event.target.value as
                  | "HighTVL"
                  | "HighAPR"
                  | "LowTVL"
                  | "LowAPR"
              )
            }
            autoWidth
            label="Sort by"
            value={sort}
            sx={{
              padding: `${spacing.sm} ${spacing.md}`,
              height: "50px",
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.neutral[700]} !important`,
              background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
              fontSize: `${typography.fontSize.sm} !important`,
              color: colors.neutral[50],
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: colors.neutral[600],
                background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
              },
              "&.Mui-focused": {
                borderColor: colors.primary.main,
                boxShadow: `0 0 0 3px rgba(249, 115, 22, 0.1)`,
              },
              "& .MuiSelect-icon": {
                color: colors.neutral[400],
              },
            }}
          >
            <MenuItem value={"HighTVL"}>
              <Typography
                fontSize={typography.fontSize.sm}
                color={colors.neutral[50]}
              >
                TVL High to Low
              </Typography>
            </MenuItem>
            <MenuItem value={"LowTVL"}>
              <Typography
                fontSize={typography.fontSize.sm}
                color={colors.neutral[50]}
              >
                TVL Low to High
              </Typography>
            </MenuItem>
            <MenuItem value={"HighAPR"}>
              <Typography
                fontSize={typography.fontSize.sm}
                color={colors.neutral[50]}
              >
                APR High to Low
              </Typography>
            </MenuItem>
            <MenuItem value={"LowAPR"}>
              <Typography
                fontSize={typography.fontSize.sm}
                color={colors.neutral[50]}
              >
                APR Low to High
              </Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* No Results State */}
      {filteredAndSortedPools.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              px: 4,
              textAlign: "center",
              borderRadius: borderRadius.xl,
              background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
              border: `2px dashed ${colors.neutral[700]}`,
            }}
          >
            <Typography
              sx={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeights.semiBold,
                color: colors.neutral[300],
                mb: 2,
              }}
            >
              No pools found
            </Typography>
            <Typography
              sx={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral[400],
                maxWidth: "400px",
              }}
            >
              {searchValue
                ? `Try adjusting your search term "${searchValue}" or browse all available pools.`
                : filter === "MY"
                ? "You haven't provided liquidity to any pools yet. Start by adding liquidity to earn rewards!"
                : "No pools are currently available."}
            </Typography>
          </Box>
        </motion.div>
      )}

      {/* Pools Grid */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {filteredAndSortedPools.map((pool, index) => (
          <PoolItem
            key={`${pool.poolAddress}-${index}`}
            filter={filter}
            onAddLiquidityClick={() => onAddLiquidityClick(pool)}
            onShowDetailsClick={() => onShowDetailsClick(pool)}
            pool={pool}
          />
        ))}
      </Grid>
    </Box>
  );
};

export { Pools };
