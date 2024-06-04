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

type HistoricalPrice = {
  tokenId: string;
  symbol: string;
  usdValue: number;
  timestamp: string;
};

type DataPoint = {
  usdValue: number;
  timestamp: number;
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
  background:
    "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
};

const tabSelectedStyles = {
  borderRadius: "1rem",
  border: "1px solid #E2571C",
  background: "rgba(226, 73, 26, 0.10)",
};

// Helper function to filter data based on period
const filterDataByPeriod = (
  data: HistoricalPrice[],
  period: string
): HistoricalPrice[] => {
  const now = new Date();
  let filteredData;

  switch (period) {
    case "1d":
      filteredData = data.filter((item) => {
        const timeDiff = now.getTime() - new Date(item.timestamp).getTime();
        return timeDiff <= 24 * 60 * 60 * 1000;
      });
      break;
    case "1m":
      filteredData = data.filter((item) => {
        const timeDiff = now.getTime() - new Date(item.timestamp).getTime();
        return timeDiff <= 30 * 24 * 60 * 60 * 1000;
      });
      break;
    default:
      filteredData = data;
      break;
  }
  return filteredData;
};

// Helper function to format data
const formatData = (data: HistoricalPrice[]): DataPoint[] => {
  return data.map((item) => ({
    usdValue: item.usdValue,
    timestamp: new Date(item.timestamp).getTime(),
  }));
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
      background:
        "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
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
            color: "white",
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
          Current Price (USD)
        </Typography>
        <Typography
          sx={{
            color: "white",
            fontFamily: "Ubuntu",
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          ${data[data.length - 1].usdValue.toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
        <Box
          sx={
            selected === "1d"
              ? { ...tabUnselectedStyles, ...tabSelectedStyles }
              : tabUnselectedStyles
          }
          onClick={() => setSelected("1d")}
        >
          D
        </Box>
        <Box
          sx={
            selected === "1m"
              ? { ...tabUnselectedStyles, ...tabSelectedStyles }
              : tabUnselectedStyles
          }
          onClick={() => setSelected("1m")}
        >
          M
        </Box>
        <Box
          sx={
            selected === "A"
              ? { ...tabUnselectedStyles, ...tabSelectedStyles }
              : tabUnselectedStyles
          }
          onClick={() => setSelected("A")}
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
        <YAxis hide={false} dataKey="usdValue" />
        <XAxis
          hide={false}
          dataKey="timestamp"
          interval={Math.ceil(data.length / 5)}
          domain={["dataMin", "dataMax"]}
          tickFormatter={(tick) => format(new Date(tick), "MM/dd/yy")}
        />
        <Area
          type="monotone"
          dataKey="usdValue"
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
      <Box p={2} border={1} borderColor="grey.300">
        <Typography variant="body2">{`Value: ${Number(payload[0].value).toFixed(
          2
        )}`}</Typography>
        <Typography variant="body2">{`Date: ${new Date(
          payload[0].payload.timestamp
        ).toLocaleDateString()}`}</Typography>
        <Typography variant="body2">{`Time: ${new Date(
          payload[0].payload.timestamp
        ).toLocaleTimeString()}`}</Typography>
      </Box>
    );
  }
  return null;
};

const FinancialChart = ({
  historicalPrices,
}: {
  historicalPrices: HistoricalPrice[];
}) => {
  const [period, setPeriod] = useState("1d");

  const handlePeriodChange = (
    event: React.ChangeEvent<{}>,
    newPeriod: string
  ) => {
    setPeriod(newPeriod);
  };

  const filteredData = filterDataByPeriod(historicalPrices, period);
  const formattedData = formatData(filteredData);

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
