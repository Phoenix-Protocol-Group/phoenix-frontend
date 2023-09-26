"use client";

import {
  PhoenixFactoryContract,
  PhoenixPairContract,
  PhoenixStakeContract,
} from "@phoenix-protocol/contracts";
import { useAppStore } from "@phoenix-protocol/state";
import { Pool, Pools, Token } from "@phoenix-protocol/ui";
import { constants } from "@phoenix-protocol/utils";
import { FACTORY_ADDRESS } from "@phoenix-protocol/utils/build/constants";
import { useEffect, useState } from "react";
import { Address } from "stellar-base";
import { useRouter } from "next/navigation";

export default function Page() {
  const store = useAppStore();
  const router = useRouter();
  const [allPools, setAllPools] = useState<Pool[]>([]);
  const [stakeContract, setStakeContract] = useState<PhoenixStakeContract.Contract | undefined>(undefined);
  const fetchPool = async (poolAddress: Address) => {
    try {
      const PairContract = new PhoenixPairContract.Contract({
        contractId: poolAddress.toString(),
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      });

      // Fetch pool config and info from chain
      const [pairConfig, pairInfo] = await Promise.all([
        PairContract.queryConfig(),
        PairContract.queryPoolInfo(),
      ]);

      // When results ok...
      if (pairConfig?.isOk() && pairInfo?.isOk()) {
        // Fetch token infos from chain and save in global appstore
        const [tokenA, tokenB, lpToken, stakeContract] = await Promise.all([
          store.fetchTokenInfo(pairConfig.unwrap().token_a),
          store.fetchTokenInfo(pairConfig.unwrap().token_b),
          store.fetchTokenInfo(pairConfig.unwrap().share_token),
          new PhoenixStakeContract.Contract({
            contractId: pairConfig.unwrap().stake_contract.toString(),
            networkPassphrase: constants.NETWORK_PASSPHRASE,
            rpcUrl: constants.RPC_URL,
          }),
        ]);

        setStakeContract(stakeContract);

        // Save Token info
        const tokens: Token[] = [
          {
            name: tokenA?.symbol || "",
            icon: `/cryptoIcons/${tokenA?.symbol.toLowerCase()}.svg`,
            amount:
              Number(pairInfo.unwrap().asset_a.amount) /
              10 ** Number(tokenA?.decimals),
            category: "",
            usdValue: 0,
          },
          {
            name: tokenB?.symbol || "",
            icon: `/cryptoIcons/${tokenB?.symbol.toLowerCase()}.svg`,
            amount:
              Number(pairInfo.unwrap().asset_b.amount) /
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
          poolAddress: poolAddress.toString(),
        };
      }
      return {
        tokens: [],
        tvl: "0",
        maxApr: "0",
        userLiquidity: 0,
        poolAddress: "",
      };
    } catch (e) {
      // If pool not found, set poolNotFound to true
      console.log(e);
      return {
        tokens: [],
        tvl: "0",
        maxApr: "0",
        userLiquidity: 0,
        poolAddress: "",
      };
    }
  };
  const fetchPools = async () => {
    const FactoryContract = new PhoenixFactoryContract.Contract({
      contractId: FACTORY_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });
    const pools = await FactoryContract.queryPools({});

    const poolWithData = pools
      ? await Promise.all(
          pools.unwrap().map(async (pool: Address) => {
            return await fetchPool(pool);
          })
        )
      : [];
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
      onShowDetailsClick={(pool) => {
        router.push(`/pools/${pool.poolAddress}`);
      }}
      onFilterClick={() => {}}
      onSortSelect={() => {}}
    />
  );
}
