import {
  Box,
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
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

const PoolItem = () => {
  return (
    <Grid item xs={6} md={3}>
      <Box
        sx={{
          padding: "16px",
          borderRadius: "8px",
          background:
            "linear-gradient(180deg, #292B2C 0%, #222426 100%), #242529",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "12px",
            marginLeft: "5px",
          }}
        >
          <Skeleton variant="circular" sx={{
              width: {
                xs: "48px",
                md: "64px",
              },
              height: {
                xs: "48px",
                md: "64px",
              },
            }}/>
          <Skeleton variant="circular" sx={{
              width: {
                xs: "48px",
                md: "64px",
              },
              height: {
                xs: "48px",
                md: "64px",
              },
            }}/>
        </Box>
        <Skeleton variant="text" sx={{ fontSize: '18px', minWidth: "120px" }} />

        <Grid
          container
          rowSpacing={1}
          columnSpacing={2}
          sx={{
            marginBottom: "24px",
          }}
        >
          <Grid item xs={6}>
            <Skeleton variant="text" sx={{ fontSize: '16px', minWidth: "60px" }} />
          </Grid>
          <Grid item xs={6}>
          <Skeleton variant="text" sx={{ fontSize: '16px', minWidth: "80px" }} />
          </Grid>
          <Grid item xs={6}>
          <Skeleton variant="text" sx={{ fontSize: '16px', minWidth: "60px" }} />
          </Grid>
          <Grid item xs={6}>
          <Skeleton variant="text" sx={{ fontSize: '16px', minWidth: "80px" }} />
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item xs={12} md={7}>
            <Skeleton variant="rounded" width={90} height={40} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rounded" width={90} height={40} />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

const Pools = () => {
  return (
    <Box>
      <Skeleton variant="text" sx={{ fontSize: '36px', maxWidth: "160px" }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', width: "100px", marginBottom: "16px" }} />
      <Grid container spacing={1}>
        <Grid item xs={7} md={10}>
        <Skeleton variant="rounded" width="100%" height={30} sx={{
          marginBottom: "16px"
        }} />
        </Grid>
        <Grid item xs={5} md={2}>
          <Skeleton variant="rounded" sx={{ height: '30px', width: "100%" }} />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          overflow: "scroll",
        }}
      >
        <PoolItem/>
        <PoolItem/>
        <PoolItem/>
        <PoolItem/>
        <PoolItem/>
        <PoolItem/>
        <PoolItem/>
        <PoolItem/>
        <PoolItem/>
        <PoolItem/>
        <PoolItem/>
        <PoolItem/>
      </Grid>
    </Box>
  );
};

export { Pools };
