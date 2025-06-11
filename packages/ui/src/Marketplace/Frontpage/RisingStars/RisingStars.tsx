import React from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import RisingStarsCard from "./RisingStarsCard";
import { RisingStarCardProps, RisingStarsProps } from "@phoenix-protocol/types";
import { colors, spacing, typography } from "../../../Theme/styleConstants";
import { Star } from "@mui/icons-material";

const tabUnselectedStyles = {
  display: "flex",
  height: "36px",
  padding: "8px 16px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "12px",
  cursor: "pointer",
  background: "linear-gradient(145deg, #262626 0%, #1a1a1a 100%)",
  border: "1px solid #404040",
  color: "#A3A3A3",
  fontSize: "0.75rem",
  fontWeight: 600,
  fontFamily: "Ubuntu, sans-serif",
  transition: "all 0.3s ease",
  userSelect: "none",
  "&:hover": {
    background: "linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)",
    color: "#FAFAFA",
    borderColor: "#525252",
  },
};

const tabSelectedStyles = {
  background:
    "linear-gradient(145deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)",
  border: "1px solid #F97316",
  color: "#F97316",
  boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)",
  "&:hover": {
    background:
      "linear-gradient(145deg, rgba(249, 115, 22, 0.25) 0%, rgba(249, 115, 22, 0.15) 100%)",
    boxShadow: "0 6px 16px rgba(249, 115, 22, 0.3)",
  },
};

const RisingStars = (props: RisingStarsProps) => {
  const [ready, setReady] = React.useState<boolean>(false);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [entryLength, setEntryLength] = React.useState<number>(0);

  React.useEffect(() => {
    const handleResize = () => {
      if (isMdUp) {
        setEntryLength(9);
      } else {
        setEntryLength(8);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMdUp]);

  React.useEffect(() => {
    setReady(true);
  }, [props.entries]);

  return (
    <Box sx={{ mb: { xs: 4, md: 6 } }}>
      {/* Modern Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: { xs: 3, md: 4 },
          pb: 2,
          borderBottom: "1px solid rgba(64, 64, 64, 0.3)",
          gap: { xs: 2, md: 0 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: spacing.md }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.primary.main}20, ${colors.primary.dark}10)`,
              border: `1px solid ${colors.primary.main}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Star
              sx={{
                fontSize: "24px",
                color: colors.primary.main,
              }}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeights.bold,
                fontFamily: typography.fontFamily,
                lineHeight: 1.2,
                mb: spacing.xs,
              }}
            >
              Rising Stars{" "}
            </Typography>
            <Typography
              sx={{
                color: colors.neutral[400],
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily,
                fontWeight: typography.fontWeights.medium,
              }}
            >
              Collections with the highest percentage gains{" "}
            </Typography>
          </Box>
        </Box>

        {/* Time Period Tabs */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            width: { xs: "100%", md: "auto" },
          }}
        >
          {["6h", "1d", "7d", "30d"].map((period) => (
            <motion.div
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={
                  props.activeTime === period
                    ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                    : tabUnselectedStyles
                }
                onClick={() => props.setActiveTime(period as any)}
              >
                {period.toUpperCase()}
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {props.entries
          .slice(0, entryLength)
          .map((item: RisingStarCardProps, index: number) => (
            <Grid key={index} item xs={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <RisingStarsCard _onClick={props.onEntryClick} {...item} />
              </motion.div>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default RisingStars;
