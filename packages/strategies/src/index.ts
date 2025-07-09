// Core exports
export * from "./types";
export { StrategyRegistry } from "./registry";
export * from "./phoenix/provider";
export * from "./blend/provider";
export { default as PhoenixBoostStrategy } from "./phoenix/strategies/pho-usdc.liquidity";

// Initialize registry with providers
import { StrategyRegistry } from "./registry";
import { PhoenixBoostProvider } from "./phoenix/provider";
import { BlendProvider } from "./blend/provider";

// Register all strategy providers
const setupRegistry = () => {
  // Register the Phoenix provider
  StrategyRegistry.registerProvider(new PhoenixBoostProvider());

  // Register the Blend provider
  StrategyRegistry.registerProvider(new BlendProvider());
};

// Initialize the registry
setupRegistry();
