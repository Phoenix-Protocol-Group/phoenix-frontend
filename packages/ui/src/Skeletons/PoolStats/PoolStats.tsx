import { Box, Grid, Skeleton, Typography } from "@mui/material";

const PoolStatsBox = () => {
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
          <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "40px" }} />
          <Skeleton variant="text" sx={{ fontSize: '1.5rem', minWidth: "60px" }} />
        </Box>
      </Box>
    </Grid>
  );
};

const PoolStats = () => {
  return (
    <Grid container spacing={2}>
      <PoolStatsBox />
      <PoolStatsBox />
      <PoolStatsBox />
      <PoolStatsBox />
    </Grid>
  );
};

export default PoolStats;
