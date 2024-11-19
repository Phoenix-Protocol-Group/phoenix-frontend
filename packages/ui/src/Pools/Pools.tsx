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
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  Pool,
  PoolsFilter as Filter,
  PoolsProps,
} from "@phoenix-protocol/types";
import { motion } from "framer-motion";

// Styles for description header and content
const descriptionHeader = {
  color: "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
  marginTop: "3px",
  fontSize: {
    xs: "12px",
    md: "14px",
  },
  lineHeight: "140%",
};

const descriptionContent = {
  color: "#FFF",
  fontSize: {
    xs: "12px",
    md: "18px",
  },
  fontWeight: 700,
  lineHeight: "140%",
  textAlign: "right",
};

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

/**
 * Pool Card Item Component
 *
 * @component
 * @param {Object} props - The properties for the PoolItem.
 * @param {Pool} props.pool - The pool data.
 * @param {Filter} props.filter - Current filter applied.
 * @param {Function} props.onAddLiquidityClick - Handler for adding liquidity.
 * @param {Function} props.onShowDetailsClick - Handler for showing details.
 */
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Box
          sx={{
            padding: "16px",
            borderRadius: "12px",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
            backdropFilter: "blur(24px)",
            position: "relative",
            cursor: "pointer",
            "&:hover": {
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 100%)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <Box
              component={motion.img}
              src={pool.tokens[0].icon}
              sx={{
                height: {
                  xs: "48px",
                  md: "64px",
                },
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <Box
              component={motion.img}
              src={pool.tokens[1].icon}
              sx={{
                height: {
                  xs: "48px",
                  md: "64px",
                },
                position: "relative",
                left: "-10px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </Box>
          <Typography
            sx={{
              textAlign: "center",
              marginBottom: "16px",
              fontWeight: 700,
              fontSize: {
                xs: "16px",
                md: "18px",
              },
            }}
          >
            {`${pool.tokens[0].name} - ${pool.tokens[1].name}`}
          </Typography>

          <Grid container rowSpacing={1} sx={{ marginBottom: "24px" }}>
            <Grid item xs={6}>
              <Typography sx={descriptionHeader}>TVL</Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography sx={descriptionContent}>{pool.tvl}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={descriptionHeader}>Max APR</Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography sx={descriptionContent}>{pool.maxApr}</Typography>
            </Grid>
            {filter === "MY" && (
              <>
                <Grid item xs={6}>
                  <Typography sx={descriptionHeader}>My Liquidity</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography sx={descriptionContent}>
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
    switch (sort) {
      case "HighTVL":
        filteredPools.sort((a, b) => parseFloat(b.tvl) - parseFloat(a.tvl));
        break;
      case "LowTVL":
        filteredPools.sort((a, b) => parseFloat(a.tvl) - parseFloat(b.tvl));
        break;
      case "HighAPR":
        filteredPools.sort(
          (a, b) => parseFloat(b.maxApr) - parseFloat(a.maxApr)
        );
        break;
      case "LowAPR":
        filteredPools.sort(
          (a, b) => parseFloat(a.maxApr) - parseFloat(b.maxApr)
        );
        break;
      default:
        break;
    }

    return filteredPools;
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
