import { Strategy, StrategyProvider } from "../types";
import BlendUsdcLendingStrategy from "./strategies/usdc-lending";
import BlendXlmLendingStrategy from "./strategies/xlm-lending";

export class BlendProvider implements StrategyProvider {
  id = "blend";
  name = "Blend";
  domain = "blend.capital";
  description = "Lending and borrowing protocol on Stellar";
  icon = "/cryptoIcons/blend.svg";

  private strategies: Strategy[] = [];

  constructor() {
    // Initialize with Blend lending strategies
    // NOTE: These are templates and will throw errors until Blend contracts are integrated
    this.strategies.push(
      new BlendUsdcLendingStrategy(),
      new BlendXlmLendingStrategy()
    );
    console.log(
      "Blend provider initialized with strategies:",
      this.strategies.length
    );
  }

  async getTVL(): Promise<number> {
    try {
      const strategyTVLs = await Promise.all(
        this.strategies.map(async (strategy) => {
          const metadata = await strategy.getMetadata();
          return metadata.tvl; // Assuming each strategy contributes equally to the total TVL
        })
      );

      return strategyTVLs.reduce((total, current) => total + current, 0);
    } catch (error) {
      console.error("Error getting TVL for Blend provider:", error);
      return 0;
    }
  }

  async getStrategies(): Promise<Strategy[]> {
    console.log("Returning Blend strategies:", this.strategies.length);
    return this.strategies;
  }
}
