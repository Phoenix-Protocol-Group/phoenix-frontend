import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import {
  DashboardStatsProps,
  GainerOrLooserAsset,
} from "@phoenix-protocol/types";

/**
 * GainerAndLooser
 * Displays the details of a top gainer or loser asset.
 *
 * @param {Object} props
 * @param {string} props.title - The title ("Top Gainer" or "Top Loser").
 * @param {GainerOrLooserAsset} props.asset - The asset details.
 * @returns {JSX.Element} The gainer or loser component.
 */
const GainerAndLooser = ({
  title,
  asset: { name, symbol, price, change, icon },
}: {
  title: string;
  asset: GainerOrLooserAsset;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    <Box
      sx={{
        borderRadius: "12px",
        padding: "1.5rem",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        backdropFilter: "blur(42px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "#FFFFFF",
          opacity: 0.9,
          mb: "1rem",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: "1rem",
        }}
      >
        <Box
          component="img"
          src={icon}
          alt={`${name} Icon`}
          sx={{
            width: "40px",
            height: "40px",
            marginRight: "1rem",
          }}
        />
        <Box>
          <Typography
            sx={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            {name}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {symbol}
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "#FFFFFF",
        }}
      >
        ${price}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          Change (24h)
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: change > 0 ? "#5BFF22" : "#FF2255",
          }}
        >
          <Box
            component="img"
            src={change > 0 ? "/green-arrow.svg" : "/red-arrow.svg"}
            alt="Change Arrow"
            sx={{
              width: "16px",
              height: "16px",
              marginRight: "0.5rem",
              transform: change > 0 ? "none" : "rotate(180deg)",
            }}
          />
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {change}%
          </Typography>
        </Box>
      </Box>
    </Box>
  </motion.div>
);

/**
 * DashboardStats
 * Displays the dashboard statistics, including the top gainer and loser.
 *
 * @param {DashboardStatsProps} props - Contains data for gainer and loser.
 * @returns {JSX.Element} The dashboard statistics component.
 */
const DashboardStats = ({ gainer, loser }: DashboardStatsProps) => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        borderRadius: "16px",
        padding: "2rem",
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <GainerAndLooser title="Top Gainer" asset={gainer} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <GainerAndLooser title="Top Loser" asset={loser} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats;
