import { StrategyProvider, Strategy, StrategyMetadata } from "./types";

export class StrategyRegistry {
  private static providers: Map<string, StrategyProvider> = new Map();
  private static strategiesCache: Map<string, Strategy[]> = new Map();
  private static metadataCache: Map<string, StrategyMetadata> = new Map();

  static registerProvider(provider: StrategyProvider): void {
    if (this.providers.has(provider.id)) {
      console.warn(
        `Provider with ID ${provider.id} is already registered. Skipping.`
      );
      return;
    }
    this.providers.set(provider.id, provider);
  }

  static getProvider(id: string): StrategyProvider | undefined {
    return this.providers.get(id);
  }

  static getProviders(): StrategyProvider[] {
    return Array.from(this.providers.values());
  }

  static async getProviderTVL(providerId: string): Promise<number> {
    const provider = this.providers.get(providerId);
    if (!provider) return 0;
    return provider.getTVL();
  }

  static async getTotalTVL(): Promise<number> {
    const allProviders = this.getProviders();
    const tvls = await Promise.all(
      allProviders.map((provider) => provider.getTVL())
    );
    return tvls.reduce((total, current) => total + current, 0);
  }

  static async getStrategiesByProvider(
    providerId: string
  ): Promise<Strategy[]> {
    const provider = this.providers.get(providerId);
    if (!provider) return [];

    if (!this.strategiesCache.has(providerId)) {
      const strategies = await provider.getStrategies();
      this.strategiesCache.set(providerId, strategies);
    }

    return this.strategiesCache.get(providerId) || [];
  }

  static async getAllStrategies(): Promise<Strategy[]> {
    const allProviders = this.getProviders();
    const strategiesArrays = await Promise.all(
      allProviders.map((provider) => this.getStrategiesByProvider(provider.id))
    );
    return strategiesArrays.flat();
  }

  static async getUserStrategies(walletAddress: string): Promise<Strategy[]> {
    if (!walletAddress) return [];

    const allStrategies = await this.getAllStrategies();
    const userStrategies = await Promise.all(
      allStrategies.map(async (strategy) => {
        const hasJoined = await strategy.hasUserJoined(walletAddress);
        return hasJoined ? strategy : null;
      })
    );

    return userStrategies.filter(Boolean) as Strategy[];
  }

  static async getStrategyMetadata(
    strategy: Strategy
  ): Promise<StrategyMetadata> {
    const metadata = await strategy.getMetadata();
    this.metadataCache.set(metadata.id, metadata);
    return metadata;
  }

  static clearCache(): void {
    this.strategiesCache.clear();
    this.metadataCache.clear();
  }
}
