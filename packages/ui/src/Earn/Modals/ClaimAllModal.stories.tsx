import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ClaimAllModal } from "./ClaimAllModal";
import { Button } from "../../Button/Button";
import {
  Strategy,
  StrategyMetadata,
  ContractType,
} from "@phoenix-protocol/strategies";

const meta: Meta<typeof ClaimAllModal> = {
  title: "Earn/Modals/ClaimAllModal",
  component: ClaimAllModal,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    open: { control: "boolean" },
    onClose: { action: "closed" },
    claimableStrategies: { control: "object" },
    onClaimStrategy: { action: "claimStrategy" },
  },
};

export default meta;

type Story = StoryObj<typeof ClaimAllModal>;

// Mock Strategy and Metadata
const createMockStrategy = (
  id: string,
  name: string,
  rewards: number
): { strategy: Strategy; metadata: StrategyMetadata; rewards: number } => ({
  strategy: {
    // Mock strategy methods - they won't be called directly by the modal story
    getMetadata: async () => ({} as StrategyMetadata),
    getUserStake: async () => 0,
    hasUserJoined: async () => true,
    getUserRewards: async () => rewards,
    bond: async () => true,
    unbond: async () => true,
    claim: async () => true, // This is the important one for the concept
  } as Strategy,
  metadata: {
    id: id,
    providerId: "mock-provider",
    name: name,
    description: `Mock description for ${name}`,
    assets: [
      {
        name: "XLM",
        icon: "/cryptoIcons/xlm.svg",
        amount: 0,
        category: "native",
        usdValue: 0.11,
      },
    ],
    tvl: 10000,
    apr: 0.1,
    rewardToken: {
      name: "PHO",
      icon: "/cryptoIcons/pho.svg",
      amount: 0,
      category: "phoenix",
      usdValue: 0.02,
    },
    unbondTime: 0,
    category: "staking",
    available: true,
    contractAddress: `MOCK_CONTRACT_${id.toUpperCase()}`,
    contractType: "stake" as ContractType,
    userStake: 100,
    userRewards: rewards,
    hasJoined: true,
  },
  rewards: rewards,
});

const mockClaimables = [
  createMockStrategy("strategy-1", "Phoenix Boost", 15.5),
  createMockStrategy("strategy-2", "Stellar Yield", 5.25),
  createMockStrategy("strategy-3", "Liquidity Farm", 22.8),
];

const mockClaimablesWithError = [
  createMockStrategy("strategy-1", "Phoenix Boost", 15.5),
  createMockStrategy("strategy-err", "Failing Strategy", 10.0), // This one will fail
  createMockStrategy("strategy-3", "Liquidity Farm", 22.8),
];

// Mock claim function for storybook interaction
const mockClaimHandler =
  (shouldFailStrategyId?: string) =>
  async (strategy: Strategy, metadata: StrategyMetadata): Promise<void> => {
    console.log(`Attempting to claim for ${metadata.name} (${metadata.id})`);
    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );

    if (shouldFailStrategyId && metadata.id === shouldFailStrategyId) {
      console.error(`Simulating failure for ${metadata.name}`);
      throw new Error(`Simulated claim error for ${metadata.name}`);
    }

    console.log(`Successfully claimed for ${metadata.name}`);
    // In a real scenario, useContractTransaction handles the promise resolution/rejection
  };

const ModalWrapper = (args) => {
  const [open, setOpen] = useState(args.open || false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    args.onClose();
  };

  return (
    <>
      <Button onClick={handleOpen}>Open Claim All Modal</Button>
      <ClaimAllModal
        {...args}
        open={open}
        onClose={handleClose}
        onClaimStrategy={args.onClaimStrategy || mockClaimHandler()} // Use default handler if none provided
      />
    </>
  );
};

export const Default: Story = {
  render: ModalWrapper,
  args: {
    claimableStrategies: mockClaimables,
  },
};

export const WithError: Story = {
  render: ModalWrapper,
  args: {
    claimableStrategies: mockClaimablesWithError,
    onClaimStrategy: mockClaimHandler("strategy-err"), // Make the specific strategy fail
  },
};

export const Empty: Story = {
  render: ModalWrapper,
  args: {
    claimableStrategies: [],
  },
};

export const PreOpened: Story = {
  render: ModalWrapper,
  args: {
    claimableStrategies: mockClaimables,
    open: true,
  },
};
