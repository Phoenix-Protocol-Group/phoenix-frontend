import React from "react";
import { Box, Grid, Typography, Skeleton } from "@mui/material";
import { PoolStatsProps, PoolStatsBoxProps } from "@phoenix-protocol/types";
import { motion } from "framer-motion";

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid var(--neutral-700, #404040)",
          background: "var(--neutral-900, #171717)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          position: "relative",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.35)",
          },
        }}
      >
        <Typography
          sx={{
            color: "var(--neutral-300, #D4D4D4)",
            fontFamily: "Ubuntu",
            fontSize: "12px",
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          {title.toUpperCase()}
        </Typography>
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
    <Grid container spacing={3}>
      {stats.map((stat, key) => (
        <Grid item xs={12} sm={6} key={key}>
          <PoolStatsBox title={stat.title} value={stat.value} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PoolStats;
