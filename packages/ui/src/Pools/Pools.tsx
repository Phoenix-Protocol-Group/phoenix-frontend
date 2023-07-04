import { Box, Button, Grid, Input, Typography } from "@mui/material";
import React from "react";
import { Button as CustomButton } from "../Button/Button";

export interface Token {
  name: string;
  icon: string;
  usdValue: number;
  amount: number;
  category: string;
}

export interface Pool {
  tokens: Token[];
  tvl: string;
  maxApr: string;
}

const descriptionHeader = {
  color: "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
  fontSize: "14px",
  lineHeight: "140%"
};

const descriptionContent = {
  color: "#FFF",
  fontSize: "18px",
  fontWeight: 700,
  lineHeight: "140%",
  textAlign: "right"
};

const FilterButton = ({
  label,
  selected,
}: {
  label: string;
  selected: boolean;
}) => {
  return (
    <Button
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

const PoolItem = ({ pool }: { pool: Pool }) => {
  return (
    <Grid item xs={3}>
      <Box
        sx={{
          padding: "16px",
          borderRadius: "8px",
          background:
            "linear-gradient(180deg, #292B2C 0%, #222426 100%), #242529",
        }}
      >
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "12px",
          marginLeft: "5px"
        }}>
          <Box
            component={"img"}
            src={pool.tokens[0].icon}
            sx={{
              width: "64px"
            }}
          />
          <Box
            component={"img"}
            src={pool.tokens[1].icon}
            sx={{
              width: "64px",
              position: "relative",
              left: "-10px"
            }}
          />
        </Box>
        <Typography
          sx={{
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          {`${pool.tokens[0].name} - ${pool.tokens[1].name}`}
        </Typography>

        <Grid container rowSpacing={1} sx={{
          marginBottom: "24px"
        }}>
          <Grid item xs={6}>
            <Typography sx={descriptionHeader}> 
              TVL
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={descriptionContent}> 
              {pool.tvl}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={descriptionHeader}> 
              Max APR
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={descriptionContent}> 
              {pool.maxApr}
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={8}>
            <CustomButton label="Add liquidity" type="primary" size="small" />
          </Grid>
          <Grid item xs={4}>
            <CustomButton label="Details" type="secondary" size="small" />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

const Pools = ({ items }: { items: Pool[] }) => {
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <Box>
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
          <FilterButton label="All Pools" selected={true} />
        </Grid>
        <Grid item>
          <FilterButton label="All Pools" selected={false} />
        </Grid>
      </Grid>
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
      <Grid container spacing={2} sx={{
        overflow: "scroll"
      }}>
        {items.map((item) => (
          <PoolItem pool={item} />
        ))}
      </Grid>
    </Box>
  );
};

export { Pools };
