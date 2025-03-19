import React, { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { format } from "date-fns";
import { PriceHistoryResponse } from "@phoenix-protocol/utils";

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
  width: "2.75rem",
  height: "2.3125rem",
  padding: "1.125rem 1.5rem",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.625rem",
  borderRadius: "1rem",
  cursor: "pointer",
  color: "var(--neutral-300, #D4D4D4)",
  background: "var(--neutral-900, #171717)",
  border: "1px solid var(--neutral-700, #404040)",
};

const tabSelectedStyles = {
  borderRadius: "1rem",
  background: "rgba(226, 73, 26, 0.10)",
  color: "var(--neutral-50, #FAFAFA)",
};

// Helper function to format data
const formatData = (data: PriceHistoryResponse): DataPoint[] => {
  return data.map((item) => {
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
}) => (
  <Box
    sx={{
      display: "flex",
      width: "100%",
      padding: "1.5rem",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "1.5625rem",
      borderRadius: "1.5rem",
      background: "var(--neutral-900, #171717)",
      border: "1px solid var(--neutral-700, #404040)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box>
        <Typography
          sx={{
            color: "var(--neutral-400, #A3A3A3)",
            fontFamily: "Ubuntu",
            fontSize: "0.75rem",
            fontWeight: 400,
            opacity: 0.6,
          }}
        >
          <Box
            component="img"
            sx={{ height: "1rem", width: "1rem" }}
            src="/cryptoIcons/pho.svg"
          />{" "}
          Current Price (USDC)
        </Typography>
        <Typography
          sx={{
            color: "var(--neutral-50, #FAFAFA)",
            fontFamily: "Ubuntu",
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          ${data[data.length - 1].price.toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
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
      </Box>
    </Box>
    <ResponsiveContainer width="100%" height={200}>
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
          hide={false}
          dataKey="price"
          domain={["dataMin - 0.2", "dataMax + 0.1"]}
          tickFormatter={(tick) => tick.toFixed(2)}
        />
        <XAxis
          hide={false}
          dataKey="timeStamp"
          interval={Math.ceil(data.length / 5)}
          domain={["dataMin", "dataMax"]}
          tickFormatter={(tick) => format(new Date(tick), "MM/dd/yy")}
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
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
          border: "1px solid #292B2C",
          borderRadius: "0.5rem",
          padding: "10px",
          color: "white",
          boxShadow:
            "-3px 3px 10px 0px rgba(25, 13, 1, 0.10),-12px 13px 18px 0px rgba(25, 13, 1, 0.09),-26px 30px 24px 0px rgba(25, 13, 1, 0.05),-46px 53px 28px 0px rgba(25, 13, 1, 0.02),-73px 83px 31px 0px rgba(25, 13, 1, 0.00)",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            margin: 0,
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >{`Value: ${Number(payload[0].value).toFixed(2)}`}</Typography>
        <Typography
          variant="body2"
          sx={{
            margin: 0,
            color: "white",
            fontSize: "0.875rem",
          }}
        >{`Date: ${new Date(
          payload[0].payload.timeStamp
        ).toLocaleDateString()}`}</Typography>
        <Typography
          variant="body2"
          sx={{
            margin: 0,
            color: "white",
            fontSize: "0.875rem",
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
    <Box>
      <GlowingChart
        data={formattedData}
        selected={period}
        setSelected={setPeriod}
      />
    </Box>
  );
};

export { FinancialChart };
