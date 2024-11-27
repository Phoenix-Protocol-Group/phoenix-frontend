import { Box, Typography, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

type Pool = {
  tokenA: { icon: string; symbol: string };
  tokenB: { icon: string; symbol: string };
  contractAddress: string;
};
interface VolumeChartProps {
  data: { timestamp: string; volume: number }[];
  selectedTab: "D" | "M" | "A";
  setSelectedTab: (tab: "D" | "M" | "A") => void;
  totalVolume: number;
  pools: Pool[];
  selectedPoolForVolume: string | undefined;
  setSelectedPoolForVolume: (pool: string | undefined) => void;
}

function formatNumber(input: string | number): string {
  let numberValue: number;

  if (typeof input === "string") {
    numberValue = parseFloat(input);
    if (isNaN(numberValue)) return input; // Return the string as is if it's not a valid number
  } else {
    numberValue = input;
  }

  if (numberValue <= 10000) {
    return numberValue.toFixed(0);
  } else if (numberValue > 10000 && numberValue < 100000) {
    return numberValue.toLocaleString("en-US", { useGrouping: true });
  } else if (numberValue >= 1_000_000) {
    const millionValue = (numberValue / 1_000_000).toFixed(2);
    return `${millionValue.replace(".", ",")} Mio`;
  }

  return numberValue.toString(); // Fallback for edge cases
}

const getBarBackground = (value: number, max: number) => {
  const percentageOfMax = value / max;

  switch (true) {
    case percentageOfMax <= 0.25:
      // Low entries
      return "url(#lowGradient)";
    case percentageOfMax <= 0.5:
      // Low medium entries
      return "url(#lowMediumGradient)";
    case percentageOfMax <= 0.75:
      // Medium entries
      return "url(#mediumGradient)";
    default:
      // High entries
      return "url(#highGradient)";
  }
};

const renderCustomAxisTick = (value: number) => {
  // Choose the appropriate unit based on the value
  if (value >= 1e6) {
    return `${value / 1e6}M`;
  } else if (value >= 1e3) {
    return `${value / 1e3}k`;
  }
  return value.toString();
};

// Helper function to resolve selected volume to name
const resolveSelectedVolume = (selectedTab: string) => {
  switch (selectedTab) {
    case "D":
      return "Today";
    case "M":
      return "This Month";
    case "A":
      return "All Time";
    default:
      return "Today";
  }
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

const VolumeChart = ({
  data,
  totalVolume,
  selectedTab,
  setSelectedTab,
  setSelectedPoolForVolume,
  selectedPoolForVolume,
  pools,
}: VolumeChartProps) => {
  // Find the maximum value in the data array
  const maxValue = Math.max(...data.map((item) => item.volume));

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontFamily: "Ubuntu",
                fontSize: "0.75rem",
                fontWeight: 400,
                opacity: 0.6,
              }}
            >
              Volume {resolveSelectedVolume(selectedTab)} (USD)
            </Typography>
            <Select
              value={selectedPoolForVolume}
              onChange={(e) => setSelectedPoolForVolume(e.target.value)}
              displayEmpty
              sx={{
                color: "white",
                fontFamily: "Ubuntu",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                fontSize: "0.75rem",
                fontWeight: 400,
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                ".MuiSelect-icon": { color: "white" },
                ".MuiSelect-select": {
                  padding: "8px 8px",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    background:
                      "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
                    border: "1px solid #292B2C",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "-3px 3px 10px 0px rgba(25, 13, 1, 0.10),-12px 13px 18px 0px rgba(25, 13, 1, 0.09),-26px 30px 24px 0px rgba(25, 13, 1, 0.05),-46px 53px 28px 0px rgba(25, 13, 1, 0.02),-73px 83px 31px 0px rgba(25, 13, 1, 0.00)",
                  },
                },
              }}
              renderValue={(selected) => {
                if (selected === "All" || !selected) {
                  return "All Pools";
                }
                const pool = pools.find((p) => p.contractAddress === selected);
                return `${pool?.tokenA.symbol} / ${pool?.tokenB.symbol}`;
              }}
            >
              <MenuItem value={undefined}>All</MenuItem>
              {pools.map((pool) => (
                <MenuItem
                  key={pool.contractAddress}
                  value={pool.contractAddress}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={pool.tokenA.icon}
                      alt={pool.tokenA.symbol}
                      width={20}
                    />
                    <Typography>{pool.tokenA.symbol}</Typography>
                    <Typography>/</Typography>
                    <img
                      src={pool.tokenB.icon}
                      alt={pool.tokenB.symbol}
                      width={20}
                    />
                    <Typography>{pool.tokenB.symbol}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Typography
            sx={{
              color: "white",
              fontFamily: "Ubuntu",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            ${totalVolume.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box
            sx={
              selectedTab === "D"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => setSelectedTab("D")}
          >
            D
          </Box>
          <Box
            sx={
              selectedTab === "M"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => setSelectedTab("M")}
          >
            M
          </Box>
          <Box
            sx={
              selectedTab === "A"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => setSelectedTab("A")}
          >
            A
          </Box>
        </Box>
      </Box>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E23F1C" />
              <stop offset="100%" stopColor="#E3721E" />
            </linearGradient>
            <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E3871C" />
              <stop offset="100%" stopColor="#E4A220" />
            </linearGradient>
            <linearGradient id="lowMediumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2A01C" />
              <stop offset="100%" stopColor="#FFD787" />
            </linearGradient>
            <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD581" />
              <stop offset="100%" stopColor="#FFEDC9" />
            </linearGradient>
          </defs>
          <CartesianGrid
            horizontal
            stroke="#FFF"
            strokeOpacity={0.4}
            strokeWidth={1}
            vertical={false}
          />
          <XAxis dataKey="timestamp" />
          <YAxis tickFormatter={renderCustomAxisTick} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div
                    style={{
                      background:
                        "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
                      border: "1px solid #292B2C",
                      borderRadius: "0.5rem",
                      padding: "10px",
                      color: "white",
                      boxShadow:
                        "-3px 3px 10px 0px rgba(25, 13, 1, 0.10),-12px 13px 18px 0px rgba(25, 13, 1, 0.09),-26px 30px 24px 0px rgba(25, 13, 1, 0.05),-46px 53px 28px 0px rgba(25, 13, 1, 0.02),-73px 83px 31px 0px rgba(25, 13, 1, 0.00)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "white",
                        fontSize: "0.875rem",
                      }}
                    >
                      Volume: ${formatNumber(Number(payload[0].value))}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Bar dataKey="volume" barSize={12} radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarBackground(entry.volume, maxValue)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export { VolumeChart };
