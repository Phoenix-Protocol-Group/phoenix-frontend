import React from "react";
import { Box, Grid, Typography, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import {
  DashboardStatsProps,
  GainerOrLooserAsset,
} from "@phoenix-protocol/types";
import { ArrowUpward } from "@mui/icons-material";

/**
 * GainerAndLooser
 * Displays the details of a top gainer or loser asset.
 *
 * @param {Object} props
 * @param {string} props.title - The title ("Top Gainer" or "Top Loser").
 * @param {GainerOrLooserAsset} props.asset - The asset details.
 * @param {boolean} props.loading - Indicates if the component is in loading state.
 * @returns {JSX.Element} The gainer or loser component.
 */
const GainerAndLooser = ({
  title,
  asset,
  loading = false,
}: {
  title: string;
  asset?: GainerOrLooserAsset;
  loading?: boolean;
}) => {
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
        }}
      >
        {loading ? (
          <>
            <Skeleton
              variant="text"
              width={100}
              height={24}
              sx={{ bgcolor: "var(--neutral-700, #404040)" }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton
                variant="circular"
                width={32}
                height={32}
                sx={{ bgcolor: "var(--neutral-700, #404040)" }}
              />
              <Skeleton
                variant="text"
                width={100}
                height={24}
                sx={{ bgcolor: "var(--neutral-700, #404040)" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: 2,
              }}
            >
              <Skeleton
                variant="text"
                width={60}
                height={32}
                sx={{ bgcolor: "var(--neutral-700, #404040)" }}
              />
              <Skeleton
                variant="text"
                width={60}
                height={24}
                sx={{ bgcolor: "var(--neutral-700, #404040)" }}
              />
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                position: "absolute",
                top: "-10%",
                right: "-10%",
                width: "120px",
                height: "120px",
                opacity: 0.1,
                background: `url(${asset?.icon}) center / contain no-repeat`,
                filter: "grayscale(100%)",
              }}
            />
            <Typography
              sx={{
                color: "var(--neutral-300, #D4D4D4)",
                fontFamily: "Ubuntu",
                fontSize: "12px",
                fontWeight: 500,
                textTransform: "uppercase",
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  width: "32px",
                  height: "32px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  background: "var(--neutral-700, #404040)",
                }}
              >
                <Box
                  sx={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    background: `url(${asset?.icon}) transparent 50% / cover no-repeat`,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  color: "var(--neutral-50, #FAFAFA)",
                  fontFamily: "Ubuntu",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {asset?.name}
              </Typography>
              <Typography
                sx={{
                  color: "var(--neutral-400, #A3A3A3)",
                  fontFamily: "Ubuntu",
                  fontSize: "12px",
                  fontWeight: 400,
                }}
              >
                {asset?.symbol}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  color: "var(--neutral-50, #FAFAFA)",
                  fontFamily: "Ubuntu",
                  fontSize: "24px",
                  fontWeight: 700,
                }}
              >
                {asset?.price}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color:
                    asset?.change && asset?.change > 0 ? "#66BB6A" : "#E57373",
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
                    transform:
                      asset?.change && asset.change > 0
                        ? "rotate(0deg)"
                        : "rotate(180deg)",
                  }}
                >
                  <ArrowUpward sx={{ fontSize: "inherit" }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "Ubuntu",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  {asset?.change && asset.change > 0
                    ? `+${asset.change}`
                    : asset?.change}
                  %
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </motion.div>
  );
};

/**
 * DashboardStats
 * Displays the dashboard statistics, including the top gainer and loser.
 *
 * @param {DashboardStatsProps} props - Contains data for gainer and loser.
 * @returns {JSX.Element} The dashboard statistics component.
 */
const DashboardStats = ({ gainer, loser }: DashboardStatsProps) => {
  const isLoading = !gainer || !loser;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <GainerAndLooser
          title="Top Gainer (24h)"
          asset={gainer}
          loading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <GainerAndLooser
          title="Top Loser (24h)"
          asset={loser}
          loading={isLoading}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
