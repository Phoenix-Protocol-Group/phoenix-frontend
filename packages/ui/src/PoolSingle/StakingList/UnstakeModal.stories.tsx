import type { Meta, StoryObj } from "@storybook/react";
import { UnstakeModal } from "./UnstakeModal";
import { Grid } from "@mui/material";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof UnstakeModal> = {
  title: "Pool/UnstakeModal",
  // @ts-ignore
  component: UnstakeModal,
};

export default meta;

const testTokens = [
  {
    name: "DAI",
    icon: "cryptoIcons/dai.svg",
    amount: 25,
    category: "Stable",
    usdValue: 1 * 25,
  },
  {
    name: "XLM",
    icon: "cryptoIcons/xlm.svg",
    amount: 200,
    category: "Non-Stable",
    usdValue: 0.85 * 200,
  },
];

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof UnstakeModal>;

export const Primary: Story = {
  args: {
    open: true,
    setOpen: () => {},
    timestamp: 1635734400000,
    maxAmount: 100,
    unstake: () => {},
    token: testTokens[0],
  },
};
