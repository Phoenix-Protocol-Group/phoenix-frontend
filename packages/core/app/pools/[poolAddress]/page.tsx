"use client";

import { Box, Typography, Grid, GlobalStyles, Button } from "@mui/material";
import {
  LiquidityMining,
  PoolLiquidity,
  PoolStats,
  StakingList,
  Token,
} from "@phoenix-protocol/ui";

import { PoolSuccess, PoolError, StakeSuccess } from "@/components/Modal/Modal";

import { time } from "@phoenix-protocol/utils";

import {
  PhoenixPairContract,
  PhoenixStakeContract,
} from "@phoenix-protocol/contracts";
import { useEffect, useState } from "react";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import Link from "next/link";

interface Entry {
  icon: string;
  title: string;
  apr: string;
  lockedPeriod: string;
  amount: {
    tokenAmount: string;
    tokenValueInUsd: string;
  };
  onClick: () => void;
}

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

  const [sucessModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [stakeModalOpen, setStakeModalOpen] = useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [errorDescription, setErrorDescripption] = useState<string>("");

  // Token Balances
  const [tokenA, setTokenA] = useState<_Token | undefined>(undefined);
  const [tokenB, setTokenB] = useState<_Token | undefined>(undefined);
  const [lpToken, setLpToken] = useState<_Token | undefined>(undefined);

  // Pool Liquidity
  const [poolLiquidity, setPoolLiquidity] = useState<number>(0);
  const [poolLiquidityTokenA, setPoolLiquidityTokenA] = useState<number>(0);
  const [poolLiquidityTokenB, setPoolLiquidityTokenB] = useState<number>(0);
  const [assetLpShare, setAssetLpShare] = useState<number>(0);

  // Stakes
  const [userStakes, setUserStakes] = useState<Entry[] | undefined>(undefined);

  // Provide Liquidity
  const provideLiquidity = async (
    tokenAAmount: number,
    tokenBAmount: number
  ) => {
    try {
      await PhoenixPairContract.provideLiquidity(
        {
          sender: storePersist.wallet.address as string,
          desired_a: BigInt(tokenAAmount * 10 ** (tokenA?.decimals || 7)),
          desired_b: BigInt(tokenBAmount * 10 ** (tokenB?.decimals || 7)),
          min_a: BigInt(1),
          min_b: BigInt(1),
          custom_slippage_bps: BigInt(1),
        },
        params.poolAddress as string,
        { fee: 300, responseType: "full" }
      );

      //!todo view transaction id in blockexplorer
      setSuccessModalOpen(true);
    } catch (error: any) {
      //!todo view transaction id in blockexplorer
      setErrorDescripption(error);
      setErrorModalOpen(true);
    }
  };

  // Remove Liquidity
  const removeLiquidity = async (lpTokenAmount: number) => {
    try {
      await PhoenixPairContract.withdrawLiquidity(
        {
          sender: storePersist.wallet.address as string,
          share_amount: BigInt(lpTokenAmount * 10 ** (lpToken?.decimals || 7)),
          min_a: BigInt(1),
          min_b: BigInt(1),
        },
        params.poolAddress as string
      );

      setStakeModalOpen(true);
    } catch (error: any) {
      setErrorDescripption(error);
      setErrorModalOpen(true);
    }
  };

  // Stake
  const stake = async (lpTokenAmount: number) => {
    try {
      await PhoenixStakeContract.bond(
        {
          sender: storePersist.wallet.address as string,
          tokens: BigInt(
            (lpTokenAmount * 10 ** (lpToken?.decimals || 7)).toFixed(0)
          ),
        },
        "CAIW4SDFLWC243A6VYB65XEUAODLQ3DSXAWVXYI4L766R2ZGDBBVFHNJ"
      );

      //!todo view transaction id in blockexplorer
      setStakeModalOpen(true);
    } catch (error) {}
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
        console.log(1);
        // Set token states
        setTokenA({
          name: tokenA?.symbol as string,
          icon: `/cryptoIcons/${tokenA?.symbol}.svg`.toLowerCase(),
          usdValue: 0,
          amount: Number(tokenA?.balance) / 10 ** Number(tokenA?.decimals),
          category: "none",
          decimals: Number(lpToken?.decimals),
        });
        setTokenB({
          name: tokenB?.symbol as string,
          icon: `/cryptoIcons/${tokenB?.symbol}.svg`.toLowerCase(),
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
        setAssetLpShare(
          Number(pairInfo.unwrap().asset_lp_share.get("amount")) /
            10 ** Number(lpToken?.decimals)
        );
        setPoolLiquidityTokenA(
          Number(pairInfo.unwrap().asset_a.get("amount")) /
            10 ** Number(tokenA?.decimals)
        );
        setPoolLiquidityTokenB(
          Number(pairInfo.unwrap().asset_b.get("amount")) /
            10 ** Number(tokenB?.decimals)
        );
      }

      if (storePersist.wallet.address) {
        // Get user stakes
        const stakes = await PhoenixStakeContract.queryStaked(
          {
            address: storePersist.wallet.address as string,
          },
          "CAIW4SDFLWC243A6VYB65XEUAODLQ3DSXAWVXYI4L766R2ZGDBBVFHNJ"
        );

        // If stakes are okay
        if (stakes.isOk()) {
          // If filled
          if (stakes.unwrap().stakes.length > 0) {
            const _stakes: Entry[] = stakes
              .unwrap()
              .stakes.map((stake: any) => {
                return {
                  icon: `/cryptoIcons/${lpToken?.name}.svg`.toLowerCase(),
                  title: lpToken?.name,
                  apr: "0",
                  lockedPeriod:
                    time.daysSinceTimestamp(Number(stake.stake_timestamp)) +
                    " days",
                  amount: {
                    tokenAmount:
                      Number(stake.stake) / 10 ** Number(lpToken?.decimals),
                    tokenValueInUsd: 0,
                  },
                  onClick: () => {},
                };
              });
            setUserStakes(_stakes);
          }
        }
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
  }, [storePersist.wallet.address]);

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
      {overviewStyles}
      {sucessModalOpen && (
        <PoolSuccess
          open={sucessModalOpen}
          setOpen={setSuccessModalOpen}
          onButtonClick={() => console.log("click")}
          tokens={[tokenA as Token, tokenB as Token]}
        />
      )}
      {errorModalOpen && (
        <PoolError
          open={errorModalOpen}
          setOpen={setErrorModalOpen}
          error={errorDescription}
        />
      )}
      {stakeModalOpen && (
        <StakeSuccess
          open={stakeModalOpen}
          setOpen={setStakeModalOpen}
          onButtonClick={() => console.log("click")}
          token={lpToken as Token}
        />
      )}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{ height: "2.5rem", width: "2.5rem" }}
            component="img"
            src={`/cryptoIcons/${tokenA?.name}.svg`.toLowerCase()}
          />
          <Box
            sx={{ ml: -1, height: "2.5rem", width: "2.5rem" }}
            component="img"
            src={`/cryptoIcons/${tokenB?.name}.svg`.toLowerCase()}
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
              rewards={[]}
              balance={lpToken?.amount || 0}
              onClaimRewards={() => {}}
              onStake={(amount) => {
                stake(amount);
              }}
              tokenName={lpToken?.name as string}
            />
          </Box>
          {userStakes && <StakingList entries={userStakes} />}
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
              liquidityA={Number(poolLiquidityTokenA)}
              liquidityB={Number(poolLiquidityTokenB)}
              liquidityToken={lpToken}
              onAddLiquidity={(tokenAAmount, tokenBAmount) => {
                provideLiquidity(tokenAAmount, tokenBAmount);
              }}
              onRemoveLiquidity={(liquidityTokenAmount) => {
                removeLiquidity(liquidityTokenAmount);
              }}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
