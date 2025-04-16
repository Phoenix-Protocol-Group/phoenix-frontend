import { Token } from "@phoenix-protocol/types";

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
}

export interface Strategy {
  getMetadata(): Promise<StrategyMetadata>;
  getUserStake(walletAddress: string): Promise<number>;
  hasUserJoined(walletAddress: string): Promise<boolean>;
  getUserRewards(walletAddress: string): Promise<number>;
  bond(walletAddress: string, amount: number): Promise<boolean>;
  unbond(walletAddress: string, amount: number): Promise<boolean>;
  claim(walletAddress: string): Promise<boolean>;
}
