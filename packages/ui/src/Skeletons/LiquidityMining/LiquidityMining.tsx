import { useState } from "react";
import {
  Box,
  Button as MuiButton,
  Grid,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";

const StakeInput = () => {

  return (
    <>
      <Skeleton variant="rounded" width="100%" height={60} />
      <Grid container spacing={2} marginTop="-2px">
        <Grid item xs={3}>
          <Skeleton variant="rounded" width="100%" height={36} />
        </Grid>
        <Grid item xs={3}>
          <Skeleton variant="rounded" width="100%" height={36} />
        </Grid>
        <Grid item xs={3}>
          <Skeleton variant="rounded" width="100%" height={36} />
        </Grid>
        <Grid item xs={3}>
          <Skeleton variant="rounded" width="100%" height={36} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rounded" width="100%" height={40} sx={{marginBottom: "8px"}} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: "140px" }} />
        </Grid>
      </Grid>
    </>
  );
};

const ClaimRewards = () => {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Box
      sx={{
        borderRadius: "0.5rem",
        background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
        position: "relative",
        padding: "1rem",
        height: !largerThenMd ? "calc(100% + 44px)" : "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <Box>
        <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "80x" }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton variant="text" sx={{ fontSize: '1.2rem', minWidth: "100px" }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton variant="text" sx={{ fontSize: '1.2rem', minWidth: "100px" }} />
        </Box>
      </Box>
      <Skeleton variant="rounded" width="100%" height={44} />
    </Box>
  );
};

const LiquidityMining = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: "120px" }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: "160px" }} />
      </Grid>
      <Grid item xs={12} sm={8}>
        <StakeInput/>
      </Grid>
      <Grid item xs={12} sm={4}>
        <ClaimRewards />
      </Grid>
    </Grid>
  );
};

export default LiquidityMining;
