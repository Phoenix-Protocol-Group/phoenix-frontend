import React, { useMemo, useEffect, useRef } from "react";
import { Box, Typography, useTheme, Skeleton } from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import { AreaChart, Area, YAxis, ResponsiveContainer } from "recharts";
import {
  DashboardChartsProps,
  DashboardData as Data,
} from "@phoenix-protocol/types";
import { ArrowUpward } from "@mui/icons-material";

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
      ".recharts-surface, .recharts-wrapper": {
        overflow: "visible !important",
      },
    }}
  >
    {loading ? (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={100}
        sx={{ bgcolor: "var(--neutral-700, #404040)" }}
      />
    ) : (
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <defs>
            {/* Filter for strong neon glowing effect */}
            <filter
              id="neonGlow"
              x="-100%"
              y="-100%"
              width="200%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="2" result="blur1" opacity={0} />
              <feGaussianBlur stdDeviation="4" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <YAxis
            hide={true}
            domain={[(dataMin: number) => dataMin * 0.9, "dataMax"]}
          />
          <Area
            type="monotone"
            dataKey={(entry) => entry[1]}
            stroke="#F97316"
            strokeWidth={2}
            isAnimationActive={true}
            fill="none"
            filter="url(#neonGlow)"
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

  // Force a reflow after animation to fix overflow issue
  useEffect(() => {
    if (!isLoading) {
      controls.start({ opacity: 1, y: 0 }).then(() => {
        setTimeout(() => {
          if (chartRef.current) {
            const elements = chartRef.current.querySelectorAll(
              ".recharts-wrapper, .recharts-surface"
            );
            elements.forEach((element) => {
              element.style.overflow = "visible";
            });
            window.dispatchEvent(new Event("resize"));
          }
        }, 100);
      });
    }
  }, [isLoading, controls]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeOut" }}
      ref={chartRef}
    >
      <Box
        sx={{
          display: "flex",
          padding: "16px",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px",
          position: "relative",
          borderRadius: "12px",
          border: "1px solid var(--neutral-700, #404040)",
          background: "var(--neutral-900, #171717)",
          overflow: "hidden",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingRight: "16px",
          }}
        >
          {isLoading ? (
            <Skeleton
              variant="text"
              width={60}
              height={20}
              sx={{ bgcolor: "var(--neutral-700, #404040)" }}
            />
          ) : (
            <Typography
              sx={{
                color: "var(--neutral-400, #A3A3A3)",
                fontFamily: "Ubuntu",
                fontSize: "10px",
                fontWeight: 500,
                lineHeight: "140%",
              }}
            >
              {""}
            </Typography>
          )}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, mt: "4px" }}
          >
            {isLoading ? (
              <>
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  sx={{ bgcolor: "var(--neutral-700, #404040)" }}
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={20}
                  sx={{ bgcolor: "var(--neutral-700, #404040)" }}
                />
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    width: "24px",
                    height: "24px",
                    padding: "4px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "24px",
                    background: "var(--neutral-700, #404040)",
                  }}
                >
                  <Box
                    sx={{
                      width: "16px",
                      height: "16px",
                      flexShrink: 0,
                      borderRadius: "4px",
                      background: `url(${
                        icon?.small || ""
                      }) transparent 50% / cover no-repeat`,
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    color: "var(--neutral-50, #FAFAFA)",
                    fontFamily: "Ubuntu",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  {assetName == "XLM" ? "Stellar" : "Phoenix"}
                </Typography>
                <Typography
                  sx={{
                    color: "var(--neutral-400, #A3A3A3)",
                    fontFamily: "Ubuntu",
                    fontSize: "10px",
                    fontWeight: 300,
                    lineHeight: "140%",
                  }}
                >
                  {assetName}
                </Typography>
              </>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              mt: "8px",
            }}
          >
            {isLoading ? (
              <Skeleton
                variant="text"
                width={60}
                height={24}
                sx={{ bgcolor: "var(--neutral-700, #404040)" }}
              />
            ) : (
              <>
                <Typography
                  sx={{
                    color: "var(--neutral-50, #FAFAFA)",
                    fontFamily: "Ubuntu",
                    fontSize: "18px",
                    fontWeight: 700,
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
                    ml: "8px",
                    color: differencePercent >= 0 ? "#66BB6A" : "#E57373",
                  }}
                >
                  <ArrowUpward
                    sx={{
                      fontSize: "12px",
                      transform:
                        differencePercent >= 0
                          ? "rotate(0deg)"
                          : "rotate(180deg)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {differencePercent.toFixed(2)}%
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Chart Section on the Right */}
        <Box
          sx={{
            flex: 2,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <GlowingChart data={data} loading={isLoading} />
        </Box>
      </Box>
    </motion.div>
  );
};

export default DashboardPriceCharts;
