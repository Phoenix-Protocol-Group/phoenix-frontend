import { Box, Grid, Skeleton, Typography } from "@mui/material";
import React from "react";

const AssetStat = () => (
  <Box
    sx={{
      borderRadius: "0.75rem",
      border: "1px solid rgba(255, 255, 255, 0.10)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        padding: "1.5rem 2rem",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          borderRadius: "0.5rem",
          padding: "0.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
      <Box sx={{ marginLeft: "1.5rem" }}>
      <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "90px" }}  />
      <Skeleton variant="text" sx={{ fontSize: '1.5rem', minWidth: "90px" }} />
      </Box>
    </Box>
  </Box>
);

const GainerAndLooser = () => (
  <Box>
    <Skeleton variant="text" sx={{ fontSize: '1.5rem', maxWidth:"120px" }} />
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginTop: "1rem",
        gap: 1,
      }}
    >
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "40px" }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "40px" }} />
    </Box>
    <Skeleton variant="text" sx={{ fontSize: '2rem', maxWidth:"120px" }} />
    <Box sx={{ display: "flex", gap: 4, marginTop: "1.5rem" }}>
      <Box>
      <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "60px" }} />
        <Box sx={{ display: "flex", gap: 1, marginTop: "0.5rem" }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" sx={{ fontSize: '1.5rem', minWidth: "60px" }} />
        </Box>
      </Box>
      <Box>
        <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "60px" }} />
        <Box sx={{ marginTop: "0.5rem" }}>
          <Skeleton variant="text" sx={{ fontSize: '1.5rem', minWidth: "60px" }} />
        </Box>
      </Box>
    </Box>
  </Box>
);

const DashboardStats = () => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        borderRadius: "1rem",
        padding: "2rem",
        height: "100%",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <AssetStat/>
        </Grid>
        <Grid item xs={12} md={6}>
          <AssetStat/>
        </Grid>
      </Grid>
      <Grid container sx={{ px: "1.6rem", mt: 3 }}>
        <Grid item xs={12} md={6} sx={{ padding: "1.2rem" }}>
          <GainerAndLooser />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            padding: "1.2rem 2.8rem",
            borderLeft: "1px solid rgba(255, 255, 255, 0.10)",
          }}
        >
          <GainerAndLooser />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats;
