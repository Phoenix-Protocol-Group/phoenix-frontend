import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

interface TileProps {
  title: string;
  value: string;
  link: string;
  isMobile?: boolean;
}

const Tile = ({ title, value, link, isMobile }: TileProps) => {
  const openInNewTab = () => {
    if (window) {
      window.open(link, "_blank")?.focus();
    }
  };

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
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: "-0.0625rem",
          }}
        >
          {value}
        </Typography>
        <Box
          sx={{ ml: isMobile ? "1rem" : "3.4rem", cursor: "pointer" }}
          component="img"
          src="arrow4.svg"
          onClick={() => openInNewTab()}
        />
      </Box>
      <Typography sx={{ fontSize: "0.875rem", opacity: 0.4 }}>
        {title}
      </Typography>
    </Box>
  );
};

interface MainStatsProps {
  stats: TileProps[];
}

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
          {stats.map((stat) => (
            <Tile {...stat} />
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
        {stats.map((stat) => (
          <Grid item xs={6}>
            <Tile {...stat} isMobile={true} />
          </Grid>
        ))}
      </Grid>
    );
  }
};

export default MainStats;
