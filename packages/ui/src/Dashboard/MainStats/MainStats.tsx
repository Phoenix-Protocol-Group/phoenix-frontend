import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import { MainStatsProps, TileProps } from "@phoenix-protocol/types";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  cardStyles,
} from "../../Theme/styleConstants";

const Tile = ({ title, value, link, isMobile }: TileProps) => {
  const openInNewTab = () => {
    if (window) {
      window.open(link, "_blank")?.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: spacing.lg,
          flexDirection: "column",
          alignItems: "flex-start",
          gap: spacing.md,
          position: "relative",
          borderRadius: borderRadius.xl,
          background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          backdropFilter: "blur(20px)",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: link ? "pointer" : "default",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, rgba(${colors.neutral[600].slice(
              1
            )}, 0.4), transparent)`,
          },
          "&:hover": {
            border: `1px solid ${colors.primary.main}`,
            background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
            boxShadow: `0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px ${colors.primary.main}`,
            "& .glow-effect": {
              opacity: 1,
            },
            "& .title-text": {
              color: colors.primary.light,
            },
          },
        }}
        onClick={link ? openInNewTab : undefined}
      >
        {/* Animated background glow */}
        <Box
          className="glow-effect"
          sx={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: `radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 50%)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />

        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Typography
            className="title-text"
            sx={{
              color: colors.neutral[400],
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeights.semiBold,
              lineHeight: 1.4,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              transition: "color 0.3s ease",
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          sx={{
            color: colors.neutral[50],
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize.xxl,
            fontWeight: typography.fontWeights.bold,
            lineHeight: 1.2,
            position: "relative",
            zIndex: 1,
            background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, rgba(255, 255, 255, 0.8) 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {value}
        </Typography>
      </Box>
    </motion.div>
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
