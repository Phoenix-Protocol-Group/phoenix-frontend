import React, { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { PriceHistoryResponse } from "@phoenix-protocol/utils";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

type HistoricalPrice = {
  price: number;
  timeStamp: number;
};

type DataPoint = {
  price: number;
  timeStamp: number;
};

const tabUnselectedStyles = {
  display: "flex",
  minWidth: "44px",
  height: "40px",
  padding: `${spacing.sm} ${spacing.md}`,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: borderRadius.md,
  cursor: "pointer",
  fontFamily: typography.fontFamily,
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeights.medium,
  transition: "all 0.3s ease",
  color: colors.neutral[300],
  background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
  border: `1px solid ${colors.neutral[700]}`,
  "&:hover": {
    background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.primary.dark}08 100%)`,
    border: `1px solid ${colors.primary.main}30`,
    color: colors.neutral[100],
    transform: "translateY(-1px)",
  },
};

const tabSelectedStyles = {
  background: `linear-gradient(135deg, ${colors.primary.main}25 0%, ${colors.primary.dark}15 100%)`,
  border: `1px solid ${colors.primary.main}80`,
  color: colors.neutral[50],
  boxShadow: `0 0 20px ${colors.primary.main}40`,
};

// Helper function to format data
const formatData = (data: PriceHistoryResponse): DataPoint[] => {
  return data
    .filter((item) => item.price > 0) // Filter out zero price entries
    .map((item) => {
      return {
        price: item.price,
        timeStamp: new Date(Number(item.txTime) * 1000).getTime(),
      };
    });
};

const GlowingChart = ({
  data,
  selected,
  setSelected,
}: {
  data: DataPoint[];
  selected: string;
  setSelected: (value: string) => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width:350px)");

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        padding: spacing.lg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: spacing.lg,
        borderRadius: borderRadius.lg,
        background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
        border: `1px solid ${colors.neutral[700]}`,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${colors.primary.main}03 0%, ${colors.primary.dark}02 100%)`,
          borderRadius: borderRadius.lg,
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          width: "100%",
          gap: { xs: spacing.md, sm: spacing.sm, md: 0 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: isSmallMobile ? "column" : "row",
                sm: "row",
                md: "row",
              },
              alignItems: {
                xs: isSmallMobile ? "flex-start" : "center",
                sm: "center",
              },
              gap: { xs: isSmallMobile ? 1 : 2, sm: 2 },
              mb: isSmallMobile ? 1 : 0,
              width: "100%",
            }}
          >
            <Typography
              sx={{
                color: colors.neutral[400],
                fontFamily: typography.fontFamily,
                fontSize: { xs: "0.75rem", sm: "0.8rem" },
                fontWeight: typography.fontWeights.regular,
                opacity: 0.6,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                component="img"
                sx={{ height: "1rem", width: "1rem" }}
                src="/cryptoIcons/pho.svg"
              />
              Current Price (USDC)
            </Typography>
          </Box>
          <Typography
            sx={{
              color: colors.neutral[50],
              fontFamily: typography.fontFamily,
              fontSize: { xs: "1.25rem", sm: typography.fontSize.xl },
              fontWeight: typography.fontWeights.bold,
            }}
          >
            ${data[data.length - 1].price.toFixed(2)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: spacing.sm,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: { xs: "flex-start", sm: "flex-end" },
            width: { xs: "100%", sm: "auto" },
            mt: { xs: spacing.sm, sm: 0 },
          }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Box
              sx={
                selected === "W"
                  ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                  : tabUnselectedStyles
              }
              onClick={() => setSelected("W")}
            >
              W
            </Box>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Box
              sx={
                selected === "M"
                  ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                  : tabUnselectedStyles
              }
              onClick={() => setSelected("M")}
            >
              M
            </Box>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Box
              sx={
                selected === "Y"
                  ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                  : tabUnselectedStyles
              }
              onClick={() => setSelected("Y")}
            >
              A
            </Box>
          </motion.div>
        </Box>
      </Box>
      <Box sx={{ position: "relative", zIndex: 1, width: "100%" }}>
        <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
          <AreaChart
            data={data}
            margin={
              isMobile
                ? { top: 0, right: -5, left: -5, bottom: 0 }
                : { top: 0, right: -10, left: -10, bottom: 0 }
            }
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E2491A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#E2491A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <YAxis
              hide={false}
              dataKey="price"
              domain={[0, "dataMax + 0.1"]}
              tickFormatter={(tick) => tick.toFixed(2)}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 35 : 45}
            />
            <XAxis
              hide={false}
              dataKey="timeStamp"
              interval={Math.ceil(data.length / (isMobile ? 3 : 5))}
              domain={["dataMin", "dataMax"]}
              tickFormatter={(tick) => format(new Date(tick), "MM/dd/yy")}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickMargin={isMobile ? 5 : 10}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#E2491A"
              strokeWidth={2}
              isAnimationActive={true}
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Tooltip content={<CustomTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  // Get access to theme and media queries
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
          border: "1px solid #292B2C",
          borderRadius: "0.5rem",
          padding: isMobile ? "8px" : "10px",
          color: "white",
          boxShadow:
            "-3px 3px 10px 0px rgba(25, 13, 1, 0.10),-12px 13px 18px 0px rgba(25, 13, 1, 0.09),-26px 30px 24px 0px rgba(25, 13, 1, 0.05),-46px 53px 28px 0px rgba(25, 13, 1, 0.02),-73px 83px 31px 0px rgba(25, 13, 1, 0.00)",
          maxWidth: isMobile ? "160px" : "200px",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            margin: 0,
            color: "white",
            fontSize: isMobile ? "0.8rem" : "0.875rem",
            fontWeight: 600,
          }}
        >{`Value: ${Number(payload[0].value).toFixed(2)}`}</Typography>
        <Typography
          variant="body2"
          sx={{
            margin: 0,
            color: "white",
            fontSize: isMobile ? "0.8rem" : "0.875rem",
          }}
        >{`Date: ${new Date(
          payload[0].payload.timeStamp
        ).toLocaleDateString()}`}</Typography>
        <Typography
          variant="body2"
          sx={{
            margin: 0,
            color: "white",
            fontSize: isMobile ? "0.8rem" : "0.875rem",
          }}
        >{`Time: ${new Date(
          payload[0].payload.timeStamp
        ).toLocaleTimeString()}`}</Typography>
      </Box>
    );
  }
  return null;
};

const FinancialChart = ({
  historicalPrices,
  period,
  setPeriod,
}: {
  historicalPrices: PriceHistoryResponse;
  period: string;
  setPeriod: (period: "W" | "M" | "Y") => void;
}) => {
  const formattedData = formatData(historicalPrices);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <GlowingChart
        data={formattedData}
        selected={period}
        setSelected={setPeriod}
      />
    </Box>
  );
};

export { FinancialChart };
