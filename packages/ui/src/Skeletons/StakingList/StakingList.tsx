import {
  Box,
  Grid,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const typoStyle = {
  fontSize: "0.875rem",
  fontWeight: 700,
  lineHeight: "140%",
};

const StakingEntry = ({ mobile }: { mobile: boolean }) => (
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
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "60px"  }} />
      </Box>
    </Grid>
    <Grid item xs={4} md={2}>
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
      <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "40px" }} />
      </Box>
    </Grid>
    <Grid item xs={6} md={2}>
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
      <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "40px"  }} />
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
        <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: "80px"  }} />
      </Box>
    </Grid>
    <Grid item xs={12} md={1}>
      <Skeleton variant="rounded" width={36} height={36} />
    </Grid>
  </Grid>
);

const StakingList = () => {
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
      <StakingEntry mobile={!largerThenSm} />
      <StakingEntry mobile={!largerThenSm} />
      <StakingEntry mobile={!largerThenSm} />
      <StakingEntry mobile={!largerThenSm} />
      <StakingEntry mobile={!largerThenSm} />
    </Box>
  );
};

export default StakingList;
