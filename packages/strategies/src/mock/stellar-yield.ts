import { StrategyProvider, Strategy, StrategyMetadata } from "../types";

class StellarYieldStrategy implements Strategy {
  private metadata: StrategyMetadata = {
    id: "stellar-yield-strategy",
    providerId: "stellar-yield",
    name: "Stellar Yield",
    description: "Stake XLM and USDC to earn PHO rewards",
    assets: [
      {
        name: "XLM",
        icon: "/cryptoIcons/xlm.svg",
        amount: 0,
        category: "native",
        usdValue: 0.11, // Mock USD value
      },
      {
        name: "USDC",
        icon: "/cryptoIcons/usdc.svg",
        amount: 0,
        category: "token",
        usdValue: 1.0, // Mock USD value
      },
    ],
    tvl: 123456,
    apr: 0.05,
    rewardToken: {
      name: "PHO",
      icon: "/cryptoIcons/pho.svg",
      amount: 0,
      category: "phoenix",
      usdValue: 0.02, // Mock USD value
    },
    unbondTime: 0, // Instant
    category: "yield",
    available: true,
  };

  // Mock user stakes storage
  private userStakes: Map<string, number> = new Map();

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

  async bond(walletAddress: string, amount: number): Promise<boolean> {
    if (amount <= 0) return false;

    const currentStake = this.userStakes.get(walletAddress) || 0;
    this.userStakes.set(walletAddress, currentStake + amount);

    // Update TVL
    this.metadata.tvl += amount;

    return true;
  }

  async unbond(walletAddress: string, amount: number): Promise<boolean> {
    if (amount <= 0) return false;

    const currentStake = this.userStakes.get(walletAddress) || 0;
    if (currentStake < amount) return false;

    this.userStakes.set(walletAddress, currentStake - amount);

    // Update TVL
    this.metadata.tvl -= amount;

    return true;
  }

  async claim(walletAddress: string): Promise<boolean> {
    return this.hasUserJoined(walletAddress);
  }

  async getUserRewards(walletAddress: string): Promise<number> {
    // Mock rewards calculation
    const currentStake = this.userStakes.get(walletAddress) || 0;
    return (currentStake * this.metadata.apr) / 365; // Daily rewards
  }
}

export class StellarYieldProvider implements StrategyProvider {
  id = "stellar-yield";
  name = "Stellar Yield";
  domain = "stellar.org";
  description = "Yield strategies from the Stellar ecosystem";
  icon = "/cryptoIcons/xlm.svg";

  private strategies: Strategy[] = [new StellarYieldStrategy()];

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
