import { Box, Divider, Grid, Skeleton } from "@mui/material";
import React from "react";

const GlowingChart = () => (
  <Skeleton variant="rectangular" width="100%" height={200} />
);

const LabTabs = () => {
  const buttonStyles = {
    display: "flex",
    height: "2.5rem",
    padding: "0rem 0.75rem",
    borderRadius: "0.5rem",
    textTransform: "none",
    color: "white",
    fontWeight: 700,
    fontSize: "0.875rem",
    background: "none",
    boxShadow: "none",
    "&:hover": {
      background: "#37373D",
      boxShadow: "none",
    },
  };

  return (
    <Box
      sx={{ width: "100%", typography: "body1", mt: 1.8, paddingBottom: "8px" }}
    >
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Skeleton
          variant="rounded"
          width={100}
          height={40}
          sx={{ marginBottom: "18px", marginRight: "16px" }}
        />
        <Skeleton
          variant="rounded"
          width={110}
          height={40}
          sx={{ marginBottom: "18px" }}
        />
      </Box>

      <Skeleton
        variant="rounded"
        width="100%"
        height={86}
        sx={{ borderRadius: "16px", marginBottom: "8px" }}
      />
      <Skeleton
        variant="rounded"
        width="100%"
        height={86}
        sx={{ borderRadius: "16px", marginBottom: "8px" }}
      />
      <Skeleton
        variant="rounded"
        width="100%"
        height={56}
        sx={{ borderRadius: "16px" }}
      />
    </Box>
  );
};

const PoolLiquidity = () => {
  return (
    <Box
      sx={{
        borderRadius: "0.5rem",
        background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px",
        }}
      >
        <Skeleton variant="circular" sx={{ height: "4rem", width: "4rem" }} />
        <Skeleton
          variant="circular"
          sx={{ ml: -1, height: "4rem", width: "4rem" }}
        />
      </Box>
      <Divider />
      <Box padding="16px">
        <Skeleton
          variant="text"
          sx={{ fontSize: "2rem", maxWidth: "120px", marginBottom: "8px" }}
        />
        <GlowingChart />
        <Grid container>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box>
                <Skeleton
                  height="48px"
                  sx={{ fontSize: "1rem", minWidth: "80px" }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box>
                <Skeleton
                  height="48px"
                  sx={{ fontSize: "1rem", minWidth: "80px" }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box>
                <Skeleton
                  height="48px"
                  sx={{ fontSize: "1rem", minWidth: "80px" }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <LabTabs />
      </Box>
    </Box>
  );
};

export default PoolLiquidity;
