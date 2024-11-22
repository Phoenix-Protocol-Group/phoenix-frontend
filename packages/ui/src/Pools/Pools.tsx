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
  Skeleton,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  Pool,
  PoolsFilter as Filter,
  PoolsProps,
} from "@phoenix-protocol/types";
import { motion } from "framer-motion";

/**
 * Button Component for Pool Filter
 *
 * @component
 * @param {Object} props - The properties for the FilterButton.
 * @param {string} props.label - The label of the filter button.
 * @param {boolean} props.selected - Whether the button is selected.
 * @param {Function} props.onClick - Function to execute on button click.
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
          borderRadius: "16px",
          border: selected ? "1px solid #E2491A" : "none",
          background: selected
            ? "rgba(226, 73, 26, 0.10)"
            : "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          color: "white",
          padding: selected ? "7px 15px" : "8px 16px",
        }}
      >
        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: 700,
            lineHeight: "20px",
          }}
        >
          {label}
        </Typography>
      </Button>
    );
  }
);

const PoolItem = React.memo(
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
        onClick={() => onShowDetailsClick(pool)}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Box
          sx={{
            padding: "24px",
            borderRadius: "20px",
            background:
              "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Logos in the background */}
          <Box
            sx={{
              position: "absolute",
              top: "-10%",
              left: "-10%",
              width: "120px",
              height: "120px",
              opacity: 0.1,
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
              width: "120px",
              height: "120px",
              opacity: 0.1,
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
              gap: "12px",
              marginBottom: "16px",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "36px",
                height: "36px",
                padding: "4px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "32px",
                background:
                  "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
              }}
            >
              <Box
                sx={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: `url(${pool.tokens[0].icon}) transparent 50% / cover no-repeat`,
                }}
              />
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "20px",
                color: "#fff",
              }}
            >
              {`${pool.tokens[0].name} - ${pool.tokens[1].name}`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                width: "36px",
                height: "36px",
                padding: "4px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "32px",
                background:
                  "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
              }}
            >
              <Box
                sx={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: `url(${pool.tokens[1].icon}) transparent 50% / cover no-repeat`,
                }}
              />
            </Box>
          </Box>

          {/* Pool Stats */}
          <Grid container rowSpacing={1} sx={{ zIndex: 1 }}>
            <Grid item xs={6}>
              <Typography
                sx={{
                  color: "var(--Secondary-S2-2, #BDBEBE)",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                TVL
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography
                sx={{
                  color: "var(--Secondary-S2, #FFF)",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                {pool.tvl}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  color: "var(--Secondary-S2-2, #BDBEBE)",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                Max APR
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography
                sx={{
                  color: "var(--Secondary-S2, #FFF)",
                  fontSize: "18px",
                  fontWeight: 700,
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
                      color: "var(--Secondary-S2-2, #BDBEBE)",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    My Liquidity
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography
                    sx={{
                      color: "var(--Secondary-S2, #FFF)",
                      fontSize: "18px",
                      fontWeight: 700,
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
 * Pools Overview Component
 *
 * @component
 * @param {PoolsProps} props - The properties for the Pools component.
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
        sortedPools.sort((a, b) => parseFloat(b.tvl) - parseFloat(a.tvl));
        break;
      case "LowTVL":
        sortedPools.sort((a, b) => parseFloat(a.tvl) - parseFloat(b.tvl));
        break;
      case "HighAPR":
        sortedPools.sort((a, b) => parseFloat(b.maxApr) - parseFloat(a.maxApr));
        break;
      case "LowAPR":
        sortedPools.sort((a, b) => parseFloat(a.maxApr) - parseFloat(b.maxApr));
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
          color: "#FFF",
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "16px",
        }}
      >
        Pools
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
        <Grid item>
          <FilterButton
            onClick={() => onFilterClick("ALL")}
            label="All Pools"
            selected={filter === "ALL"}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", gap: 2, marginBottom: "16px" }}>
        <Input
          placeholder="Search"
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            width: "100%",
            borderRadius: "16px",
            border: "1px solid #2D303A",
            background: "#1D1F21",
            padding: "8px 16px",
            lineHeight: "18px",
            fontSize: "13px",
            "&:before": {
              content: "none",
            },
            "&:after": {
              content: "none",
            },
          }}
          startAdornment={
            <img
              style={{ marginRight: "8px" }}
              src="/MagnifyingGlass.svg"
              alt="search"
            />
          }
        />
        <FormControl sx={{ minWidth: "180px" }}>
          <InputLabel
            sx={{
              fontSize: "13px !important",
              paddingBottom: "12px",
              top: "-2px",
              color: "rgba(255, 255, 255, 0.70) !important",
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
              padding: "16px",
              height: "46px",
              borderRadius: "16px",
              border: "1px solid #2D303A !important",
              background: "#1F2123",
              fontSize: "14px !important",
            }}
          >
            <MenuItem value={"HighTVL"}>
              <Typography fontSize="14px">TVL High to Low</Typography>
            </MenuItem>
            <MenuItem value={"LowTVL"}>
              <Typography fontSize="14px">TVL Low to High</Typography>
            </MenuItem>
            <MenuItem value={"HighAPR"}>
              <Typography fontSize="14px">APR High to Low</Typography>
            </MenuItem>
            <MenuItem value={"LowAPR"}>
              <Typography fontSize="14px">APR Low to High</Typography>
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
            onShowDetailsClick={onShowDetailsClick}
            pool={pool}
          />
        ))}
      </Grid>
    </Box>
  );
};

export { Pools };
