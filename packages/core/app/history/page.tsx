/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Box, Grid, Typography } from "@mui/material";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { ActiveFilters, Token } from "@phoenix-protocol/types";
import {
  Button,
  FinancialChart,
  Skeleton,
  TransactionsCards,
  TransactionsTable,
  VolumeChart,
} from "@phoenix-protocol/ui";
import { API, symbolToToken } from "@phoenix-protocol/utils";
import { fetchAllTrades, scaToToken } from "@phoenix-protocol/utils";

import { TradingVolumeResponse } from "@phoenix-protocol/utils/build/api/types";
import { useEffect, useState } from "react";

export default function Page() {
  const appStore = useAppStore();
  const appStorePersist = usePersistStore();

  const [meta, setMeta] = useState({
    users24h: "0",
    totalUsers: "0",
    totalTrades: "0",
    mostTradedAsset: {} as Token,
  });
  const [data, setData] = useState<{ timestamp: string; volume: number }[]>([]);
  const [totalVolume, setTotalVolume] = useState(0);
  const [period, setPeriod] = useState<"W" | "M" | "Y">("W");
  const [mostTradedAsset, setMostTradedAsset] = useState<any>({
    name: "XLM",
    icon: `cryptoIcons/xlm.svg`,
  });
  const [history, setHistory] = useState<any>([]);
  const [allTrades, setAllTrades] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historicalPrices, setHistoricalPrices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<
    | "tradeType"
    | "asset"
    | "tradeSize"
    | "tradeValue"
    | "date"
    | "actions"
    | undefined
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTimeEpoch, setSelectedTimeEpoch] = useState<"D" | "M" | "A">(
    "D"
  );
  const [activeView, setActiveView] = useState<"personal" | "all">("all");
  const [pools, setPools] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    dateRange: {
      from: undefined,
      to: undefined,
    },
    tradeSize: {
      from: undefined,
      to: undefined,
    },
    tradeValue: {
      from: undefined,
      to: undefined,
    },
  });
  const [selectedPoolForVolume, setSelectedPoolForVolume] = useState<
    string | undefined
  >();

  const applyFilters = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);
    loadAllTrades(newFilters);
  };

  const loadMore = () => {
    setPageSize(pageSize + 10);
  };

  const handleSortChange = (
    newSortBy:
      | "tradeType"
      | "asset"
      | "tradeSize"
      | "tradeValue"
      | "date"
      | "actions"
      | undefined,
    newSortOrder: "asc" | "desc"
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    applyFilters(activeFilters);
  };

  const loadVolumeData = async (timeEpoch: "D" | "M" | "A") => {
    let volume: TradingVolumeResponse;

    // Define start and end timestamps
    const now = new Date();
    let start: string, end: string;

    switch (timeEpoch) {
      case "D": // Hourly data for the last 24 hours
        start = (
          new Date(now.getTime() - 24 * 60 * 60 * 1000).getTime() / 1000
        ).toFixed(0); // 24 hours ago
        end = (now.getTime() / 1000).toFixed(0); // Current time
        if (selectedPoolForVolume) {
          volume = await API.getTradingVolumePerHour(
            selectedPoolForVolume,
            start,
            end
          );
        } else {
          volume = await API.getAllTradingVolumePerHour(start, end);
        }
        break;

      case "M": // Daily data for the last 30 days
        start = (
          new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime() / 1000
        ).toFixed(0); // 30 days ago
        end = now.getTime().toString(); // Current time
        if (selectedPoolForVolume) {
          volume = await API.getTradingVolumePerDay(
            selectedPoolForVolume,
            start,
            end
          );
        } else {
          volume = await API.getAllTradingVolumePerDay(start, end);
        }
        break;

      case "A": // Monthly data for the last 12 months
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), 1); // First day of this month, last year
        start = (lastYear.getTime() / 1000).toFixed(0);
        end = (now.getTime() / 1000).toFixed(0);
        if (selectedPoolForVolume) {
          volume = await API.getTradingVolumePerMonth(
            selectedPoolForVolume,
            start,
            end
          );
        } else {
          volume = await API.getAllTradingVolumePerMonth(start, end);
        }
        break;
    }

    let volumeTotal = 0;

    // Map volume data to [[timestamp, amount]] format
    const _data: { timestamp: string; volume: number; time: number }[] =
      volume.tradingVolume.map((entry) => {
        let timestamp: number;

        if (entry.time) {
          timestamp = new Date(
            entry.time.date.year,
            entry.time.date.month - 1,
            entry.time.date.day,
            entry.time.hour
          ).getTime();
        } else if (entry.date) {
          timestamp = new Date(
            entry.date.year,
            entry.date.month - 1,
            entry.date.day
          ).getTime();
        } else if (entry.week) {
          // Approximate the week's start timestamp (assuming week starts on Monday)
          const firstDayOfYear = new Date(entry.week.year, 0, 1);
          timestamp =
            firstDayOfYear.getTime() +
            ((entry.week.week - 1) * 7 - firstDayOfYear.getDay() + 1) *
              24 *
              60 *
              60 *
              1000;
        } else if (entry.month) {
          timestamp = new Date(
            entry.month.year,
            entry.month.month - 1,
            1
          ).getTime();
        } else {
          throw new Error("Invalid time bucket in response");
        }

        let formattedTimestamp: string = "";
        if (timeEpoch === "D") {
          formattedTimestamp = new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } else if (timeEpoch === "M") {
          formattedTimestamp = new Date(timestamp).toLocaleDateString();
        } else if (timeEpoch === "A") {
          formattedTimestamp = new Date(timestamp).toLocaleDateString([], {
            month: "short",
            year: "numeric",
          });
        }

        volumeTotal += entry.usdVolume;
        return {
          time: timestamp,
          timestamp: formattedTimestamp,
          volume: parseFloat(entry.usdVolume.toFixed(2)),
        };
      });

    setTotalVolume(volumeTotal);
    setData(_data.sort((a, b) => a.time - b.time));
  };

  const loadMetaData = async () => {
    const totalTrades = (await API.getTotalTrades()).totalTrades;
    const _totalUsers = await API.getTotalUsers();
    const _mostResult = (await API.getMostTraded()).asset;

    const _mostTradedAsset = await symbolToToken(_mostResult, appStore);

    const mostTradedAsset = {
      ..._mostTradedAsset,
      icon: `/cryptoIcons/${_mostTradedAsset?.symbol.toLowerCase()}.svg`,
      name: _mostTradedAsset?.symbol,
    };

    const users24h = _totalUsers.usersLast24h;
    const totalUsers = _totalUsers.totalUsers;

    setMeta({
      totalTrades,
      users24h,
      totalUsers,
      mostTradedAsset: mostTradedAsset as Token,
    });
  };

  const loadPools = async () => {
    const tickers = await API.getTickers();
    const _pools = await Promise.all(
      tickers.map(async (ticker) => {
        const tokenA = await scaToToken(ticker.base_currency, appStore);
        const tokenB = await scaToToken(ticker.target_currency, appStore);
        return {
          contractAddress: ticker.pool_id,
          tokenA: {
            ...tokenA,
            icon: `/cryptoIcons/${tokenA?.symbol.toLowerCase()}.svg`,
          },
          tokenB: {
            ...tokenB,
            icon: `/cryptoIcons/${tokenB?.symbol.toLowerCase()}.svg`,
          },
        };
      })
    );
    setPools(_pools);
  };

  const loadPriceData = async (period: "W" | "M" | "Y") => {
    let graph: any[] = [];
    switch (period) {
      case "W":
        graph = (
          await API.getRatioGraphLastWeek(
            "CD5XNKK3B6BEF2N7ULNHHGAMOKZ7P6456BFNIHRF4WNTEDKBRWAE7IAA"
          )
        ).graph;
        break;

      case "M":
        graph = (
          await API.getRatioGraphLastMonth(
            "CD5XNKK3B6BEF2N7ULNHHGAMOKZ7P6456BFNIHRF4WNTEDKBRWAE7IAA"
          )
        ).graph;
        break;

      case "Y":
        graph = (
          await API.getRatioGraphLastYear(
            "CD5XNKK3B6BEF2N7ULNHHGAMOKZ7P6456BFNIHRF4WNTEDKBRWAE7IAA"
          )
        ).graph;
        break;
    }
    setHistoricalPrices(graph);
  };

  const loadAllTrades = async (newFilters: ActiveFilters = activeFilters) => {
    let from, to;
    if (newFilters.dateRange.from) {
      from = (newFilters.dateRange.from.getTime() / 1000).toFixed(0);
    }
    if (newFilters.dateRange.to) {
      to = (newFilters.dateRange.to.getTime() / 1000).toFixed(0);
    }
    const trades = await fetchAllTrades(
      appStore,
      pageSize,
      undefined,
      from,
      to
    );
    setHistory(trades);
    setHistoryLoading(false);
  };

  useEffect(() => {
    loadAllTrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  useEffect(() => {
    loadVolumeData(selectedTimeEpoch);
  }, [selectedTimeEpoch, selectedPoolForVolume]);

  useEffect(() => {
    loadPriceData(period);
  }, [period]);

  useEffect(() => {
    loadVolumeData("D");
    loadMetaData();
    loadPriceData("W");
    loadAllTrades();
    loadPools();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: "1440px",
        width: "100%",
        padding: { xs: 0, md: "2.5rem" },
        mt: { xs: "4.5rem", md: 0 },
      }}
    >
      {/* Hacky Title Injector - Waiting for Next Helmet for Next15 */}
      <input type="hidden" value="Phoenix DeFi Hub - Transaction History" />

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
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <VolumeChart
            pools={pools}
            selectedPoolForVolume={selectedPoolForVolume}
            setSelectedPoolForVolume={setSelectedPoolForVolume}
            data={data}
            setSelectedTab={(e) => setSelectedTimeEpoch(e)}
            selectedTab={selectedTimeEpoch}
            totalVolume={totalVolume}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {historicalPrices.length > 0 && (
            <FinancialChart
              setPeriod={setPeriod}
              period={period}
              historicalPrices={historicalPrices}
            />
          )}
        </Grid>
      </Grid>
      <TransactionsCards
        activeTraders={meta.users24h}
        totalTraders={meta.totalUsers}
        totalTrades={meta.totalTrades}
        mostTradedAsset={meta.mostTradedAsset}
      />

      {!historyLoading ? (
        <TransactionsTable
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          entries={history}
          activeSort={{
            column: sortBy,
            direction: sortOrder,
          }}
          activeView={activeView}
          setActiveView={(view) => {
            setHistory([]);
            setActiveView(view);
          }}
          loggedIn={!!appStorePersist.wallet.address}
          activeFilters={activeFilters}
          applyFilters={(newFilters: ActiveFilters) => applyFilters(newFilters)}
          handleSort={(column) =>
            handleSortChange(
              column as any,
              sortOrder === "asc" ? "desc" : "asc"
            )
          }
        />
      ) : (
        <Skeleton.TransactionsTable />
      )}

      <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
        <Button type="secondary" label="Load more" onClick={loadMore} />
      </Box>
    </Box>
  );
}
