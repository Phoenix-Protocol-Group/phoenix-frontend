import { Box, Grid, Skeleton } from "@mui/material";
import React from "react";

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

const PoolItemSkeleton = () => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
      <Box
        sx={{
          padding: "24px",
          borderRadius: "20px",
          background: "rgb(29, 31, 33)",
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Logos in the background with adjusted opacity and proper circle shape */}
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "60%",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Skeleton
            variant="circular"
            sx={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "60%",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Skeleton
            variant="circular"
            sx={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>

        {/* Pool Information with Icons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Skeleton
            variant="circular"
            sx={{
              width: "24px",
              height: "24px",
            }}
          />
          <Skeleton variant="text" sx={{ fontSize: "22px", width: "120px" }} />
          <Skeleton
            variant="circular"
            sx={{
              width: "24px",
              height: "24px",
            }}
          />
        </Box>

        <Grid container rowSpacing={1} sx={{ position: "relative", zIndex: 1 }}>
          <Grid item xs={6}>
            <Skeleton
              variant="text"
              sx={{ ...descriptionHeader, width: "60px" }}
            />
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Skeleton
              variant="text"
              sx={{ ...descriptionContent, width: "80px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <Skeleton
              variant="text"
              sx={{ ...descriptionHeader, width: "60px" }}
            />
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Skeleton
              variant="text"
              sx={{ ...descriptionContent, width: "80px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <Skeleton
              variant="text"
              sx={{ ...descriptionHeader, width: "60px" }}
            />
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Skeleton
              variant="text"
              sx={{ ...descriptionContent, width: "80px" }}
            />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

const Pools = () => {
  return (
    <Box sx={{ flex: 1 }}>
      <Skeleton
        variant="text"
        sx={{ fontSize: "32px", maxWidth: "160px", marginBottom: "16px" }}
      />
      <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
        <Grid item xs={9} md={10}>
          <Skeleton variant="rounded" width="100%" height={46} />
        </Grid>
        <Grid item xs={3} md={2}>
          <Skeleton variant="rounded" width="100%" height={46} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {Array.from(new Array(8)).map((_, index) => (
          <PoolItemSkeleton key={index} />
        ))}
      </Grid>
    </Box>
  );
};

export { Pools };
