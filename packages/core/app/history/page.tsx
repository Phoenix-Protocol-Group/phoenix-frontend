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
import { API, constants, TradeAPi } from "@phoenix-protocol/utils";
import { fetchAllTrades, scaToToken } from "@phoenix-protocol/utils";

import {
  PriceHistoryResponse,
  TradingVolumeResponse,
} from "@phoenix-protocol/utils/build/api/types";
import { useEffect, useState, useCallback } from "react";

export default function Page() {
  const appStore = useAppStore();
  const appStorePersist = usePersistStore();

  const tradeApi = new TradeAPi.API(constants.TRADING_API_URL);

  const [meta, setMeta] = useState({
    users24h: "0",
    totalUsers: "0",
    totalTrades: "0",
    mostTradedAsset: {} as Token,
  });
  const [data, setData] = useState<{ timestamp: string; volume: number }[]>([]);
  const [totalVolume, setTotalVolume] = useState(0);
  const [period, setPeriod] = useState<"W" | "M" | "Y">("W");
  const [history, setHistory] = useState<any>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historicalPrices, setHistoricalPrices] =
    useState<PriceHistoryResponse>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
    dateRange: { from: undefined, to: undefined },
    tradeSize: { from: undefined, to: undefined },
    tradeValue: { from: undefined, to: undefined },
  });
  const [selectedPoolForVolume, setSelectedPoolForVolume] = useState<
    string | undefined
  >();

  const applyFilters = useCallback((newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);
    loadAllTrades(newFilters);
  }, []);

  const loadMore = () => {
    setPageSize((prev) => prev + 10);
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
    let volume: TradeAPi.TradingVolumeResponse;
    const now = new Date();
    let start: string, end: string;

    switch (timeEpoch) {
      case "D":
        start = (
          new Date(now.getTime() - 24 * 60 * 60 * 1000).getTime() / 1000
        ).toFixed(0);
        end = (now.getTime() / 1000).toFixed(0);
        volume = selectedPoolForVolume
          ? await tradeApi.getTradingVolumePerHour(
              selectedPoolForVolume,
              Number(start),
              Number(end)
            )
          : await tradeApi.getAllTradingVolumePerHour(
              Number(start),
              Number(end)
            );
        break;
      case "M":
        start = (
          new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime() / 1000
        ).toFixed(0);
        end = now.getTime().toString();
        volume = selectedPoolForVolume
          ? await tradeApi.getTradingVolumePerDay(
              selectedPoolForVolume,
              Number(start),
              Number(end)
            )
          : await tradeApi.getAllTradingVolumePerDay(
              Number(start),
              Number(end)
            );
        break;
      case "A":
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        start = (lastYear.getTime() / 1000).toFixed(0);
        end = (now.getTime() / 1000).toFixed(0);
        volume = selectedPoolForVolume
          ? await tradeApi.getTradingVolumePerMonth(
              selectedPoolForVolume,
              Number(start),
              Number(end)
            )
          : await tradeApi.getAllTradingVolumePerMonth(
              Number(start),
              Number(end)
            );
        break;
    }

    let volumeTotal = 0;
    const mappedData = volume.tradingVolume.map((entry) => {
      let ts: number;
      if (entry.time) {
        const { year, month, day } = entry.time.date;
        ts = new Date(year, month! - 1, day, entry.time.hour).getTime();
      } else if (entry.date) {
        if (entry.date.day !== undefined && entry.date.month !== undefined) {
          ts = new Date(
            entry.date.year,
            entry.date.month - 1,
            entry.date.day
          ).getTime();
        } else if (entry.date.week !== undefined) {
          const firstDayOfYear = new Date(entry.date.year, 0, 1);
          ts =
            firstDayOfYear.getTime() +
            ((entry.date.week - 1) * 7 - firstDayOfYear.getDay() + 1) *
              24 *
              60 *
              60 *
              1000;
        } else if (entry.date.month !== undefined) {
          ts = new Date(entry.date.year, entry.date.month - 1, 1).getTime();
        } else {
          throw new Error("Invalid date bucket in response");
        }
      } else {
        throw new Error("Invalid time bucket in response");
      }

      let formattedTimestamp = "";
      if (timeEpoch === "D") {
        formattedTimestamp = new Date(ts).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (timeEpoch === "M") {
        formattedTimestamp = new Date(ts).toLocaleDateString();
      } else if (timeEpoch === "A") {
        formattedTimestamp = new Date(ts).toLocaleDateString([], {
          month: "short",
          year: "numeric",
        });
      }
      volumeTotal += entry.usdVolume;
      return {
        time: ts,
        timestamp: formattedTimestamp,
        volume: parseFloat(entry.usdVolume.toFixed(2)),
      };
    });

    setTotalVolume(volumeTotal);
    setData(mappedData.sort((a, b) => a.time - b.time));
  };

  const loadMetaData = async () => {
    const totalTrades = (await tradeApi.getTotalTrades()).totalTrades;
    const _totalUsers = await tradeApi.getTotalUsers();
    const _mostResult = (await tradeApi.getMostTraded()).asset;
    const _mostTradedAsset = await appStore.fetchTokenInfo(_mostResult);
    const mostTradedAsset = {
      ..._mostTradedAsset,
      icon: `/cryptoIcons/${_mostTradedAsset?.symbol.toLowerCase()}.svg`,
      name: _mostTradedAsset?.symbol,
    };
    setMeta({
      totalTrades,
      users24h: _totalUsers.usersLast24h,
      totalUsers: _totalUsers.totalUsers,
      mostTradedAsset: mostTradedAsset as Token,
    });
  };

  const loadPools = async () => {
    try {
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
    } catch (e) {
      console.log(e);
      appStore.setLoading(false);
    } finally {
      appStore.setLoading(false);
    }
  };

  const loadPriceData = async (period: "W" | "M" | "Y") => {
    let graph: any[] = [];
    const now = new Date();
    switch (period) {
      case "W":
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        graph = (
          await tradeApi.getTokenPrices(
            "CBZ7M5B3Y4WWBZ5XK5UZCAFOEZ23KSSZXYECYX3IXM6E2JOLQC52DK32",
            Number((lastWeek.getTime() / 1000).toFixed(0)),
            Number((now.getTime() / 1000).toFixed(0))
          )
        ).prices;
        break;
      case "M":
        const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        graph = (
          await tradeApi.getTokenPrices(
            "CBZ7M5B3Y4WWBZ5XK5UZCAFOEZ23KSSZXYECYX3IXM6E2JOLQC52DK32",
            Number((lastMonth.getTime() / 1000).toFixed(0)),
            Number((now.getTime() / 1000).toFixed(0))
          )
        ).prices;
        break;
      case "Y":
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        graph = (
          await tradeApi.getTokenPrices(
            "CBZ7M5B3Y4WWBZ5XK5UZCAFOEZ23KSSZXYECYX3IXM6E2JOLQC52DK32",
            Number((lastYear.getTime() / 1000).toFixed(0)),
            Number((now.getTime() / 1000).toFixed(0))
          )
        ).prices;
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
      to,
      activeView === "personal" ? appStorePersist.wallet.address : undefined
    );
    setHistory(trades);
    console.log(trades[0]);
    setHistoryLoading(false);
  };

  useEffect(() => {
    loadAllTrades();
  }, [pageSize, activeView]);

  useEffect(() => {
    loadVolumeData(selectedTimeEpoch);
  }, [selectedTimeEpoch, selectedPoolForVolume]);

  useEffect(() => {
    loadPriceData(period);
  }, [period]);

  useEffect(() => {
    loadMetaData();
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
      <Grid container spacing={2} sx={{ display: "flex" }}>
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
        <Grid item xs={12} md={6} sx={{ height: "auto" }}>
          {historicalPrices.length > 0 && (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                width: "100%",
              }}
            >
              <FinancialChart
                setPeriod={setPeriod}
                period={period}
                historicalPrices={historicalPrices}
              />
            </Box>
          )}
        </Grid>
      </Grid>
      <TransactionsCards
        activeTraders={meta.users24h}
        totalTraders={meta.totalUsers}
        totalTrades={meta.totalTrades}
        mostTradedAsset={meta.mostTradedAsset}
      />
      <Box sx={{ flexGrow: 1 }}>
        {!historyLoading ? (
          <TransactionsTable
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            entries={history}
            activeSort={{ column: sortBy, direction: sortOrder }}
            activeView={activeView}
            setActiveView={(view) => {
              setHistory([]);
              setActiveView(view);
            }}
            loggedIn={!!appStorePersist.wallet.address}
            activeFilters={activeFilters}
            applyFilters={(newFilters: ActiveFilters) =>
              applyFilters(newFilters)
            }
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
      </Box>
      <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
        <Button type="secondary" label="Load more" onClick={loadMore} />
      </Box>
    </Box>
  );
}
