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
import React from "react";
import { Button as CustomButton } from "../Button/Button";
import {
  Pool,
  PoolsProps,
  PoolsFilter as Filter,
} from "@phoenix-protocol/types";
import { Info } from "@mui/icons-material";

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
    <Grid
      item
      xs={6}
      md={4}
      lg={3}
      xl={2}
      className="pool-card"
      onClick={() => onShowDetailsClick(pool)}
    >
      <Box
        sx={{
          padding: "16px",
          borderRadius: "8px",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          backdropFilter: "blur(42px)",
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
            marginBottom: "12px",
            marginLeft: "5px",
          }}
        >
          <Box
            component={"img"}
            src={pool.tokens[0].icon}
            sx={{
              height: {
                xs: "48px",
                md: "64px",
              },
            }}
          />
          <Box
            component={"img"}
            src={pool.tokens[1].icon}
            sx={{
              height: {
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
        <Tooltip title="During the initial phase of the DEX (May 7-July 7), APR earned during this period will be doubled. The doubled APR will be paid out as a vested, claimable airdrop at the end of this period.">
          <Box
            sx={{
              width: "100%",
              mt: 1,
              border: "1px solid #E2621B",
              display: "flex",
              alignItems: "center",
              padding: 1,
              cursor: "help",
              borderRadius: "0.5rem",
              justifyContent: "space-between",
              background:
                "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
            }}
          >
            <Info />
            <Typography
              sx={{
                color: "#FFF",
                fontSize: "0.7rem",
                fontWeight: 700,
                lineHeight: "140%",
              }}
            >
              This pool is qualified for the PHO Airdrop.
            </Typography>
          </Box>
        </Tooltip>
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
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Input
          placeholder="Search"
          onChange={(e: any) => setSearchValue(e.target.value)}
          sx={{
            width: "100%",
            mr: 2,
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
        <FormControl
          sx={{
            minWidth: "180px",
          }}
        >
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
      </Box>
      <Grid container spacing={2}>
        {pools.map((pool, index) => {
          if (filter === "ALL" || (filter === "MY" && pool.userLiquidity > 0)) {
            return (
              <PoolItem
                key={index}
                filter={filter}
                onAddLiquidityClick={() => onAddLiquidityClick(pool)}
                onShowDetailsClick={onShowDetailsClick}
                pool={pool}
              />
            );
          }
          return null;
        })}
      </Grid>
    </Box>
  );
};

export { Pools };
