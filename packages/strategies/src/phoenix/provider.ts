import { Strategy, StrategyProvider } from "../types";
import PhoenixPhoUsdcStrategy from "./strategies/pho-usdc.liquidity";
import PhoenixXlmPhoStrategy from "./strategies/xlm-pho.liquidity";

export class PhoenixBoostProvider implements StrategyProvider {
  id = "phoenix-boost";
  name = "Phoenix Boost";
  domain = "phoenix-hub.io";
  description = "Official staking strategies from Phoenix Protocol";
  icon = "/cryptoIcons/pho.svg";

  private strategies: Strategy[] = [];

  constructor() {
    // Initialize with the PHO-USDC strategy
    this.strategies.push(
      new PhoenixPhoUsdcStrategy(),
      new PhoenixXlmPhoStrategy()
    );
    console.log(
      "Phoenix provider initialized with strategies:",
      this.strategies.length
    );
  }

  async getTVL(): Promise<number> {
    try {
      const strategyTVLs = await Promise.all(
        this.strategies.map(async (strategy) => {
          const metadata = await strategy.getMetadata();
          return metadata.tvl;
        })
      );

      return strategyTVLs.reduce((total, current) => total + current, 0);
    } catch (error) {
      console.error("Error getting TVL for Phoenix provider:", error);
      return 0;
    }
  }

  async getStrategies(): Promise<Strategy[]> {
    console.log("Returning Phoenix strategies:", this.strategies.length);
    return this.strategies;
  }
}
