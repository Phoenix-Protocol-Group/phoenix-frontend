import type { Meta, StoryObj } from "@storybook/react";
import { BridgeTokenBox } from "./BridgeTokenBox";

const token = {
  name: "USDT",
  icon: "cryptoIcons/usdt.svg",
  amount: 100,
  category: "Stable",
  usdValue: 1 * 100,
};

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof BridgeTokenBox> = {
  title: "Bridge/TokenBox",
  // @ts-ignore
  component: BridgeTokenBox,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof BridgeTokenBox>;

export const Primary: Story = {
  args: {
    token: token,
  },
};

export const Secondary: Story = {
  args: {
    token: token,
    hideDropdownButton: true,
  },
};
