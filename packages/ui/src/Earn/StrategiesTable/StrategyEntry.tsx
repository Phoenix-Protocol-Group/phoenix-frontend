import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Button } from "../../Button/Button";
import { Token } from "@phoenix-protocol/types";

type assetDisplay = {
  name: string;
  address: string;
  icon: string;
};

export interface StrategyEntryProps {
  asset: assetDisplay;
  name: string;
  tvl: number;
  apr: number;
  rewardToken: string;
  unbondTime: string;
  isMobile: boolean;
}

const BoxStyle = {
  p: 3,
  borderRadius: "12px",
  background: "var(--neutral-900, #171717)",
  border: "1px solid var(--neutral-700, #404040)",
  position: "relative",
  overflow: "hidden",
  boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  marginTop: "16px",
};

const StrategyEntry = ({
  name,
  tvl,
  apr,
  rewardToken,
  unbondTime,
  isMobile,
  asset,
}: StrategyEntryProps) => {
  return (
    <Box sx={BoxStyle}>
      <Box
        component="img"
        src={asset.icon}
        alt={name}
        sx={{
          position: "absolute",
          top: "50%",
          width: "20%",
          height: "auto",
          opacity: 0.1,
          transform: "translateY(-50%)",
          left: -40,
        }}
      />
      <Grid container alignItems="center" spacing={isMobile ? 1 : 3}>
        <Grid
          item
          xs={12}
          md={2}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <img src={asset.icon} alt={name} width={24} />
          <Typography
            sx={{
              color: "var(--neutral-300, #D4D4D4)", // Adjusted color
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "400",
              opacity: 0.6,
              marginLeft: "8px",
            }}
          >
            {asset.name}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography
            sx={{
              color: "var(--neutral-50, #FAFAFA)",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "500",
            }}
          >
            {name}
          </Typography>
        </Grid>
        <Grid item xs={12} md={1}>
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "400",
              color: "var(--neutral-300, #D4D4D4)",
            }}
          >
            {tvl}
          </Typography>
        </Grid>
        <Grid item xs={12} md={1}>
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "400",
              color: "var(--neutral-300, #D4D4D4)",
            }}
          >
            {apr}
          </Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "400",
              color: "var(--neutral-300, #D4D4D4)",
            }}
          >
            {rewardToken}
          </Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "400",
              color: "var(--neutral-300, #D4D4D4)",
            }}
          >
            {unbondTime}
          </Typography>
        </Grid>
        <Grid item xs={12} md={1} sx={{ textAlign: "right" }}>
          <Button type="secondary">Join</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StrategyEntry;
