import { Box, Typography } from "@mui/material";
import React from "react";
import { VolumeChart } from "../VolumeChart/VolumeChart";
import { TransactionsCards } from "../TransactionsCards/TransactionsCards";
import { TransactionsTable } from "../TransactionsTable/TransactionsTable";
const data = [
  { timestamp: "12 AM", volume: 1200000 },
  { timestamp: "1 AM", volume: 800000 },
  { timestamp: "2 AM", volume: 500000 },
  { timestamp: "3 AM", volume: 300000 },
  { timestamp: "4 AM", volume: 200000 },
  { timestamp: "5 AM", volume: 250000 },
  { timestamp: "6 AM", volume: 600000 },
  { timestamp: "7 AM", volume: 960000 },
  { timestamp: "8 AM", volume: 1280000 },
  { timestamp: "9 AM", volume: 1600000 },
  { timestamp: "10 AM", volume: 1880000 },
  { timestamp: "11 AM", volume: 2200000 },
  { timestamp: "12 PM", volume: 2100000 },
  { timestamp: "1 PM", volume: 2000000 },
  { timestamp: "2 PM", volume: 1800000 },
  { timestamp: "3 PM", volume: 1700000 },
  { timestamp: "4 PM", volume: 1500000 },
  { timestamp: "5 PM", volume: 1400000 },
  { timestamp: "6 PM", volume: 1300000 },
  { timestamp: "7 PM", volume: 1250000 },
  { timestamp: "8 PM", volume: 1300000 },
  { timestamp: "9 PM", volume: 1350000 },
  { timestamp: "10 PM", volume: 1400000 },
  { timestamp: "11 PM", volume: 1450000 },
];

const asset = {
  name: "USDT",
  icon: "cryptoIcons/usdt.svg",
  amount: 100,
  category: "Stable",
  usdValue: 1 * 100,
};

const cardArgs = {
  activeTraders: "12 370",
  totalTraders: "420 690",
  totalTrades: "1 234 567",
  mostTradedAsset: {
    name: "USDT",
    icon: "cryptoIcons/usdt.svg",
    amount: 100,
    category: "Stable",
    usdValue: 1 * 100,
  },
};

const tableArgs = {
  entries: [
    {
      type: "Buy",
      assets: [asset, asset],
      tradeSize: "1000",
      tradeValue: "2000",
      date: "1.1.2024",
      txHash: "0x1234567890",
    },
    {
      type: "Sell",
      assets: [asset, asset],
      tradeSize: "1000",
      tradeValue: "2000",
      date: "1.1.2024",
      txHash: "0x1234567890",
    },
  ],
};

const mockActiveFilters = {
  dateRange: {
    from: null,
    to: null,
  },
  tradeSize: {
    from: 100,
    to: 1000,
  },
  tradeValue: {
    from: 5000,
    to: 10000,
  },
};

const mockApplyFilters: (newFilters) => void = (newFilters) => {
  console.log("Applying filters with new values:", newFilters);
};

const mockProps = {
  activeFilters: mockActiveFilters,
  applyFilters: mockApplyFilters,
};

const HistoryPage = () => {
  const [activeSort, setActiveSort] = React.useState<{
    column:
      | "date"
      | "tradeSize"
      | "tradeValue"
      | "asset"
      | "tradeType"
      | "txHash"
      | "actions";
    direction: "asc" | "desc" | false;
  }>({
    column: "date",
    direction: "asc",
  });

  const [selectedTab, setSelectedTab] = React.useState<"A" | "M" | "D">("A");

  return (
    <Box>
      <Typography
        sx={{
          color: "#FFF",
          fontFamily: "Ubuntu",
          fontSize: "2rem",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "normal",
        }}
      >
        Transaction History
      </Typography>

      <TransactionsCards {...cardArgs} />
      {/* @ts-ignore */}
      <TransactionsTable
        {...tableArgs}
        {...mockProps}
        // @ts-ignore
        activeSort={activeSort}
        activeView="personal"
        setActiveView={() => {}}
        handleSort={(column) =>
          setActiveSort({
            // @ts-ignore
            column,
            direction:
              column === activeSort.column
                ? activeSort.direction === "asc"
                  ? "desc"
                  : "asc"
                : "asc",
          })
        }
      />
    </Box>
  );
};

export default HistoryPage;
