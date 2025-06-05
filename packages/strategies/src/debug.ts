import { StrategyRegistry } from "./registry";
import { PhoenixBoostProvider } from "./phoenix/provider";

async function debugRegistry() {
  console.log("=== STRATEGY REGISTRY DEBUG ===");

  // Initialize provider
  const provider = new PhoenixBoostProvider();
  console.log("Provider created:", provider.id);

  // Register provider
  StrategyRegistry.registerProvider(provider);
  console.log("Provider registered");

  // List providers
  const providers = StrategyRegistry.getProviders();
  console.log(
    "Providers:",
    providers.map((p) => p.id)
  );

  // Get strategies
  const strategies = await StrategyRegistry.getAllStrategies();
  console.log("Total strategies:", strategies.length);
  strategies.forEach(async (strategy, index) => {
    const meta = await strategy.getMetadata();
    console.log(`Strategy ${index + 1}:`, meta.id);
  });
}

export { debugRegistry };
