import {
  Box,
  Chip,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { AreaChart, Area, YAxis, ResponsiveContainer } from "recharts";
import {
  DashboardChartsProps,
  DashboardData as Data,
} from "@phoenix-protocol/types";

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
        dataKey={(v) => v[1]}
        domain={[(dataMin: number) => dataMin * 0.9, "dataMax"]}
      />
      <Area
        type="monotone"
        dataKey={(v) => v[1]}
        stroke="#E2491A"
        strokeWidth={2}
        isAnimationActive={true}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

const DashboardPriceCharts = ({
  data,
  icon,
  assetName,
}: DashboardChartsProps) => {
  const differencePercent: number =
    ((data[data.length - 1][1] - data[0][1]) / data[data.length - 1][1]) * 100;
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Box
      sx={{
        height: "26rem",
        borderRadius: "24px",
        position: "relative",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: "1.2rem" }}>
        <Box
          sx={{
            display: largerThenMd ? "block" : "flex",
            justifyContent: largerThenMd ? "normal" : "space-between",
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
            />
          </Box>

          {!largerThenMd && (
            <Chip
              label={`${differencePercent.toFixed(2)}%`}
              sx={{
                borderRadius: "16px",
                border:
                  differencePercent > 0
                    ? "1px solid #5BFF22"
                    : "1px solid #F22",
                background:
                  differencePercent > 0
                    ? "rgba(91, 255, 34, 0.20)"
                    : "rgba(255, 34, 34, 0.20)",
                backdropFilter: "blur(2.5px)",
                color: differencePercent > 0 ? "#5BFF22" : "#F22",
              }}
            />
          )}
        </Box>
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
            ${data[data.length - 1][1].toString().slice(0, 5)}
          </Typography>
          {largerThenMd && (
            <Chip
              label={`${differencePercent.toFixed(2)}%`}
              sx={{
                borderRadius: "16px",
                border:
                  differencePercent > 0
                    ? "1px solid #5BFF22"
                    : "1px solid #F22",
                background:
                  differencePercent > 0
                    ? "rgba(91, 255, 34, 0.20)"
                    : "rgba(255, 34, 34, 0.20)",
                backdropFilter: "blur(2.5px)",
                color: differencePercent > 0 ? "#5BFF22" : "#F22",
              }}
            />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <Box component="img" src={icon.large} />
      </Box>
      <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <GlowingChart data={data} />
      </Box>
    </Box>
  );
};

export default DashboardPriceCharts;
