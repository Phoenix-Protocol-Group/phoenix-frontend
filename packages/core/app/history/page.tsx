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
import { motion } from "framer-motion";
import {
  cardStyles,
  colors,
  spacing,
  borderRadius,
  typography,
} from "@phoenix-protocol/ui/src/Theme/styleConstants";

import {
  PriceHistoryResponse,
  TradingVolumeResponse,
} from "@phoenix-protocol/utils/build/api/types";
import { useEffect, useState, useCallback, useRef } from "react";

export default function Page() {
  const appStore = useAppStore();
  const appStorePersist = usePersistStore();
  const isSorting = useRef(false);

  const tradeApi = new TradeAPi.API(constants.TRADING_API_URL);

  const [meta, setMeta] = useState({
    users24h: "0",
    totalUsers: "0",
    totalTrades: "0",
  });
  const [data, setData] = useState<{ timestamp: string; volume: number }[]>([]);
  const [totalVolume, setTotalVolume] = useState(0);
  const [period, setPeriod] = useState<"W" | "M" | "Y">("W");
  const [volumeTimeframe, setVolumeTimeframe] = useState<"D" | "M" | "A">("D"); // Independent state for volume chart
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

  const loadAllTrades = useCallback(
    async (newFilters: ActiveFilters = activeFilters) => {
      setHistoryLoading(true);

      try {
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
          activeView === "personal"
            ? appStorePersist.wallet.address
            : undefined,
          sortBy,
          sortOrder
        );

        // Apply client-side filtering for tradeSize and tradeValue
        let filteredTrades = trades;

        if (
          newFilters.tradeSize.from !== undefined ||
          newFilters.tradeSize.to !== undefined
        ) {
          filteredTrades = filteredTrades.filter((trade) => {
            // Use fromAmount as the trade size
            const size = trade.fromAmount;
            if (
              newFilters.tradeSize.from !== undefined &&
              newFilters.tradeSize.to !== undefined
            ) {
              return (
                size >= newFilters.tradeSize.from &&
                size <= newFilters.tradeSize.to
              );
            } else if (newFilters.tradeSize.from !== undefined) {
              return size >= newFilters.tradeSize.from;
            } else if (newFilters.tradeSize.to !== undefined) {
              return size <= newFilters.tradeSize.to;
            }
            return true;
          });
        }

        if (
          newFilters.tradeValue.from !== undefined ||
          newFilters.tradeValue.to !== undefined
        ) {
          filteredTrades = filteredTrades.filter((trade) => {
            const value = parseFloat(trade.tradeValue);
            if (
              newFilters.tradeValue.from !== undefined &&
              newFilters.tradeValue.to !== undefined
            ) {
              return (
                value >= newFilters.tradeValue.from &&
                value <= newFilters.tradeValue.to
              );
            } else if (newFilters.tradeValue.from !== undefined) {
              return value >= newFilters.tradeValue.from;
            } else if (newFilters.tradeValue.to !== undefined) {
              return value <= newFilters.tradeValue.to;
            }
            return true;
          });
        }

        // Server-side sorting applied, no need for client-side sorting
        setHistory(filteredTrades);
      } catch (error) {
        console.error("Error loading trades:", error);
      } finally {
        setHistoryLoading(false);
      }
    },
    [
      pageSize,
      activeView,
      appStorePersist.wallet.address,
      activeFilters,
      sortBy,
      sortOrder,
    ]
  );

  const applyFilters = useCallback(
    (newFilters: ActiveFilters) => {
      setActiveFilters(newFilters);
      loadAllTrades(newFilters);
    },
    [loadAllTrades]
  );

  const loadMore = () => {
    setPageSize((prev) => prev + 10);
  };

  const handleSortChange = (column: string) => {
    let newSortOrder: "asc" | "desc";

    // If clicking the same column, toggle the sort order
    if (sortBy === column) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      // If clicking a different column, start with descending order (except for date which should start with desc to show newest first)
      newSortOrder = column === "date" ? "desc" : "asc";
    }

    // Update sort state
    setSortBy(column as any);
    setSortOrder(newSortOrder);

    // The loadAllTrades function will be automatically called due to dependency array including sortBy and sortOrder
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

    setMeta({
      totalTrades,
      users24h: _totalUsers.usersLast24h,
      totalUsers: _totalUsers.totalUsers,
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
              icon: `/cryptoIcons/${tokenA?.symbol!.toLowerCase()}.svg`,
            },
            tokenB: {
              ...tokenB,
              icon: `/cryptoIcons/${tokenB?.symbol!.toLowerCase()}.svg`,
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

  useEffect(() => {
    loadAllTrades();
  }, [loadAllTrades]);

  useEffect(() => {
    loadVolumeData(volumeTimeframe); // Use independent volume timeframe
  }, [volumeTimeframe, selectedPoolForVolume]);

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
        maxWidth: 1440,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        mt: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: { xs: "1rem", md: "2.5rem" },
          mt: { xs: "4.5rem", md: 0 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <input type="hidden" value="Phoenix DeFi Hub - Transaction History" />

        {/* Hero Section */}
        <Box
          sx={{
            mb: "3rem",
            textAlign: "center",
            pt: { xs: "2rem", md: "3rem" },
            pb: "2rem",
          }}
        >
          <Typography
            sx={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #e4e4e7 50%, #a1a1aa 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "Ubuntu",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 700,
              lineHeight: 1.2,
              mb: "1rem",
              animation: "glow 3s ease-in-out infinite alternate",
              "@keyframes glow": {
                "0%": {
                  filter: "drop-shadow(0 0 20px rgba(249, 115, 22, 0.3))",
                },
                "100%": {
                  filter: "drop-shadow(0 0 30px rgba(234, 88, 12, 0.4))",
                },
              },
            }}
          >
            Transaction History
          </Typography>

          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: { xs: "1rem", md: "1.125rem" },
              fontWeight: 400,
              maxWidth: "600px",
              margin: "0 auto",
              mb: "2rem",
            }}
          >
            Track all trading activity and market statistics across the Phoenix
            DeFi ecosystem
          </Typography>

          {/* Stats Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: "1.5rem", md: "3rem" },
              flexWrap: "wrap",
              mb: "1rem",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #F97316, #FB923C)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {meta.totalTrades}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Total Trades
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #EA580C, #F97316)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {meta.totalUsers}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Total Users
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #FB923C, #FDBA74)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                $
                {totalVolume.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Volume (
                {volumeTimeframe === "D"
                  ? "24h"
                  : volumeTimeframe === "M"
                  ? "30d"
                  : "1y"}
                )
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box sx={{ mb: spacing.xxl }}>
          <Grid container spacing={4}>
            {" "}
            {/* Increased spacing between charts */}
            <Grid item xs={12} md={6}>
              {data.length > 0 && (
                <VolumeChart
                  selectedTab={volumeTimeframe}
                  data={data}
                  totalVolume={totalVolume}
                  setSelectedTab={setVolumeTimeframe}
                  pools={pools}
                  selectedPoolForVolume={selectedPoolForVolume}
                  setSelectedPoolForVolume={setSelectedPoolForVolume}
                />
              )}
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
        </Box>
      </motion.div>

      {/* Transactions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Box sx={{ mb: spacing.xl }}>
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
              handleSort={(column) => handleSortChange(column)}
            />
          ) : (
            <Skeleton.TransactionsTable />
          )}
        </Box>

        {/* Load More Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: spacing.xl,
          }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Box
              component="button"
              onClick={loadMore}
              sx={{
                ...cardStyles.base,
                p: `${spacing.md} ${spacing.xl}`,
                background: `linear-gradient(135deg, ${colors.primary.main}80 0%, ${colors.primary.dark}60 100%)`,
                border: `1px solid ${colors.primary.main}40`,
                color: colors.neutral[50],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.semiBold,
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 40px ${colors.primary.main}40`,
                  background: `linear-gradient(135deg, ${colors.primary.main}90 0%, ${colors.primary.dark}70 100%)`,
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(90deg, transparent, ${colors.neutral[50]}20, transparent)`,
                  transition: "left 0.5s",
                },
                "&:hover::before": {
                  left: "100%",
                },
              }}
            >
              Load More Transactions
            </Box>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
}
