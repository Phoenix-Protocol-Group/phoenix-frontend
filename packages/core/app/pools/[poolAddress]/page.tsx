"use client";

import React, {useEffect, useState} from "react";
import * as refuse from "react-usestateref";
import {Box, GlobalStyles, Grid, Skeleton, Typography} from "@mui/material";
import {
  LiquidityMining,
  PoolLiquidity,
  PoolStats,
  Skeleton as PhoenixSkeleton,
  StakingList,
} from "@phoenix-protocol/ui";
import {Token} from "@phoenix-protocol/types";
import {Loading, PoolError, PoolSuccess, StakeSuccess, UnstakeSuccess,} from "../../../components/Modal/Modal";

import {
  constants,
  fetchTokenPrices,
  formatCurrency,
  resolveContractError,
  Signer,
  time,
} from "@phoenix-protocol/utils";

import {fetchPho, PhoenixPairContract, PhoenixStakeContract,} from "@phoenix-protocol/contracts";
import {useAppStore, usePersistStore} from "@phoenix-protocol/state";
import Link from "next/link";
import {Helmet} from "react-helmet";

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

  // Set APR
  const [maxApr, setMaxApr] = useState<number>(0);

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

  const PairContract = new PhoenixPairContract.Client({
    contractId: params.poolAddress,
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });

  // Method for handling user tour events
  const initUserTour = () => {
    // Check if the user has already skipped the tour
    if (storePersist.userTour.skipped && !storePersist.userTour.active) {
      return;
    }

    // If the user has started the tour, we need to resume it from the last step
    if (storePersist.userTour.active) {
      store.setTourRunning(true);
      store.setTourStep(8);
    }
  };

  // Effect hook to initialize the user tour delayed to avoid hydration issues
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        initUserTour();
      }, 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const fetchStakingAddress = async (): Promise<string | undefined> => {
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
            }),
          ]);
        return pairConfig.result.stake_contract.toString();
      }
    } catch (e) {
      console.error(e);
    }
  };
  // Provide Liquidity
  const provideLiquidity = async (
    tokenAAmount: number,
    tokenBAmount: number
  ) => {
    try {
      setLoading(true);
      const stakeSigner = storePersist.wallet.walletType === "wallet-connect" ? store.walletConnectInstance : new Signer();

      const SigningPairContract = new PhoenixPairContract.Client({
        publicKey: storePersist.wallet.address!,
        contractId: params.poolAddress,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
        signTransaction: (tx: string) => storePersist.wallet.walletType === "wallet-connect" ? stakeSigner.signTransaction(tx) : stakeSigner.sign(tx),
      });
      const tx = await SigningPairContract.provide_liquidity({
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
      });
      await tx.signAndSend();

      setLoading(false);
      //!todo view transaction id in blockexplorer
      setTokenAmounts([tokenAAmount, tokenBAmount]);
      // Refresh pool data
      await getPool();
      setSuccessModalOpen(true);
    } catch (error: any) {
      // TODO: Hacky fix for XDR issues with wallet-connect
      if (error.message.includes("envelope")) {
        setTokenAmounts([tokenAAmount, tokenBAmount]);
        setSuccessModalOpen(true);
        setLoading(false);
        return;
      }
      setErrorModalOpen(true);
      if (storePersist.wallet.walletType === "wallet-connect") {
        setErrorDescripption(error.message);
      } else {
        setErrorDescripption(resolveContractError(JSON.stringify(error.message)));
      }
      setLoading(false);
      console.error(error);
    }
  };

  // Remove Liquidity
  const removeLiquidity = async (lpTokenAmount: number) => {
    try {
      setLoading(true);
      const stakeSigner = storePersist.wallet.walletType === "wallet-connect" ? store.walletConnectInstance : new Signer();

      const SigningPairContract = new PhoenixPairContract.Client({
        publicKey: storePersist.wallet.address!,
        contractId: params.poolAddress,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
        signTransaction: (tx: string) => storePersist.wallet.walletType === "wallet-connect" ? stakeSigner.signTransaction(tx) : stakeSigner.sign(tx),
      });
      const tx = await SigningPairContract.withdraw_liquidity({
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
      //TODO: Hacky fix for XDR issues with wallet-connect
      if (error.message.includes("envelope")) {
        setTokenAmounts([lpTokenAmount]);
        setSuccessModalOpen(true);
        setLoading(false);
        return;
      }
      setLoading(false);
      if (storePersist.wallet.walletType === "wallet-connect") {
        setErrorDescripption(error.message);
      } else {
        setErrorDescripption(JSON.stringify(error));
      }
      setErrorModalOpen(true);
    }
  };

  // Stake
  const stake = async (lpTokenAmount: number) => {
    try {
      setLoading(true);

      const stakeSigner = storePersist.wallet.walletType === "wallet-connect" ? store.walletConnectInstance : new Signer();

      let stakeAddress: string | undefined = stakeContractAddress;
      if (stakeContractAddress === "") {
        stakeAddress = await fetchStakingAddress();
      }

      const SigningStakeContract = new PhoenixStakeContract.Client({
        publicKey: storePersist.wallet.address!,
        contractId: stakeAddress!,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
        signTransaction: (tx: string) => storePersist.wallet.walletType === "wallet-connect" ? stakeSigner.signTransaction(tx) : stakeSigner.sign(tx),
      });

      const tx = await SigningStakeContract.bond({
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
      //TODO: Hacky fix for XDR issues with wallet-connect
      if (error.message.includes("envelope")) {
        setTokenAmounts([lpTokenAmount]);
        setSuccessModalOpen(true);
        setLoading(false);
        return;
      }
      setLoading(false);
      if (storePersist.wallet.walletType === "wallet-connect") {
        setErrorDescripption(error.message);
      } else {
        setErrorDescripption(JSON.stringify(error));
      }
      setErrorModalOpen(true);
    }
  };

  // Stake
  const unstake = async (lpTokenAmount: number, stake_timestamp: number) => {
    try {
      setLoading(true);

      const stakeSigner = storePersist.wallet.walletType === "wallet-connect" ? store.walletConnectInstance : new Signer();

      let stakeAddress: string | undefined = stakeContractAddress;
      if (stakeContractAddress === "") {
        stakeAddress = await fetchStakingAddress();
      }

      const SigningStakeContract = new PhoenixStakeContract.Client({
        publicKey: storePersist.wallet.address!,
        contractId: stakeAddress!,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
        signTransaction: (tx: string) => storePersist.wallet.walletType === "wallet-connect" ? stakeSigner.signTransaction(tx) : stakeSigner.sign(tx),
      });
      const tx = await SigningStakeContract.unbond({
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
      //TODO: Hacky fix for XDR issues with wallet-connect
      if (error.message.includes("envelope")) {
        setTokenAmounts([lpTokenAmount]);
        setSuccessModalOpen(true);
        setLoading(false);
        return;
      }
      setLoading(false);
      if (storePersist.wallet.walletType === "wallet-connect") {
        setErrorDescripption(error.message);
      } else {
        setErrorDescripption(JSON.stringify(error.message));
      }
      setErrorModalOpen(true);
    }
  };

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
            }),
          ]);
        setStakeContractAddress(pairConfig.result.stake_contract.toString());
        // Fetch prices and calculate TVL
        const [priceA, priceB] = await Promise.all([
          await fetchTokenPrices(_tokenA?.symbol || ""),
          await fetchTokenPrices(_tokenB?.symbol || ""),
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

        const stakingInfo = await stakeContractAddress.query_total_staked();
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
            const lpShareAmount = info.asset_lp_share.amount;
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
    }
  };

  const fetchStakes = async (
    name = lpToken?.name,
    stakeContract = StakeContract,
    calcApr = maxApr,
    tokenPrice = lpTokenPrice
  ) => {
    if (storePersist.wallet.address) {
      // Get user stakes
      const stakes = await stakeContract?.query_staked({
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
              apr:
                (
                  time.daysSinceTimestamp(Number(stake.stake_timestamp)) *
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
                unstake(Number(stake.stake) / 10 ** 7, stake.stake_timestamp);
              },
            };
          });
          setUserStakes(_stakes);
          return _stakes;
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
      <Box sx={{ mt: { xs: 12, md: 0 } }}>
        <Typography>{"The pool you're looking for doesn't exist."}</Typography>
        <Typography>
          Return <Link href="/">Home</Link>
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ mt: { xs: 12, md: 0 } }}>
      <Helmet>
        <title>{`Phoenix DeFi Hub - ${tokenA?.name} / ${tokenB?.name}`}</title>
      </Helmet>
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
