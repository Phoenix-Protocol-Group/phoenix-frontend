import { Token as BaseToken } from "@phoenix-protocol/types";
import { AssembledTransaction } from "@stellar/stellar-sdk/lib/contract";

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

// Define the structure for an individual stake/bond
export interface IndividualStake {
  lpAmount: bigint; // Raw LP token amount for contract interaction
  timestamp: bigint; // Raw timestamp for contract interaction
  displayAmount: string; // User-friendly display of the amount (e.g., "123.45 LP")
  displayDate: string; // User-friendly display of the stake date
  // Potentially other identifiers or display info if needed
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
  userIndividualStakes?: IndividualStake[]; // For strategies with multiple, distinct stakes
  // UI state properties
  isMobile?: boolean; // For UI rendering
  userAssetMatch?: boolean; // Used in StrategiesTable filtering
  // Provider-specific properties for grouping
  providerName?: string; // Display name for the provider (e.g., "Phoenix Protocol", "Blend")
  providerIcon?: string; // Icon for the provider
  providerDomain?: string; // Domain for the provider
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
  ): Promise<AssembledTransaction<any>>;

  // Updated unbond signature to handle specific stakes or general amounts
  unbond(
    walletAddress: string,
    params: number | { lpAmount: bigint; timestamp: bigint }
  ): Promise<AssembledTransaction<any>>;
  claim(walletAddress: string): Promise<AssembledTransaction<any>>;
}
