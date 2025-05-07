import { Token as BaseToken } from "@phoenix-protocol/types";

// Extend the Token interface to include address
export interface Token extends BaseToken {
  address?: string; // Add address field that's used in stories
}

// Define Contract Types - Mirroring useContractTransaction
export type ContractType =
  | "pair"
  | "multihop"
  | "stake"
  | "factory"
  | "vesting"
  | "token";

export interface StrategyProvider {
  id: string;
  name: string;
  domain: string;
  description?: string;
  icon?: string;
  getTVL(): Promise<number>;
  getStrategies(): Promise<Strategy[]>;
}

export interface StrategyMetadata {
  id: string;
  providerId: string;
  name: string;
  description: string;
  assets: Token[];
  tvl: number;
  apr: number;
  rewardToken: Token;
  unbondTime: number; // seconds
  link?: string;
  category: string;
  icon?: string;
  available: boolean;
  userStake?: number; // Amount the user has staked
  userRewards?: number; // Rewards available for claiming
  hasJoined?: boolean; // Whether the user has joined this strategy
  // Add contract details for transactions
  contractAddress: string;
  contractType: ContractType;
  // UI state properties
  isMobile?: boolean; // For UI rendering
  userAssetMatch?: boolean; // Used in StrategiesTable filtering
}

export interface Strategy {
  getMetadata(): Promise<StrategyMetadata>;
  getUserStake(walletAddress: string): Promise<number>;
  hasUserJoined(walletAddress: string): Promise<boolean>;
  getUserRewards(walletAddress: string): Promise<number>;

  // Update bond signature to support multiple token amounts
  bond(
    walletAddress: string,
    amountA: number,
    amountB?: number
  ): Promise<boolean>;

  unbond(walletAddress: string, amount: number): Promise<boolean>;
  claim(walletAddress: string): Promise<boolean>;
}
