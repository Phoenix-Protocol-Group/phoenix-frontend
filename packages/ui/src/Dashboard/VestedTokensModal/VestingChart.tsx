import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Typography } from "@mui/material";
import {
  format,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

type HistoricalAmount = {
  amount: number;
  timeStamp: number;
};

export type DataPoint = {
  amount: number;
  timeStamp: number;
};

// Helper function to determine the best date format based on data range
const getTimeFormatter = (data: DataPoint[]) => {
  if (data.length < 2) return (tick: number) => format(new Date(tick), "P");

  const startDate = new Date(data[0].timeStamp);
  const endDate = new Date(data[data.length - 1].timeStamp);
  const totalDays = differenceInDays(endDate, startDate);
  const totalMonths = differenceInMonths(endDate, startDate);
  const totalYears = differenceInYears(endDate, startDate);

  if (totalYears > 1) return (tick: number) => format(new Date(tick), "yyyy");
  if (totalMonths > 2)
    return (tick: number) => format(new Date(tick), "MMM yyyy");
  if (totalDays > 10) return (tick: number) => format(new Date(tick), "MMM d");
  return (tick: number) => format(new Date(tick), "MM/dd");
};

export const VestingChart = ({ data }: { data: DataPoint[] }) => {
  const tickFormatter = getTimeFormatter(data);

  return (
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
            Total Vesting (PHO)
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontFamily: "Ubuntu",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            {data[0].amount.toFixed(2)}
          </Typography>
          <Typography
            sx={{ color: "white", fontFamily: "Ubuntu", fontSize: "0.75rem" }}
          >
            Fully unlocked{" "}
            {new Date(data[data.length - 1].timeStamp).toLocaleDateString()}
          </Typography>
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
            dataKey="amount"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(tick) => tick.toFixed(2)}
          />
          <XAxis
            hide={false}
            dataKey="timeStamp"
            interval="preserveStartEnd"
            tickFormatter={tickFormatter}
          />
          <Area
            type="monotone"
            dataKey="amount"
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
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box p={2} border={1} borderColor="grey.300">
        <Typography variant="body2">{`Value: ${Number(payload[0].value).toFixed(
          2
        )}`}</Typography>
        <Typography variant="body2">{`Date: ${format(
          new Date(payload[0].payload.timeStamp),
          "PPpp"
        )}`}</Typography>
      </Box>
    );
  }
  return null;
};
