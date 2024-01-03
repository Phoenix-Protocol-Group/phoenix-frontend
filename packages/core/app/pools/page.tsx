"use client";

import {
  PhoenixFactoryContract,
  PhoenixPairContract,
} from "@phoenix-protocol/contracts";
import { useAppStore } from "@phoenix-protocol/state";
import { Pools, Skeleton } from "@phoenix-protocol/ui";
import { constants } from "@phoenix-protocol/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Address } from "stellar-sdk";
import { Pool } from "@phoenix-protocol/types";

export default function Page() {
  const store = useAppStore(); // Global state management
  const router = useRouter(); // Next.js router
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [allPools, setAllPools] = useState<Pool[]>([]); // State to hold pool data

  // Fetch pool information by its address
  const fetchPool = async (poolAddress: string) => {
    try {
      const PairContract = new PhoenixPairContract.Contract({
        contractId: poolAddress,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      });

      const [pairConfig, pairInfo] = await Promise.all([
        PairContract.queryConfig(),
        PairContract.queryPoolInfo(),
      ]);

      if (pairConfig?.result && pairInfo?.result) {
        const [tokenA, tokenB] = await Promise.all([
          store.fetchTokenInfo(
            Address.fromString(pairConfig.result.unwrap().token_a)
          ),
          store.fetchTokenInfo(
            Address.fromString(pairConfig.result.unwrap().token_b)
          ),
        ]);

        // Construct and return pool object if all fetches are successful
        return {
          tokens: [
            {
              name: tokenA?.symbol || "",
              icon: `/cryptoIcons/${tokenA?.symbol.toLowerCase()}.svg`,
              amount:
                Number(pairInfo.result.unwrap().asset_a.amount) /
                10 ** Number(tokenA?.decimals),
              category: "",
              usdValue: 0,
            },
            {
              name: tokenB?.symbol || "",
              icon: `/cryptoIcons/${tokenB?.symbol.toLowerCase()}.svg`,
              amount:
                Number(pairInfo.result.unwrap().asset_b.amount) /
                10 ** Number(tokenB?.decimals),
              category: "",
              usdValue: 0,
            },
          ],
          tvl: "0",
          maxApr: "0",
          userLiquidity: 0,
          poolAddress: poolAddress,
        };
      }
    } catch (e) {
      console.log(e);
    }
    return;
  };

  // Fetch all pools' data
  const fetchPools = async () => {
    const FactoryContract = new PhoenixFactoryContract.Contract({
      contractId: constants.FACTORY_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });

    const pools = await FactoryContract.queryPools({});

    const poolWithData = pools
      ? await Promise.all(
          pools.result.map(async (pool: string) => {
            return await fetchPool(pool);
          })
        )
      : [];

    const poolsFiltered = poolWithData.filter(
      (el: any) =>
        el !== undefined ||
        el?.tokens.length >= 2 ||
        el.poolAddress !== "CBXBKAB6QIRUGTG77OQZHC46BIIPA5WDKIKZKPA2H7Q7CPKQ555W3EVB" // TODO TESTNET DEBUG
    );
    console.log(poolsFiltered);
    setAllPools(poolsFiltered as Pool[]);
  };

  // On component mount, fetch pools and update loading state
  useEffect(() => {
    fetchPools().then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render: conditionally display skeleton loader or pool data
  return loading ? (
    <Skeleton.Pools />
  ) : (
    <Pools
      pools={allPools}
      filter="ALL"
      sort="HighAPR"
      onAddLiquidityClick={() => {}}
      onShowDetailsClick={(pool) => {
        router.push(`/pools/${pool.poolAddress}`);
      }}
      onFilterClick={() => {}}
      onSortSelect={() => {}}
    />
  );
}
