"use client";

import {
  fetchPho,
  PhoenixFactoryContract,
  PhoenixPairContract,
  PhoenixStakeContract,
} from "@phoenix-protocol/contracts";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { Pools, Skeleton } from "@phoenix-protocol/ui";
import {
  constants,
  fetchTokenPrices,
  formatCurrency,
} from "@phoenix-protocol/utils";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Pool, PoolsFilter } from "@phoenix-protocol/types";
import { Box } from "@mui/material";
import { FACTORY_ADDRESS } from "@phoenix-protocol/utils/build/constants";
import { LiquidityPoolInfo } from "@phoenix-protocol/contracts/build/phoenix-pair";
import { motion } from "framer-motion";
import Head from "next/head";

/**
 * Page Component - Phoenix DeFi Pools Overview
 *
 * This component renders an overview of available liquidity pools in the Phoenix DeFi Hub.
 * It features interactive pool management options, including sorting, filtering, and viewing detailed liquidity information.
 *
 * @component
 */
export default function Page() {
  const store = useAppStore(); // Global state management
  const router = useRouter(); // Next.js router
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [allPools, setAllPools] = useState<Pool[]>([]); // State to hold pool data
  const storePersist = usePersistStore(); // Persisted state
  const [poolFilter, setPoolFilter] = useState<PoolsFilter>("ALL");
  const [sortBy, setSortBy] = useState<string>("HighAPR");
  const isInitialMount = useRef(true); // To track the initial component mount
  const appStore = useAppStore();

  /**
   * Fetch pool information by its address.
   *
   * @async
   * @function fetchPool
   * @param {string} poolAddress - The address of the liquidity pool.
   * @returns {Promise<Pool | undefined>} A promise that resolves to the pool information or undefined in case of failure.
   */
  const fetchPool = useCallback(async (poolAddress: string) => {
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
          store.fetchTokenInfo(pairConfig.result.token_a),
          store.fetchTokenInfo(pairConfig.result.token_b),
        ]);

        // Fetch prices and calculate TVL
        const [priceA, priceB] = await Promise.all([
          fetchTokenPrices(tokenA?.symbol || ""),
          fetchTokenPrices(tokenB?.symbol || ""),
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
            contractId: FACTORY_ADDRESS,
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
            address: "CBHCRSVX3ZZ7EGTSYMKPEFGZNWRVCSESQR3UABET4MIW52N4EVU6BIZX",
            amount: 12500,
          },
          {
            address: "CBCZGGNOEUZG4CAAE7TGTQQHETZMKUT4OIPFHHPKEUX46U4KXBBZ3GLH",
            amount: 25000,
          },
          {
            address: "CD5XNKK3B6BEF2N7ULNHHGAMOKZ7P6456BFNIHRF4WNTEDKBRWAE7IAA",
            amount: 18750,
          },
        ];

        const poolIncentive = poolIncentives.find(
          (incentive) => incentive.address === poolAddress
        );

        const phoprice = await fetchPho();
        const _apr =
          ((poolIncentive?.amount || 0 * phoprice) / valueStaked) * 100 * 6;

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
            },
            {
              name: tokenB?.symbol || "",
              icon: `/cryptoIcons/${tokenB?.symbol.toLowerCase()}.svg`,
              amount:
                Number(pairInfo.result.asset_b.amount) /
                10 ** Number(tokenB?.decimals),
              category: "",
              usdValue: 0,
            },
          ],
          tvl: formatCurrency("USD", tvl.toString(), navigator.language),
          maxApr: `${(apr / 2).toFixed(2)}%`,
          userLiquidity: 0,
          poolAddress: poolAddress,
        };
      }
    } catch (e) {
      console.log(e);
    }
    return;
  }, []);

  /**
   * Fetch all pools' data.
   *
   * @async
   * @function fetchPools
   */
  const fetchPools = useCallback(async () => {
    try {
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
          el.poolAddress !==
            "CBXBKAB6QIRUGTG77OQZHC46BIIPA5WDKIKZKPA2H7Q7CPKQ555W3EVB"
      );
      setAllPools(poolsFiltered as Pool[]);
      setLoading(false);
    } catch (e) {
      console.error(e);
      appStore.setLoading(false);
    } finally {
      appStore.setLoading(false);
    }
  }, [fetchPool]);

  // On component mount, fetch pools
  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  // Render: conditionally display skeleton loader or pool data
  return loading ? (
    <Box sx={{ mt: { xs: 12, md: 0 }, maxWidth: "1440px" }}>
      {/* Hacky Title Injector - Waiting for Next Helmet for Next15 */}
      <input type="hidden" value="Phoenix DeFi Hub - Pools Overview" />

      <Skeleton.Pools />
    </Box>
  ) : (
    <Box sx={{ mt: { xs: 12, md: 0 }, width: "100%", maxWidth: "1440px" }}>
      {/* Hacky Title Injector - Waiting for Next Helmet for Next15 */}
      <input type="hidden" value="Phoenix DeFi Hub - Pools Overview" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
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
    </Box>
  );
}
