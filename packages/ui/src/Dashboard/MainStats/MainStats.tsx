import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { MainStatsProps, TileProps } from "@phoenix-protocol/types";

const Tile = ({ title, value, link, isMobile }: TileProps) => {
  const openInNewTab = () => {
    if (window) {
      window.open(link, "_blank")?.focus();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        padding: "24px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        position: "relative",
        borderRadius: "12px",
        border: "1px solid var(--neutral-700, #404040)",
        background: "var(--neutral-900, #171717)",
        overflow: "hidden",
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography
          sx={{
            color: "var(--neutral-300, #D4D4D4)",
            fontFamily: "Ubuntu",
            fontSize: "12px",
            fontWeight: 700,
            lineHeight: "140%",
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        sx={{
          color: "var(--neutral-50, #FAFAFA)",
          fontFamily: "Ubuntu",
          fontSize: "24px",
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const MainStats = ({ stats }: MainStatsProps) => {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));

  const HelloMsg = () => (
    <Box>
      <Typography sx={{ fontSize: "2rem", fontWeight: "700" }}>
        Hello 👋
      </Typography>
      <Typography sx={{ fontSize: "0.875rem", opacity: "0.4" }}>
        Here are your main stats.
      </Typography>
    </Box>
  );

  if (largerThenMd) {
    return (
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <HelloMsg />
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {stats.map((stat, key) => (
            <Tile key={key} {...stat} />
          ))}
        </Box>
      </Box>
    );
  } else {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HelloMsg />
        </Grid>
        {stats.map((stat, key) => (
          <Grid key={key} item xs={6}>
            <Tile {...stat} isMobile={true} />
          </Grid>
        ))}
      </Grid>
    );
  }
};

export { MainStats, Tile };
