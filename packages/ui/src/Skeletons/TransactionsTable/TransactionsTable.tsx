import { Box, Grid, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const TransactionsTable = () => {
  const tabUnselectedStyles = {
    display: "flex",
    width: "2.75rem",
    height: "2.3125rem",
    padding: "1.125rem 1.5rem",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.625rem",
    borderRadius: "1rem",
    cursor: "pointer",
    background:
      "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
    color: "#FFF",
    opacity: 0.6,
    textAlign: "center",
    fontFeatureSettings: "'clig' off, 'liga' off",
    fontFamily: "Ubuntu",
    fontSize: "0.625rem",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "1.25rem", // 200%
  };

  const BoxStyle = {
    p: 2,
    borderRadius: "8px",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
  };

  <Box
      sx={{
        mt: 2,
        p: 3,
        borderRadius: 3,
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          mb: 2,
          minWidth: { xs: "80vw", md: "700px" },
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
          <Box
            sx={tabUnselectedStyles}
          >
            All
          </Box>
        </Box>
      </Box>
      <Box sx={{ ...BoxStyle, mb: 2, minWidth: "700px" }}>
        <Grid container>
          <Grid item xs={2}>
            foo
          </Grid>
          <Grid item xs={3}>
          foo
          </Grid>
          <Grid item xs={2}>
          foo
          </Grid>
          <Grid item xs={2}>
          foo
          </Grid>
          <Grid item xs={2}>
          foo
          </Grid>
          <Grid item xs={1}>
          foo
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ minWidth: "700px" }}>
        entries
      </Box>
    </Box>
};

const ListItem = () => {
  return (
    <Box
      sx={{
        borderTop: "1px solid #F0F3F61A",
        py: "1.3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton
          variant="text"
          sx={{ fontSize: "1.2rem", minWidth: "160px" }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Skeleton
          variant="text"
          sx={{ fontSize: "1.2rem", marginRight: "16px", minWidth: "70px" }}
        />
        <Skeleton variant="rounded" width={24} height={24} />
      </Box>
    </Box>
  );
};

export default TransactionsTable;
