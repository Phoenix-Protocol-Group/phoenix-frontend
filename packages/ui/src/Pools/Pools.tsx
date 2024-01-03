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
import React from "react";
import { Button as CustomButton } from "../Button/Button";
import {
  Pool,
  PoolsProps,
  PoolsFilter as Filter,
} from "@phoenix-protocol/types";

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

const FilterButton = ({
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
};

const PoolItem = ({
  pool,
  onAddLiquidityClick,
  onShowDetailsClick,
  filter,
}: {
  pool: Pool;
  filter: Filter;
  onAddLiquidityClick: (pool: Pool) => void;
  onShowDetailsClick: (pool: Pool) => void;
}) => {
  return (
    <Grid item xs={6} md={3}>
      <Box
        sx={{
          padding: "16px",
          borderRadius: "8px",
          background:
            "linear-gradient(180deg, #292B2C 0%, #222426 100%), #242529",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "12px",
            marginLeft: "5px",
          }}
        >
          <Box
            component={"img"}
            src={pool.tokens[0].icon}
            sx={{
              width: {
                xs: "48px",
                md: "64px",
              },
            }}
          />
          <Box
            component={"img"}
            src={pool.tokens[1].icon}
            sx={{
              width: {
                xs: "48px",
                md: "64px",
              },
              position: "relative",
              left: "-10px",
            }}
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

        <Grid
          container
          rowSpacing={1}
          sx={{
            marginBottom: "24px",
          }}
        >
          <Grid item xs={6}>
            <Typography sx={descriptionHeader}>TVL</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={descriptionContent}>{pool.tvl}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={descriptionHeader}>Max APR</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={descriptionContent}>{pool.maxApr}</Typography>
          </Grid>
          <Grid item xs={6} display={filter == "MY" ? "block" : "none"}>
            <Typography sx={descriptionHeader}>My Liquidity</Typography>
          </Grid>
          <Grid item xs={6} display={filter == "MY" ? "block" : "none"}>
            <Typography sx={descriptionContent}>
              {pool.userLiquidity}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item xs={12} md={7}>
            <CustomButton
              onClick={() => onAddLiquidityClick(pool)}
              sx={{
                padding: "12px 16px",
                width: "100%",
              }}
              label="Add liquidity"
              type="primary"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <CustomButton
              onClick={() => onShowDetailsClick(pool)}
              sx={{
                padding: "12px 16px",
                width: "100%",
              }}
              label="Details"
              type="secondary"
              size="small"
            />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

const Pools = ({
  pools,
  onAddLiquidityClick,
  onShowDetailsClick,
  filter,
  sort,
  onSortSelect,
  onFilterClick,
}: PoolsProps) => {
  const [searchValue, setSearchValue] = React.useState("");

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
      <Grid
        container
        spacing={1}
        sx={{
          marginBottom: "24px",
        }}
      >
        <Grid item>
          <FilterButton
            onClick={() => onFilterClick("ALL")}
            label="All Pools"
            selected={filter == "ALL"}
          />
        </Grid>
        <Grid item>
          <FilterButton
            onClick={() => onFilterClick("MY")}
            label="My Pools"
            selected={filter == "MY"}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={7} md={10}>
          <Input
            placeholder="Search"
            onChange={(e: any) => setSearchValue(e.target.value)}
            sx={{
              width: "100%",
              borderRadius: "16px",
              border: "1px solid #2D303A",
              background: "#1D1F21",
              padding: "8px 16px",
              lineHeight: "18px",
              fontSize: "13px",
              marginBottom: "16px",
              "&:before": {
                content: "none",
              },
              "&:after": {
                content: "none",
              },
            }}
            startAdornment={
              <img style={{ marginRight: "8px" }} src="/MagnifyingGlass.svg" />
            }
          />
        </Grid>
        <Grid item xs={5} md={2}>
          <FormControl fullWidth>
            <InputLabel
              sx={{
                fontSize: "13px !important",
                paddingBottom: "12px",
                top: "-2px",
                color: "rgba(255, 255, 255, 0.70) !important",
                borderColor: "transparent",
                "&:hover": {
                  borderColor: "transparent",
                },
              }}
            >
              Sort by
            </InputLabel>
            <Select
              onChange={(event: any) => onSortSelect(event.target.value)}
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
              <MenuItem value={"HighTVL"}>
                <Typography fontSize="14px">TVL Low to High</Typography>
              </MenuItem>
              <MenuItem value={"HighAPR"}>
                <Typography fontSize="14px">APR High to Low</Typography>
              </MenuItem>
              <MenuItem value={"HighAPR"}>
                <Typography fontSize="14px">APR Low to High</Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {pools.map((pool) => (
          <PoolItem
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
