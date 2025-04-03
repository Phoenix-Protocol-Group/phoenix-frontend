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
      <Button
        onClick={onClick}
        sx={{
          borderRadius: borderRadius.md,
          border: selected
            ? `1px solid ${colors.primary.main}`
            : `1px solid ${colors.neutral[700]}`,
          background: selected
            ? `rgba(${colors.primary.gradient}, 0.1)`
            : colors.neutral[900],
          color: colors.neutral[300],
          padding: selected ? "7px 15px" : "8px 16px",
          transition: "all 0.2s ease",
          "&:hover": {
            background: selected
              ? `rgba(${colors.primary.gradient}, 0.2)`
              : colors.neutral[800],
          },
        }}
      >
        <Typography
          sx={{
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeights.medium,
            lineHeight: "20px",
          }}
        >
          {label}
        </Typography>
      </Button>
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
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onShowDetailsClick(pool)}
      >
        <Box
          sx={{
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            background: colors.neutral[900],
            border: `1px solid ${colors.neutral[700]}`,
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            transition: "all 0.2s ease",
            "&:hover": {
              border: `1px solid ${colors.neutral[600]}`,
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          {/* Background Logos */}
          <Box
            sx={{
              position: "absolute",
              top: "-10%",
              left: "-10%",
              width: "100px",
              height: "100px",
              opacity: 0.08,
              background: `url(${pool.tokens[0].icon}) center / cover no-repeat`,
              filter: "grayscale(100%)",
              borderRadius: "50%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "-10%",
              right: "-10%",
              width: "100px",
              height: "100px",
              opacity: 0.08,
              background: `url(${pool.tokens[1].icon}) center / cover no-repeat`,
              filter: "grayscale(100%)",
              borderRadius: "50%",
            }}
          />

          {/* Pool Information */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: spacing.sm,
              marginBottom: spacing.md,
              zIndex: 1,
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "28px",
                height: "28px",
                padding: "4px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "28px",
                background: colors.neutral[800],
              }}
            >
              <Box
                sx={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: `url(${pool.tokens[0].icon}) transparent 50% / cover no-repeat`,
                }}
              />
            </Box>
            <Typography
              sx={{
                fontWeight: typography.fontWeights.medium,
                fontSize: typography.fontSize.md,
                color: colors.neutral[50],
              }}
            >
              {`${pool.tokens[0].name} - ${pool.tokens[1].name}`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                width: "28px",
                height: "28px",
                padding: "4px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "28px",
                background: colors.neutral[800],
              }}
            >
              <Box
                sx={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: `url(${pool.tokens[1].icon}) transparent 50% / cover no-repeat`,
                }}
              />
            </Box>
          </Box>

          {/* Pool Stats */}
          <Grid
            container
            rowSpacing={1}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Grid item xs={6}>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                TVL
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography
                sx={{
                  color: colors.neutral[50],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                {pool.tvl}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                Max APR
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography
                sx={{
                  color: colors.neutral[50],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                {pool.maxApr}
              </Typography>
            </Grid>
            {filter === "MY" && (
              <>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      color: colors.neutral[400],
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeights.medium,
                    }}
                  >
                    My Liquidity
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography
                    sx={{
                      color: colors.neutral[50],
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeights.medium,
                    }}
                  >
                    {pool.userLiquidity}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
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
    <Box sx={{ flex: 1 }}>
      <Typography
        sx={{
          color: colors.neutral[50],
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeights.bold,
          marginBottom: spacing.md,
        }}
      >
        Pools
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: spacing.md }}>
        <Grid item>
          <FilterButton
            onClick={() => onFilterClick("ALL")}
            label="All Pools"
            selected={filter === "ALL"}
          />
        </Grid>
        <Grid item>
          <FilterButton
            onClick={() => onFilterClick("MY")}
            label="My Pools"
            selected={filter === "MY"}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", gap: spacing.md, marginBottom: spacing.md }}>
        <Input
          placeholder="Search"
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            width: "100%",
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.neutral[700]}`,
            background: colors.neutral[900],
            padding: `${spacing.sm} ${spacing.md}`,
            lineHeight: "1.5",
            fontSize: typography.fontSize.xs,
            color: colors.neutral[300],
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: colors.neutral[600],
            },
            "&:focus-within": {
              borderColor: colors.primary.main,
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
              sx={{ marginRight: spacing.sm, opacity: 0.6 }}
            />
          }
        />
        <FormControl sx={{ minWidth: "160px" }}>
          <InputLabel
            sx={{
              fontSize: `${typography.fontSize.xs} !important`,
              paddingBottom: spacing.sm,
              top: "-2px",
              color: `${colors.neutral[400]} !important`,
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
              height: "40px",
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.neutral[700]} !important`,
              background: colors.neutral[900],
              fontSize: `${typography.fontSize.xs} !important`,
              color: colors.neutral[300],
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: colors.neutral[600],
              },
              "&.Mui-focused": {
                borderColor: colors.primary.main,
              },
            }}
          >
            <MenuItem value={"HighTVL"}>
              <Typography
                fontSize={typography.fontSize.xs}
                color={colors.neutral[300]}
              >
                TVL High to Low
              </Typography>
            </MenuItem>
            <MenuItem value={"LowTVL"}>
              <Typography
                fontSize={typography.fontSize.xs}
                color={colors.neutral[300]}
              >
                TVL Low to High
              </Typography>
            </MenuItem>
            <MenuItem value={"HighAPR"}>
              <Typography
                fontSize={typography.fontSize.xs}
                color={colors.neutral[300]}
              >
                APR High to Low
              </Typography>
            </MenuItem>
            <MenuItem value={"LowAPR"}>
              <Typography
                fontSize={typography.fontSize.xs}
                color={colors.neutral[300]}
              >
                APR Low to High
              </Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={3}>
        {filteredAndSortedPools.map((pool, index) => (
          <PoolItem
            key={index}
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
