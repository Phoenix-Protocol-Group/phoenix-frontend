import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import {
  DashboardStatsProps,
  GainerOrLooserAsset,
} from "@phoenix-protocol/types";
import Image from "next/image";
import { ArrowUpward } from "@mui/icons-material";

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
      {/* Grey version of the icon as background */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "120px",
          height: "120px",
          opacity: 0.1,
          background: `url(${icon}) center / contain no-repeat`,
          filter: "grayscale(100%)",
        }}
      />

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            width: "32px",
            height: "32px",
            padding: "6px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "32px",
            background:
              "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
          }}
        >
          <Box
            sx={{
              width: "20px",
              height: "20px",
              flexShrink: 0,
              borderRadius: "4px",
              background: `url(${icon}) transparent 50% / cover no-repeat`,
            }}
          />
        </Box>
        <Typography
          sx={{
            color: "var(--Secondary-S2, #FFF)",
            fontFamily: "Ubuntu",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            color: "var(--Secondary-S2-2, #BDBEBE)",
            fontFamily: "Ubuntu",
            fontSize: "12px",
            fontWeight: 300,
            lineHeight: "140%",
          }}
        >
          {symbol}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            color: "var(--Secondary-S2, #FFF)",
            fontFamily: "Ubuntu",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          {price}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: change > 0 ? "#4CAF50" : "#F44336",
          }}
        >
          <Box
            component="span"
            sx={{
              width: "16px",
              height: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: change > 0 ? "rotate(0deg)" : "rotate(180deg)",
            }}
          >
            {/* Arrow Icon (up or down) */}
            <ArrowUpward sx={{ fontSize: "inherit" }} />
          </Box>
          <Typography
            sx={{
              fontFamily: "Ubuntu",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            {change > 0 ? `+${change}` : change}%
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
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <GainerAndLooser title="Top Gainer (24h)" asset={gainer} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <GainerAndLooser title="Top Loser (24h)" asset={loser} />
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
