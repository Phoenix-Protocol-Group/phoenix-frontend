import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { PoolStatsProps, PoolStatsBoxProps } from "@phoenix-protocol/types";
import { motion } from "framer-motion";

/**
 * PoolStatsBox Component
 *
 * @component
 * @param {Object} props - The properties for the PoolStatsBox component.
 * @param {string} props.title - The title of the stats box.
 * @param {string | number} props.value - The value to display in the stats box.
 */
const PoolStatsBox = ({ title, value }: PoolStatsBoxProps) => {
  return (
    <Grid
      item
      xs={6}
      sm={3}
      component={motion.div}
      whileHover={{ scale: 1.05 }}
    >
      <Box
        sx={{
          padding: "0.625rem 1rem",
          borderRadius: "0.5rem",
          border: "1px solid #E2621B",
          display: "flex",
          alignItems: "center",
          minHeight: "5.5rem",
          background:
            "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Box>
          <Typography
            sx={{
              opacity: 0.7,
              fontSize: "0.875rem",
              lineHeight: "140%",
              transition: "color 0.3s ease-in-out",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.125rem",
              fontWeight: 700,
              lineHeight: "140%",
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

/**
 * PoolStats Component
 *
 * @component
 * @param {Object} props - The properties for the PoolStats component.
 * @param {Array} props.stats - Array of stat objects with title and value properties.
 */
const PoolStats = ({ stats }: PoolStatsProps) => {
  return (
    <Grid container spacing={2}>
      {stats.map((stat, key) => (
        <PoolStatsBox key={key} title={stat.title} value={stat.value} />
      ))}
    </Grid>
  );
};

export default PoolStats;
