import { StrategyProvider, Strategy, StrategyMetadata } from "../types";

class PhoenixBoostStrategy implements Strategy {
  private metadata: StrategyMetadata = {
    id: "phoenix-boost-strategy",
    providerId: "phoenix-boost",
    name: "Phoenix Boost",
    description: "Stake XLM to earn PHO rewards at a boosted rate",
    assets: [
      {
        name: "XLM",
        icon: "/cryptoIcons/xlm.svg",
        amount: 0,
        category: "native",
        usdValue: 0.11, // Mock USD value
      },
    ],
    tvl: 789012,
    apr: 0.1,
    rewardToken: {
      name: "PHO",
      icon: "/cryptoIcons/pho.svg",
      amount: 0,
      category: "phoenix",
      usdValue: 0.02, // Mock USD value
    },
    unbondTime: 604800, // 7 days in seconds
    category: "staking",
    available: true,
    // Mock contract details
    contractAddress: "CDLZXA6KCSMAPYOURMOCKphoenixBOOSTCONTRACTADDRESS", // Replace with actual mock/testnet address if available
    contractType: "stake", // Assuming a generic stake contract type
  };

  // Mock user stakes storage
  private userStakes: Map<string, number> = new Map();
  // Mock user rewards storage
  private userRewards: Map<string, number> = new Map();

  async getMetadata(): Promise<StrategyMetadata> {
    return this.metadata;
  }

  async getUserStake(walletAddress: string): Promise<number> {
    return this.userStakes.get(walletAddress) || 0;
  }

  async hasUserJoined(walletAddress: string): Promise<boolean> {
    return (
      this.userStakes.has(walletAddress) &&
      (this.userStakes.get(walletAddress) || 0) > 0
    );
  }

  async getUserRewards(walletAddress: string): Promise<number> {
    return this.userRewards.get(walletAddress) || 0;
  }

  async bond(walletAddress: string, amount: number): Promise<boolean> {
    if (amount <= 0) return false;

    const currentStake = this.userStakes.get(walletAddress) || 0;
    this.userStakes.set(walletAddress, currentStake + amount);

    // Add some rewards based on stake for demo purposes
    const currentRewards = this.userRewards.get(walletAddress) || 0;
    this.userRewards.set(walletAddress, currentRewards + amount * 0.01);

    // Update TVL
    this.metadata.tvl += amount;

    console.log(`[Mock PhoenixBoost] Bond: ${amount} for ${walletAddress}`);

    return true;
  }

  async unbond(walletAddress: string, amount: number): Promise<boolean> {
    if (amount <= 0) return false;

    const currentStake = this.userStakes.get(walletAddress) || 0;
    if (currentStake < amount) return false;

    this.userStakes.set(walletAddress, currentStake - amount);

    // Update TVL
    this.metadata.tvl -= amount;

    console.log(`[Mock PhoenixBoost] Unbond: ${amount} for ${walletAddress}`);

    return true;
  }

  async claim(walletAddress: string): Promise<boolean> {
    const rewards = this.userRewards.get(walletAddress) || 0;
    if (rewards <= 0) return false;

    // Reset rewards to 0 after claiming
    this.userRewards.set(walletAddress, 0);

    console.log(`[Mock PhoenixBoost] Claim for ${walletAddress}`);

    return true;
  }
}

export class PhoenixBoostProvider implements StrategyProvider {
  id = "phoenix-boost";
  name = "Phoenix Boost";
  domain = "phoenix-hub.io";
  description = "Official staking strategies from Phoenix Protocol";
  icon = "/cryptoIcons/pho.svg";

  private strategies: Strategy[] = [
    new PhoenixBoostStrategy(),
    new PhoenixBoostStrategy(),
  ];

  async getTVL(): Promise<number> {
    const strategyTVLs = await Promise.all(
      this.strategies.map(async (strategy) => {
        const metadata = await strategy.getMetadata();
        return metadata.tvl;
      })
    );

    return strategyTVLs.reduce((total, current) => total + current, 0);
  }

  async getStrategies(): Promise<Strategy[]> {
    return this.strategies;
  }
}
