import { Box, Typography, MenuItem, Select, TextField } from "@mui/material";
import React, { useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrencyStatic } from "@phoenix-protocol/utils";

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
      return "last 24h";
    case "M":
      return "last 30days";
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
  color: "var(--neutral-300, #D4D4D4)", // Adjusted color
  background: "var(--neutral-900, #171717)", // Adjusted background
  border: "1px solid var(--neutral-700, #404040)", // Adjusted border
};

const tabSelectedStyles = {
  borderRadius: "1rem",
  background: "rgba(226, 73, 26, 0.10)",
  color: "var(--neutral-50, #FAFAFA)", // Adjusted color
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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPools = useMemo(() => {
    if (!searchTerm) return pools;
    return pools.filter(
      (pool) =>
        pool.tokenA.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pool.tokenB.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pools, searchTerm]);
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  const handleClose = (e: any) => {
    if (searchRef.current?.contains(e.target)) {
      return; // keep it open if the click is inside the search
    }
    setOpen(false);
  };
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
        background: "var(--neutral-900, #171717)", // Adjusted background
        border: "1px solid var(--neutral-700, #404040)", // Adjusted border
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
                color: "var(--neutral-400, #A3A3A3)", // Adjusted color
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
              onChange={(e) => {
                if (e.target.value != "12342") {
                  setSelectedPoolForVolume(e.target.value);
                }
              }}
              displayEmpty
              open={open}
              onOpen={() => setOpen(true)}
              onClose={handleClose}
              fullWidth
              sx={{
                width: { xs: "100%", sm: "auto" },
                color: "var(--neutral-300, #D4D4D4)", // Adjusted color
                fontFamily: "Ubuntu",
                background: "var(--neutral-900, #171717)", // Adjusted background
                borderRadius: "16px",
                fontSize: "0.75rem",
                fontWeight: 400,
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                ".MuiSelect-icon": { color: "var(--neutral-300, #D4D4D4)" }, // Adjusted color
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
                    maxHeight: 300,
                    overflowY: "auto",
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
              <MenuItem
                disabled
                disableRipple
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: "none" }}
              >
                <Box
                  sx={{ pointerEvents: "auto" }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                >
                  <TextField
                    inputRef={searchRef}
                    placeholder="Search Pools"
                    variant="standard"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      style: { color: "var(--neutral-300, #D4D4D4)" }, // Adjusted color
                    }}
                    sx={{
                      mb: 1,
                      "& .MuiInputBase-input": {
                        padding: 0,
                      },
                    }}
                  />
                </Box>
              </MenuItem>
              <MenuItem
                value={undefined}
                sx={{
                  textAlign: "center",
                  color: "var(--neutral-300, #D4D4D4)",
                }}
              >
                All
              </MenuItem>
              {filteredPools.map((pool) => (
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
                    <Typography color="var(--neutral-300, #D4D4D4)">
                      {pool.tokenA.symbol}
                    </Typography>
                    <Typography>/</Typography>
                    <img
                      src={pool.tokenB.icon}
                      alt={pool.tokenB.symbol}
                      width={20}
                    />
                    <Typography color="var(--neutral-300, #D4D4D4)">
                      {pool.tokenB.symbol}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Typography
            sx={{
              color: "var(--neutral-50, #FAFAFA)", // Adjusted color
              fontFamily: "Ubuntu",
              fontSize: "1.5rem",
            }}
          >
            {formatCurrencyStatic.format(totalVolume)}
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
                      Volume:
                      {formatCurrencyStatic.format(Number(payload[0].value))}
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
