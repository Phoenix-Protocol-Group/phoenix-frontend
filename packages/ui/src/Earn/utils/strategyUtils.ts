import { StrategyMetadata } from "@phoenix-protocol/strategies";

export interface StrategyProvider {
  id: string;
  name: string;
  icon: string;
  domain?: string;
  description?: string;
  strategies: StrategyMetadata[];
  totalTVL: number;
  totalRewards: number;
  rewardTokens: { token: string; icon: string; amount: number }[];
}

export const groupStrategiesByProvider = (
  strategies: StrategyMetadata[]
): StrategyProvider[] => {
  const providerMap = new Map<string, StrategyProvider>();

  strategies.forEach((strategy) => {
    // Use providerName to determine the main provider, with fallback logic
    let mainProviderId: string;
    let providerName: string;

    if (strategy.providerName) {
      // Map provider names to consistent IDs
      if (strategy.providerName.includes("Phoenix")) {
        mainProviderId = "phoenix";
        providerName = "Phoenix Protocol";
      } else if (strategy.providerName.includes("Blend")) {
        mainProviderId = "blend";
        providerName = "Blend";
      } else {
        // Use the providerName as is and create a simple ID
        providerName = strategy.providerName;
        mainProviderId = strategy.providerName
          .toLowerCase()
          .replace(/\s+/g, "-");
      }
    } else {
      // Fallback: extract from providerId and create a default name
      mainProviderId = strategy.providerId.split("-")[0];
      providerName =
        mainProviderId.charAt(0).toUpperCase() + mainProviderId.slice(1);
    }

    if (!providerMap.has(mainProviderId)) {
      const providerIcon =
        strategy.providerIcon ||
        (mainProviderId === "phoenix"
          ? "/cryptoIcons/pho.svg"
          : mainProviderId === "blend"
          ? "/cryptoIcons/blend.svg"
          : "/cryptoIcons/default.svg");

      providerMap.set(mainProviderId, {
        id: mainProviderId,
        name: providerName,
        icon: providerIcon,
        domain: strategy.providerDomain,
        description: getProviderDescription(mainProviderId),
        strategies: [],
        totalTVL: 0,
        totalRewards: 0,
        rewardTokens: [],
      });
    }

    const provider = providerMap.get(mainProviderId)!;
    provider.strategies.push(strategy);
    provider.totalTVL += strategy.tvl || 0;
    provider.totalRewards += strategy.userRewards || 0;

    // Track unique reward tokens
    const rewardTokenName = strategy.rewardToken.name;
    const existingRewardToken = provider.rewardTokens.find(
      (rt) => rt.token === rewardTokenName
    );

    if (existingRewardToken) {
      existingRewardToken.amount += strategy.userRewards || 0;
    } else {
      provider.rewardTokens.push({
        token: rewardTokenName,
        icon: strategy.rewardToken.icon,
        amount: strategy.userRewards || 0,
      });
    }
  });

  return Array.from(providerMap.values()).sort(
    (a, b) => b.totalTVL - a.totalTVL
  );
};

const getProviderDescription = (mainProviderId: string): string => {
  switch (mainProviderId) {
    case "phoenix":
      return "Decentralized liquidity and staking on Stellar";
    case "blend":
      return "Lending and borrowing protocol on Stellar";
    default:
      return `${mainProviderId} protocol strategies`;
  }
};

export const getProviderRewardsSummary = (
  strategies: StrategyMetadata[]
): {
  totalValue: number;
  rewardTokens: { token: string; icon: string; amount: number }[];
} => {
  const rewardTokenMap = new Map<string, { icon: string; amount: number }>();
  let totalValue = 0;

  strategies.forEach((strategy) => {
    totalValue += strategy.userStake || 0;

    const rewardTokenName = strategy.rewardToken.name;
    const userRewards = strategy.userRewards || 0;

    if (userRewards > 0) {
      const existing = rewardTokenMap.get(rewardTokenName);
      if (existing) {
        existing.amount += userRewards;
      } else {
        rewardTokenMap.set(rewardTokenName, {
          icon: strategy.rewardToken.icon,
          amount: userRewards,
        });
      }
    }
  });

  const rewardTokens = Array.from(rewardTokenMap.entries()).map(
    ([token, data]) => ({
      token,
      icon: data.icon,
      amount: data.amount,
    })
  );

  return { totalValue, rewardTokens };
};
