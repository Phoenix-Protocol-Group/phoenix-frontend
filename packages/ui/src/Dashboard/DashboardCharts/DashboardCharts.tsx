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
        sx={{ bgcolor: "var(--Secondary-S4, #2C2C31)" }}
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
            stroke="#E2491A"
            strokeWidth={3}
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
          padding: "24px",
          flexDirection: "row",
          alignItems: "center",
          gap: "24px",
          position: "relative",
          borderRadius: "12px",
          border: "1px solid var(--Secondary-S4, #2C2C31)",
          background:
            "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
          overflow: "visible",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingRight: "24px",
          }}
        >
          {isLoading ? (
            <Skeleton
              variant="text"
              width={80}
              height={24}
              sx={{ bgcolor: "var(--Secondary-S4, #2C2C31)" }}
            />
          ) : (
            <Typography
              sx={{
                color: "var(--Secondary-S2-2, #BDBEBE)",
                fontFamily: "Ubuntu",
                fontSize: "12px",
                fontWeight: 700,
                lineHeight: "140%",
              }}
            >
              {assetName?.toUpperCase()}
            </Typography>
          )}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, mt: "8px" }}
          >
            {isLoading ? (
              <>
                <Skeleton
                  variant="circular"
                  width={32}
                  height={32}
                  sx={{ bgcolor: "var(--Secondary-S4, #2C2C31)" }}
                />
                <Skeleton
                  variant="text"
                  width={100}
                  height={24}
                  sx={{ bgcolor: "var(--Secondary-S4, #2C2C31)" }}
                />
              </>
            ) : (
              <>
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
                      background: `url(${
                        icon?.small || ""
                      }) transparent 50% / cover no-repeat`,
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
                  {assetName}
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
                  XML
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
              mt: "16px",
            }}
          >
            {isLoading ? (
              <Skeleton
                variant="text"
                width={80}
                height={36}
                sx={{ bgcolor: "var(--Secondary-S4, #2C2C31)" }}
              />
            ) : (
              <>
                <Typography
                  sx={{
                    color: "var(--Secondary-S2, #FFF)",
                    fontFamily: "Ubuntu",
                    fontSize: "24px",
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
                    ml: "16px",
                    color: differencePercent >= 0 ? "#5BFF22" : "#F22",
                  }}
                >
                  <ArrowUpward
                    sx={{
                      fontSize: "16px",
                      transform:
                        differencePercent >= 0
                          ? "rotate(0deg)"
                          : "rotate(180deg)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "16px",
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
            overflow: "visible",
          }}
        >
          <GlowingChart data={data} loading={isLoading} />
        </Box>
      </Box>
    </motion.div>
  );
};

export default DashboardPriceCharts;
