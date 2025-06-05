import React from "react";
import { Box, Grid, Typography, Skeleton } from "@mui/material";
import { PoolStatsProps, PoolStatsBoxProps } from "@phoenix-protocol/types";
import { motion } from "framer-motion";
import { colors } from "../../Theme/styleConstants";

/**
 * PoolStatsBox Component
 *
 * @component
 * @param {Object} props - The properties for the PoolStatsBox component.
 * @param {string} props.title - The title of the stats box.
 * @param {string | number} props.value - The value to display in the stats box.
 * @param {boolean} props.loading - Indicates if the component is in loading state.
 */
const PoolStatsBox = ({ title, value }: PoolStatsBoxProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
          p: 3,
          borderRadius: "20px",
          background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
          },
        }}
      >
        {/* Animated glow effect */}
        <Box
          sx={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: `radial-gradient(circle, ${colors.neutral[700]}1A 0%, transparent 50%)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
            ".MuiBox-root:hover &": {
              opacity: 1,
            },
          }}
        />

        <Typography
          sx={{
            color: colors.neutral[400],
            fontFamily: "Ubuntu, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            position: "relative",
            zIndex: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#FFFFFF",
            fontFamily: "Ubuntu, sans-serif",
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 700,
            lineHeight: 1.2,
            position: "relative",
            zIndex: 1,
            background:
              "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)",
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

/**
 * PoolStats Component
 *
 * @component
 * @param {Object} props - The properties for the PoolStats component.
 * @param {Array} props.stats - Array of stat objects with title and value properties.
 * @param {boolean} props.loading - Indicates if the component is in loading state.
 */
const PoolStats = ({ stats }: PoolStatsProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1.25rem", md: "1.5rem" },
            fontWeight: 700,
            mb: 3,
            background:
              "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Ubuntu, sans-serif",
          }}
        >
          Pool Statistics
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {stats.map((stat, key) => (
          <Grid item xs={12} sm={6} key={key}>
            <PoolStatsBox title={stat.title} value={stat.value} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PoolStats;
