import React from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const typoStyle = {
  fontSize: "0.875rem",
  fontWeight: 700,
  lineHeight: "140%",
};

interface Token {
  name: string;
  symbol: string;
  icon: string;
}

interface Entry {
  fromToken: {
    token: Token;
    amount: string;
  };
  toToken: {
    token: Token;
    amount: string;
  };
  date: string;
  onClick: () => void;
  txHash: string;
}

const TradeEntry = ({ entry, mobile }: { entry: Entry; mobile: boolean }) => (
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
    <Grid item xs={8} md={2}>
      <Box
        sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}
      >
        <Typography sx={typoStyle}>{entry.date}</Typography>
      </Box>
    </Grid>
    <Grid item xs={4} md={3}>
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Box
          component="img"
          width={32}
          maxWidth={"100%"}
          mr={1}
          src={entry.fromToken.token.icon}
        />
        <Typography sx={typoStyle}>
          {entry.fromToken.amount} {entry.fromToken.token.symbol}
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={4} md={3}>
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Box
          component="img"
          width={32}
          maxWidth={"100%"}
          mr={1}
          src={entry.toToken.token.icon}
        />
        <Typography sx={typoStyle}>
          {entry.toToken.amount} {entry.toToken.token.symbol}
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={6} md={2}>
      <Box sx={{ display: "flex", alignItems: "center", height: "100%", cursor: "pointer" }}>
        <Typography
          sx={{
            ...typoStyle,
            textDecoration: "underline",
            textDecorationStyle: "dotted",
          }}
          onClick={entry.onClick}
        >
          {entry.txHash.slice(0, 6)}...{entry.txHash.slice(-4)}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const TradeHistory = ({ entries }: { entries: Entry[] }) => {
  const theme = useTheme();
  const largerThenSm = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Box>
      {largerThenSm && (
        <Grid container sx={{ px: 2, pb: 1 }}>
          <Grid item xs={2}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>Date</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>From</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>To</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
              TX Hash
            </Typography>
          </Grid>
        </Grid>
      )}
      {entries.length > 0 ? (
        entries.map((entry, index) => (
          <TradeEntry mobile={!largerThenSm} entry={entry} key={index} />
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

export default TradeHistory;
