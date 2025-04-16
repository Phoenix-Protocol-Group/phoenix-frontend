import { StrategyRegistry } from "../registry";
import { PhoenixBoostProvider } from "./phoenix-boost";
import { StellarYieldProvider } from "./stellar-yield";
import { PhoenixDexProvider } from "./liquidity-farming";

export function registerMockProviders() {
  // Register mock providers
  StrategyRegistry.registerProvider(new PhoenixBoostProvider());
  StrategyRegistry.registerProvider(new StellarYieldProvider());
  StrategyRegistry.registerProvider(new PhoenixDexProvider());
}

export * from "./phoenix-boost";
export * from "./stellar-yield";
export * from "./liquidity-farming";
