import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ProviderStrategyGroup } from "./ProviderStrategyGroup";
import { StrategyMetadata } from "@phoenix-protocol/strategies";
import { ContractType } from "@phoenix-protocol/strategies";

const meta: Meta<typeof ProviderStrategyGroup> = {
  title: "Earn/ProviderStrategyGroup",
  component: ProviderStrategyGroup,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onBondClick: { action: "bond clicked" },
    onUnbondClick: { action: "unbond clicked" },
    onViewDetails: { action: "view details clicked" },
  },
};

export default meta;

type Story = StoryObj<typeof ProviderStrategyGroup>;

// Mock strategies for Phoenix
const mockPhoenixStrategies: StrategyMetadata[] = [
  {
    id: "phoenix-xlm-usdc",
    providerId: "phoenix",
    name: "XLM-USDC Liquidity Pool",
    description: "Provide liquidity to the XLM-USDC pair and earn PHO rewards",
    assets: [
      {
        name: "XLM",
        icon: "/cryptoIcons/xlm.svg",
        amount: 50000,
        category: "native",
        usdValue: 0.11,
        contractId: "xlm-native",
      },
      {
        name: "USDC",
        icon: "/cryptoIcons/usdc.svg",
        amount: 25000,
        category: "token",
        usdValue: 1.0,
        contractId: "usdc-token",
      },
    ],
    tvl: 2500000,
    apr: 0.085,
    rewardToken: {
      name: "PHO",
      icon: "/cryptoIcons/pho.svg",
      amount: 0,
      category: "phoenix",
      usdValue: 0.02,
      contractId: "pho-token",
    },
    unbondTime: 0,
    category: "liquidity",
    available: true,
    contractAddress: "CBHCRSVX3ZZ7EGTSYMKPEFGZNWRVCSESQR3UABET4MIW52N4EVU6BIZX",
    contractType: "pair" as ContractType,
    userStake: 1200,
    userRewards: 15.5,
    hasJoined: true,
  },
  {
    id: "phoenix-pho-usdc",
    providerId: "phoenix",
    name: "PHO-USDC Liquidity Pool",
    description: "Provide liquidity to the PHO-USDC pair and earn PHO rewards",
    assets: [
      {
        name: "PHO",
        icon: "/cryptoIcons/pho.svg",
        amount: 1000000,
        category: "phoenix",
        usdValue: 0.02,
        contractId: "pho-token",
      },
      {
        name: "USDC",
        icon: "/cryptoIcons/usdc.svg",
        amount: 20000,
        category: "token",
        usdValue: 1.0,
        contractId: "usdc-token",
      },
    ],
    tvl: 1800000,
    apr: 0.12,
    rewardToken: {
      name: "PHO",
      icon: "/cryptoIcons/pho.svg",
      amount: 0,
      category: "phoenix",
      usdValue: 0.02,
      contractId: "pho-token",
    },
    unbondTime: 259200,
    category: "liquidity",
    available: true,
    contractAddress: "CD5XNKK3B6BEF2N7ULNHHGAMOKZ7P6456BFNIHRF4WNTEDKBRWAE7IAA",
    contractType: "pair" as ContractType,
    userStake: 0,
    userRewards: 0,
    hasJoined: false,
  },
];

// Mock strategies for Blend
const mockBlendStrategies: StrategyMetadata[] = [
  {
    id: "blend-usdc-lending",
    providerId: "blend",
    name: "USDC Lending",
    description: "Lend USDC on Blend and earn BLND rewards",
    assets: [
      {
        name: "USDC",
        icon: "/cryptoIcons/usdc.svg",
        amount: 0,
        category: "token",
        usdValue: 1.0,
        contractId: "usdc-token",
      },
    ],
    tvl: 5200000,
    apr: 0.045,
    rewardToken: {
      name: "BLND",
      icon: "/cryptoIcons/blend.svg",
      amount: 0,
      category: "blend",
      usdValue: 0.05,
      contractId: "blnd-token",
    },
    unbondTime: 0,
    category: "lending",
    available: true,
    contractAddress: "BLEND_USDC_CONTRACT",
    contractType: "stake" as ContractType,
    userStake: 2500,
    userRewards: 8.2,
    hasJoined: true,
  },
  {
    id: "blend-xlm-lending",
    providerId: "blend",
    name: "XLM Lending",
    description: "Lend XLM on Blend and earn BLND rewards",
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
    tvl: 3800000,
    apr: 0.038,
    rewardToken: {
      name: "BLND",
      icon: "/cryptoIcons/blend.svg",
      amount: 0,
      category: "blend",
      usdValue: 0.05,
      contractId: "blnd-token",
    },
    unbondTime: 0,
    category: "lending",
    available: true,
    contractAddress: "BLEND_XLM_CONTRACT",
    contractType: "stake" as ContractType,
    userStake: 0,
    userRewards: 0,
    hasJoined: false,
  },
];

export const PhoenixProtocol: Story = {
  args: {
    providerId: "phoenix",
    providerName: "Phoenix Protocol",
    providerIcon: "/cryptoIcons/pho.svg",
    providerDescription:
      "Provide liquidity to the Phoenix trading pairs and earn PHO rewards",
    strategies: mockPhoenixStrategies,
    totalTVL: 4300000,
    rewardTokens: [
      {
        token: "PHO",
        icon: "/cryptoIcons/pho.svg",
        amount: 15.5,
      },
    ],
  },
};

export const BlendProtocol: Story = {
  args: {
    providerId: "blend",
    providerName: "Blend",
    providerIcon: "/cryptoIcons/blend.svg",
    providerDescription: "Lending and borrowing protocol on Stellar",
    strategies: mockBlendStrategies,
    totalTVL: 9000000,
    rewardTokens: [
      {
        token: "BLND",
        icon: "/cryptoIcons/blend.svg",
        amount: 8.2,
      },
    ],
  },
};

export const NoStrategies: Story = {
  args: {
    providerId: "empty",
    providerName: "Empty Provider",
    providerIcon: "/cryptoIcons/default.svg",
    providerDescription: "A provider with no strategies",
    strategies: [],
    totalTVL: 0,
    rewardTokens: [],
  },
};
