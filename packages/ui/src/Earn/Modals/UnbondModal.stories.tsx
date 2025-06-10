import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { UnbondModal } from "./UnbondModal";
import { Button } from "../../Button/Button";
import {
  StrategyMetadata,
  ContractType,
  IndividualStake,
} from "@phoenix-protocol/strategies";

const meta: Meta<typeof UnbondModal> = {
  title: "Earn/Modals/UnbondModal",
  component: UnbondModal,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    open: { control: "boolean" },
    onClose: { action: "closed" },
    onConfirm: { action: "confirmed" },
    strategy: { control: "object" },
    maxAmount: { control: "number" },
  },
};

export default meta;

type Story = StoryObj<typeof UnbondModal>;

const mockStrategyAssets = [
  {
    name: "XLM",
    icon: "/cryptoIcons/xlm.svg",
    amount: 0,
    category: "native",
    usdValue: 0.11,
    contractId: "xlm-native",
  },
];

const mockLPAssets = [
  {
    name: "XLM",
    icon: "/cryptoIcons/xlm.svg",
    amount: 0,
    category: "native",
    usdValue: 0.11,
    contractId: "xlm-native",
  },
  {
    name: "USDC",
    icon: "/cryptoIcons/usdc.svg",
    amount: 0,
    category: "token",
    usdValue: 1.0,
    contractId: "usdc-token",
  },
];

const mockStrategy: StrategyMetadata = {
  id: "mock-strategy-1",
  providerId: "mock-provider",
  name: "Mock Yield Strategy",
  description: "A mock strategy for testing",
  assets: mockStrategyAssets,
  tvl: 100000,
  apr: 0.05,
  rewardToken: {
    name: "PHO",
    icon: "/cryptoIcons/pho.svg",
    amount: 0,
    category: "phoenix",
    usdValue: 0.02,
    contractId: "pho-token",
  },
  unbondTime: 0, // Instant
  category: "yield",
  available: true,
  contractAddress: "MOCK_CONTRACT_ADDRESS",
  contractType: "stake" as ContractType,
  userStake: 1000, // Example stake
  userRewards: 10,
  hasJoined: true,
};

const mockStrategyWithLock: StrategyMetadata = {
  ...mockStrategy,
  id: "mock-strategy-lock",
  name: "Mock Locked Strategy",
  unbondTime: 604800, // 7 days
  userStake: 500,
};

const mockLPStrategyWithIndividualStakes: StrategyMetadata = {
  id: "mock-lp-strategy-individual",
  providerId: "mock-provider",
  name: "Mock LP Strategy",
  description: "LP strategy with individual stakes",
  assets: mockLPAssets,
  tvl: 250000,
  apr: 0.12,
  rewardToken: {
    name: "PHO",
    icon: "/cryptoIcons/pho.svg",
    amount: 0,
    category: "phoenix",
    usdValue: 0.02,
    contractId: "pho-token",
  },
  unbondTime: 0, // Instant for LP example
  category: "liquidity",
  available: true,
  contractAddress: "MOCK_LP_CONTRACT_ADDRESS",
  contractType: "pair" as ContractType,
  userStake: 1500, // Total USD value of all stakes
  userRewards: 25,
  hasJoined: true,
  userIndividualStakes: [
    {
      lpAmount: BigInt("1000000000"),
      timestamp: BigInt(Math.floor(new Date("2023-01-15").getTime() / 1000)),
      displayAmount: "100.00 LP",
      displayDate: "2023-01-15",
    },
    {
      lpAmount: BigInt("500000000"),
      timestamp: BigInt(Math.floor(new Date("2023-02-20").getTime() / 1000)),
      displayAmount: "50.00 LP",
      displayDate: "2023-02-20",
    },
    {
      lpAmount: BigInt("2000000000"),
      timestamp: BigInt(Math.floor(new Date("2023-03-10").getTime() / 1000)),
      displayAmount: "200.00 LP",
      displayDate: "2023-03-10",
    },
  ],
};

const ModalWrapper = (args) => {
  const [open, setOpen] = useState(args.open || false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    args.onClose();
  };
  const handleConfirm = (
    params: number | { lpAmount: bigint; timestamp: bigint }
  ) => {
    args.onConfirm(params);
    // Do not close modal here, let the parent (EarnPage) handle it after transaction.
    // setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Open Unbond Modal</Button>
      <UnbondModal
        {...args}
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
        strategy={args.strategy || mockStrategy}
        maxAmount={args.maxAmount ?? (args.strategy || mockStrategy).userStake}
      />
    </>
  );
};

export const Default: Story = {
  render: ModalWrapper,
  args: {
    strategy: mockStrategy,
    maxAmount: 1000,
  },
};

export const WithLockPeriod: Story = {
  render: ModalWrapper,
  args: {
    strategy: mockStrategyWithLock,
    maxAmount: 500,
  },
};

export const PreOpened: Story = {
  render: ModalWrapper,
  args: {
    strategy: mockStrategy,
    maxAmount: 1000,
    open: true,
  },
};

export const ZeroMaxAmount: Story = {
  render: ModalWrapper,
  args: {
    strategy: mockStrategy,
    maxAmount: 0,
  },
};

export const LPStrategyWithIndividualStakes: Story = {
  render: ModalWrapper,
  args: {
    strategy: mockLPStrategyWithIndividualStakes,
    maxAmount: mockLPStrategyWithIndividualStakes.userStake, // Total stake value
    // open: false, // Default to closed
  },
};

export const PreOpenedLPStrategyWithIndividualStakes: Story = {
  render: ModalWrapper,
  args: {
    strategy: mockLPStrategyWithIndividualStakes,
    maxAmount: mockLPStrategyWithIndividualStakes.userStake,
    open: true,
  },
};
