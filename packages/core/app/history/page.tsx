"use client";
import { Box, Typography } from "@mui/material";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import {
  Button,
  TransactionsCards,
  TransactionsTable,
  VolumeChart,
} from "@phoenix-protocol/ui";
import {
  fetchDataByTimeEpoch,
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
  });

  // Set Volume Chart Data
  const [data, setData] = useState([]);

  // Set Total Volume
  const [totalVolume, setTotalVolume] = useState(0);

  // Set History
  const [history, setHistory] = useState<any>([]);

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

  // Load Meta Data
  const loadMetaData = async () => {
    const { activeAccountsLast24h, totalAccounts } =
      await fetchHistoryMetaData();
    setMeta({ activeAccountsLast24h, totalAccounts });
  };

  // Load Volume Data
  const loadVolumeData = async (epoch: "monthly" | "yearly" | "daily") => {
    const result = await fetchDataByTimeEpoch(epoch);
    setData(result[Object.keys(result)[0]].intervals);
    setTotalVolume(result[Object.keys(result)[0]].totalVolume);
  };

  // Load more / pagination
  const loadMore = () => {
    setPage(page + 1);
  };

  // Load History
  const loadHistory = async () => {
    let result = [];
    if (activeView === "personal" && appStorePersist.wallet.address) {
      result = await fetchSwapHistory(
        page,
        pageSize,
        sortBy,
        sortOrder.toUpperCase(),
        appStorePersist.wallet.address
      );
    } else {
      result = await fetchSwapHistory(
        page,
        pageSize,
        sortBy,
        sortOrder.toUpperCase()
      );
    }

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

        return {
          ...item,
          // @ts-ignore
          tradeSize: Number(item.tradeSize) / 10 ** assets.flat()[0].decimals,
          tradeValue:
            (Number(item.tradeValue) * Number(item.tradeSize)) /
            // @ts-ignore
            10 ** assets.flat()[0].decimals,
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
    const updatedHistory = [...history, ..._result];
    setHistory(updatedHistory);
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

  const mockApplyFilters: (newFilters: any) => void = (newFilters) => {
    console.log("Applying filters with new values:", newFilters);
  };

  const mockProps = {
    activeFilters: mockActiveFilters,
    applyFilters: mockApplyFilters,
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
  }, [page, pageSize, sortBy, sortOrder, activeView]);

  // Use Effect to Init Data
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
      <VolumeChart
        data={data}
        setSelectedTab={(e) => setSelectedTimeEpoch(e)}
        selectedTab={selectedTimeEpoch}
        totalVolume={totalVolume}
      />
      <TransactionsCards
        activeTraders={meta.activeAccountsLast24h.toString()}
        totalTraders={meta.totalAccounts.toString()}
        {...cardArgs}
      />
      {/* @ts-ignore */}
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
          setHistory([]);
          setActiveView(a);
        }}
        loadingResults={false}
        loggedIn={appStorePersist.wallet.address ? true : false}
        {...mockProps}
        handleSort={(column) => handleSortChange(mapToSwapField(column), "asc")}
      />
      <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
        <Button type="secondary" label="Load more" onClick={() => loadMore()} />
      </Box>
    </Box>
  );
}
