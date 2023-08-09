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
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
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

interface _Token extends Token {
  readonly decimals: number;
}

export default function Page({ params }: PoolPageProps) {
  // Load App Store
  const store = useAppStore();
  const storePersist = usePersistStore();

  // Let's have some variable to see if the pool even exists
  const [poolNotFound, setPoolNotFound] = useState<boolean>(false);

  // Token Balances
  const [tokenA, setTokenA] = useState<_Token | undefined>(undefined);
  const [tokenB, setTokenB] = useState<_Token | undefined>(undefined);
  const [lpToken, setLpToken] = useState<_Token | undefined>(undefined);

  // Pool Liquidity
  const [poolLiquidity, setPoolLiquidity] = useState<number>(0);
  const [poolLiquidityTokenA, setPoolLiquidityTokenA] = useState<bigint>(
    BigInt(0)
  );
  const [poolLiquidityTokenB, setPoolLiquidityTokenB] = useState<bigint>(
    BigInt(0)
  );
  const [assetLpShare, setAssetLpShare] = useState<bigint>(BigInt(0));

  // Provide Liquidity
  const provideLiquidity = async (
    tokenAAmount: number,
    tokenBAmount: number
  ) => {
    PhoenixPairContract.provideLiquidity(
      {
        sender: storePersist.wallet.address as string,
        desired_a: BigInt(tokenAAmount * 10 ** (tokenA?.decimals || 7)),
        desired_b: BigInt(tokenBAmount * 10 ** (tokenA?.decimals || 7)),
        min_a: BigInt(0),
        min_b: BigInt(0),
        custom_slippage_bps: BigInt(0),
      },
      params.poolAddress as string
    );
  };

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
          decimals: Number(lpToken?.decimals),
        });
        setTokenB({
          name: tokenB?.symbol as string,
          icon: `/${tokenB?.symbol}`,
          usdValue: 0,
          amount: Number(tokenB?.balance) / 10 ** Number(tokenB?.decimals),
          category: "none",
          decimals: Number(lpToken?.decimals),
        });
        setLpToken({
          name: lpToken?.symbol as string,
          icon: `/${lpToken?.symbol}`,
          usdValue: 0,
          amount: Number(lpToken?.balance) / 10 ** Number(lpToken?.decimals),
          category: "none",
          decimals: Number(lpToken?.decimals),
        });
        setAssetLpShare(pairInfo.unwrap().asset_lp_share.amount);
        setPoolLiquidityTokenA(pairInfo.unwrap().asset_a.amount);
        setPoolLiquidityTokenB(pairInfo.unwrap().asset_b.amount);
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
                  value: poolLiquidity.toString(),
                },
                {
                  title: "My Share",
                  value: "$0.00",
                },
                {
                  title: "LP tokens",
                  value: lpToken?.amount.toString() || "0",
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
              liquidityA={tokenA.amount}
              liquidityB={tokenB.amount}
              liquidityToken={lpToken}
              onAddLiquidity={(tokenAAmount, tokenBAmount) => {
                provideLiquidity(tokenAAmount, tokenBAmount);
              }}
              onRemoveLiquidity={() => {}}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
