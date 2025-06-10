import React, { useState, useEffect } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Box, Button } from "@mui/material";
import {
  Strategy,
  StrategyMetadata,
  Token,
  ContractType,
  IndividualStake,
} from "@phoenix-protocol/strategies";
import { AssembledTransaction } from "@stellar/stellar-sdk/lib/contract";
import { ClaimAllModal } from "./ClaimAllModal"; // Assuming ClaimAllModalProps is part of this or defined below

// Replicating ClaimAllModalProps for clarity if not exported directly
interface ClaimAllModalProps {
  open: boolean;
  onClose: () => void;
  claimableStrategies: {
    strategy: Strategy;
    metadata: StrategyMetadata;
    rewards: number;
  }[];
  onClaimStrategy: (
    strategy: Strategy,
    metadata: StrategyMetadata
  ) => Promise<void>;
}

const mockToken = (name: string, symbol: string): Token => ({
  name,
  icon: `/cryptoIcons/${symbol.toLowerCase()}.svg`,
  amount: 0,
  usdValue: Math.random() * 100,
  category: "mock",
  address: `C${"X".repeat(55)}`,
  id: `mock-token-${symbol.toLowerCase()}`,
  symbol,
  decimals: 18,
  balance: BigInt(0),
  isStakingToken: false,
  contractId: `mock-contract-${symbol.toLowerCase()}`,
});

const mockStrategyMetadata = (
  id: string,
  name: string,
  rewards: number
): StrategyMetadata => ({
  id,
  providerId: `mock-provider-${id}`,
  name,
  description: `This is a mock description for ${name}. It involves staking and earning rewards.`,
  assets: [mockToken("Token A", "TKA"), mockToken("Token B", "TKB")],
  tvl: Math.random() * 1000000,
  apr: Math.random() * 0.25,
  rewardToken: mockToken("Reward Token", "RWD"),
  unbondTime: 86400 * 7, // 7 days
  category: "Liquidity Provision",
  available: true,
  contractAddress: `CA${id.toUpperCase()}${"X".repeat(50 - id.length)}`,
  contractType: "stake" as ContractType,
  userStake: rewards > 0 ? Math.random() * 10000 : 0,
  userRewards: rewards,
  hasJoined: rewards > 0,
  userIndividualStakes: [], // Set to empty array to avoid BigInt serialization in Storybook
});

const mockStrategy = (metadata: StrategyMetadata): Strategy => ({
  getMetadata: async () => metadata,
  getUserStake: async () => metadata.userStake || 0,
  hasUserJoined: async () => metadata.hasJoined || false,
  getUserRewards: async () => metadata.userRewards || 0,
  bond: async () => ({} as unknown as AssembledTransaction<any>),
  unbond: async () => ({} as unknown as AssembledTransaction<any>),
  claim: async () => ({} as unknown as AssembledTransaction<any>),
});

const mockOnClaimStrategy = (
  _strategy: Strategy,
  metadata: StrategyMetadata
): Promise<void> => {
  action("onClaimStrategy")(metadata.name);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (metadata.name.includes("Fails")) {
        action("onClaimStrategy - Error")(metadata.name);
        reject(new Error(`Simulated claim failure for ${metadata.name}`));
      } else {
        action("onClaimStrategy - Success")(metadata.name);
        resolve();
      }
    }, 1500 + Math.random() * 1000);
  });
};

const meta: Meta<typeof ClaimAllModal> = {
  title: "Earn/Modals/ClaimAllModal",
  component: ClaimAllModal,
  argTypes: {
    open: { control: "boolean" },
    onClose: { action: "onClose" },
    claimableStrategies: { control: "object" },
    onClaimStrategy: { action: "onClaimStrategy" },
  },
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story, context) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isOpen, setIsOpen] = useState(context.args.open);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        setIsOpen(context.args.open);
      }, [context.args.open]);

      const handleOpen = () => setIsOpen(true);
      const handleClose = () => {
        setIsOpen(false);
        action("onClose")(); // Call the Storybook action
      };

      return (
        <Box>
          {!isOpen && (
            <Button onClick={handleOpen}>Open Claim All Modal</Button>
          )}
          <Story
            args={{ ...context.args, open: isOpen, onClose: handleClose }}
          />
        </Box>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<ClaimAllModalProps>;

const strategyMetas = [
  mockStrategyMetadata("s1", "Alpha Liquidity Pool", 125.5),
  mockStrategyMetadata("s2", "Beta Staking (Sometimes Fails)", 75.2),
  mockStrategyMetadata("s3", "Gamma Yield Farm", 200.0),
  mockStrategyMetadata("s4", "Delta Vault", 50.75),
];

const mockClaimableStrategiesData = strategyMetas
  .filter((meta) => meta.userRewards && meta.userRewards > 0)
  .map((meta) => ({
    strategy: mockStrategy(meta),
    metadata: meta,
    rewards: meta.userRewards || 0,
  }));

export const Default: Story = {
  args: {
    open: false,
    claimableStrategies: mockClaimableStrategiesData,
    onClaimStrategy: mockOnClaimStrategy,
    onClose: action("onClose"),
  },
};

export const WithFailingStrategy: Story = {
  args: {
    ...Default.args,
    claimableStrategies: [
      {
        strategy: mockStrategy(
          mockStrategyMetadata("s1-fail", "Stable Yield", 100)
        ),
        metadata: mockStrategyMetadata("s1-fail", "Stable Yield", 100),
        rewards: 100,
      },
      {
        strategy: mockStrategy(
          mockStrategyMetadata("s2-fail", "Risky Bet (Fails)", 50)
        ),
        metadata: mockStrategyMetadata("s2-fail", "Risky Bet (Fails)", 50),
        rewards: 50,
      },
      {
        strategy: mockStrategy(
          mockStrategyMetadata("s3-fail", "Safe Bet", 120)
        ),
        metadata: mockStrategyMetadata("s3-fail", "Safe Bet", 120),
        rewards: 120,
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    claimableStrategies: [],
  },
};

export const SingleItem: Story = {
  args: {
    ...Default.args,
    claimableStrategies:
      mockClaimableStrategiesData.length > 0
        ? [mockClaimableStrategiesData[0]]
        : [],
  },
};
