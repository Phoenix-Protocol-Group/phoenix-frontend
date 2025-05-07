import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { UnbondModal } from "./UnbondModal";
import { Button } from "../../Button/Button";
import { StrategyMetadata, ContractType } from "@phoenix-protocol/strategies";

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

const mockStrategy: StrategyMetadata = {
  id: "mock-strategy-1",
  providerId: "mock-provider",
  name: "Mock Yield Strategy",
  description: "A mock strategy for testing",
  assets: [
    {
      name: "XLM",
      icon: "/cryptoIcons/xlm.svg",
      amount: 0,
      category: "native",
      usdValue: 0.11,
    },
  ],
  tvl: 100000,
  apr: 0.05,
  rewardToken: {
    name: "PHO",
    icon: "/cryptoIcons/pho.svg",
    amount: 0,
    category: "phoenix",
    usdValue: 0.02,
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

const ModalWrapper = (args) => {
  const [open, setOpen] = useState(args.open || false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    args.onClose();
  };
  const handleConfirm = (amount: number) => {
    args.onConfirm(amount);
    setOpen(false);
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
