"use client";

import React from "react";
import * as refuse from "react-usestateref";
import {
  Box,
  Typography,
  Grid,
  GlobalStyles,
  Button,
  Skeleton,
} from "@mui/material";
import {
  LiquidityMining,
  PoolLiquidity,
  PoolStats,
  StakingList,
  Skeleton as PhoenixSkeleton,
} from "@phoenix-protocol/ui";
import { Token } from "@phoenix-protocol/types";
import {
  PoolSuccess,
  PoolError,
  StakeSuccess,
  Loading,
  UnstakeSuccess,
} from "../../../components/Modal/Modal";

import { constants, time } from "@phoenix-protocol/utils";

import { Address } from "stellar-sdk";

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
  const [unstakeModalOpen, setUnstakeModalOpen] = useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorDescription, setErrorDescripption] = useState<string>("");
  const [tokenAmounts, setTokenAmounts] = useState<number[]>([0]);

  // Token Balances
  const [tokenA, setTokenA] = useState<_Token | undefined>(undefined);
  const [tokenB, setTokenB] = useState<_Token | undefined>(undefined);
  const [lpToken, setLpToken] = useState<_Token | undefined>(undefined);

  // Stake Contract
  const [StakeContract, setStakeContract, StakeContractRef] = refuse.default<
    PhoenixStakeContract.Contract | undefined
  >(undefined);

  // Pool Liquidity
  const [poolLiquidity, setPoolLiquidity] = useState<number>(0);
  const [poolLiquidityTokenA, setPoolLiquidityTokenA] = useState<number>(0);
  const [poolLiquidityTokenB, setPoolLiquidityTokenB] = useState<number>(0);
  const [assetLpShare, setAssetLpShare] = useState<number>(0);

  // Stakes
  const [userStakes, setUserStakes] = useState<Entry[] | undefined>(undefined);

  const PairContract = new PhoenixPairContract.Contract({
    contractId: params.poolAddress,
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });

  // Provide Liquidity
  const provideLiquidity = async (
    tokenAAmount: number,
    tokenBAmount: number
  ) => {
    try {
      setLoading(true);

      const tx = await PairContract.provideLiquidity({
        sender: storePersist.wallet.address!,
        desired_a: BigInt(
          (tokenAAmount * 10 ** (tokenA?.decimals || 7)).toFixed(0)
        ),
        desired_b: BigInt(
          (tokenBAmount * 10 ** (tokenB?.decimals || 7)).toFixed(0)
        ),
        min_a: BigInt(1),
        min_b: BigInt(1),
        custom_slippage_bps: BigInt(1),
      });
      await tx.signAndSend();
      console.log(tx);
      setLoading(false);
      //!todo view transaction id in blockexplorer
      setTokenAmounts([tokenAAmount, tokenBAmount]);
      setSuccessModalOpen(true);
    } catch (error: any) {
      //!todo view transaction id in blockexplorer
      setLoading(false);
      setErrorDescripption(error);
      setErrorModalOpen(true);
    }
  };

  // Remove Liquidity
  const removeLiquidity = async (lpTokenAmount: number) => {
    try {
      setLoading(true);

      const tx = await PairContract.withdrawLiquidity({
        sender: storePersist.wallet.address!,
        share_amount: BigInt(
          (lpTokenAmount * 10 ** (lpToken?.decimals || 7)).toFixed(0)
        ),
        min_a: BigInt(1),
        min_b: BigInt(1),
      });
      await tx.signAndSend();
      setLoading(false);
      setTokenAmounts([lpTokenAmount]);
      setStakeModalOpen(true);
    } catch (error: any) {
      setLoading(false);
      setErrorDescripption(error);
      setErrorModalOpen(true);
    }
  };

  // Stake
  const stake = async (lpTokenAmount: number) => {
    try {
      setLoading(true);

      const tx = await StakeContractRef.current?.bond({
        sender: storePersist.wallet.address!,
        tokens: BigInt(
          (lpTokenAmount * 10 ** (lpToken?.decimals || 7)).toFixed(0)
        ),
      });
      await tx?.signAndSend();
      await fetchStakes();
      setLoading(false);
      //!todo view transaction id in blockexplorer
      setTokenAmounts([lpTokenAmount]);
      setStakeModalOpen(true);
    } catch (error: any) {
      setLoading(false);
      setErrorDescripption(error);
      setErrorModalOpen(true);
    }
  };

  // Stake
  const unstake = async (lpTokenAmount: number, stake_timestamp: number) => {
    try {
      setLoading(true);

      const tx = await StakeContractRef.current?.unbond({
        sender: storePersist.wallet.address!,
        stake_amount: BigInt(
          (lpTokenAmount * 10 ** (lpToken?.decimals || 7)).toFixed(0)
        ),
        stake_timestamp: BigInt(stake_timestamp),
      });
      await tx?.signAndSend();
      setLoading(false);
      //!todo view transaction id in blockexplorer
      setTokenAmounts([lpTokenAmount]);
      setUnstakeModalOpen(true);
    } catch (error: any) {
      setLoading(false);
      setErrorDescripption(error);
      setErrorModalOpen(true);
    }
  };

  // Function to fetch pool config and info from chain
  const getPool = async () => {
    try {
      // Fetch pool config and info from chain
      const [pairConfig, pairInfo] = await Promise.all([
        PairContract.queryConfig(),
        PairContract.queryPoolInfo(),
      ]);

      // When results ok...
      if (pairConfig?.result.isOk() && pairInfo?.result.isOk()) {
        // Fetch token infos from chain and save in global appstore
        const [_tokenA, _tokenB, _lpToken, stakeContractAddress] =
          await Promise.all([
            store.fetchTokenInfo(
              Address.fromString(pairConfig.result.unwrap().token_a)
            ),
            store.fetchTokenInfo(
              Address.fromString(pairConfig.result.unwrap().token_b)
            ),
            store.fetchTokenInfo(
              Address.fromString(pairConfig.result.unwrap().share_token)
            ),
            new PhoenixStakeContract.Contract({
              contractId: pairConfig.result.unwrap().stake_contract.toString(),
              networkPassphrase: constants.NETWORK_PASSPHRASE,
              rpcUrl: constants.RPC_URL,
            }),
          ]);

        setStakeContract(stakeContractAddress);
        // Set token states
        setTokenA({
          name: _tokenA?.symbol as string,
          icon: `/cryptoIcons/${_tokenA?.symbol.toLowerCase()}.svg`,
          usdValue: 0,
          amount: Number(_tokenA?.balance) / 10 ** Number(_tokenA?.decimals),
          category: "none",
          decimals: Number(_tokenA?.decimals),
        });
        setTokenB({
          name: _tokenB?.symbol as string,
          icon: `/cryptoIcons/${_tokenB?.symbol.toLowerCase()}.svg`,
          usdValue: 0,
          amount: Number(_tokenB?.balance) / 10 ** Number(_tokenB?.decimals),
          category: "none",
          decimals: Number(_tokenB?.decimals),
        });
        setLpToken({
          name: _lpToken?.symbol as string,
          icon: `/cryptoIcons/poolIcon.png`,
          usdValue: 0,
          amount: Number(_lpToken?.balance) / 10 ** Number(_lpToken?.decimals),
          category: "none",
          decimals: Number(_lpToken?.decimals),
        });
        setAssetLpShare(
          Number(pairInfo.result.unwrap().asset_lp_share.amount) /
            10 ** Number(_lpToken?.decimals)
        );
        setPoolLiquidityTokenA(
          Number(
            (
              Number(pairInfo.result.unwrap().asset_a.amount) /
              10 ** Number(_tokenA?.decimals)
            ).toFixed(2)
          )
        );
        setPoolLiquidityTokenB(
          Number(
            (
              Number(pairInfo.result.unwrap().asset_b.amount) /
              10 ** Number(_tokenB?.decimals)
            ).toFixed(2)
          )
        );
        fetchStakes(_lpToken?.symbol, stakeContractAddress);
      }
    } catch (e) {
      // If pool not found, set poolNotFound to true
      console.log(e);
      setPoolNotFound(true);
    }
  };

  const fetchStakes = async (
    name = lpToken?.name,
    stakeContract = StakeContract
  ) => {
    if (storePersist.wallet.address) {
      // Get user stakes
      const stakes = await stakeContract?.queryStaked({
        address: storePersist.wallet.address!,
      });

      // If stakes are okay
      if (stakes?.result) {
        // If filled
        if (stakes.result.stakes.length > 0) {
          //@ts-ignore
          const _stakes: Entry[] = stakes.result.stakes.map((stake: any) => {
            return {
              icon: `/cryptoIcons/poolIcon.png`,
              title: name!,
              apr: "0",
              lockedPeriod:
                time.daysSinceTimestamp(Number(stake.stake_timestamp)) +
                " days",
              amount: {
                tokenAmount: Number(stake.stake) / 10 ** 7,
                tokenValueInUsd: 0,
              },
              onClick: () => {
                unstake(Number(stake.stake) / 10 ** 7, stake.stake_timestamp);
              },
            };
          });
          setUserStakes(_stakes);
        }
      }
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
      {loading && <Loading open={loading} setOpen={setLoading} />}
      {sucessModalOpen && (
        <PoolSuccess
          open={sucessModalOpen}
          setOpen={setSuccessModalOpen}
          tokenAmounts={tokenAmounts}
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
          tokenAmounts={tokenAmounts}
          setOpen={setStakeModalOpen}
          onButtonClick={() => console.log("click")}
          token={lpToken as Token}
        />
      )}
      {unstakeModalOpen && (
        <UnstakeSuccess
          open={unstakeModalOpen}
          tokenAmounts={tokenAmounts}
          setOpen={setUnstakeModalOpen}
          onButtonClick={() => console.log("click")}
          token={lpToken as Token}
        />
      )}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {tokenA?.icon ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{ height: "2.5rem", width: "2.5rem" }}
              component="img"
              src={tokenA?.icon}
            />
            <Box
              sx={{ ml: -1, height: "2.5rem", width: "2.5rem" }}
              component="img"
              src={tokenB?.icon}
            />
          </Box>
        ) : (
          <>
            <Skeleton variant="circular" width={60} height={60} />
            <Skeleton variant="circular" width={60} height={60} />
          </>
        )}

        {tokenA?.name ? (
          <Typography sx={{ fontSize: "2rem", fontWeight: 700, ml: 1 }}>
            {tokenA?.name}-{tokenB?.name}
          </Typography>
        ) : (
          <Skeleton width={210} height={60}></Skeleton>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 2 }}>
            <PoolStats
              stats={[
                {
                  title: "TVL",
                  value: "-",
                },
                {
                  title: "My Share",
                  value: "-",
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
          {tokenA && tokenB && lpToken ? (
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
          ) : (
            <PhoenixSkeleton.PoolLiquidity />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
