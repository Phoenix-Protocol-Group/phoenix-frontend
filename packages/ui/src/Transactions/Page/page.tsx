import { Box, Typography } from "@mui/material";
import React from "react";
import { VolumeChart } from "../VolumeChart/VolumeChart";
import { TransactionsCards } from "../TransactionsCards/TransactionsCards";
import { TransactionsTable } from "../TransactionsTable/TransactionsTable";
const data = [
  { name: "12 AM", value: 1200000 },
  { name: "1 AM", value: 800000 },
  { name: "2 AM", value: 500000 },
  { name: "3 AM", value: 300000 },
  { name: "4 AM", value: 200000 },
  { name: "5 AM", value: 250000 },
  { name: "6 AM", value: 600000 },
  { name: "7 AM", value: 960000 },
  { name: "8 AM", value: 1280000 },
  { name: "9 AM", value: 1600000 },
  { name: "10 AM", value: 1880000 },
  { name: "11 AM", value: 2200000 },
  { name: "12 PM", value: 2100000 },
  { name: "1 PM", value: 2000000 },
  { name: "2 PM", value: 1800000 },
  { name: "3 PM", value: 1700000 },
  { name: "4 PM", value: 1500000 },
  { name: "5 PM", value: 1400000 },
  { name: "6 PM", value: 1300000 },
  { name: "7 PM", value: 1250000 },
  { name: "8 PM", value: 1300000 },
  { name: "9 PM", value: 1350000 },
  { name: "10 PM", value: 1400000 },
  { name: "11 PM", value: 1450000 },
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
      type: "Success",
      assets: [asset, asset],
      tradeSize: "1000",
      tradeValue: "2000",
      date: "1.1.2024",
      txHash: "0x1234567890",
    },
    {
      type: "Failed",
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
      <VolumeChart data={data} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
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
