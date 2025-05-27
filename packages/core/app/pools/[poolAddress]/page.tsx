/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, use, useMemo, useCallback } from "react";
import * as refuse from "react-usestateref";
import { Box, GlobalStyles, Grid, Skeleton, Typography } from "@mui/material";
import {
  LiquidityMining,
  PoolLiquidity,
  PoolStats,
  Skeleton as PhoenixSkeleton,
  StakingList,
  UnstakeInfoModal,
} from "@phoenix-protocol/ui";
import { useContractTransaction } from "@/hooks/useContractTransaction";
import { Token } from "@phoenix-protocol/types";
import { Loading } from "../../../components/Modal/Modal";

import {
  API,
  constants,
  fetchTokenPrices,
  formatCurrency,
  resolveContractError,
  Signer,
  time,
} from "@phoenix-protocol/utils";

import {
  fetchPho,
  PhoenixPairContract,
  PhoenixStakeContract,
} from "@phoenix-protocol/contracts";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import Link from "next/link";
import Head from "next/head";

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
  onClickFix: () => void;
}

interface PoolPageProps {
  readonly params: Promise<{
    readonly poolAddress: string;
  }>;
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

export default function Page(props: PoolPageProps) {
  const params = use(props.params);
  // Load App Store
  const store = useAppStore();
  const storePersist = usePersistStore();

  const { executeContractTransaction } = useContractTransaction();

  // Let's have some variable to see if the pool even exists
  const [poolNotFound, setPoolNotFound] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [tokenAmounts, setTokenAmounts] = useState<number[]>([0]);

  // Token Balances
  const [tokenA, setTokenA] = useState<_Token | undefined>(undefined);
  const [tokenB, setTokenB] = useState<_Token | undefined>(undefined);
  const [lpToken, setLpToken] = useState<_Token | undefined>(undefined);

  // Set APR
  const [maxApr, setMaxApr] = useState<number>(0);

  // Rewards
  const [rewards, setRewards] = useState<Token[]>([]);
  // Stake Contract
  const [StakeContract, setStakeContract, StakeContractRef] = refuse.default<
    PhoenixStakeContract.Client | undefined
  >(undefined);

  // Pool Liquidity
  const [poolLiquidity, setPoolLiquidity] = useState<number>(0);
  const [poolLiquidityTokenA, setPoolLiquidityTokenA] = useState<number>(0);
  const [poolLiquidityTokenB, setPoolLiquidityTokenB] = useState<number>(0);
  const [assetLpShare, setAssetLpShare] = useState<number>(0);
  const [userShare, setUserShare] = useState<number>(0);
  const [lpTokenPrice, setLpTokenPrice] = useState<number>(0);

  // Stakes
  const [userStakes, setUserStakes] = useState<Entry[] | undefined>(undefined);
  const [stakeContractAddress, setStakeContractAddress] = useState<string>("");

  const [unstakeModalOpen, setUnstakeModalOpen] = useState<boolean>(false);
  const [isFixUnstake, setIsFixUnstake] = useState<boolean>(false);
  const [unstakeAmount, setUnstakeAmount] = useState<number>(0);
  const [unstakeTimestamp, setUnstakeTimestamp] = useState<number>(0);

  // Memoize the PairContract
  const PairContract = useMemo(
    () =>
      new PhoenixPairContract.Client({
        contractId: params.poolAddress,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      }),
    [params.poolAddress]
  );

  const appStore = useAppStore();

  const loadRewards = useCallback(
    async (stakeContract = StakeContract) => {
      try {
        // Stake Contract
        const _rewards = await stakeContract?.query_withdrawable_rewards({
          user: storePersist.wallet.address!,
        });

        const __rewards = _rewards?.result.rewards?.map(async (reward: any) => {
          // Get the token
          const token = await store.fetchTokenInfo(reward.reward_address);
          return {
            name: token?.symbol.toUpperCase(),
            icon: `/cryptoIcons/${token?.symbol.toLowerCase()}.svg`,
            usdValue: "0",
            amount:
              Number(reward.reward_amount.toString()) / 10 ** token?.decimals!,
            category: "",
          };
        });

        const rew = await Promise.all(__rewards);
        setRewards(rew);
      } catch (e) {
        console.log(e);
      }
    },
    [StakeContract, store, storePersist.wallet.address]
  );

  const fetchStakes = useCallback(
    async (
      name = lpToken?.name,
      stakeContract = StakeContract,
      calcApr = maxApr,
      tokenPrice = lpTokenPrice
    ) => {
      if (storePersist.wallet.address) {
        // Get user stakes
        const stakesA = await stakeContract?.query_staked(
          {
            address: storePersist.wallet.address!,
          },
          { simulate: false }
        );

        const stakes = await stakesA.simulate({ restore: true });
        // If stakes are okay
        if (stakes?.result) {
          // If filled
          if (stakes.result.stakes.length > 0) {
            //@ts-ignore
            const _stakes: Entry[] = stakes.result.stakes.map((stake: any) => {
              return {
                icon: `/cryptoIcons/poolIcon.png`,
                title: name!,
                apr:
                  // Calculate APR

                  (
                    (time.daysSinceTimestamp(Number(stake.stake_timestamp)) > 60
                      ? 60
                      : time.daysSinceTimestamp(
                          Number(stake.stake_timestamp)
                        )) *
                    (calcApr / 2 / 60)
                  ).toFixed(2) + "%",
                lockedPeriod:
                  time.daysSinceTimestamp(Number(stake.stake_timestamp)) +
                  " days",
                amount: {
                  tokenAmount: Number(stake.stake) / 10 ** 7,
                  tokenValueInUsd: (
                    (Number(stake.stake) / 10 ** 7) *
                    tokenPrice
                  ).toFixed(2),
                },
                onClick: () => {
                  setIsFixUnstake(false);
                  setUnstakeAmount(Number(stake.stake) / 10 ** 7);
                  setUnstakeTimestamp(stake.stake_timestamp);
                  setUnstakeModalOpen(true);
                },
                onClickFix: () => {
                  setIsFixUnstake(true);
                  setUnstakeAmount(Number(stake.stake) / 10 ** 7);
                  setUnstakeTimestamp(stake.stake_timestamp);
                  setUnstakeModalOpen(true);
                },
              };
            });
            setUserStakes(_stakes);
            await loadRewards(stakeContract);
            return _stakes;
          }
        }
      }
    },
    [
      lpToken?.name,
      StakeContract,
      maxApr,
      lpTokenPrice,
      storePersist.wallet.address,
      loadRewards,
    ]
  );

  /**
   * Fetch staking address with error handling
   */
  const fetchStakingAddress = useCallback(async (): Promise<
    string | undefined
  > => {
    try {
      // Fetch pool config and info from chain
      const [pairConfig, pairInfo] = await Promise.all([
        PairContract.query_config(),
        PairContract.query_pool_info(),
      ]);

      // When results ok...
      if (pairConfig?.result && pairInfo?.result) {
        // Fetch token infos
        const stakeContractId = pairConfig.result.stake_contract.toString();
        const stakeContractAddress = new PhoenixStakeContract.Client({
          contractId: stakeContractId,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
          publicKey: storePersist.wallet.address,
          signTransaction: (tx: string) => new Signer().sign(tx),
        });

        return stakeContractId;
      }
    } catch (e) {
      console.log("Error fetching staking address:", e);
    }
    return undefined;
  }, [PairContract, storePersist.wallet.address]);

  /**
   * Refresh pool data and balances after operations
   */
  const refreshPoolData = useCallback(async () => {
    await getPool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Provide liquidity to the pool with callback for balance updates
   */
  const provideLiquidity = useCallback(
    async (tokenAAmount: number, tokenBAmount: number) => {
      await executeContractTransaction({
        contractType: "pair",
        contractAddress: params.poolAddress,
        transactionFunction: async (client, restore) => {
          return client.provide_liquidity(
            {
              sender: storePersist.wallet.address!,
              desired_a: BigInt(
                (tokenAAmount * 10 ** (tokenA?.decimals || 7)).toFixed(0)
              ),
              desired_b: BigInt(
                (tokenBAmount * 10 ** (tokenB?.decimals || 7)).toFixed(0)
              ),
              min_a: undefined,
              min_b: undefined,
              custom_slippage_bps: undefined,
              deadline: undefined,
              auto_stake: false,
            },
            { simulate: !restore }
          );
        },
      });
    },
    [
      executeContractTransaction,
      params.poolAddress,
      storePersist.wallet.address,
      tokenA?.decimals,
      tokenB?.decimals,
      refreshPoolData,
    ]
  );

  /**
   * Remove liquidity from the pool with callback for balance updates
   */
  const removeLiquidity = useCallback(
    async (lpTokenAmount: number, fix?: boolean) => {
      await executeContractTransaction({
        contractType: "pair",
        contractAddress: params.poolAddress,
        transactionFunction: async (client, restore) => {
          return client.withdraw_liquidity(
            {
              sender: storePersist.wallet.address!,
              share_amount: BigInt(
                (lpTokenAmount * 10 ** (lpToken?.decimals || 7)).toFixed(0)
              ),
              min_a: BigInt(1),
              min_b: BigInt(1),
              deadline: undefined,
              auto_unstake: false,
            },
            { simulate: !restore }
          );
        },
      });
    },
    [
      executeContractTransaction,
      params.poolAddress,
      storePersist.wallet.address,
      lpToken?.decimals,
      refreshPoolData,
    ]
  );

  /**
   * Stake LP tokens with callback for balance updates
   */
  const stake = useCallback(
    async (lpTokenAmount: number) => {
      let stakeAddress: string | undefined = stakeContractAddress;
      if (!stakeAddress) {
        stakeAddress = await fetchStakingAddress();
        if (!stakeAddress) return;
      }

      await executeContractTransaction({
        contractType: "stake",
        contractAddress: stakeAddress,
        transactionFunction: async (client, restore) => {
          return client.bond(
            {
              sender: storePersist.wallet.address!,
              tokens: BigInt(
                (lpTokenAmount * 10 ** (lpToken?.decimals || 7)).toFixed(0)
              ),
            },
            { simulate: !restore }
          );
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      stakeContractAddress,
      fetchStakingAddress,
      executeContractTransaction,
      storePersist.wallet.address,
      lpToken?.decimals,
      fetchStakes,
      refreshPoolData,
    ]
  );

  /**
   * Unstake LP tokens with callback for balance updates
   */
  const unstake = useCallback(
    async (lpTokenAmount: number, stake_timestamp: number, fix?: boolean) => {
      let stakeAddress: string | undefined = stakeContractAddress;
      if (!stakeAddress) {
        stakeAddress = await fetchStakingAddress();
        if (!stakeAddress) return;
      }

      await executeContractTransaction({
        contractType: "stake",
        contractAddress: stakeAddress,
        transactionFunction: async (client, restore) => {
          return client.unbond(
            {
              sender: storePersist.wallet.address!,
              stake_amount: BigInt(
                (lpTokenAmount * 10 ** (lpToken?.decimals || 7)).toFixed(0)
              ),
              stake_timestamp: BigInt(stake_timestamp),
            },
            { simulate: !restore }
          );
        },
      });
    },
    [
      stakeContractAddress,
      fetchStakingAddress,
      executeContractTransaction,
      storePersist.wallet.address,
      lpToken?.decimals,
      refreshPoolData,
    ]
  );

  // Function to fetch pool config and info from chain
  const getPool = async () => {
    try {
      // Fetch pool config and info from chain
      const [pairConfig, pairInfo] = await Promise.all([
        PairContract.query_config(),
        PairContract.query_pool_info(),
      ]);

      // When results ok...
      if (pairConfig?.result && pairInfo?.result) {
        // Fetch token infos from chain and save in global appstore
        const [_tokenA, _tokenB, _lpToken, stakeContractAddress] =
          await Promise.all([
            store.fetchTokenInfo(pairConfig.result.token_a),
            store.fetchTokenInfo(pairConfig.result.token_b),
            store.fetchTokenInfo(pairConfig.result.share_token, true),
            new PhoenixStakeContract.Client({
              contractId: pairConfig.result.stake_contract.toString(),
              networkPassphrase: constants.NETWORK_PASSPHRASE,
              rpcUrl: constants.RPC_URL,
              signTransaction: (tx: string) => new Signer().sign(tx),
              publicKey: storePersist.wallet.address,
            }),
          ]);
        setStakeContractAddress(pairConfig.result.stake_contract.toString());

        // Fetch prices and calculate TVL
        const [priceA, priceB] = await Promise.all([
          API.getPrice(_tokenA?.symbol || ""),
          API.getPrice(_tokenB?.symbol || ""),
        ]);

        const tvl =
          (priceA * Number(pairInfo.result.asset_a.amount)) /
            10 ** Number(_tokenA?.decimals) +
          (priceB * Number(pairInfo.result.asset_b.amount)) /
            10 ** Number(_tokenB?.decimals);

        setPoolLiquidity(tvl);
        setStakeContract(stakeContractAddress);
        // Set token states
        setTokenA({
          name: _tokenA?.symbol as string,
          icon: `/cryptoIcons/${_tokenA?.symbol.toLowerCase()}.svg`,
          usdValue: Number(priceA),
          amount: Number(_tokenA?.balance) / 10 ** Number(_tokenA?.decimals),
          category: "none",
          decimals: Number(_tokenA?.decimals),
        });
        setTokenB({
          name: _tokenB?.symbol as string,
          icon: `/cryptoIcons/${_tokenB?.symbol.toLowerCase()}.svg`,
          usdValue: Number(priceB),
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
          Number(pairInfo.result.asset_lp_share.amount) /
            10 ** Number(_lpToken?.decimals)
        );
        setPoolLiquidityTokenA(
          Number(
            (
              Number(pairInfo.result.asset_a.amount) /
              10 ** Number(_tokenA?.decimals)
            ).toFixed(2)
          )
        );
        setPoolLiquidityTokenB(
          Number(
            (
              Number(pairInfo.result.asset_b.amount) /
              10 ** Number(_tokenB?.decimals)
            ).toFixed(2)
          )
        );

        const poolIncentives = [
          {
            // XLM / USDC
            address: "CBHCRSVX3ZZ7EGTSYMKPEFGZNWRVCSESQR3UABET4MIW52N4EVU6BIZX",
            amount: 12500,
          },
          // XLM/PHO
          {
            address: "CBCZGGNOEUZG4CAAE7TGTQQHETZMKUT4OIPFHHPKEUX46U4KXBBZ3GLH",
            amount: 25000,
          },
          {
            // PHO/USDC
            address: "CD5XNKK3B6BEF2N7ULNHHGAMOKZ7P6456BFNIHRF4WNTEDKBRWAE7IAA",
            amount: 18750,
          },
        ];

        const stakingInfoA = await stakeContractAddress.query_total_staked({
          simulate: false,
        });
        const stakingInfo = await stakingInfoA.simulate({ restore: true });
        const totalStaked = Number(stakingInfo?.result);

        const ratioStaked =
          totalStaked / Number(pairInfo.result.asset_lp_share.amount);
        const valueStaked = tvl * ratioStaked;
        const poolIncentive = poolIncentives.find(
          (incentive) => incentive.address === params.poolAddress
        )!;
        const phoprice = await fetchPho();
        const apr =
          ((poolIncentive?.amount * phoprice) / valueStaked) * 100 * 6;

        const tokenPrice = valueStaked / (totalStaked / 10 ** 7);
        setLpTokenPrice(tokenPrice);
        const stakes = await fetchStakes(
          _lpToken?.symbol,
          stakeContractAddress,
          apr,
          tokenPrice
        );
        // Get user share
        if (storePersist.wallet.address) {
          if (pairInfo.result) {
            // Get the total amount of LP tokens in the pool
            const info = pairInfo.result;

            const lpShareAmount = Number(info.asset_lp_share.amount);
            const lpShareAmountDec =
              Number(lpShareAmount) / 10 ** (_lpToken?.decimals || 7);

            // Get the amount of LP tokens the user has as balance or staked
            const userLpTokenAmount =
              Number(_lpToken!.balance || 0) / 10 ** (_lpToken?.decimals || 7);

            const summedStakes =
              stakes?.reduce(
                (acc, stake) => acc + Number(stake.amount.tokenAmount),
                0
              ) || 0;

            // Total LP tokens of the user
            const totalUserLPTokens = userLpTokenAmount + summedStakes;

            // Price per Unit
            const pricePerUnit = tvl / lpShareAmountDec;

            // User share
            setUserShare(totalUserLPTokens * pricePerUnit);
          }
        }
      }
    } catch (e) {
      // If pool not found, set poolNotFound to true
      console.log(e);
      setPoolNotFound(true);
      appStore.setLoading(false);
    } finally {
      appStore.setLoading(false);
    }
  };

  /**
   * Claim rewards with callback for balance updates
   */
  const claimTokens = useCallback(async () => {
    let stakeAddress: string | undefined = stakeContractAddress;
    if (!stakeAddress) {
      stakeAddress = await fetchStakingAddress();
      if (!stakeAddress) return;
    }

    await executeContractTransaction({
      contractType: "stake",
      contractAddress: stakeAddress,
      transactionFunction: async (client, restore) => {
        return client.withdraw_rewards(
          {
            sender: storePersist.wallet.address!,
          },
          { simulate: !restore }
        );
      },
    });
  }, [
    stakeContractAddress,
    fetchStakingAddress,
    executeContractTransaction,
    storePersist.wallet.address,
    refreshPoolData,
  ]);

  // Fetch pool data when address changes
  useEffect(() => {
    if (storePersist.wallet.address) {
      getPool();
    }
  }, [storePersist.wallet.address]);

  if (!params.poolAddress || poolNotFound) {
    return (
      <Box sx={{ mt: { xs: 12, md: 0 }, maxWidth: "1440px" }}>
        <Typography>{"The pool you're looking for doesn't exist."}</Typography>
        <Typography>
          Return <Link href="/">Home</Link>
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ mt: { xs: 12, md: 0 }, maxWidth: "1440px" }}>
      {/* Hacky Title Injector - Waiting for Next Helmet for Next15 */}
      <input type="hidden" value={`Phoenix DeFi Hub - Pool`} />
      {overviewStyles}
      {loading && <Loading open={loading} setOpen={setLoading} />}
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
                  value: formatCurrency(
                    "USD",
                    poolLiquidity.toString(),
                    navigator.language
                  ),
                },
                {
                  title: "My Share",
                  value: storePersist.wallet.address
                    ? formatCurrency(
                        "USD",
                        userShare.toString(),
                        navigator.language
                      )
                    : "-",
                },
                {
                  title: "LP tokens",
                  value: lpToken?.amount.toString() || "0",
                },
                {
                  title: "Swap fee",
                  value: "1%",
                },
              ]}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <LiquidityMining
              rewards={rewards}
              balance={lpToken?.amount || 0}
              onClaimRewards={() => claimTokens()}
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
              onRemoveLiquidity={(liquidityTokenAmount, fix) => {
                removeLiquidity(liquidityTokenAmount, fix);
              }}
            />
          ) : (
            <PhoenixSkeleton.PoolLiquidity />
          )}
        </Grid>
      </Grid>
      <UnstakeInfoModal
        open={unstakeModalOpen}
        onConfirm={async () => {
          if (isFixUnstake) {
            setUnstakeModalOpen(false);
            await unstake(unstakeAmount, unstakeTimestamp, true);
          } else {
            setUnstakeModalOpen(false);
            await unstake(unstakeAmount, unstakeTimestamp);
          }
        }}
        onClose={() => setUnstakeModalOpen(false)}
      />
    </Box>
  );
}
