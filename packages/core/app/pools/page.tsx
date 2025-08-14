"use client";

import {
  fetchPho,
  PhoenixFactoryContract,
  PhoenixPairContract,
  PhoenixStakeContract,
  SorobanTokenContract,
} from "@phoenix-protocol/contracts";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { Pools, Skeleton } from "@phoenix-protocol/ui";
import {
  API,
  constants,
  fetchTokenPrices,
  fetchTVL,
  fetchTVLByPoolId,
  formatCurrency,
} from "@phoenix-protocol/utils";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Pool, PoolsFilter } from "@phoenix-protocol/types";
import { Box, Typography } from "@mui/material";
import { FACTORY_ADDRESS } from "@phoenix-protocol/utils/build/constants";
import { LiquidityPoolInfo } from "@phoenix-protocol/contracts/build/phoenix-pair";
import { motion } from "framer-motion";
import Head from "next/head";

interface PoolFeeEntry {
  date: string;
  pool: string;
  token1: string;
  token2: string;
  token1Fees: number;
  token2Fees: number;
}

interface FeesByDay {
  [date: string]: PoolFeeEntry[];
}

interface FeesResponse {
  feesByPoolPerDay: FeesByDay[];
}

/**
 * Page Component - Phoenix DeFi Pools Overview
 *
 * This component renders an overview of available liquidity pools in the Phoenix DeFi Hub.
 * It features interactive pool management options, including sorting, filtering, and viewing detailed liquidity information.
 *
 * @component
 */
export default function Page() {
  const router = useRouter(); // Next.js router
  const [allPools, setAllPools] = useState<Pool[]>([]); // State to hold pool data
  const storePersist = usePersistStore(); // Persisted state
  const [poolFilter, setPoolFilter] = useState<PoolsFilter>("ALL");
  const [sortBy, setSortBy] = useState<string>("HighAPR");
  const appStore = useAppStore();
  const [tvl, setTvl] = useState<number>(0);
  const hasInitialized = useRef(false);

  const getTVL = async () => {
    const _tvl = await fetchTVL();
    setTvl(_tvl);
  };

  // On component mount, fetch pools
  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;

    let isMounted = true;

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
          const [tokenA, tokenB, lpToken] = await Promise.all([
            appStore.fetchTokenInfo(pairConfig.result.token_a),
            appStore.fetchTokenInfo(pairConfig.result.token_b),
            appStore.fetchTokenInfo(pairConfig.result.share_token, true),
          ]);

          // Fetch prices and calculate TVL
          const [priceA, priceB] = await Promise.all([
            API.getPrice(tokenA?.symbol || ""),
            API.getPrice(tokenB?.symbol || ""),
          ]);

          const tvl = await fetchTVLByPoolId(poolAddress);
          console.log(tvl);

          const stakingAddress = pairInfo.result.stake_address;

          const StakeContract = new PhoenixStakeContract.Client({
            contractId: stakingAddress,
            networkPassphrase: constants.NETWORK_PASSPHRASE,
            rpcUrl: constants.RPC_URL,
          });

          // Check if wallet is connected before fetching user stake
          const isWalletConnected = storePersist.wallet.address !== undefined;

          const stakingInfoPromise = StakeContract.query_total_staked();
          const userStakePromise = isWalletConnected
            ? StakeContract.query_staked({
                address: storePersist.wallet.address!,
              })
            : Promise.resolve({ total_stake: 0 }); // Default value when no wallet

          const [stakingInfo, userStake] = await Promise.all([
            stakingInfoPromise,
            userStakePromise,
          ]);

          const totalStaked = Number(stakingInfo.result);
          const valueStaked =
            (totalStaked / 10 ** 7) *
            (tvl / (Number(pairInfo.result.asset_lp_share.amount) / 10 ** 7));

          const _poolFees = await fetch(
            "https://trades.phoenix-hub.io/fees/by-pool/daily"
          );
          const poolFees = (await _poolFees.json()) as FeesResponse;

          const dailyFees = poolFees.feesByPoolPerDay;

          const poolFeesData30d = dailyFees
            .flatMap((day) =>
              Object.values(day)
                .flat()
                .filter((fee) => fee.pool === poolAddress)
            )
            .reduce(
              (acc, fee) => {
                acc.token1Fees += fee.token1Fees;
                acc.token2Fees += fee.token2Fees;
                return acc;
              },
              { token1Fees: 0, token2Fees: 0 }
            );

          // Get dollar price for fees
          const token1Price = priceA || 0;
          const token2Price = priceB || 0;

          const token1FeesUSD =
            (poolFeesData30d.token1Fees / 10 ** (tokenA?.decimals || 7)) *
            token1Price *
            0.3; // 30% of fees in token1
          const token2FeesUSD =
            (poolFeesData30d.token2Fees / 10 ** (tokenB?.decimals || 7)) *
            token2Price *
            0.3; // 30% of fees in token2

          const totalFeesUSD = token1FeesUSD + token2FeesUSD;

          if (valueStaked === 0) {
          }

          const _apr = (totalFeesUSD / valueStaked) * 100 * 12 * 0.7;

          let apr = isNaN(_apr) ? 0 : _apr;

          const phoPrice = await fetchPho();

          // Increase the rewards for PHO pair
          if (tokenA?.symbol === "PHO" || tokenB?.symbol === "PHO") {
            apr = ((45000 * phoPrice) / valueStaked) * 100 * 12;
          }

          return {
            tokens: [
              {
                name: tokenA?.symbol || "",
                icon: `/cryptoIcons/${(
                  tokenA?.symbol || ""
                ).toLowerCase()}.svg`,
                amount:
                  Number(pairInfo.result.asset_a.amount) /
                  10 ** Number(tokenA?.decimals),
                category: "",
                usdValue: 0,
              },
              {
                name: tokenB?.symbol || "",
                icon: `/cryptoIcons/${(
                  tokenB?.symbol || ""
                ).toLowerCase()}.svg`,
                amount:
                  Number(pairInfo.result.asset_b.amount) /
                  10 ** Number(tokenB?.decimals),
                category: "",
                usdValue: 0,
              },
            ],
            tvl: formatCurrency("USD", tvl.toString(), navigator.language),
            maxApr: `${(apr / 2).toFixed(2)}%`,
            userLiquidity: isWalletConnected
              ? (lpToken && (lpToken.balance || 0) > 0) ||
                userStake.total_stake > 0
                ? 1
                : 0
              : 0, // Always 0 when no wallet is connected
            poolAddress: poolAddress,
          };
        }
      } catch (e) {
        console.log(e);
      }
      return;
    };

    const loadPools = async () => {
      if (!isMounted) return;

      console.log("Loading pools - fetching real data");

      try {
        const FactoryContract = new PhoenixFactoryContract.Client({
          contractId: constants.FACTORY_ADDRESS,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
        });

        getTVL();

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
            el.poolAddress !==
              "CBXBKAB6QIRUGTG77OQZHC46BIIPA5WDKIKZKPA2H7Q7CPKQ555W3EVB"
        );

        if (isMounted) {
          setAllPools(poolsFiltered);
          appStore.setLoading(false);
          console.log("Pools loaded successfully:", poolsFiltered.length);
          hasInitialized.current = true; // Mark as initialized
        }
      } catch (e) {
        console.error("Error loading pools:", e);
        if (isMounted) {
          appStore.setLoading(false);
        }
      }
    };

    // Add a small delay to ensure component is fully mounted
    const timeoutId = setTimeout(loadPools, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array since we only want this to run once

  // Render: conditionally display skeleton loader or pool data
  return (
    <Box
      sx={{
        maxWidth: 1440,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        mt: { xs: 2, md: 4 },
      }}
    >
      {/* Hacky Title Injector - Waiting for Next Helmet for Next15 */}
      <input type="hidden" value="Phoenix DeFi Hub - Pools Overview" />

      {/* Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249, 115, 22, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 50% 120%, rgba(249, 115, 22, 0.06) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      {appStore.loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Skeleton.Pools />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Hero Section */}
          <Box
            sx={{
              mb: 4,
              px: 2,
              pt: 4,
              textAlign: { xs: "center", md: "left" },
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
                  fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #FAFAFA 0%, #F97316 50%, #FAFAFA 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Liquidity Pools
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: "#A3A3A3",
                  maxWidth: "600px",
                  mx: { xs: "auto", md: 0 },
                  lineHeight: 1.6,
                }}
              >
                Provide liquidity to earn fees and rewards. Join our
                decentralized pools and become part of the future of DeFi.
              </Typography>
            </motion.div>
          </Box>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Box
              sx={{
                mb: 4,
                px: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: "12px",
                  background: "rgba(249, 115, 22, 0.05)",
                  border: "1px solid rgba(249, 115, 22, 0.2)",
                  minWidth: "140px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#F97316",
                    mb: 0.5,
                  }}
                >
                  {allPools.length}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#A3A3A3",
                  }}
                >
                  Active Pools
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: "12px",
                  background: "rgba(249, 115, 22, 0.05)",
                  border: "1px solid rgba(249, 115, 22, 0.2)",
                  minWidth: "140px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#F97316",
                    mb: 0.5,
                  }}
                >
                  {(() => {
                    return tvl > 0
                      ? `$${tvl.toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}`
                      : "$0";
                  })()}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#A3A3A3",
                  }}
                >
                  Total TVL
                </Typography>
              </Box>
            </Box>
          </motion.div>

          {/* Main Pools Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Pools
              pools={allPools}
              filter={poolFilter}
              //@ts-ignore
              sort={sortBy}
              onAddLiquidityClick={() => {}}
              onShowDetailsClick={(pool) => {
                router.push(`/pools/${pool.poolAddress}`);
              }}
              onFilterClick={(by: string) => {
                setPoolFilter(by as PoolsFilter);
              }}
              onSortSelect={(by) => {
                setSortBy(by);
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </Box>
  );
}
