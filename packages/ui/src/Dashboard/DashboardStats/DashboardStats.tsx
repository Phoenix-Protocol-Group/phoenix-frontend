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
          gap: "16px",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid var(--Secondary-S4, #2C2C31)",
          background:
            "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%))",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
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
              height={28}
              sx={{ bgcolor: "var(--Secondary-S4, #2C2C31)" }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ bgcolor: "var(--Secondary-S4, #2C2C31)" }}
              />
              <Skeleton
                variant="text"
                width={120}
                height={28}
                sx={{ bgcolor: "var(--Secondary-S4, #2C2C31)" }}
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
                width={80}
                height={40}
                sx={{ bgcolor: "var(--Secondary-S4, #2C2C31)" }}
              />
              <Skeleton
                variant="text"
                width={80}
                height={28}
                sx={{ bgcolor: "var(--Secondary-S4, #2C2C31)" }}
              />
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                position: "absolute",
                top: "-15%",
                right: "-15%",
                width: "140px",
                height: "140px",
                opacity: 0.1,
                background: `url(${asset?.icon}) center / contain no-repeat`,
                filter: "grayscale(100%)",
              }}
            />
            <Typography
              sx={{
                color: "var(--Secondary-S2-2, #BDBEBE)",
                fontFamily: "Ubuntu",
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  width: "40px",
                  height: "40px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  background:
                    "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%))",
                }}
              >
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "4px",
                    background: `url(${asset?.icon}) transparent 50% / cover no-repeat`,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  color: "var(--Secondary-S2, #FFF)",
                  fontFamily: "Ubuntu",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                {asset?.name}
              </Typography>
              <Typography
                sx={{
                  color: "var(--Secondary-S2-2, #BDBEBE)",
                  fontFamily: "Ubuntu",
                  fontSize: "14px",
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
                  color: "var(--Secondary-S2, #FFF)",
                  fontFamily: "Ubuntu",
                  fontSize: "28px",
                  fontWeight: 700,
                }}
              >
                {asset?.price}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color:
                    asset?.change && asset?.change > 0 ? "#4CAF50" : "#F44336",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: "20px",
                    height: "20px",
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
                    fontSize: "18px",
                    fontWeight: 700,
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
