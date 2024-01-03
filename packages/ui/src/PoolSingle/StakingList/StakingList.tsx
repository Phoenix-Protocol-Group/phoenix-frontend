import React from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { StakingListEntry as Entry } from "@phoenix-protocol/types";

const typoStyle = {
  fontSize: "0.875rem",
  fontWeight: 700,
  lineHeight: "140%",
};

const StakingEntry = ({ entry, mobile }: { entry: Entry; mobile: boolean }) => (
  <Grid
    container
    sx={{
      borderRadius: "0.5rem",
      background:
        "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
      padding: "1rem",
      marginBottom: 1,
    }}
  >
    <Grid item xs={8} md={3}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box
          component="img"
          width={32}
          maxWidth={"100%"}
          src="/cryptoIcons/poolIcon.png"
        />
        <Typography sx={typoStyle}>{entry.title}</Typography>
      </Box>
    </Grid>
    <Grid item xs={4} md={2}>
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Typography sx={typoStyle}>
          {entry.apr} {mobile && "APR"}
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={6} md={2}>
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Typography sx={typoStyle}>
          {mobile && "Locked: "}
          {entry.lockedPeriod}
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={6} md={4}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography sx={typoStyle}>{entry.amount.tokenAmount}</Typography>
        <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
          ${entry.amount.tokenValueInUsd}
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={12} md={1}>
      <IconButton
        aria-label="actions"
        id="long-button"
        aria-haspopup="true"
        sx={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
        }}
        onClick={entry.onClick}
      >
        <Box component="img" src="/sliders.svg" />
        {mobile && (
          <Typography sx={{ opacity: "0.7", fontSize: "0.75rem" }}>
            Manage{" "}
          </Typography>
        )}
      </IconButton>
    </Grid>
  </Grid>
);

const StakingList = ({ entries }: { entries: Entry[] }) => {
  const theme = useTheme();
  const largerThenSm = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Box>
      {largerThenSm && (
        <Grid container sx={{ px: 2, pb: 1 }}>
          <Grid item xs={3}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
              Asset
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>APR</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
              Locked Period
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
              Amount
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
              Actions
            </Typography>
          </Grid>
        </Grid>
      )}
      {entries.length > 0 ? (
        entries.map((entry, index) => (
          <StakingEntry mobile={!largerThenSm} entry={entry} key={index} />
        ))
      ) : (
        <Typography
          sx={{ ...typoStyle, textAlign: "center", opacity: 0.5, mt: 2 }}
        >
          No stakes
        </Typography>
      )}
    </Box>
  );
};

export default StakingList;
