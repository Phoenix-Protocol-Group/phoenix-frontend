import { Box, Button, Grid, Input, Typography } from "@mui/material";
import React from "react";

const FilterButton = ({
  label,
  selected
}: {
  label: string;
  selected: boolean;
}) => {
  return (
    <Button sx={{
      borderRadius: "16px",
      border: selected ? "1px solid #E2491A" : "none",
      background: selected ? "rgba(226, 73, 26, 0.10)" : "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
      color: "white",
      padding: selected ? "7px 15px" : "8px 16px"
    }}>
      <Typography sx={{
        fontSize: "10px",
        fontWeight: 700,
        lineHeight: "20px"
      }}>
        {label}
      </Typography>
  </Button>
  );
};

const Pools = () => {
  const [searchValue, setSearchValue] = React.useState("");
  
  return (
    <Box>
      <Typography sx={{
        color: "#FFF",
        fontSize: "32px",
        fontWeight: 700,
        marginBottom: "16px"
      }}>
        Pools
      </Typography>
      <Grid container spacing={1} sx={{
        marginBottom: "24px"
      }}>
        <Grid item>
          <FilterButton label="All Pools" selected={true}/>
        </Grid>
        <Grid item>
          <FilterButton label="All Pools" selected={false}/>
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
    </Box>
  );
};

export { Pools }
