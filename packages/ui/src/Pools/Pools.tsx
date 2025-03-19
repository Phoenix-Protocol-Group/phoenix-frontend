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
          borderRadius: "12px", // Reduced border radius
          border: selected
            ? "1px solid #F97316"
            : "1px solid var(--neutral-700, #404040)", // Adjusted border
          background: selected
            ? "rgba(249, 115, 22, 0.1)" // Adjusted background
            : "var(--neutral-900, #171717)", // Adjusted background
          color: "var(--neutral-300, #D4D4D4)", // Adjusted color
          padding: selected ? "7px 15px" : "8px 16px",
          "&:hover": {
            background: selected
              ? "rgba(249, 115, 22, 0.2)" // Adjusted background on hover
              : "var(--neutral-800, #262626)", // Adjusted background on hover
          },
        }}
      >
        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: 500, // Adjusted font weight
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
        whileHover={{ scale: 1.03 }} // Reduced scale
        whileTap={{ scale: 0.98 }} // Adjusted scale
      >
        <Box
          sx={{
            padding: "16px", // Reduced padding
            borderRadius: "12px", // Reduced border radius
            background: "var(--neutral-900, #171717)", // Adjusted background
            border: "1px solid var(--neutral-700, #404040)", // Adjusted border
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)", // Adjusted shadow
          }}
        >
          {/* Logos in the background */}
          <Box
            sx={{
              position: "absolute",
              top: "-10%",
              left: "-10%",
              width: "100px", // Reduced size
              height: "100px", // Reduced size
              opacity: 0.08, // Adjusted opacity
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
              width: "100px", // Reduced size
              height: "100px", // Reduced size
              opacity: 0.08, // Adjusted opacity
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
              gap: "8px", // Reduced gap
              marginBottom: "12px", // Reduced margin
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "28px", // Reduced size
                height: "28px", // Reduced size
                padding: "4px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "28px",
                background: "var(--neutral-800, #262626)", // Adjusted background
              }}
            >
              <Box
                sx={{
                  width: "20px", // Reduced size
                  height: "20px", // Reduced size
                  borderRadius: "50%",
                  background: `url(${pool.tokens[0].icon}) transparent 50% / cover no-repeat`,
                }}
              />
            </Box>
            <Typography
              sx={{
                fontWeight: 500, // Adjusted font weight
                fontSize: "16px", // Adjusted font size
                color: "var(--neutral-50, #FAFAFA)", // Adjusted color
              }}
            >
              {`${pool.tokens[0].name} - ${pool.tokens[1].name}`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                width: "28px", // Reduced size
                height: "28px", // Reduced size
                padding: "4px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "28px",
                background: "var(--neutral-800, #262626)", // Adjusted background
              }}
            >
              <Box
                sx={{
                  width: "20px", // Reduced size
                  height: "20px", // Reduced size
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
                  color: "var(--neutral-400, #A3A3A3)", // Adjusted color
                  fontSize: "12px", // Adjusted font size
                  fontWeight: 500, // Adjusted font weight
                }}
              >
                TVL
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography
                sx={{
                  color: "var(--neutral-50, #FAFAFA)", // Adjusted color
                  fontSize: "14px", // Adjusted font size
                  fontWeight: 500, // Adjusted font weight
                }}
              >
                {pool.tvl}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  color: "var(--neutral-400, #A3A3A3)", // Adjusted color
                  fontSize: "12px", // Adjusted font size
                  fontWeight: 500, // Adjusted font weight
                }}
              >
                Max APR
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography
                sx={{
                  color: "var(--neutral-50, #FAFAFA)", // Adjusted color
                  fontSize: "14px", // Adjusted font size
                  fontWeight: 500, // Adjusted font weight
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
                      color: "var(--neutral-400, #A3A3A3)", // Adjusted color
                      fontSize: "12px", // Adjusted font size
                      fontWeight: 500, // Adjusted font weight
                    }}
                  >
                    My Liquidity
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography
                    sx={{
                      color: "var(--neutral-50, #FAFAFA)", // Adjusted color
                      fontSize: "14px", // Adjusted font size
                      fontWeight: 500, // Adjusted font weight
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
          color: "var(--neutral-50, #FAFAFA)", // Adjusted color
          fontSize: "24px", // Adjusted font size
          fontWeight: 700,
          marginBottom: "16px",
        }}
      >
        Pools
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
        {" "}
        {/* Adjusted margin */}
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
            borderRadius: "12px", // Reduced border radius
            border: "1px solid var(--neutral-700, #404040)", // Adjusted border
            background: "var(--neutral-900, #171717)", // Adjusted background
            padding: "8px 12px", // Adjusted padding
            lineHeight: "16px", // Adjusted line height
            fontSize: "12px", // Adjusted font size
            color: "var(--neutral-300, #D4D4D4)", // Adjusted color
            "&:before": {
              content: "none",
            },
            "&:after": {
              content: "none",
            },
          }}
          startAdornment={
            <img
              style={{ marginRight: "8px", opacity: 0.6 }} // Adjusted opacity
              src="/MagnifyingGlass.svg"
              alt="search"
            />
          }
        />
        <FormControl sx={{ minWidth: "160px" }}>
          {" "}
          {/* Adjusted width */}
          <InputLabel
            sx={{
              fontSize: "12px !important", // Adjusted font size
              paddingBottom: "8px", // Adjusted padding
              top: "-2px",
              color: "var(--neutral-400, #A3A3A3) !important", // Adjusted color
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
              padding: "8px 12px", // Adjusted padding
              height: "40px", // Adjusted height
              borderRadius: "12px", // Reduced border radius
              border: "1px solid var(--neutral-700, #404040) !important", // Adjusted border
              background: "var(--neutral-900, #171717)", // Adjusted background
              fontSize: "12px !important", // Adjusted font size
              color: "var(--neutral-300, #D4D4D4)", // Adjusted color
            }}
          >
            <MenuItem value={"HighTVL"}>
              <Typography fontSize="12px" color="var(--neutral-300, #D4D4D4)">
                {" "}
                {/* Adjusted color */}
                TVL High to Low
              </Typography>
            </MenuItem>
            <MenuItem value={"LowTVL"}>
              <Typography fontSize="12px" color="var(--neutral-300, #D4D4D4)">
                {" "}
                {/* Adjusted color */}
                TVL Low to High
              </Typography>
            </MenuItem>
            <MenuItem value={"HighAPR"}>
              <Typography fontSize="12px" color="var(--neutral-300, #D4D4D4)">
                {" "}
                {/* Adjusted color */}
                APR High to Low
              </Typography>
            </MenuItem>
            <MenuItem value={"LowAPR"}>
              <Typography fontSize="12px" color="var(--neutral-300, #D4D4D4)">
                {" "}
                {/* Adjusted color */}
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
            onShowDetailsClick={onShowDetailsClick}
            pool={pool}
          />
        ))}
      </Grid>
    </Box>
  );
};

export { Pools };
