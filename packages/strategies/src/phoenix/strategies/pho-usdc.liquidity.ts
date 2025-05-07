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

// Needed constants and types
const userWalletAddress = usePersistStore.getState().wallet;
const contractAddress =
  "CD5XNKK3B6BEF2N7ULNHHGAMOKZ7P6456BFNIHRF4WNTEDKBRWAE7IAA";
const contractType = "pair";

class PhoenixPhoUsdcStrategy implements Strategy {
  private metadata: StrategyMetadata = {
    id: "phoenix-provide-liquidity-pho-usdc",
    providerId: "phoenix-pho-usdc",
    name: "Provide Liquidity to PHO-USDC",
    description: "Provide liquidity to the PHO-USDC pair and earn PHO rewards",
    assets: [],
    tvl: 0,
    apr: 0,
    rewardToken: {
      name: "PHO",
      icon: "/cryptoIcons/pho.svg",
      amount: 0,
      category: "phoenix",
      usdValue: 0,
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
            name: _tokenA?.symbol!,
            icon: `/cryptoIcons/${_tokenA?.symbol.toLowerCase()}.svg`,
            usdValue: priceA,
            amount:
              Number(pairInfo.result.asset_a.amount) /
              10 ** Number(_tokenA?.decimals),
            category: "phoenix",
          },
          {
            name: _tokenB?.symbol!,
            icon: `/cryptoIcons/${_tokenB?.symbol.toLowerCase()}.svg`,
            usdValue: priceB,
            amount:
              Number(pairInfo.result.asset_b.amount) /
              10 ** Number(_tokenB?.decimals),
            category: "phoenix",
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

      const stakes = await stakesQuery.simulate({ restore: true });

      // Calculate total staked amount
      if (stakes?.result && stakes.result.stakes.length > 0) {
        const _stakes = stakes.result.stakes.reduce(
          (total: number, stake: any) =>
            total + Number(stake.stake) / 10 ** (this.lpToken?.decimals || 7),
          0
        );
        this.userStake = this.lpTokenPrice * _stakes;
      } else {
        this.userStake = 0;
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
              name: token?.symbol.toUpperCase(),
              icon: `/cryptoIcons/${token?.symbol.toLowerCase()}.svg`,
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
  ): Promise<boolean> {
    // For liquidity pairs, we expect both amounts
    return this.provideLiquidity(walletAddress, amountA, amountB!);
  }

  async unbond(walletAddress: string, amount: number): Promise<boolean> {
    if (!this.stakeContract || amount <= 0) return false;

    try {
      // Get user's stakes
      const stakesQuery = await this.stakeContract.query_staked(
        { address: walletAddress },
        { simulate: false }
      );

      const stakes = await stakesQuery.simulate({ restore: true });

      if (!stakes?.result || stakes.result.stakes.length === 0) {
        return false;
      }

      // Get the stake to unbond (using the first one as an example)
      // In a real implementation, you might want to select a specific stake
      const stake = stakes.result.stakes[0];

      const response = await this.stakeContract.unbond(
        {
          sender: walletAddress,
          stake_amount: BigInt(
            (amount * 10 ** (this.lpToken?.decimals || 7)).toFixed(0)
          ),
          stake_timestamp: BigInt(stake.stake_timestamp),
        },
        { simulate: true }
      );

      // Execute contract call
      await response.execute();

      // Refresh user data
      await this.fetchPoolDetails();
      await this.fetchUserPosition(walletAddress);

      return true;
    } catch (error) {
      console.error("Error unbonding:", error);
      return false;
    }
  }

  async claim(walletAddress: string): Promise<boolean> {
    if (!this.stakeContract) return false;

    try {
      const response = await this.stakeContract.withdraw_rewards(
        { sender: walletAddress },
        { simulate: true }
      );

      // Execute contract call
      await response.execute();

      // Refresh user data
      await this.fetchPoolDetails();
      await this.fetchUserPosition(walletAddress);

      return true;
    } catch (error) {
      console.error("Error claiming rewards:", error);
      return false;
    }
  }

  // Helper method to provide liquidity directly through this strategy
  async provideLiquidity(
    walletAddress: string,
    tokenAAmount: number,
    tokenBAmount: number
  ): Promise<boolean> {
    if (!this.pairContract) return false;

    try {
      const response = await this.pairContract.provide_liquidity(
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
        },
        { simulate: true }
      );

      // Execute contract call
      await response.execute();

      // Refresh pool data
      await this.fetchPoolDetails();

      return true;
    } catch (error) {
      console.error("Error providing liquidity:", error);
      return false;
    }
  }

  // Helper method to remove liquidity
  async removeLiquidity(
    walletAddress: string,
    lpAmount: number
  ): Promise<boolean> {
    if (!this.pairContract) return false;

    try {
      const response = await this.pairContract.withdraw_liquidity(
        {
          sender: walletAddress,
          share_amount: BigInt(
            (lpAmount * 10 ** (this.lpToken?.decimals || 7)).toFixed(0)
          ),
          min_a: BigInt(1),
          min_b: BigInt(1),
          deadline: undefined,
        },
        { simulate: true }
      );

      // Execute contract call
      await response.execute();

      // Refresh pool data
      await this.fetchPoolDetails();

      return true;
    } catch (error) {
      console.error("Error removing liquidity:", error);
      return false;
    }
  }
}

export default PhoenixPhoUsdcStrategy;
