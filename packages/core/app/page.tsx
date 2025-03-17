"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import Head from "next/head";
import {
  AnchorServices,
  AssetInfoModal,
  Button,
  CryptoCTA,
  DashboardPriceCharts,
  DashboardStats,
  Tile,
  VestingTokensModal,
  WalletBalanceTable,
} from "@phoenix-protocol/ui";
import { useRouter } from "next/navigation";
import {
  API,
  constants,
  fetchBiggestWinnerAndLoser,
  fetchHistoricalPrices,
  formatCurrency,
  formatCurrencyStatic,
  TradingVolumeResponse,
} from "@phoenix-protocol/utils";
import { getAllAnchors } from "@phoenix-protocol/utils/build/sep24";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import {
  Anchor,
  AssetInfo,
  GainerOrLooserAsset,
} from "@phoenix-protocol/types";
import NftCarouselPlaceholder from "@/components/_preview";
import {
  PhoenixVestingContract,
  SorobanTokenContract,
} from "@phoenix-protocol/contracts";
import { useContractTransaction } from "@/hooks/useContractTransaction";
import { API as TradeAPI } from "@phoenix-protocol/utils/build/trade_api";

export default function Page() {
  const theme = useTheme();
  const router = useRouter();
  const appStore = useAppStore();
  const persistStore = usePersistStore();
  const walletAddress = persistStore.wallet.address;
  const { executeContractTransaction } = useContractTransaction();

  // State management
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [gainerAsset, setGainerAsset] = useState<GainerOrLooserAsset>(
    {} as GainerOrLooserAsset
  );
  const [loserAsset, setLoserAsset] = useState<GainerOrLooserAsset>(
    {} as GainerOrLooserAsset
  );
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const [xlmPriceChart, setXlmPriceChart] = useState<any[]>([]);
  const [phoPriceChart, setPhoPriceChart] = useState<any[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [selectedTokenForInfo, setSelectedTokenForInfo] =
    useState<AssetInfo | null>(null);
  const [tokenInfoOpen, setTokenInfoOpen] = useState(false);
  const [tvl, setTVL] = useState<number>(0);
  const [dailyVolume, setDailyVolume] = useState<number>(0);
  const [vestingModalOpen, setVestingModalOpen] = useState(false);
  const [vestingInfo, setVestingInfo] = useState<any>([]);

  const tradeApi = new TradeAPI(constants.TRADING_API_URL);

  const get24hVolume = async () => {
    // Define start and end timestamps
    const now = new Date();

    const start = (
      new Date(now.getTime() - 24 * 60 * 60 * 1000).getTime() / 1000
    ).toFixed(0); // 24 hours ago
    const end = (now.getTime() / 1000).toFixed(0); // Current time

    const volume = await tradeApi.getAllTradingVolumePerHour(
      Number(start),
      Number(end)
    );

    let volumeTotal = 0;

    volume.tradingVolume.map((entry) => {
      volumeTotal += entry.usdVolume;
    });

    setDailyVolume(volumeTotal);
  };

  const getTVL = async () => {
    const allTickers = await API.getTickers();
    const _tvl = allTickers.reduce((total, ticker) => {
      return total + ticker.liquidity_in_usd;
    }, 0);
    setTVL(_tvl);
  };

  const queryAvailableToClaim = async (index: bigint) => {
    const vestingContract = new PhoenixVestingContract.Client({
      contractId: constants.VESTING_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });

    const res = await vestingContract.query_available_to_claim({
      index: index,
      address: walletAddress!,
    });

    return res.result;
  };

  const queryVestingInfo = async () => {
    const vestingContract = new PhoenixVestingContract.Client({
      contractId: constants.VESTING_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });

    const _vestingInfo = await vestingContract.query_all_vesting_info({
      address: walletAddress!,
    });

    setVestingInfo(_vestingInfo.result);
  };

  const claim = async (index: bigint) => {
    try {
      // Execute the transaction using the hook
      await executeContractTransaction({
        contractType: "vesting",
        contractAddress: constants.VESTING_ADDRESS,
        transactionFunction: async (client, restore) => {
          return client.claim(
            {
              index: index,
              sender: walletAddress!,
            },
            { simulate: !restore }
          );
        },
      });
    } catch (error) {
      console.log("Error during claim transaction", error);
    }
  };

  // Fetch and initialize data
  useEffect(() => {
    const initData = async () => {
      try {
        setLoadingDashboard(true);

        // Fetch TVL
        getTVL();

        // Fetch 24h volume
        get24hVolume();

        // Fetch anchors
        const anchors = await getAllAnchors();
        setAnchors(anchors);

        // Fetch gainer and loser
        const { winner, loser } = await fetchBiggestWinnerAndLoser();
        const allTokens = await appStore.getAllTokens();
        const gainer = allTokens.find((token) => token.name === winner.symbol);
        const loserAsset = allTokens.find(
          (token) => token.name === loser.symbol
        );

        if (gainer && loserAsset) {
          setGainerAsset({
            name: gainer.name,
            symbol: gainer.symbol,
            price: formatCurrency(
              "USD",
              winner.price.toString(),
              navigator.language
            ),
            change: winner.percent_change_24,
            icon: `/cryptoIcons/${winner.symbol.toLowerCase()}.svg`,
            volume: "TBD",
          });

          setLoserAsset({
            name: loserAsset.name,
            symbol: loserAsset.symbol,
            price: formatCurrency(
              "USD",
              loser.price.toString(),
              navigator.language
            ),
            change: loser.percent_change_24,
            icon: `/cryptoIcons/${loser.symbol.toLowerCase()}.svg`,
            volume: "TBD",
          });
        }

        // Fetch historical prices
        const [xlmPrices, phoPrices] = await Promise.all([
          fetchHistoricalPrices(1440, "XLM", undefined, 20),
          fetchHistoricalPrices(1440, "PHO", undefined, 20),
        ]);

        setXlmPriceChart(xlmPrices);
        setPhoPriceChart(phoPrices);

        // Load all token balances
        setAllTokens(allTokens);
      } catch (error) {
        console.log("Failed to initialize data:", error);
      } finally {
        setLoadingDashboard(false);
        setLoadingBalances(false);
        appStore.setLoading(false);
      }
    };

    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (walletAddress) {
      queryVestingInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  // Memoized props for child components
  const args = useMemo(
    () => ({
      dashboardStatsArgs: {
        gainer: gainerAsset!,
        loser: loserAsset!,
        availableAssets: "$100,000",
        lockedAssets: "$100,000",
      },
      walletBalanceArgs: {
        tokens: allTokens,
        onTokenClick: (token: string) => {
          fetchTokenInfo(token);
        },
        hasVesting: vestingInfo.length > 0,
        onVestingClick: () => setVestingModalOpen(true),
      },
      dashboardArgs1: {
        data: xlmPriceChart,
        icon: {
          small: "/image-103.png",
          large: "/image-stellar.png",
        },
        assetName: "XLM",
      },
      dashboardArgs2: {
        data: phoPriceChart,
        icon: {
          small: "/cryptoIcons/pho.svg",
          large: "/pho-bg.png",
        },
        assetName: "PHO",
      },
    }),
    [
      gainerAsset,
      loserAsset,
      allTokens,
      xlmPriceChart,
      phoPriceChart,
      vestingInfo,
    ]
  );

  const fetchTokenInfo = async (tokenId: string) => {
    const TokenContract = new SorobanTokenContract.Client({
      contractId: tokenId,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });
    const tokenName = (await TokenContract.name()).result
      .toLowerCase()
      .replace(":", "-");

    const fetchedInfo = await (
      await fetch(
        `https://api.stellar.expert/explorer/public/asset?search=${tokenName}`
      )
    ).json();

    const info = fetchedInfo._embedded.records.find(
      (el: any) =>
        el.asset.toUpperCase() === tokenName.toUpperCase() ||
        el.asset.toUpperCase() === tokenName.toUpperCase() + "-1" ||
        el.asset.toUpperCase() === tokenName.toUpperCase() + "-2"
    );
    setSelectedTokenForInfo(info);
    setTokenInfoOpen(true);
  };

  return (
    <Box sx={{ marginTop: { md: 0, xs: 12 } }}>
      {/* Hacky Title Injector - Waiting for Next Helmet for Next15 */}
      <input type="hidden" value="Phoenix DeFi Hub - Dashboard" />

      {/* Anchor Services */}
      {anchors.length > 0 && (
        <AnchorServices
          anchors={anchors}
          open={Boolean(anchorOpen)}
          authenticate={() => Promise.resolve(true)}
          sign={() => Promise.resolve(true)}
          send={() => Promise.resolve(true)}
          setOpen={setAnchorOpen}
        />
      )}

      <Grid container spacing={3} sx={{ mt: 4, maxWidth: 1440 }}>
        {/* Banner */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Box
              sx={{
                background: "url('/banner.png') center/cover",
                padding: "3rem",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "left",
              }}
            >
              <Box>
                <Typography
                  variant="h1"
                  sx={{ fontSize: "2rem", fontWeight: 700, color: "#fff" }}
                >
                  Are you an artist?
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 400,
                    opacity: 0.8,
                    color: "#fff",
                    mt: 1,
                  }}
                >
                  Be one of the first and become a genesis NFT creator!
                </Typography>
              </Box>
              <Button type="primary" onClick={() => router.push("/nft")}>
                Apply Now!
              </Button>
            </Box>
          </motion.div>
        </Grid>
        <Grid item container lg={9} spacing={3}>
          {/* Dashboard Stats */}
          <Grid item xs={12}>
            {loadingDashboard ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                  backgroundColor: "#1d1f21",
                  borderRadius: "12px",
                }}
              >
                <CircularProgress sx={{ color: "#E2491A" }} />
              </Box>
            ) : (
              <DashboardStats {...args.dashboardStatsArgs} />
            )}
          </Grid>
          {/* Price Charts */}
          <Grid item xs={12} lg={6}>
            {loadingDashboard ? (
              <Box
                sx={{
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1d1f21",
                  borderRadius: "12px",
                }}
              >
                <CircularProgress sx={{ color: "#E2491A" }} />
              </Box>
            ) : (
              <DashboardPriceCharts {...args.dashboardArgs1} />
            )}
          </Grid>
          <Grid item xs={12} lg={6}>
            {loadingDashboard ? (
              <Box
                sx={{
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1d1f21",
                  borderRadius: "12px",
                }}
              >
                <CircularProgress sx={{ color: "#E2491A" }} />
              </Box>
            ) : (
              <DashboardPriceCharts {...args.dashboardArgs2} />
            )}
          </Grid>
          {/* Wallet Balance Table */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            {loadingBalances ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  backgroundColor: "#1d1f21",
                  borderRadius: "12px",
                }}
              >
                <CircularProgress sx={{ color: "#E2491A" }} />
              </Box>
            ) : allTokens.length ? (
              <WalletBalanceTable {...args.walletBalanceArgs} />
            ) : (
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: "14px",
                  textAlign: "center",
                  padding: "20px",
                  backgroundColor: "#1d1f21",
                  borderRadius: "12px",
                }}
              >
                Looks like you haven{"'"}t acquired any tokens.
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sx={{ overflow: "hidden" }}>
            <NftCarouselPlaceholder />
          </Grid>
        </Grid>
        <Grid item container lg={3}>
          {/* Crypto CTA */}
          <Grid
            item
            xs={12}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Tile
              value={formatCurrencyStatic.format(dailyVolume)}
              title="Volume (24h)"
              link=""
            />
            <Tile
              value={formatCurrencyStatic.format(tvl)}
              title="Total Value Locked"
              link=""
            />
            <CryptoCTA onClick={() => window.open("https://app.kado.money")} />
          </Grid>
        </Grid>
      </Grid>
      {/* Asset Info Modal */}
      {selectedTokenForInfo && (
        <AssetInfoModal
          open={tokenInfoOpen}
          onClose={() => setTokenInfoOpen(false)}
          asset={selectedTokenForInfo}
        />
      )}

      {/* Vesting Modal */}
      {vestingInfo.length > 0 && (
        <VestingTokensModal
          open={vestingModalOpen}
          onClose={() => setVestingModalOpen(false)}
          vestingInfo={vestingInfo}
          queryAvailableToClaim={(index) => queryAvailableToClaim(index)}
          claim={(index) => claim(index)}
        />
      )}
    </Box>
  );
}
