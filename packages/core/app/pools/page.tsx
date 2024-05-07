"use client";

import {
  PhoenixFactoryContract,
  PhoenixPairContract,
  PhoenixStakeContract,
  fetchPho,
} from "@phoenix-protocol/contracts";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { Pools, Skeleton } from "@phoenix-protocol/ui";
import {
  constants,
  fetchTokenPrices,
  formatCurrency,
} from "@phoenix-protocol/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Address } from "stellar-sdk";
import { Pool } from "@phoenix-protocol/types";
import { Helmet } from "react-helmet";
import { Box } from "@mui/material";
import { FACTORY_ADDRESS } from "@phoenix-protocol/utils/build/constants";

export default function Page() {
  const store = useAppStore(); // Global state management
  const router = useRouter(); // Next.js router
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [allPools, setAllPools] = useState<Pool[]>([]); // State to hold pool data
  const storePersist = usePersistStore(); // Persisted state

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
          store.fetchTokenInfo(Address.fromString(pairConfig.result.token_a)),
          store.fetchTokenInfo(Address.fromString(pairConfig.result.token_b)),
        ]);

        // Fetch prices and calculate TVL
        const [priceA, priceB] = await Promise.all([
          await fetchTokenPrices(tokenA?.symbol || ""),
          await fetchTokenPrices(tokenB?.symbol || ""),
        ]);

        const tvl =
          (priceA * Number(pairInfo.result.asset_a.amount)) /
            10 ** Number(tokenA?.decimals) +
          (priceB * Number(pairInfo.result.asset_b.amount)) /
            10 ** Number(tokenB?.decimals);

        const stakingAddress = pairInfo.result.stake_address;

        const StakeContract = new PhoenixStakeContract.Contract({
          contractId: stakingAddress,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
        });

        const stakingInfo = await StakeContract.queryTotalStaked();
        const totalStaked = Number(stakingInfo.result);

        const FactoryContract = new PhoenixFactoryContract.Contract({
          contractId: FACTORY_ADDRESS,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
        });

        const allPoolDetails = (await FactoryContract.queryAllPoolsDetails()).result;
        const totalTokens = Number(allPoolDetails.find((pool) => pool.pool_address === poolAddress)?.pool_response.asset_lp_share.amount);
        
        const ratioStaked = totalStaked / totalTokens;
        // Calculate APR by get the value of the total staked amount and the incentive amount
        const poolIncentives = [
          {
            // XLM / USDC
            address: "CBHCRSVX3ZZ7EGTSYMKPEFGZNWRVCSESQR3UABET4MIW52N4EVU6BIZX",
            amount: 50000,
          },
          // XLM/PHO
          {
            address: "CBCZGGNOEUZG4CAAE7TGTQQHETZMKUT4OIPFHHPKEUX46U4KXBBZ3GLH",
            amount: 100000,
          },
          {
            // PHO/USDC
            address: "CAZ6W4WHVGQBGURYTUOLCUOOHW6VQGAAPSPCD72VEDZMBBPY7H43AYEC",
            amount: 75000,
          },
        ];
        const valueStaked = tvl * ratioStaked;
        const poolIncentive = poolIncentives.find((incentive) => incentive.address === poolAddress)!;
        const phoprice = await fetchPho();
        const apr = ((poolIncentive?.amount * phoprice) / valueStaked) * 100 * 6;



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
          maxApr: `${(apr / 2).toFixed(2)}% + ${(apr / 2).toFixed(2)}% Airdrop `,
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

    const poolWithData =
      pools && Array.isArray(pools.result)
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
        el.poolAddress !==
          "CBXBKAB6QIRUGTG77OQZHC46BIIPA5WDKIKZKPA2H7Q7CPKQ555W3EVB" // TODO TESTNET DEBUG
    );
    setAllPools(poolsFiltered as Pool[]);
  };

  // Method for handling user tour events
  const initUserTour = () => {
    // Check if the user has already skipped the tour
    if (storePersist.userTour.skipped && !storePersist.userTour.active) {
      return;
    }

    // If the user has started the tour, we need to resume it from the last step
    if (storePersist.userTour.active) {
      store.setTourRunning(true);
      store.setTourStep(7);
    }
  };

  // On component mount, fetch pools and update loading state
  useEffect(() => {
    fetchPools().then(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect hook to initialize the user tour delayed to avoid hydration issues
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        initUserTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  // Render: conditionally display skeleton loader or pool data
  return loading ? (
    <Box sx={{ mt: { xs: 12, md: 0 } }}>
      <Helmet>
        <title>Phoenix DeFi Hub - Pools Overview</title>
      </Helmet>
      <Skeleton.Pools />
    </Box>
  ) : (
    <Box sx={{ mt: { xs: 12, md: 0 }, width: "100%" }}>
      <Helmet>
        <title>Phoenix DeFi Hub - Pools Overview</title>
      </Helmet>
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
    </Box>
  );
}
