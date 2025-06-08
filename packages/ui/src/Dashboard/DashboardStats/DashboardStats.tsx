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
import {
  borderRadius,
  colors,
  spacing,
  typography,
  cardStyles,
} from "../../Theme/styleConstants";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        sx={{
          ...cardStyles.base,
          height: { xs: "140px", sm: "160px" },
          padding: { xs: spacing.md, sm: spacing.lg },
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          "&:hover": {
            ...cardStyles.hover,
            "& .background-icon": {
              opacity: 0.15,
              transform: "scale(1.1) rotate(5deg)",
            },
            "& .glow-effect": {
              opacity: 1,
            },
          },
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, transparent 30%, rgba(249, 115, 22, 0.05) 50%, transparent 70%)`,
            opacity: 0,
            transition: "opacity 0.4s ease-in-out",
          },
          "&:hover:before": {
            opacity: 1,
            animation: "shimmer 2s infinite",
            "@keyframes shimmer": {
              "0%": { transform: "translateX(-100%)" },
              "100%": { transform: "translateX(100%)" },
            },
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
                bgcolor: colors.neutral[700],
                borderRadius: borderRadius.sm,
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Skeleton
                variant="circular"
                width={isMobile ? 28 : 32}
                height={isMobile ? 28 : 32}
                sx={{ bgcolor: colors.neutral[700] }}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Skeleton
                  variant="text"
                  width={isMobile ? 60 : 80}
                  height={16}
                  sx={{
                    bgcolor: colors.neutral[700],
                    borderRadius: borderRadius.xs,
                  }}
                />
                <Skeleton
                  variant="text"
                  width={isMobile ? 40 : 50}
                  height={12}
                  sx={{
                    bgcolor: colors.neutral[700],
                    borderRadius: borderRadius.xs,
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
                mt: 2,
              }}
            >
              <Skeleton
                variant="text"
                width={isMobile ? 50 : 60}
                height={isMobile ? 28 : 32}
                sx={{
                  bgcolor: colors.neutral[700],
                  borderRadius: borderRadius.md,
                }}
              />
              <Skeleton
                variant="text"
                width={isMobile ? 50 : 60}
                height={isMobile ? 20 : 24}
                sx={{
                  bgcolor: colors.neutral[700],
                  borderRadius: borderRadius.sm,
                }}
              />
            </Box>
          </>
        ) : (
          <>
            {/* Background Asset Icon with Glassmorphism Effect */}
            <Box
              className="background-icon"
              sx={{
                position: "absolute",
                top: "-20%",
                right: "-15%",
                width: isMobile ? "100px" : "140px",
                height: isMobile ? "100px" : "140px",
                opacity: 0.08,
                background: `url(${asset?.icon}) center / contain no-repeat`,
                filter: "grayscale(100%)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: "scale(1) rotate(0deg)",
              }}
            />

            {/* Glow Effect */}
            <Box
              className="glow-effect"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "60%",
                height: "60%",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)`,
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
                borderRadius: "50%",
                filter: "blur(20px)",
              }}
            />

            {/* Title */}
            <Typography
              sx={{
                color: colors.neutral[300],
                fontFamily: typography.fontFamily,
                fontSize: {
                  xs: typography.fontSize.xs,
                  sm: typography.fontSize.sm,
                },
                fontWeight: typography.fontWeights.medium,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1,
                position: "relative",
                zIndex: 2,
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
                mb: 2,
                position: "relative",
                zIndex: 2,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: { xs: "32px", sm: "36px" },
                    height: { xs: "32px", sm: "36px" },
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[700]} 100%)`,
                    border: `2px solid ${colors.neutral[600]}`,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "18px", sm: "22px" },
                      height: { xs: "18px", sm: "22px" },
                      borderRadius: "50%",
                      background: `url(${asset?.icon}) transparent 50% / cover no-repeat`,
                    }}
                  />
                </Box>
              </motion.div>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    color: colors.neutral[50],
                    fontFamily: typography.fontFamily,
                    fontSize: {
                      xs: typography.fontSize.sm,
                      sm: typography.fontSize.md,
                    },
                    fontWeight: typography.fontWeights.semiBold,
                    lineHeight: 1.2,
                  }}
                >
                  {asset?.name}
                </Typography>
                <Typography
                  sx={{
                    color: colors.neutral[400],
                    fontFamily: typography.fontFamily,
                    fontSize: {
                      xs: typography.fontSize.xs,
                      sm: typography.fontSize.sm,
                    },
                    fontWeight: typography.fontWeights.regular,
                    lineHeight: 1,
                    opacity: 0.8,
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
                position: "relative",
                zIndex: 2,
              }}
            >
              <Typography
                sx={{
                  color: colors.neutral[50],
                  fontFamily: typography.fontFamily,
                  fontSize: {
                    xs: typography.fontSize.lg,
                    sm: typography.fontSize.xl,
                  },
                  fontWeight: typography.fontWeights.bold,
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
                  padding: { xs: "6px 8px", sm: "8px 12px" },
                  borderRadius: borderRadius.md,
                  background:
                    asset?.change && asset?.change > 0
                      ? `linear-gradient(135deg, rgba(102, 187, 106, 0.15) 0%, rgba(102, 187, 106, 0.08) 100%)`
                      : `linear-gradient(135deg, rgba(229, 115, 115, 0.15) 0%, rgba(229, 115, 115, 0.08) 100%)`,
                  border: `1px solid ${
                    asset?.change && asset?.change > 0
                      ? "rgba(102, 187, 106, 0.3)"
                      : "rgba(229, 115, 115, 0.3)"
                  }`,
                  color:
                    asset?.change && asset?.change > 0
                      ? colors.success.main
                      : colors.error.main,
                  backdropFilter: "blur(10px)",
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
                    fontFamily: typography.fontFamily,
                    fontSize: {
                      xs: typography.fontSize.sm,
                      sm: typography.fontSize.md,
                    },
                    fontWeight: typography.fontWeights.semiBold,
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
