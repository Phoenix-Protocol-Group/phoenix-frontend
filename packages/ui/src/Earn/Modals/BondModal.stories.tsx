import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { BondModal } from "./BondModal";
import { Button } from "../../Button/Button"; // Import Button to trigger modal
import { StrategyMetadata, ContractType } from "@phoenix-protocol/strategies";
import { Token } from "@phoenix-protocol/types";

const meta: Meta<typeof BondModal> = {
  title: "Earn/Modals/BondModal",
  component: BondModal,
  parameters: {
    layout: "centered", // Center the button that opens the modal
  },
  argTypes: {
    open: { control: "boolean" },
    onClose: { action: "closed" },
    onConfirm: { action: "confirmed" },
    strategy: { control: "object" },
  },
};

export default meta;

type Story = StoryObj<typeof BondModal>;

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
      contractId: "xlm-native",
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
    contractId: "pho-token",
  },
  unbondTime: 0,
  category: "yield",
  available: true,
  contractAddress: "MOCK_CONTRACT_ADDRESS",
  contractType: "stake" as ContractType,
  userStake: 0,
  userRewards: 0,
  hasJoined: false,
};

const mockLPStrategy: StrategyMetadata = {
  ...mockStrategy,
  id: "mock-lp-strategy",
  name: "XLM-USDC Liquidity Pool",
  description: "Provide liquidity to earn PHO rewards",
  assets: [
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
  ],
  category: "farming",
  contractType: "pair" as ContractType,
};

const mockTripleAssetStrategy: StrategyMetadata = {
  ...mockStrategy,
  id: "mock-triple-asset-strategy",
  name: "Triple Asset Pool",
  description: "Provide liquidity to a stable pool",
  assets: [
    {
      name: "USDC",
      icon: "/cryptoIcons/usdc.svg",
      amount: 0,
      category: "token",
      usdValue: 1.0,
      contractId: "usdc-token",
    },
    {
      name: "USDT",
      icon: "/cryptoIcons/usdt.svg",
      amount: 0,
      category: "token",
      usdValue: 0.999,
      contractId: "usdt-token",
    },
    {
      name: "DAI",
      icon: "/cryptoIcons/dai.svg",
      amount: 0,
      category: "token",
      usdValue: 0.998,
      contractId: "dai-token",
    },
  ],
  category: "farming",
  contractType: "pair" as ContractType, // Using "pair" for triple asset pool too
};

const ModalWrapper = (args) => {
  const [open, setOpen] = useState(args.open || false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    args.onClose(); // Call the action
  };
  const handleConfirm = (tokenAmounts) => {
    args.onConfirm(tokenAmounts); // Call the action
    console.log("Token amounts:", tokenAmounts);
    setOpen(false); // Close modal on confirm
  };

  return (
    <>
      <Button onClick={handleOpen}>
        {args.strategy?.contractType === "pair"
          ? "Open Liquidity Modal"
          : "Open Bond Modal"}
      </Button>
      <BondModal
        {...args}
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
        strategy={args.strategy || mockStrategy}
      />
    </>
  );
};

export const Default: Story = {
  render: ModalWrapper,
  args: {
    // Args for the wrapper, not the modal directly
    strategy: mockStrategy,
    // open: false, // Initial state is closed
  },
};

export const PreOpened: Story = {
  render: ModalWrapper,
  args: {
    strategy: mockStrategy,
    open: true, // Start with the modal open
  },
};

export const LiquidityPair: Story = {
  render: ModalWrapper,
  args: {
    strategy: mockLPStrategy,
  },
};

export const PreOpenedLiquidityPair: Story = {
  render: ModalWrapper,
  args: {
    strategy: mockLPStrategy,
    open: true,
  },
};

export const TripleAssetPool: Story = {
  render: ModalWrapper,
  args: {
    strategy: mockTripleAssetStrategy,
  },
};
