import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { PoolStatsProps, PoolStatsBoxProps } from "@phoenix-protocol/types";

const PoolStatsBox = ({ title, value }: PoolStatsBoxProps) => {
  return (
    <Grid item xs={6} sm={3}>
      <Box
        sx={{
          padding: "0.625rem 1rem",
          borderRadius: "0.5rem",
          border: "1px solid #E2621B",
          display: "flex",
          alignItems: "center",
          minHeight: "5.5rem",
          background:
            "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
        }}
      >
        <Box>
          <Typography
            sx={{
              opacity: 0.7,
              fontSize: "0.875rem",
              lineHeight: "140%",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.125rem",
              fontWeight: 700,
              lineHeight: "140%",
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

const PoolStats = ({ stats }: PoolStatsProps) => {
  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <PoolStatsBox title={stat.title} value={stat.value} />
      ))}
    </Grid>
  );
};

export default PoolStats;
