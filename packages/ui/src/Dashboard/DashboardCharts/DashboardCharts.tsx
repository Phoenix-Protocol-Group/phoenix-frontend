import React, { useMemo, useEffect, useRef } from "react";
import { Box, Typography, useTheme, Skeleton } from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import { AreaChart, Area, YAxis, ResponsiveContainer } from "recharts";
import {
  DashboardChartsProps,
  DashboardData as Data,
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
 * GlowingChart
 * A modern, glowing area chart visualization with a strong neon effect on the stroke.
 * @param {Object} props - The component props
 * @param {Data[]} props.data - The chart data
 * @param {boolean} props.loading - Loading state for the chart
 * @returns {JSX.Element}
 */
const GlowingChart = ({
  data,
  loading,
}: {
  data?: Data[];
  loading: boolean;
}) => (
  <Box
    sx={{
      position: "relative",
      width: "100%",
      height: "100%",
      minHeight: { xs: "80px", sm: "90px", md: "100px" }, // Reduced minimum heights for compact display
      overflow: "hidden", // Prevent chart overflow on mobile
      ".recharts-surface, .recharts-wrapper": {
        overflow: "hidden !important", // Ensure charts don't overflow on mobile
      },
    }}
  >
    {loading ? (
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        sx={{
          bgcolor: colors.neutral[700],
          borderRadius: borderRadius.md,
          minHeight: { xs: "80px", sm: "90px", md: "100px" }, // Match reduced chart heights
        }}
      />
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }} // Reduced margins for more chart space
        >
          <defs>
            {/* Enhanced gradient with better visibility */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={colors.primary.main}
                stopOpacity={0.4}
              />
              <stop
                offset="50%"
                stopColor={colors.primary.main}
                stopOpacity={0.2}
              />
              <stop
                offset="100%"
                stopColor={colors.primary.main}
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <YAxis
            hide={true}
            domain={[
              (dataMin: number) => dataMin * 0.9,
              (dataMax: number) => dataMax * 1.1,
            ]}
          />
          <Area
            type="monotone"
            dataKey={(entry) => entry[1]}
            stroke={colors.primary.main}
            strokeWidth={2} // Slightly thinner line for compact display
            fill="url(#chartGradient)"
            isAnimationActive={true}
            dot={false}
            activeDot={{
              r: 4, // Smaller active dot
              stroke: colors.primary.main,
              strokeWidth: 2,
              fill: colors.primary.main,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    )}
  </Box>
);

/**
 * DashboardPriceCharts
 * Displays a price chart with asset details and percentage change.
 * Includes framer motion animations for a modern appearance.
 * @param {DashboardChartsProps} props - The component props
 * @returns {JSX.Element}
 */
const DashboardPriceCharts = ({
  data,
  icon,
  assetName,
}: DashboardChartsProps) => {
  const theme = useTheme();
  const controls = useAnimation();
  const chartRef = useRef(null);

  const isLoading = !data || !data.length;

  // Calculate percentage change and memoize the result for performance
  const differencePercent = useMemo(() => {
    if (data?.length) {
      const startPrice = data[0][1];
      const endPrice = data[data.length - 1][1];
      return ((endPrice - startPrice) / startPrice) * 100;
    }
    return 0;
  }, [data]);

  // Initialize animation and ensure proper chart rendering
  useEffect(() => {
    const startAnimation = async () => {
      await controls.start({ opacity: 1, y: 0 });

      // Force chart visibility after animation
      setTimeout(() => {
        if (chartRef.current) {
          const elements = chartRef.current.querySelectorAll(
            ".recharts-wrapper, .recharts-surface"
          );
          elements.forEach((element: any) => {
            if (element?.style) {
              element.style.overflow = "hidden"; // Prevent overflow on mobile
            }
          });

          // Trigger a resize to ensure chart renders properly
          window.dispatchEvent(new Event("resize"));
        }
      }, 150);
    };

    if (!isLoading) {
      startAnimation();
    }
  }, [isLoading, controls]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeOut" }}
      ref={chartRef}
    >
      {" "}
      <Box
        sx={{
          ...cardStyles.base,
          height: { xs: "180px", sm: "200px", md: "220px" }, // Reduced height for more compact chart display
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden", // Prevent chart overflow on mobile
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 8px 25px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.1)`,
            border: `1px solid ${colors.neutral[600]}`,
            transition: "all 0.2s ease-in-out",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        {/* Header Section - Compact */}
        <Box
          sx={{
            padding: { xs: spacing.sm, sm: spacing.md },
            paddingBottom: { xs: spacing.xs, sm: spacing.sm }, // Reduced bottom padding
            position: "relative",
            zIndex: 2,
          }}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Skeleton
                variant="circular"
                width={28}
                height={28}
                sx={{ bgcolor: colors.neutral[700] }}
              />
              <Box>
                <Skeleton
                  variant="text"
                  width={80}
                  height={16}
                  sx={{ bgcolor: colors.neutral[700], mb: 0.5 }}
                />
                <Skeleton
                  variant="text"
                  width={60}
                  height={12}
                  sx={{ bgcolor: colors.neutral[700] }}
                />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "32px",
                    height: "32px",
                    padding: "2px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[700]} 100%)`,
                    border: `2px solid ${colors.neutral[600]}`,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: `url(${
                        icon?.small || ""
                      }) transparent 50% / cover no-repeat`,
                    }}
                  />
                </Box>
              </motion.div>
              <Box>
                <Typography
                  sx={{
                    color: colors.neutral[50],
                    fontFamily: typography.fontFamily,
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeights.semiBold,
                    lineHeight: 1.2,
                  }}
                >
                  {assetName === "XLM" ? "Stellar" : "Phoenix"}
                </Typography>
                <Typography
                  sx={{
                    color: colors.neutral[400],
                    fontFamily: typography.fontFamily,
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.regular,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    opacity: 0.8,
                  }}
                >
                  {assetName}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Price and Change */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isLoading ? (
              <Skeleton
                variant="text"
                width={120}
                height={32}
                sx={{ bgcolor: colors.neutral[700] }}
              />
            ) : (
              <>
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
                  ${" "}
                  {data.length
                    ? data[data.length - 1][1].toLocaleString()
                    : "0.00"}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    borderRadius: borderRadius.sm,
                    background:
                      differencePercent >= 0
                        ? `linear-gradient(135deg, rgba(102, 187, 106, 0.15) 0%, rgba(102, 187, 106, 0.08) 100%)`
                        : `linear-gradient(135deg, rgba(229, 115, 115, 0.15) 0%, rgba(229, 115, 115, 0.08) 100%)`,
                    border: `1px solid ${
                      differencePercent >= 0
                        ? "rgba(102, 187, 106, 0.3)"
                        : "rgba(229, 115, 115, 0.3)"
                    }`,
                    color:
                      differencePercent >= 0
                        ? colors.success.main
                        : colors.error.main,
                  }}
                >
                  <ArrowUpward
                    sx={{
                      fontSize: "14px",
                      transform:
                        differencePercent >= 0
                          ? "rotate(0deg)"
                          : "rotate(180deg)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeights.semiBold,
                    }}
                  >
                    {differencePercent.toFixed(2)}%
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Chart Section - Compact */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            height: { xs: "100px", sm: "110px", md: "120px" }, // Fixed height instead of flex
            padding: { xs: spacing.xs, sm: spacing.sm },
            paddingTop: 0, // Remove top padding to reduce gap
            overflow: "hidden", // Prevent chart overflow on mobile
          }}
        >
          <GlowingChart data={data} loading={isLoading} />
        </Box>
      </Box>
    </motion.div>
  );
};

export default DashboardPriceCharts;
