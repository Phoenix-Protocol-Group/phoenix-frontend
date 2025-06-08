"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Pool,
} from "@phoenix-protocol/types";
import NftCarouselPlaceholder from "@/components/_preview";
import {
  fetchPho,
  PhoenixFactoryContract,
  PhoenixPairContract,
  PhoenixStakeContract,
  PhoenixVestingContract,
  SorobanTokenContract,
} from "@phoenix-protocol/contracts";
import { useContractTransaction } from "@/hooks/useContractTransaction";
import {
  API as TradeAPI,
  TradingVolume,
} from "@phoenix-protocol/utils/build/trade_api";
import { LiquidityPoolInfo } from "@phoenix-protocol/contracts/build/phoenix-pair";

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
  const [selectedAssetPools, setSelectedAssetPools] = useState<Pool[]>([]);
  const [tradingVolume7d, setTradingVolume7d] = useState<TradingVolume[]>([]);
  const [loadingAssetInfo, setLoadingAssetInfo] = useState(false);

  // Create an empty asset placeholder for use during loading
  const emptyAssetPlaceholder: AssetInfo = useMemo(
    () => ({
      asset: "",
      supply: 0,
      traded_amount: 0,
      payments_amount: 0,
      created: 0,
      trustlines: [],
      payments: 0,
      domain: "",
      rating: {
        age: 0,
        trades: 0,
        payments: 0,
        trustlines: 0,
        volume7d: 0,
        interop: 0,
        liquidity: 0,
        average: 0,
      },
      price7d: [],
      volume7d: 0,
      tomlInfo: {
        code: "",
        issuer: "",
        image: "",
        decimals: 0,
        orgName: "",
        orgLogo: "",
      },
      paging_token: 0,
    }),
    []
  );

  const tradeApi = useMemo(() => new TradeAPI(constants.TRADING_API_URL), []);

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

  const fetchTokenInfo = useCallback(
    async (tokenId: string) => {
      setLoadingAssetInfo(true);
      setTokenInfoOpen(true);

      try {
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

        const fetchPool = async (poolAddress: string) => {
          try {
            const PairContract = new PhoenixPairContract.Client({
              contractId: poolAddress,
              networkPassphrase: constants.NETWORK_PASSPHRASE,
              rpcUrl: constants.RPC_URL,
            });

            const [pairConfig, pairInfo] = await Promise.all([
              PairContract.query_config(),
              PairContract.query_pool_info(),
            ]);

            if (pairConfig?.result && pairInfo?.result) {
              const [tokenA, tokenB] = await Promise.all([
                appStore.fetchTokenInfo(pairConfig.result.token_a),
                appStore.fetchTokenInfo(pairConfig.result.token_b),
              ]);

              // Fetch prices and calculate TVL
              const [priceA, priceB] = await Promise.all([
                API.getPrice(tokenA?.symbol || ""),
                API.getPrice(tokenB?.symbol || ""),
              ]);

              const tvl =
                (priceA * Number(pairInfo.result.asset_a.amount)) /
                  10 ** Number(tokenA?.decimals) +
                (priceB * Number(pairInfo.result.asset_b.amount)) /
                  10 ** Number(tokenB?.decimals);

              const stakingAddress = pairInfo.result.stake_address;

              const StakeContract = new PhoenixStakeContract.Client({
                contractId: stakingAddress,
                networkPassphrase: constants.NETWORK_PASSPHRASE,
                rpcUrl: constants.RPC_URL,
              });

              const [stakingInfo, allPoolDetails] = await Promise.all([
                StakeContract.query_total_staked(),
                new PhoenixFactoryContract.Client({
                  contractId: constants.FACTORY_ADDRESS,
                  networkPassphrase: constants.NETWORK_PASSPHRASE,
                  rpcUrl: constants.RPC_URL,
                }).query_all_pools_details(),
              ]);

              const totalStaked = Number(stakingInfo.result);
              const totalTokens = Number(
                allPoolDetails.result.find(
                  (pool: any) => pool.pool_address === poolAddress
                )?.pool_response.asset_lp_share.amount
              );

              const ratioStaked = totalStaked / totalTokens;
              const valueStaked = tvl * ratioStaked;

              // Calculate APR based on incentives
              const poolIncentives = [
                {
                  address:
                    "CBHCRSVX3ZZ7EGTSYMKPEFGZNWRVCSESQR3UABET4MIW52N4EVU6BIZX",
                  amount: 12500,
                },
                {
                  address:
                    "CBCZGGNOEUZG4CAAE7TGTQQHETZMKUT4OIPFHHPKEUX46U4KXBBZ3GLH",
                  amount: 25000,
                },
                {
                  address:
                    "CD5XNKK3B6BEF2N7ULNHHGAMOKZ7P6456BFNIHRF4WNTEDKBRWAE7IAA",
                  amount: 18750,
                },
              ];

              const poolIncentive = poolIncentives.find(
                (incentive) => incentive.address === poolAddress
              );

              const phoprice = await fetchPho();
              const _apr =
                ((poolIncentive?.amount || 0 * phoprice) / valueStaked) *
                100 *
                6;

              const apr = isNaN(_apr) ? 0 : _apr;

              // Construct and return pool object if all fetches are successful
              return {
                tokens: [
                  {
                    name: tokenA?.symbol || "",
                    icon: `/cryptoIcons/${tokenA?.symbol.toLowerCase()}.svg`,
                    amount:
                      Number(pairInfo.result.asset_a.amount) /
                      10 ** Number(tokenA?.decimals),
                    category: "",
                    usdValue: 0,
                    address: tokenA?.id,
                  },
                  {
                    name: tokenB?.symbol || "",
                    icon: `/cryptoIcons/${tokenB?.symbol.toLowerCase()}.svg`,
                    amount:
                      Number(pairInfo.result.asset_b.amount) /
                      10 ** Number(tokenB?.decimals),
                    category: "",
                    usdValue: 0,
                    address: tokenB?.id,
                  },
                ],
                tvl,
                maxApr: `${(apr / 2).toFixed(2)}`,
                userLiquidity: 0,
                poolAddress: poolAddress,
              };
            }
          } catch (e) {
            console.log(e);
          }
          return;
        };

        const FactoryContract = new PhoenixFactoryContract.Client({
          contractId: constants.FACTORY_ADDRESS,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
        });

        const pools = await FactoryContract.query_pools({});

        const poolWithData =
          pools && Array.isArray(pools.result)
            ? await Promise.all(
                pools.result.map(async (pool: string) => {
                  return await fetchPool(pool);
                })
              )
            : [];

        const poolsFiltered: Pool[] = poolWithData.filter(
          (el: any) =>
            el !== undefined &&
            el.tokens.length >= 2 &&
            el.tokens.some((token: any) => token.address === tokenId)
        );

        // Grab volume  and price of token from last 7d
        const tokenPrice = await tradeApi.getTokenPrices(
          tokenId,
          Number(((Date.now() - 604800000) / 1000).toFixed(0))
        );

        let prices7d: [number, number][];

        if (!tokenPrice.prices) {
          prices7d = [];
        } else {
          prices7d = tokenPrice.prices.map((price) => [
            Number(price.txTime) * 1000,
            price.price,
          ]);
        }

        const volumes = poolsFiltered.map((pool) => {
          const volume7d = tradeApi.getTradingVolumePerDay(
            pool.poolAddress,
            Number(((Date.now() - 604800000) / 1000).toFixed(0))
          );
          return volume7d;
        });

        const d7d = tradeApi.sumTradingVolumesByBucket(
          await Promise.all(volumes)
        );
        info.price7d = prices7d;
        setTradingVolume7d(d7d.tradingVolume);

        setSelectedAssetPools(poolsFiltered);
        setSelectedTokenForInfo(info);
      } catch (error) {
        console.error("Error fetching token info:", error);
      } finally {
        setLoadingAssetInfo(false);
      }
    },
    [appStore, tradeApi]
  );

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
      fetchTokenInfo,
    ]
  );

  return (
    <Box sx={{ marginTop: { md: 4, xs: 12 } }}>
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

      {/* Main Container with improved spacing and responsive layout */}
      <Box
        sx={{
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 2, md: 4 },
        }}
      >
        {/* Modern Welcome Hero Section - Matching Earn/Pools Design */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
              position: "relative",
              pt: { xs: 2, md: 3 },
              pb: { xs: 3, md: 4 },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  mb: 2,
                  fontFamily: "Ubuntu",
                  lineHeight: 1.2,
                }}
              >
                Welcome to Phoenix
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.125rem", md: "1.25rem" },
                  color: "#A3A3A3",
                  fontFamily: "Ubuntu",
                  maxWidth: "700px",
                  mx: "auto",
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Your comprehensive DeFi hub on Stellar. Trade, earn, and explore
                the future of decentralized finance with cutting-edge protocols.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 3 },
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: "400px",
                  mx: "auto",
                }}
              >
                <Button
                  type="primary"
                  onClick={() => router.push("/swap")}
                  sx={{
                    minWidth: { xs: "200px", sm: "160px" },
                    height: { xs: "48px", sm: "52px" },
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    fontWeight: 600,
                    fontFamily: "Ubuntu",
                    textTransform: "none",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                    border: "1px solid rgba(249, 115, 22, 0.3)",
                    boxShadow:
                      "0 4px 20px rgba(249, 115, 22, 0.3), 0 2px 10px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #FB923C 0%, #F97316 100%)",
                      transform: "translateY(-3px)",
                      boxShadow:
                        "0 8px 30px rgba(249, 115, 22, 0.4), 0 4px 15px rgba(249, 115, 22, 0.2)",
                      border: "1px solid rgba(249, 115, 22, 0.5)",
                    },
                    "&:active": {
                      transform: "translateY(-1px)",
                      boxShadow:
                        "0 4px 20px rgba(249, 115, 22, 0.3), 0 2px 10px rgba(0, 0, 0, 0.1)",
                    },
                    "@media (max-width: 768px)": {
                      "&:active": {
                        transform: "scale(0.98)",
                        transition: "all 0.1s ease",
                      },
                    },
                  }}
                >
                  Start Trading
                </Button>
                <Button
                  type="secondary"
                  onClick={() => router.push("/pools")}
                  sx={{
                    minWidth: { xs: "200px", sm: "160px" },
                    height: { xs: "48px", sm: "52px" },
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    fontWeight: 600,
                    fontFamily: "Ubuntu",
                    textTransform: "none",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FAFAFA",
                    backdropFilter: "blur(10px)",
                    boxShadow:
                      "0 4px 15px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background:
                        "linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)",
                      transform: "translateY(-3px)",
                      border: "1px solid rgba(249, 115, 22, 0.3)",
                      boxShadow:
                        "0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(249, 115, 22, 0.1)",
                    },
                    "&:active": {
                      transform: "translateY(-1px)",
                      boxShadow:
                        "0 4px 15px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)",
                    },
                    "@media (max-width: 768px)": {
                      "&:active": {
                        transform: "scale(0.98)",
                        transition: "all 0.1s ease",
                      },
                    },
                  }}
                >
                  Explore Pools
                </Button>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* Main content grid with improved responsive design */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Main Content Area */}
          <Grid item xs={12} lg={9}>
            <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
              {/* Price Charts - Responsive layout */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {loadingDashboard ? (
                    <Box
                      sx={{
                        height: { xs: "200px", md: "240px" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "var(--neutral-900, #171717)",
                        borderRadius: { xs: "12px", md: "16px" },
                        border: "1px solid var(--neutral-700, #404040)",
                      }}
                    >
                      <CircularProgress sx={{ color: "#E2491A" }} />
                    </Box>
                  ) : (
                    <DashboardPriceCharts {...args.dashboardArgs1} />
                  )}
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {loadingDashboard ? (
                    <Box
                      sx={{
                        height: { xs: "200px", md: "240px" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "var(--neutral-900, #171717)",
                        borderRadius: { xs: "12px", md: "16px" },
                        border: "1px solid var(--neutral-700, #404040)",
                      }}
                    >
                      <CircularProgress sx={{ color: "#E2491A" }} />
                    </Box>
                  ) : (
                    <DashboardPriceCharts {...args.dashboardArgs2} />
                  )}
                </motion.div>
              </Grid>

              {/* Wallet Balance Table - Enhanced */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Box sx={{ mt: { xs: 1, md: 2 } }}>
                    {loadingBalances ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: { xs: "200px", md: "240px" },
                          backgroundColor: "var(--neutral-900, #171717)",
                          borderRadius: { xs: "12px", md: "16px" },
                          border: "1px solid var(--neutral-700, #404040)",
                        }}
                      >
                        <CircularProgress sx={{ color: "#E2491A" }} />
                      </Box>
                    ) : allTokens.length ? (
                      <WalletBalanceTable {...args.walletBalanceArgs} />
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          padding: { xs: "32px 20px", md: "40px 24px" },
                          backgroundColor: "var(--neutral-900, #171717)",
                          borderRadius: { xs: "12px", md: "16px" },
                          border: "1px solid var(--neutral-700, #404040)",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "var(--neutral-300, #D4D4D4)",
                            fontSize: { xs: "14px", md: "16px" },
                            fontWeight: 500,
                            mb: 2,
                          }}
                        >
                          No tokens found in your wallet
                        </Typography>
                        <Typography
                          sx={{
                            color: "var(--neutral-400, #A3A3A3)",
                            fontSize: { xs: "12px", md: "14px" },
                            mb: 3,
                          }}
                        >
                          Start trading to see your token balances here
                        </Typography>
                        <Button
                          type="primary"
                          onClick={() => router.push("/swap")}
                          sx={{
                            px: { xs: 3, md: 4 },
                            py: { xs: 1, md: 1.5 },
                          }}
                        >
                          Start Trading
                        </Button>
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </Grid>

              {/* NFT Preview Section - Enhanced */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Box sx={{ mt: { xs: 2, md: 0 }, overflow: "hidden" }}>
                    <NftCarouselPlaceholder />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>

          {/* Sidebar - Now properly aligned */}
          <Grid item xs={12} lg={3}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {/* Volume Tile */}
              <Grid item xs={12} sm={6} lg={12}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Tile
                    value={formatCurrencyStatic.format(dailyVolume)}
                    title="Volume (24h)"
                    link=""
                  />
                </motion.div>
              </Grid>

              {/* TVL Tile */}
              <Grid item xs={12} sm={6} lg={12}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Tile
                    value={formatCurrencyStatic.format(tvl)}
                    title="Total Value Locked"
                    link=""
                  />
                </motion.div>
              </Grid>

              {/* CryptoCTA */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Box sx={{ mt: { xs: 1, md: 2 } }}>
                    <CryptoCTA
                      onClick={() => window.open("https://app.kado.money")}
                    />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Asset Info Modal */}

        <AssetInfoModal
          open={tokenInfoOpen}
          onClose={() => {
            setTokenInfoOpen(false);
            if (loadingAssetInfo) {
              setLoadingAssetInfo(false);
            }
          }}
          asset={selectedTokenForInfo || emptyAssetPlaceholder}
          userBalance={0}
          pools={selectedAssetPools}
          // @ts-ignore
          tradingVolume7d={tradingVolume7d}
          loading={loadingAssetInfo}
        />

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
    </Box>
  );
}
