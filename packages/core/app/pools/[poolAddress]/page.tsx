"use client";

import { Box, Typography, Grid, GlobalStyles, Button } from "@mui/material";
import {
  LiquidityMining,
  PoolLiquidity,
  PoolStats,
  StakingList,
} from "@phoenix-protocol/ui";

import { PhoenixPairContract } from "@phoenix-protocol/contracts";
import { useEffect, useState } from "react";
import { useAppStore } from "@phoenix-protocol/state";

interface PoolPageProps {
  readonly params: {
    readonly poolAddress: string;
  };
}

const overviewStyles = (
  <GlobalStyles
    styles={{
      body: { background: "linear-gradient(180deg, #1F2123 0%, #131517 100%)" },
    }}
  />
);

const testTokens = [
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
  {
    name: "DAI",
    icon: "cryptoIcons/dai.svg",
    amount: 25,
    category: "Stable",
    usdValue: 1 * 25,
  },
  {
    name: "XLM",
    icon: "cryptoIcons/xlm.svg",
    amount: 200,
    category: "Non-Stable",
    usdValue: 0.85 * 200,
  },
  {
    name: "BTC",
    icon: "cryptoIcons/btc.svg",
    amount: 0.5,
    category: "Non-Stable",
    usdValue: 30000 * 0.5,
  },
];

const args = {
  poolStatArgs: {
    stats: [
      {
        title: "TVL",
        value: "$100,000.00",
      },
      {
        title: "My Share",
        value: "$0.00",
      },
      {
        title: "LP tokens",
        value: "0.00",
      },
      {
        title: "Swap fee",
        value: "0.3%",
      },
    ],
  },
  lpArgs: {
    rewards: [
      {
        name: "DAI",
        icon: "cryptoIcons/dai.svg",
        amount: 25,
        category: "Stable",
        usdValue: 1 * 25,
      },
      {
        name: "XLM",
        icon: "cryptoIcons/xlm.svg",
        amount: 200,
        category: "Non-Stable",
        usdValue: 0.85 * 200,
      },
    ],
    balance: 800,
  },
  stakingListArgs: {
    entries: [
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "3.5%",
        lockedPeriod: "1 day",
        amount: {
          tokenAmount: "10,000.5",
          tokenValueInUsd: "100,000.25",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "5.5%",
        lockedPeriod: "10 days",
        amount: {
          tokenAmount: "5,500.75",
          tokenValueInUsd: "55,000.50",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "7.5%",
        lockedPeriod: "20 days",
        amount: {
          tokenAmount: "2,250.25",
          tokenValueInUsd: "22,502.50",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "9.5%",
        lockedPeriod: "30 days",
        amount: {
          tokenAmount: "1,200.35",
          tokenValueInUsd: "12,003.75",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "11.5%",
        lockedPeriod: "40 days",
        amount: {
          tokenAmount: "800.75",
          tokenValueInUsd: "8,007.50",
        },
        onClick: () => {
          // Empty function
        },
      },
      // Add more entries as needed
    ],
  },
  poolLiquidityArgs: {
    poolHistory: [
      [1687392000000, 152000],
      [1687478400000, 140400],
      [1687564800000, 160100],
      [1687651200000, 163300],
      [1687737600000, 150000],
      [1687824000000, 180000],
      [1687859473000, 200000],
    ],
    tokenA: testTokens[0],
    tokenB: testTokens[1],
    liquidityA: 10000,
    liquidityB: 20000,
    liquidityToken: testTokens[0],
    onAddLiquidity: () => {},
    onRemoveLiquidity: () => {},
  },
};

export default function Page({ params }: PoolPageProps) {
  const store = useAppStore();

  const fetchToken = async (tokenId: string) => {
    const token = store.tokens.find(
      (el) => el.id === tokenId
    );

    if(token) {
      return token;
    }
  
    return await store.fetchTokenBalance(
      tokenId
    );
  };
  
  const getPool = async () => {
    const pairConfigResult = await PhoenixPairContract.query_config({
      contractId: "CBL2R7RR6DCMNCTBGBXUKWULEP76DCWNKVVFY5DEKRINW3XRNN2ZCOCL",
    });

    const pairInfoResult = await PhoenixPairContract.query_pool_info({
      contractId: "CBL2R7RR6DCMNCTBGBXUKWULEP76DCWNKVVFY5DEKRINW3XRNN2ZCOCL",
    });

    if(pairConfigResult.isOk() && pairInfoResult.isOk()) {
      const pairConfig = pairConfigResult.unwrap();
      const pairInfo = pairInfoResult.unwrap();

      console.log(pairConfig, pairInfo);

      const lpBalance = await fetchToken(pairConfig.token_a);
      console.log(lpBalance);
    }
  };

  useEffect(() => {
    getPool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Box>
      <Button onClick={() => getPool()}>Foo</Button>
      {overviewStyles}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{ height: "2.5rem", width: "2.5rem" }}
            component="img"
            src="cryptoIcons/btc.svg"
          />
          <Box
            sx={{ ml: -1, height: "2.5rem", width: "2.5rem" }}
            component="img"
            src="cryptoIcons/usdc.svg"
          />
        </Box>
        <Typography sx={{ fontSize: "2rem", fontWeight: 700, ml: 1 }}>
          BTC-USDC
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 2 }}>
            <PoolStats {...args.poolStatArgs} />
          </Box>
          <Box sx={{ mb: 4 }}>
            <LiquidityMining
              {...args.lpArgs}
              onClaimRewards={() => {}}
              onStake={() => {}}
            />
          </Box>
          <StakingList {...args.stakingListArgs} />
        </Grid>
        <Grid item xs={12} md={4}>
          <PoolLiquidity {...args.poolLiquidityArgs} />
        </Grid>
      </Grid>
    </Box>
  );
}
