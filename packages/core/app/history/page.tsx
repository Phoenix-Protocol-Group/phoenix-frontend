"use client";
import { Box, Typography } from "@mui/material";
import {
  TransactionsCards,
  TransactionsTable,
  VolumeChart,
} from "@phoenix-protocol/ui";
import {
  fetchDataByTimeEpoch,
  fetchHistoryMetaData,
} from "@phoenix-protocol/utils";
import { useEffect, useState } from "react";

export default function Page() {
  // Set Account Meta
  const [meta, setMeta] = useState({
    activeAccountsLast24h: 0,
    totalAccounts: 0,
  });

  // Set Volume Chart Data
  const [data, setData] = useState([]);

  const loadMetaData = async () => {
    const { activeAccountsLast24h, totalAccounts } =
      await fetchHistoryMetaData();
    setMeta({ activeAccountsLast24h, totalAccounts });
  };

  const loadVolumeData = async (epoch: "monthly" | "yearly" | "daily") => {
    const result = await fetchDataByTimeEpoch(epoch);
    setData(result[Object.keys(result)[0]].intervals);
  };

  useEffect(() => {
    loadMetaData();
    loadVolumeData("daily");
  }, []);

  const asset = {
    name: "USDT",
    icon: "cryptoIcons/usdt.svg",
    amount: 100,
    category: "Stable",
    usdValue: 1 * 100,
  };

  const cardArgs = {
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
        type: "Sent",
        assets: [asset, asset],
        tradeSize: "1000",
        tradeValue: "2000",
        date: "1.1.2024",
      },
      {
        type: "Received",
        assets: [asset, asset],
        tradeSize: "1000",
        tradeValue: "2000",
        date: "1.1.2024",
      },
    ],
  };

  return (
    <Box sx={{ width: "100%", padding: "2.5rem" }}>
      <Typography
        sx={{
          color: "#FFF",
          fontFamily: "Ubuntu",
          fontSize: "2rem",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "normal",
          mb: "1.5rem",
        }}
      >
        Transaction History
      </Typography>
      <VolumeChart
        data={data}
        setSelectedTab={(e) => console.log}
        selectedTab="D"
      />
      <TransactionsCards
        activeTraders={meta.activeAccountsLast24h.toString()}
        totalTraders={meta.totalAccounts.toString()}
        {...cardArgs}
      />
      {/* <TransactionsTable {...tableArgs} /> */}
    </Box>
  );
}
