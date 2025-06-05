import React from "react";
import {
  Box,
  Grid,
  Typography,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: { xs: "8px", sm: "12px" },
          padding: { xs: "16px", sm: "20px" },
          borderRadius: { xs: "12px", sm: "16px" },
          border: "1px solid var(--neutral-700, #404040)",
          background: "var(--neutral-900, #171717)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          "&:hover": {
            boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.4)",
            borderColor: "var(--neutral-600, #525252)",
            "& .background-icon": {
              opacity: 0.12,
              transform: "scale(1.1) rotate(5deg)",
            },
          },
          "&:active": {
            transform: "translateY(1px)",
          },
        }}
      >
        {loading ? (
          <>
            <Skeleton
              variant="text"
              width={isMobile ? 80 : 100}
              height={isMobile ? 20 : 24}
              sx={{
                bgcolor: "var(--neutral-700, #404040)",
                borderRadius: "8px",
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton
                variant="circular"
                width={isMobile ? 28 : 32}
                height={isMobile ? 28 : 32}
                sx={{ bgcolor: "var(--neutral-700, #404040)" }}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Skeleton
                  variant="text"
                  width={isMobile ? 60 : 80}
                  height={16}
                  sx={{
                    bgcolor: "var(--neutral-700, #404040)",
                    borderRadius: "4px",
                  }}
                />
                <Skeleton
                  variant="text"
                  width={isMobile ? 40 : 50}
                  height={12}
                  sx={{
                    bgcolor: "var(--neutral-700, #404040)",
                    borderRadius: "4px",
                  }}
                />
              </Box>
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
                width={isMobile ? 50 : 60}
                height={isMobile ? 28 : 32}
                sx={{
                  bgcolor: "var(--neutral-700, #404040)",
                  borderRadius: "8px",
                }}
              />
              <Skeleton
                variant="text"
                width={isMobile ? 50 : 60}
                height={isMobile ? 20 : 24}
                sx={{
                  bgcolor: "var(--neutral-700, #404040)",
                  borderRadius: "6px",
                }}
              />
            </Box>
          </>
        ) : (
          <>
            {/* Background Asset Icon */}
            <Box
              className="background-icon"
              sx={{
                position: "absolute",
                top: "-10%",
                right: "-10%",
                width: isMobile ? "80px" : "120px",
                height: isMobile ? "80px" : "120px",
                opacity: 0.08,
                background: `url(${asset?.icon}) center / contain no-repeat`,
                filter: "grayscale(100%)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: "scale(1) rotate(0deg)",
              }}
            />

            {/* Title */}
            <Typography
              sx={{
                color: "var(--neutral-300, #D4D4D4)",
                fontFamily: "Ubuntu",
                fontSize: { xs: "11px", sm: "12px" },
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {title}
            </Typography>

            {/* Asset Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, sm: 2 },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: { xs: "28px", sm: "32px" },
                  height: { xs: "28px", sm: "32px" },
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  background: "var(--neutral-700, #404040)",
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: { xs: "16px", sm: "20px" },
                    height: { xs: "16px", sm: "20px" },
                    borderRadius: "4px",
                    background: `url(${asset?.icon}) transparent 50% / cover no-repeat`,
                  }}
                />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    color: "var(--neutral-50, #FAFAFA)",
                    fontFamily: "Ubuntu",
                    fontSize: { xs: "13px", sm: "14px" },
                    fontWeight: 500,
                    lineHeight: 1.2,
                  }}
                >
                  {asset?.name}
                </Typography>
                <Typography
                  sx={{
                    color: "var(--neutral-400, #A3A3A3)",
                    fontFamily: "Ubuntu",
                    fontSize: { xs: "11px", sm: "12px" },
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {asset?.symbol}
                </Typography>
              </Box>
            </Box>

            {/* Price and Change */}
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
                  fontSize: { xs: "20px", sm: "24px" },
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {asset?.price}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: "4px", sm: "6px" },
                  padding: { xs: "4px 6px", sm: "6px 8px" },
                  borderRadius: "8px",
                  backgroundColor:
                    asset?.change && asset?.change > 0
                      ? "rgba(102, 187, 106, 0.1)"
                      : "rgba(229, 115, 115, 0.1)",
                  color:
                    asset?.change && asset?.change > 0 ? "#66BB6A" : "#E57373",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: { xs: "14px", sm: "16px" },
                    height: { xs: "14px", sm: "16px" },
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
                    fontSize: { xs: "14px", sm: "16px" },
                    fontWeight: 500,
                    lineHeight: 1,
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
    <Grid container spacing={{ xs: 2, sm: 3 }}>
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
