import { Box, Grid, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const Tile = ({
  isMobile
}: {
  isMobile: boolean;
}) => {
  return (
    <Box
      sx={{
        borderRadius: "24px",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%) ",
        padding: "1rem 1.5rem",
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Skeleton variant="text" sx={{ fontSize: '2rem', minWidth: "150px" }} />
      </Box>
      <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "150px" }} />
    </Box>
  );
};

const MainStats = () => {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));

  const HelloMsg = () => (
    <Box>
      <Skeleton variant="text" sx={{ fontSize: '2.5rem', minWidth: "100px" }} />
       <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "120px" }} />
    </Box>
  );

  if (largerThenMd) {
    return (
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <HelloMsg />
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Tile isMobile={false} />
          <Tile isMobile={false} />
          <Tile isMobile={false} />
        </Box>
      </Box>
    );
  } else {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HelloMsg />
        </Grid>
        <Grid item xs={6}>
            <Tile isMobile={true} />
          </Grid>
          <Grid item xs={6}>
            <Tile isMobile={true} />
          </Grid>
          <Grid item xs={6}>
            <Tile isMobile={true} />
          </Grid>
      </Grid>
    );
  }
};

export default MainStats;
