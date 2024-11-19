import React, { useMemo } from "react";
import { Box, Chip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { AreaChart, Area, YAxis, ResponsiveContainer } from "recharts";
import {
  DashboardChartsProps,
  DashboardData as Data,
} from "@phoenix-protocol/types";

/**
 * GlowingChart
 * A modern, glowing area chart visualization with gradient effects.
 * @param {Object} props - The component props
 * @param {Data[]} props.data - The chart data
 * @returns {JSX.Element}
 */
const GlowingChart = ({ data }: { data: Data[] }) => (
  <ResponsiveContainer width="100%" height={250}>
    <AreaChart
      data={data}
      margin={{ top: 0, right: -10, left: -10, bottom: 0 }}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#E2491A" stopOpacity={0.2} />
          <stop offset="95%" stopColor="#E2491A" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <YAxis
        hide={true}
        domain={[(dataMin: number) => dataMin * 0.9, "dataMax"]}
      />
      <Area
        type="monotone"
        dataKey={(entry) => entry[1]}
        stroke="#E2491A"
        strokeWidth={2}
        isAnimationActive={true}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </AreaChart>
  </ResponsiveContainer>
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
  const largerThanMd = useMediaQuery(theme.breakpoints.up("md"));

  // Calculate percentage change and memoize the result for performance
  const differencePercent = useMemo(() => {
    if (data.length) {
      const startPrice = data[0][1];
      const endPrice = data[data.length - 1][1];
      return ((endPrice - startPrice) / startPrice) * 100;
    }
    return 0;
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        sx={{
          height: "26.875rem",
          borderRadius: "24px",
          position: "relative",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Box sx={{ p: "1.2rem" }}>
          <Box
            sx={{
              display: largerThanMd ? "block" : "flex",
              justifyContent: largerThanMd ? "normal" : "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                p: "0.6rem",
                display: "inline-flex",
                borderRadius: "8px",
                justifyContent: "center",
                alignItems: "center",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
              }}
            >
              <Box
                component="img"
                sx={{ width: "1.25rem", height: "1.25rem" }}
                src={icon.small}
                alt={`${assetName} icon`}
              />
            </Box>

            {!largerThanMd && (
              <Chip
                label={`${differencePercent.toFixed(2)}%`}
                sx={{
                  borderRadius: "16px",
                  border:
                    differencePercent >= 0
                      ? "1px solid #5BFF22"
                      : "1px solid #F22",
                  background:
                    differencePercent >= 0
                      ? "rgba(91, 255, 34, 0.20)"
                      : "rgba(255, 34, 34, 0.20)",
                  backdropFilter: "blur(2.5px)",
                  color: differencePercent >= 0 ? "#5BFF22" : "#F22",
                }}
              />
            )}
          </Box>

          {/* Asset Name and Timespan */}
          <Typography
            sx={{
              color: "#808191",
              fontSize: "0.75rem",
              fontWeight: 500,
              lineHeight: "1rem",
              mt: "1.25rem",
            }}
          >
            {assetName} Price
          </Typography>

          {/* Price and Percentage Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: 700,
                letterSpacing: "-0.0625rem",
              }}
            >
              ${data.length ? data[data.length - 1][1].toFixed(2) : "0.00"}
            </Typography>
            {largerThanMd && (
              <Chip
                label={`${differencePercent.toFixed(2)}%`}
                sx={{
                  borderRadius: "16px",
                  border:
                    differencePercent >= 0
                      ? "1px solid #5BFF22"
                      : "1px solid #F22",
                  background:
                    differencePercent >= 0
                      ? "rgba(91, 255, 34, 0.20)"
                      : "rgba(255, 34, 34, 0.20)",
                  backdropFilter: "blur(2.5px)",
                  color: differencePercent >= 0 ? "#5BFF22" : "#F22",
                }}
              />
            )}
          </Box>
        </Box>

        {/* Background Image */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            opacity: 0.3,
            zIndex: -1,
          }}
        >
          <Box
            component="img"
            src={icon.large}
            alt={`${assetName} background`}
            sx={{ width: "10rem", height: "10rem" }}
          />
        </Box>

        {/* Chart Section */}
        <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
          <GlowingChart data={data} />
        </Box>
      </Box>
    </motion.div>
  );
};

export default DashboardPriceCharts;
