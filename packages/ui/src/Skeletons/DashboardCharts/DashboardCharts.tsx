import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const GlowingChart = () => (
  <Skeleton variant="rectangular" width="100%" height={250} />
);

const DashboardPriceCharts = () => {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Box
      sx={{
        height: "26rem",
        borderRadius: "24px",
        position: "relative",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: "1.2rem" }}>
        <Box
          sx={{
            display: largerThenMd ? "block" : "flex",
            justifyContent: largerThenMd ? "normal" : "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              p: "0.6rem",
              display: "inline-flex",
              borderRadius: "8px",
              justifyContent: "center",
              alignItems: "center",
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
            }}
          >
            <Skeleton variant="circular" width="1.25rem" height="1.25rem" />
          </Box>
        </Box>
        <Skeleton
          variant="text"
          sx={{ fontSize: "1.5rem", maxWidth: "80px" }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton
            variant="text"
            sx={{ fontSize: "2rem", minWidth: "120px" }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      ></Box>
      <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <GlowingChart />
      </Box>
    </Box>
  );
};

export default DashboardPriceCharts;
