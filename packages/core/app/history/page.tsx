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
  fetchSwapHistory,
} from "@phoenix-protocol/utils";
import { useEffect, useState } from "react";

export default function Page() {
  // Init AppStore
  const appStore = useAppStore();
  const appStorePersist = usePersistStore();

  // Set Account Meta
  const [meta, setMeta] = useState({
    activeAccountsLast24h: 0,
    totalAccounts: 0,
    totalTrades: 0,
  });

  // Set Volume Chart Data
  const [data, setData] = useState([]);

  // Set Total Volume
  const [totalVolume, setTotalVolume] = useState(0);

  const [mostTradedAsset, setMostTradedAsset] = useState<any>({
    name: "XLM",
    icon: `cryptoIcons/xlm.svg`,
  });

  // Set History
  const [history, setHistory] = useState<any>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Historical Prices
  const [historicalPrices, setHistoricalPrices] = useState<any[]>([]);

  // Set Search Term
  const [searchTerm, setSearchTerm] = useState("");

  // Set History Table Pagination
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  // Set History Table Sorting
  const [sortBy, setSortBy] = useState<"timestamp" | "fromAmount" | "usdValue">(
    "timestamp"
  ); // Default sorting field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Default sorting order

  // Set selected time epoch
  const [selectedTimeEpoch, setSelectedTimeEpoch] = useState<"D" | "M" | "A">(
    "D"
  );

  // Personal or all
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

  // Load Meta Data
  const loadMetaData = async () => {
    const { activeAccountsLast24h, totalAccounts, totalTrades } =
      await fetchHistoryMetaData();
    setMeta({ activeAccountsLast24h, totalAccounts, totalTrades });
  };

  // Load price data
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

  // Load Volume Data
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

  // Load more / pagination
  const loadMore = () => {
    setPageSize(pageSize + 10);
  };

  // Load History
  const loadHistory = async () => {
    setHistoryLoading(true);
    let result = [];

    if (activeView === "personal" && appStorePersist.wallet.address) {
      result = await fetchSwapHistory(
        page,
        pageSize,
        sortBy,
        sortOrder.toUpperCase(),
        activeFilters,
        appStorePersist.wallet.address
      );
    } else {
      result = await fetchSwapHistory(
        page,
        pageSize,
        sortBy,
        sortOrder.toUpperCase(),
        activeFilters
      );
    }

    if (!result.length) {
      setHistoryLoading(false);
      return setHistory([]);
    }

    const tradedAssets: any = {};
    // Map Token Names
    const _result = await Promise.all(
      result.map(async (item) => {
        const assetInfoPromises = item.assets.map(async (asset) => {
          const offerAssetInfo = await appStore.fetchTokenInfo(
            asset.offer_asset
          );
          const askAssetInfo = await appStore.fetchTokenInfo(asset.ask_asset);

          return [offerAssetInfo, askAssetInfo];
        });

        const assets = await Promise.all(assetInfoPromises);

        for (let i = 0; i < 2; i++) {
          const assetId = assets.flat()[i]?.id;
          const tradeVal = Number(item.tradeSize);

          if (!assetId) continue;

          if (!tradedAssets.hasOwnProperty(assetId)) {
            tradedAssets[assetId] = tradeVal;
          } else {
            tradedAssets[assetId] += tradeVal;
          }
        }

        return {
          ...item,
          // @ts-ignore
          tradeSize: Number(item.tradeSize) / 10 ** assets.flat()[0].decimals,
          tradeValue: Number(item.tradeValue).toFixed(2),
          assets: assets.flat().map((asset) => {
            return {
              name: asset?.symbol,
              icon: `cryptoIcons/${asset?.symbol.toLowerCase()}.svg`,
              amount: 100,
              category: "Stable",
              usdValue: 0,
            };
          }),
        };
      })
    );

    const mtAsset = Object.keys(tradedAssets).reduce((a: any, b: any) =>
      data[a] > data[b] ? a : b
    );
    const mtAssetInfo = await appStore.fetchTokenInfo(mtAsset);

    if (mtAssetInfo) {
      setMostTradedAsset({
        name: mtAssetInfo?.symbol,
        icon: `cryptoIcons/${mtAssetInfo?.symbol.toLowerCase()}.svg`,
        amount: 100,
        category: "Stable",
        usdValue: 0,
      });
    }

    setHistory(_result);
    setHistoryLoading(false);
  };

  // Handle Sort Change
  const handleSortChange = (
    newSortBy: "timestamp" | "fromAmount" | "usdValue",
    newSortOrder: "asc" | "desc"
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(0); // Reset page to the first page
    setHistory([]); // Reset history to clear previous entries
  };

  const mapToSwapField = (column: string) => {
    switch (column) {
      case "tradeType":
        return "timestamp";
      case "asset":
        return "timestamp";
      case "tradeSize":
        return "fromAmount";
      case "tradeValue":
        return "usdValue";
      case "date":
        return "timestamp";
      case "actions":
        return "timestamp";
      default:
        throw new Error("Invalid column name");
    }
  };

  const mapFromSwapField = (
    swapField: "timestamp" | "fromAmount" | "usdValue"
  ) => {
    switch (swapField) {
      case "timestamp":
        return "tradeType";
      case "fromAmount":
        return "tradeSize";
      case "usdValue":
        return "tradeValue";
      default:
        throw new Error("Invalid Swap field");
    }
  };

  // Use Effect to load volume on selected time epoch
  useEffect(() => {
    const _selected = () => {
      switch (selectedTimeEpoch) {
        case "D":
          return "daily";
        case "M":
          return "monthly";
        case "A":
          return "yearly";
      }
    };

    loadVolumeData(_selected());
  }, [selectedTimeEpoch]);

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortBy, sortOrder, activeView, activeFilters]);

  // Use Effect to Init Data
  useEffect(() => {
    loadMetaData();
    loadVolumeData("daily");
    loadPriceData();
  }, []);

  const asset = {
    name: "USDT",
    icon: "cryptoIcons/usdt.svg",
    amount: 100,
    category: "Stable",
    usdValue: 1 * 100,
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: { xs: 0, md: "2.5rem" },
        mt: { xs: "4.5rem", md: 0 },
      }}
    >
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
        totalTraders={meta.totalAccounts.toString()}
        mostTradedAsset={mostTradedAsset}
        totalTrades={meta.totalTrades.toString()}
      />

      {!historyLoading ? (
        <TransactionsTable
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          entries={history}
          activeSort={{
            column: mapFromSwapField(sortBy),
            direction: sortOrder,
          }}
          activeView={activeView}
          setActiveView={(a) => {
            if (a === activeView) return;
            setHistory([]);
            setActiveView(a);
          }}
          loggedIn={appStorePersist.wallet.address ? true : false}
          activeFilters={activeFilters}
          applyFilters={(newFilters: ActiveFilters) => {
            setActiveFilters(newFilters);
          }}
          handleSort={(column) =>
            handleSortChange(mapToSwapField(column), "asc")
          }
        />
      ) : (
        <Skeleton.TransactionsTable />
      )}

      <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
        <Button type="secondary" label="Load more" onClick={() => loadMore()} />
      </Box>
    </Box>
  );
}
