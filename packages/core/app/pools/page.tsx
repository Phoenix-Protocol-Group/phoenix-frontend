"use client";

import {
  PhoenixFactoryContract,
  PhoenixPairContract,
} from "@phoenix-protocol/contracts";
import { useAppStore } from "@phoenix-protocol/state";
import { Pool, Pools, Token } from "@phoenix-protocol/ui";
import { constants } from "@phoenix-protocol/utils";
import { useEffect, useState } from "react";

const testTokens: Token[] = [
  {
    name: "USDT",
    icon: "cryptoIcons/usdt.svg",
    amount: 100,
    category: "Stable",
    usdValue: 1 * 100,
  },
  {
    name: "USDC",
    icon: "cryptoIcons/usdc.svg",
    amount: 50,
    category: "Stable",
    usdValue: 1 * 50,
  },
];

const testPool: Pool = {
  tokens: testTokens,
  tvl: "$29,573.57",
  maxApr: "98.65%",
  userLiquidity: 30,
};

const pools: Pool[] = [
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
];

export default function Page() {
  const store = useAppStore();
  const [allPools, setAllPools] = useState<Pool[]>([]);
  const fetchPool = async (poolAddress: string) => {
    try {
      // Fetch pool config and info from chain
      const [pairConfig, pairInfo] = await Promise.all([
        PhoenixPairContract.queryConfig(poolAddress),
        PhoenixPairContract.queryPoolInfo(poolAddress),
      ]);

      // When results ok...
      if (pairConfig.isOk() && pairInfo.isOk()) {
        // Fetch token infos from chain and save in global appstore
        const [tokenA, tokenB, lpToken] = await Promise.all([
          store.fetchTokenInfo(pairConfig.unwrap().token_a),
          store.fetchTokenInfo(pairConfig.unwrap().token_b),
          store.fetchTokenInfo(pairConfig.unwrap().share_token),
        ]);

        // Save Token info
        const tokens: Token[] = [
          {
            name: tokenA?.symbol || "",
            icon: `/cryptoIcons/${tokenA?.symbol}.svg`,
            amount:
              Number(pairInfo.unwrap().asset_a.get("amount")) /
              10 ** Number(tokenA?.decimals),
            category: "",
            usdValue: 0,
          },
          {
            name: tokenB?.symbol || "",
            icon: `/cryptoIcons/${tokenB?.symbol}.svg`,
            amount:
              Number(pairInfo.unwrap().asset_b.get("amount")) /
              10 ** Number(tokenB?.decimals),
            category: "",
            usdValue: 0,
          },
        ];

        return {
          tokens,
          tvl: "0",
          maxApr: "0",
          userLiquidity: 0,
        };
      }
    } catch (e) {
      // If pool not found, set poolNotFound to true
      console.log(e);
    }
  };
  const fetchPools = async () => {
    const pools = await PhoenixFactoryContract.queryPools(
      {},
      constants.FACTORY_ADDRESS
    );
    const poolWithData = await Promise.all(
      pools.unwrap().map(async (pool: string) => {
        return await fetchPool(pool);
      })
    );
    setAllPools(poolWithData);
  };
  useEffect(() => {
    fetchPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Pools
      pools={allPools}
      filter="ALL"
      sort="HighAPR"
      onAddLiquidityClick={() => {}}
      onShowDetailsClick={() => {}}
      onFilterClick={() => {}}
      onSortSelect={() => {}}
    />
  );
}
