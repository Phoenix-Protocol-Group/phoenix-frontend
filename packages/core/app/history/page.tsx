"use client";
import { Box, Grid, Typography } from "@mui/material";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { ActiveFilters } from "@phoenix-protocol/types";
import {
  Button,
  FinancialChart,
  Skeleton,
  TransactionsCards,
  TransactionsTable,
  VolumeChart,
} from "@phoenix-protocol/ui";
import {
  fetchDataByTimeEpoch,
  fetchHistoricalPrices,
  fetchHistoryMetaData,
  fetchAllTrades,
} from "@phoenix-protocol/utils";
import { useEffect, useState } from "react";

export default function Page() {
  const appStore = useAppStore();
  const appStorePersist = usePersistStore();

  const [meta, setMeta] = useState({
    activeAccountsLast24h: 0,
    totalAccounts: 0,
    totalTrades: 0,
  });
  const [data, setData] = useState([]);
  const [totalVolume, setTotalVolume] = useState(0);
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

  const loadPriceData = async () => {
    const result = await fetchHistoricalPrices(
      undefined,
      "PHO",
      undefined,
      undefined,
      true
    );
    setHistoricalPrices(result);
  };

  const loadVolumeData = async (epoch: "monthly" | "yearly" | "daily") => {
    const result = await fetchDataByTimeEpoch(epoch);
    const intervals = result[Object.keys(result)[0]].intervals;

    setData(intervals);

    const newTotalVolume: number = intervals.reduce(
      (total: string, currentValue: any) => total + currentValue.volume,
      0
    );
    setTotalVolume(Number(Number(newTotalVolume).toFixed(5)));
  };

  const loadAllTrades = async () => {
    const { totalTradeCount, mostTradedAsset, tradeList, totalTradeCount24h } =
      await fetchAllTrades(appStore);

    setMeta((prevMeta) => ({
      ...prevMeta,
      totalTrades: totalTradeCount,
      activeAccountsLast24h: totalTradeCount24h,
    }));

    setMostTradedAsset({
      name: mostTradedAsset,
      icon: `cryptoIcons/${mostTradedAsset.toLowerCase()}.svg`,
    });

    setAllTrades(tradeList);
    setHistory(tradeList.slice(0, pageSize));
    setHistoryLoading(false);
  };

  const applyFilters = () => {
    const filteredTrades = allTrades.filter((trade) => {
      const tradeTimestamp = new Date(trade.date * 1000).getTime() / 1000;

      // Filter by date range
      if (activeFilters.dateRange.from || activeFilters.dateRange.to) {
        const from = activeFilters.dateRange.from
          ? new Date(activeFilters.dateRange.from).setHours(0, 0, 0, 0) / 1000
          : null;
        const to = activeFilters.dateRange.to
          ? new Date(activeFilters.dateRange.to).setHours(23, 59, 59, 999) /
            1000
          : null;

        if (from && tradeTimestamp < from) return false;
        if (to && tradeTimestamp > to) return false;
      }

      // Filter by trade size
      if (
        activeFilters.tradeSize.from &&
        Number(trade.tradeSize) < activeFilters.tradeSize.from
      )
        return false;
      if (
        activeFilters.tradeSize.to &&
        Number(trade.tradeSize) > activeFilters.tradeSize.to
      )
        return false;

      // Filter by trade value
      if (
        activeFilters.tradeValue.from &&
        Number(trade.tradeValue) < activeFilters.tradeValue.from
      )
        return false;
      if (
        activeFilters.tradeValue.to &&
        Number(trade.tradeValue) > activeFilters.tradeValue.to
      )
        return false;

      return true;
    });

    // Sort the filtered trades
    const sortedTrades = filteredTrades.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" ? a.date - b.date : b.date - a.date;
      } else if (sortBy) {
        return sortOrder === "asc"
          ? a[sortBy] - b[sortBy]
          : b[sortBy] - a[sortBy];
      }
      return 0;
    });

    // Update history with sorted and filtered trades
    setHistory(sortedTrades.slice(0, pageSize));
  };

  const loadMore = () => {
    const newPageSize = pageSize + 10;
    setPageSize(newPageSize);
    setHistory(history.slice(0, newPageSize));
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
    applyFilters();
  };

  useEffect(() => {
    if (allTrades.length > 0) {
      applyFilters();
    }
  }, [pageSize, sortBy, sortOrder, activeFilters, allTrades]);

  useEffect(() => {
    switch (selectedTimeEpoch) {
      case "D":
        loadVolumeData("daily");
        break;

      case "M":
        loadVolumeData("monthly");
        break;

      case "A":
        loadVolumeData("yearly");
    }
  }, [selectedTimeEpoch]);

  useEffect(() => {
    loadVolumeData("daily");
    loadPriceData();
    loadAllTrades();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: "none", // Remove max-width restriction on the entire page
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
            data={data}
            setSelectedTab={(e) => setSelectedTimeEpoch(e)}
            selectedTab={selectedTimeEpoch}
            totalVolume={totalVolume}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {historicalPrices.length > 0 && (
            <FinancialChart historicalPrices={historicalPrices} />
          )}
        </Grid>
      </Grid>
      <TransactionsCards
        activeTraders={meta.activeAccountsLast24h.toString()}
        totalTraders={meta.activeAccountsLast24h.toString()}
        mostTradedAsset={mostTradedAsset}
        totalTrades={meta.totalTrades.toString()}
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
          applyFilters={(newFilters: ActiveFilters) => {
            setActiveFilters(newFilters);
          }}
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
