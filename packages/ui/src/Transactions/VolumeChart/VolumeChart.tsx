import {
  Box,
  Typography,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
import { CustomDropdown } from "../../Common/CustomDropdown";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

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
  borderRadius: borderRadius.md,
  cursor: "pointer",
  color: colors.neutral[300],
  background: colors.neutral[900],
  border: `1px solid ${colors.neutral[700]}`,
};

const tabSelectedStyles = {
  borderRadius: borderRadius.md,
  background: "rgba(226, 73, 26, 0.10)",
  color: colors.neutral[50],
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width:350px)");

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
        background: colors.neutral[900], // Adjusted background
        border: `1px solid ${colors.neutral[700]}`, // Adjusted border
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on small screens
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          width: "100%",
          gap: { xs: 2, sm: 1, md: 0 },
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
              gap: { xs: isSmallMobile ? 1 : 2, sm: 3, md: 4 },
              justifyContent: { xs: "space-between", sm: "flex-start" },
              mb: isSmallMobile ? 1 : 0,
              width: "100%",
            }}
          >
            <Typography
              sx={{
                color: colors.neutral[400], // Adjusted color
                fontFamily: typography.fontFamily,
                fontSize: { xs: "0.75rem", sm: "0.8rem" },
                fontWeight: 400,
                opacity: 0.6,
                whiteSpace: "nowrap",
                minWidth: { xs: "auto", sm: "140px", md: "auto" },
                mr: { xs: 0, sm: 2, md: 2 },
              }}
            >
              Volume {resolveSelectedVolume(selectedTab)} (USD)
            </Typography>
            <CustomDropdown
              pools={pools}
              selectedPoolForVolume={selectedPoolForVolume}
              setSelectedPoolForVolume={setSelectedPoolForVolume}
            />
          </Box>
          <Typography
            sx={{
              color: colors.neutral[50], // Adjusted color
              fontFamily: typography.fontFamily,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            {formatCurrencyStatic.format(totalVolume)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: { xs: "flex-start", sm: "flex-end" },
            width: { xs: "100%", sm: "auto" },
            mt: { xs: 1, sm: 0 },
          }}
        >
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
      <ResponsiveContainer width="100%" height={isMobile ? 150 : 200}>
        <BarChart
          data={data}
          barCategoryGap={isMobile ? 1 : 2}
          margin={
            isMobile
              ? { top: 5, right: 10, bottom: 5, left: 0 }
              : { top: 5, right: 30, bottom: 5, left: 0 }
          }
        >
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
            strokeOpacity={0}
            strokeWidth={3}
            vertical={false}
          />
          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickMargin={isMobile ? 5 : 10}
          />
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
