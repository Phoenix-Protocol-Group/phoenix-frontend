import { Strategy, StrategyMetadata } from "../../types";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import {
  API,
  constants,
  fetchTokenPrices,
  Signer,
} from "@phoenix-protocol/utils";
import {
  PhoenixPairContract,
  PhoenixStakeContract,
  fetchPho,
} from "@phoenix-protocol/contracts";
import { AssembledTransaction } from "@stellar/stellar-sdk/lib/contract";

// Needed constants and types
const contractAddress =
  "CBCZGGNOEUZG4CAAE7TGTQQHETZMKUT4OIPFHHPKEUX46U4KXBBZ3GLH";
const contractType = "pair";

class PhoenixXlmPhoStrategy implements Strategy {
  private metadata: StrategyMetadata = {
    id: "phoenix-provide-liquidity-xlm-pho",
    providerId: "phoenix-xlm-pho",
    name: "Provide Liquidity to XLM-PHO",
    description: "Provide liquidity to the XLM-PHO pair and earn PHO rewards",
    assets: [],
    tvl: 0,
    apr: 0,
    rewardToken: {
      name: "PHO",
      icon: "/cryptoIcons/pho.svg",
      amount: 0,
      category: "phoenix",
      usdValue: 0,
      contractId: "", // TODO: Set the correct contractId for PHO if available
    },
    unbondTime: 0,
    category: "liquidity",
    available: true,
    contractAddress,
    contractType,
  };

  private initialized: boolean = false;
  private pairContract: PhoenixPairContract.Client | null = null;
  private stakeContract: PhoenixStakeContract.Client | null = null;
  private stakeContractAddress: string = "";
  private tokenA: any = null;
  private tokenB: any = null;
  private lpToken: any = null;
  private userStake: number = 0;
  private userRewards: any[] = [];
  private userIndividualStakesDetailed: any[] = []; // Store raw stakes for unbonding
  private lpTokenPrice: number = 0;

  constructor() {
    // Initialize immediately
    this.initialize();
  }

  // Async initialization method
  private async initialize(): Promise<void> {
    try {
      // Initialize contract clients
      this.pairContract = new PhoenixPairContract.Client({
        contractId: contractAddress,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
        publicKey: usePersistStore.getState().wallet.address,
        signTransaction: (tx: string) => new Signer().sign(tx),
      });

      // Fetch real-time data for the strategy
      await this.fetchPoolDetails();

      // Mark as initialized
      this.initialized = true;
      console.log("PhoenixBoostStrategy initialized successfully");
    } catch (error) {
      console.error("Failed to initialize PhoenixBoostStrategy:", error);
    }
  }

  private async fetchPoolDetails(): Promise<void> {
    try {
      const store = useAppStore.getState();
      const storePersist = usePersistStore.getState();

      // Fetch pool config and info from chain
      const [pairConfig, pairInfo] = await Promise.all([
        this.pairContract?.query_config(),
        this.pairContract?.query_pool_info(),
      ]);

      if (pairConfig?.result && pairInfo?.result) {
        // Set stake contract address and instantiate client
        this.stakeContractAddress = pairConfig.result.stake_contract.toString();
        this.stakeContract = new PhoenixStakeContract.Client({
          contractId: this.stakeContractAddress,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
          signTransaction: (tx: string) => new Signer().sign(tx),
          publicKey: storePersist.wallet.address,
        });

        // Fetch token info
        const [_tokenA, _tokenB, _lpToken] = await Promise.all([
          store.fetchTokenInfo(pairConfig.result.token_a),
          store.fetchTokenInfo(pairConfig.result.token_b),
          store.fetchTokenInfo(pairConfig.result.share_token, true),
        ]);

        this.tokenA = _tokenA;
        this.tokenB = _tokenB;
        this.lpToken = _lpToken;

        // Fetch token prices and calculate TVL
        const [priceA, priceB] = await Promise.all([
          API.getPrice(_tokenA?.symbol || ""),
          API.getPrice(_tokenB?.symbol || ""),
        ]);

        // Calculate pool TVL
        const tvl =
          (priceA * Number(pairInfo.result.asset_a.amount)) /
            10 ** Number(_tokenA?.decimals) +
          (priceB * Number(pairInfo.result.asset_b.amount)) /
            10 ** Number(_tokenB?.decimals);

        this.metadata.tvl = tvl;

        // Calculate APR based on incentives
        const stakingInfoA = await this.stakeContract.query_total_staked({
          simulate: false,
        });
        const stakingInfo = await stakingInfoA.simulate({ restore: true });
        const totalStaked = Number(stakingInfo?.result);

        const ratioStaked =
          totalStaked / Number(pairInfo.result.asset_lp_share.amount);
        const valueStaked = tvl * ratioStaked;

        // Apply the same pool incentives logic
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

        const poolIncentive = poolIncentives.find(
          (incentive) => incentive.address === contractAddress
        )!;

        const phoprice = await fetchPho();
        const apr =
          ((poolIncentive?.amount * phoprice) / valueStaked) * 100 * 6;

        this.metadata.apr = apr / 100;

        // Update reward token USD value
        this.metadata.rewardToken.usdValue = phoprice;

        // Calculate LP token price for value conversion
        this.lpTokenPrice = valueStaked / (totalStaked / 10 ** 7);

        // Set assets in metadata
        this.metadata.assets = [
          {
            name: _tokenA?.symbol ?? "",
            icon: _tokenA?.symbol
              ? `/cryptoIcons/${_tokenA.symbol.toLowerCase()}.svg`
              : "",
            usdValue: priceA,
            amount:
              Number(pairInfo.result.asset_a.amount) /
              10 ** Number(_tokenA?.decimals ?? 7),
            category: "phoenix",
            contractId: _tokenA?.contractId ?? "",
          },
          {
            name: _tokenB?.symbol ?? "",
            icon: _tokenB?.symbol
              ? `/cryptoIcons/${_tokenB.symbol.toLowerCase()}.svg`
              : "",
            usdValue: priceB,
            amount:
              Number(pairInfo.result.asset_b.amount) /
              10 ** Number(_tokenB?.decimals ?? 7),
            category: "phoenix",
            contractId: _tokenB?.contractId ?? "",
          },
        ];

        // If wallet connected, fetch user stake and rewards
        if (storePersist.wallet.address) {
          await this.fetchUserPosition(storePersist.wallet.address);
        }
      }
    } catch (error) {
      console.error("Error fetching pool details:", error);
    }
  }

  private async fetchUserPosition(walletAddress: string): Promise<void> {
    try {
      if (!this.stakeContract) return;

      // Get user stakes
      const stakesQuery = await this.stakeContract.query_staked(
        { address: walletAddress },
        { simulate: false }
      );

      const stakesResult = await stakesQuery.simulate({ restore: true });
      this.userIndividualStakesDetailed = stakesResult?.result?.stakes || []; // Store raw stakes

      // Calculate total staked amount and populate userIndividualStakes for metadata
      if (this.userIndividualStakesDetailed.length > 0) {
        let totalLpStaked = BigInt(0);
        this.metadata.userIndividualStakes =
          this.userIndividualStakesDetailed.map((stake: any) => {
            const lpAmountBigInt = BigInt(stake.stake);
            totalLpStaked += lpAmountBigInt;
            const lpAmountNumber =
              Number(lpAmountBigInt) / 10 ** (this.lpToken?.decimals || 7);
            return {
              lpAmount: lpAmountBigInt,
              timestamp: BigInt(stake.stake_timestamp),
              displayAmount: `${lpAmountNumber.toFixed(
                this.lpToken?.decimals || 7
              )} LP`,
              displayDate: new Date(
                Number(stake.stake_timestamp) * 1000
              ).toLocaleDateString(),
            };
          });
        const totalLpStakedNumber =
          Number(totalLpStaked) / 10 ** (this.lpToken?.decimals || 7);
        this.userStake = this.lpTokenPrice * totalLpStakedNumber;
      } else {
        this.userStake = 0;
        this.metadata.userIndividualStakes = [];
      }

      // Fetch user rewards
      const rewards = await this.stakeContract.query_withdrawable_rewards({
        user: walletAddress,
      });

      if (rewards?.result?.rewards) {
        const store = useAppStore.getState();
        const rewardPromises = rewards.result.rewards.map(
          async (reward: any) => {
            const token = await store.fetchTokenInfo(reward.reward_address);
            return {
              name: token?.symbol!.toUpperCase(),
              icon: `/cryptoIcons/${token?.symbol!.toLowerCase()}.svg`,
              usdValue: await API.getPrice(token?.symbol || ""),
              amount:
                Number(reward.reward_amount.toString()) /
                10 ** token?.decimals!,
              category: "phoenix",
            };
          }
        );

        this.userRewards = await Promise.all(rewardPromises);
      }
    } catch (error) {
      console.error("Error fetching user position:", error);
    }
  }

  async getMetadata(): Promise<StrategyMetadata> {
    // If not initialized yet, wait for initialization
    if (!this.initialized) {
      await this.waitForInitialization();
    }
    return this.metadata;
  }

  private async waitForInitialization(timeout = 5000): Promise<void> {
    const start = Date.now();
    while (!this.initialized && Date.now() - start < timeout) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!this.initialized) {
      console.warn(
        "Strategy initialization timed out, returning potentially incomplete metadata"
      );
    }
  }

  async getUserStake(walletAddress: string): Promise<number> {
    if (walletAddress !== usePersistStore.getState().wallet.address) {
      // If asking for a different wallet, fetch specific data
      await this.fetchUserPosition(walletAddress);
    }
    return this.userStake;
  }

  async hasUserJoined(walletAddress: string): Promise<boolean> {
    return (await this.getUserStake(walletAddress)) > 0;
  }

  async getUserRewards(walletAddress: string): Promise<number> {
    if (walletAddress !== usePersistStore.getState().wallet.address) {
      // If asking for a different wallet, fetch specific data
      await this.fetchUserPosition(walletAddress);
    }

    // Sum up all rewards
    return this.userRewards.reduce(
      (total: number, reward: any) => total + reward.amount,
      0
    );
  }

  // Update the bond method to handle multiple tokens for liquidity provision
  async bond(
    walletAddress: string,
    amountA: number,
    amountB?: number
  ): Promise<AssembledTransaction<any>> {
    if (amountB === undefined) {
      throw new Error(
        "Amount B is required for providing liquidity to this pair."
      );
    }
    // For liquidity pairs, we expect both amounts
    return this.provideLiquidity(walletAddress, amountA, amountB);
  }

  async unbond(
    walletAddress: string,
    params: { lpAmount: bigint; timestamp: bigint }
  ): Promise<AssembledTransaction<any>> {
    if (!this.stakeContract) {
      throw new Error("Stake contract not initialized");
    }

    const assembledTx = this.removeLiquidity(
      walletAddress,
      Number(params.lpAmount),
      {
        lpAmount: params.lpAmount,
        timestamp: params.timestamp,
      }
    );

    return assembledTx;
  }

  async claim(walletAddress: string): Promise<AssembledTransaction<any>> {
    if (!this.stakeContract) {
      throw new Error("Stake contract not initialized");
    }

    const assembledTx = await this.stakeContract.withdraw_rewards(
      { sender: walletAddress },
      { simulate: true, fee: parseInt(constants.PHOENIX_BASE_FEE) }
    );

    return assembledTx;
  }

  // Helper method to provide liquidity directly through this strategy
  async provideLiquidity(
    walletAddress: string,
    tokenAAmount: number,
    tokenBAmount: number
  ): Promise<AssembledTransaction<any>> {
    if (!this.pairContract) {
      throw new Error("Pair contract not initialized");
    }
    const assembledTx = await this.pairContract.provide_liquidity(
      {
        sender: walletAddress,
        desired_a: BigInt(
          (tokenAAmount * 10 ** (this.tokenA?.decimals || 7)).toFixed(0)
        ),
        desired_b: BigInt(
          (tokenBAmount * 10 ** (this.tokenB?.decimals || 7)).toFixed(0)
        ),
        min_a: undefined,
        min_b: undefined,
        custom_slippage_bps: undefined,
        deadline: undefined,
        auto_stake: true, // Automatically stake LP tokens
      },
      { simulate: true, fee: parseInt(constants.PHOENIX_BASE_FEE) }
    );

    return assembledTx;
  }

  // Helper method to remove liquidity
  async removeLiquidity(
    walletAddress: string,
    lpAmount: number,
    stakeBucket: { lpAmount: bigint; timestamp: bigint }
  ): Promise<AssembledTransaction<any>> {
    if (!this.pairContract) {
      throw new Error("Pair contract not initialized");
    }
    const assembledTx = await this.pairContract.withdraw_liquidity(
      {
        sender: walletAddress,
        share_amount: BigInt(
          (lpAmount * 10 ** (this.lpToken?.decimals || 7)).toFixed(0)
        ),
        min_a: BigInt(1),
        min_b: BigInt(1),
        deadline: undefined,
        auto_unstake: {
          stake_amount: stakeBucket.lpAmount,
          stake_timestamp: stakeBucket.timestamp,
        },
      },
      { simulate: true, fee: parseInt(constants.PHOENIX_BASE_FEE) }
    );
    return assembledTx;
  }
}

export default PhoenixXlmPhoStrategy;
