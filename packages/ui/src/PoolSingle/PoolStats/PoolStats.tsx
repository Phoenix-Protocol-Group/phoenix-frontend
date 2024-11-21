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
          padding: "24px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px",
          position: "relative",
          borderRadius: "12px",
          border: "1px solid var(--Secondary-S4, #2C2C31)",
          background:
            "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            color: "var(--Secondary-S2-2, #BDBEBE)",
            fontFamily: "Ubuntu",
            fontSize: "12px",
            fontWeight: 700,
            lineHeight: "140%",
          }}
        >
          {title.toUpperCase()}
        </Typography>
        <Typography
          sx={{
            color: "var(--Secondary-S2, #FFF)",
            fontFamily: "Ubuntu",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "140%",
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
