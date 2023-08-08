"use client";

import { Box, Typography, Grid, GlobalStyles, Button } from "@mui/material";
import {
  LiquidityMining,
  PoolLiquidity,
  PoolStats,
  StakingList,
  Token,
} from "@phoenix-protocol/ui";

import { PhoenixPairContract } from "@phoenix-protocol/contracts";
import { useEffect, useState } from "react";
import { useAppStore } from "@phoenix-protocol/state";
import Link from "next/link";

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

export default function Page({ params }: PoolPageProps) {
  // Load App Store
  const store = useAppStore();

  // Let's have some variable to see if the pool even exists
  const [poolNotFound, setPoolNotFound] = useState<boolean>(false);

  // Token Balances
  const [tokenA, setTokenA] = useState<Token | undefined>(undefined);
  const [tokenB, setTokenB] = useState<Token | undefined>(undefined);
  const [lpToken, setLpToken] = useState<Token | undefined>(undefined);

  // Fetch pool and balance infos

  // Function to fetch pool config and info from chain
  const getPool = async () => {
    try {
      // Fetch pool config and info from chain
      const [pairConfig, pairInfo] = await Promise.all([
        PhoenixPairContract.queryConfig(params.poolAddress),
        PhoenixPairContract.queryPoolInfo(params.poolAddress),
      ]);

      // When results ok...
      if (pairConfig.isOk() && pairInfo.isOk()) {
        // Fetch token infos from chain and save in global appstore
        const [tokenA, tokenB, lpToken] = await Promise.all([
          store.fetchTokenInfo(pairConfig.unwrap().token_a),
          store.fetchTokenInfo(pairConfig.unwrap().token_b),
          store.fetchTokenInfo(pairConfig.unwrap().share_token),
        ]);

        // Set token states
        setTokenA({
          name: tokenA?.symbol as string,
          icon: `/${tokenA?.symbol}`,
          usdValue: 0,
          amount: Number(tokenA?.balance) / 10 ** Number(tokenA?.decimals),
          category: "none",
        });
        setTokenB({
          name: tokenB?.symbol as string,
          icon: `/${tokenB?.symbol}`,
          usdValue: 0,
          amount: Number(tokenB?.balance) / 10 ** Number(tokenB?.decimals),
          category: "none",
        });
        setLpToken({
          name: lpToken?.symbol as string,
          icon: `/${lpToken?.symbol}`,
          usdValue: 0,
          amount: Number(lpToken?.balance) / 10 ** Number(lpToken?.decimals),
          category: "none",
        });
      }
    } catch (e) {
      // If pool not found, set poolNotFound to true
      console.log(e);
      setPoolNotFound(true);
    }
  };

  useEffect(() => {
    getPool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!params.poolAddress || poolNotFound) {
    return (
      <Box>
        <Typography>{"The pool you're looking for doesn't exist."}</Typography>
        <Typography>
          Return <Link href="/">Home</Link>
        </Typography>
      </Box>
    );
  }
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
          {tokenA?.name}-{tokenB?.name}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 2 }}>
            <PoolStats
              stats={[
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
              ]}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <LiquidityMining
              rewards={[
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
              ]}
              balance={400}
              onClaimRewards={() => {}}
              onStake={() => {}}
            />
          </Box>
          <StakingList
            entries={[
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
            ]}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          {tokenA && tokenB && lpToken && (
            <PoolLiquidity
              poolHistory={[
                [1687392000000, 152000],
                [1687478400000, 140400],
                [1687564800000, 160100],
                [1687651200000, 163300],
                [1687737600000, 150000],
                [1687824000000, 180000],
                [1687859473000, 200000],
              ]}
              tokenA={tokenA}
              tokenB={tokenB}
              liquidityA={10000}
              liquidityB={20000}
              liquidityToken={lpToken}
              onAddLiquidity={() => {}}
              onRemoveLiquidity={() => {}}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
