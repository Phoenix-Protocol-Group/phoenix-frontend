import { Box, Grid, IconButton, Typography } from "@mui/material";

const typoStyle = {
  fontSize: "0.875rem",
  fontWeight: 700,
  lineHeight: "140%",
};

interface Entry {
  icon: string;
  title: string;
  apr: string;
  lockedPeriod: string;
  amount: {
    tokenAmount: string;
    tokenValueInUsd: string;
  };
  onClick: () => void;
}

const StakingEntry = ({ entry }: { entry: Entry }) => (
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
    <Grid item xs={3}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box component="img" src="cryptoIcons/btc.svg" />
        <Typography sx={typoStyle}>{entry.title}</Typography>
      </Box>
    </Grid>
    <Grid item xs={2}>
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Typography sx={typoStyle}>{entry.apr}</Typography>
      </Box>
    </Grid>
    <Grid item xs={2}>
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Typography sx={typoStyle}>{entry.lockedPeriod}</Typography>
      </Box>
    </Grid>
    <Grid item xs={4}>
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
    <Grid item xs={1}>
      <IconButton
        aria-label="actions"
        id="long-button"
        aria-haspopup="true"
        sx={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          borderRadius: "8px",
        }}
        onClick={entry.onClick}
      >
        <Box component="img" src="sliders.svg" />
      </IconButton>
    </Grid>
  </Grid>
);

const StakingList = ({ entries }: { entries: Entry[] }) => {
  return (
    <Box>
      <Grid container sx={{ px: 2, pb: 1 }}>
        <Grid item xs={3}>
          <Typography sx={{ ...typoStyle, fontWeight: 400 }}>Asset</Typography>
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
          <Typography sx={{ ...typoStyle, fontWeight: 400 }}>Amount</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
            Actions
          </Typography>
        </Grid>
      </Grid>
      {entries.map((entry, index) => (
        <StakingEntry entry={entry} key={index} />
      ))}
    </Box>
  );
};

export default StakingList;
