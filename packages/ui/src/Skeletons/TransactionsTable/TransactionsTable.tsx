import { Box, Grid, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const TransactionHeader = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
    }}
  >
    <Skeleton variant="text" sx={{ fontSize: "18px", minWidth: "60px" }} />
  </Box>
);

const TransactionEntry = () => {
  const BoxStyle = {
    p: 2,
    borderRadius: "8px",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
  };

  return (
    <Box sx={{ ...BoxStyle, mb: 2 }}>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Skeleton
            variant="text"
            sx={{ fontSize: "18px", maxWidth: "80px" }}
          />
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            <Skeleton
              variant="text"
              sx={{ fontSize: "18px", width: "120px" }}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Skeleton
            variant="text"
            sx={{ fontSize: "18px", maxWidth: "60px" }}
          />
        </Grid>
        <Grid item xs={2}>
          <Skeleton
            variant="text"
            sx={{ fontSize: "18px", maxWidth: "60px" }}
          />
        </Grid>
        <Grid item xs={2}>
          <Skeleton
            variant="text"
            sx={{ fontSize: "18px", maxWidth: "70px" }}
          />
        </Grid>
        <Grid item xs={1}>
          <Skeleton
            variant="circular"
            sx={{ fontSize: "18px", maxWidth: "24px" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

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

  return (
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
          <Skeleton variant="rectangular" sx={{fontSize: "26px", minWidth: "48px", borderRadius: "1rem"}} />
        </Box>
      </Box>
      <Box sx={{ ...BoxStyle, mb: 2, minWidth: "700px" }}>
        <Grid container>
          <Grid item xs={2}>
            <TransactionHeader />
          </Grid>
          <Grid item xs={3}>
            <TransactionHeader />
          </Grid>
          <Grid item xs={2}>
            <TransactionHeader />
          </Grid>
          <Grid item xs={2}>
            <TransactionHeader />
          </Grid>
          <Grid item xs={2}>
            <TransactionHeader />
          </Grid>
          <Grid item xs={1}>
            <TransactionHeader />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ minWidth: "700px" }}>
        <TransactionEntry />
        <TransactionEntry />
        <TransactionEntry />
        <TransactionEntry />
        <TransactionEntry />
        <TransactionEntry />
        <TransactionEntry />
        <TransactionEntry />
        <TransactionEntry />
        <TransactionEntry />
      </Box>
    </Box>
  );
};

export default TransactionsTable;
