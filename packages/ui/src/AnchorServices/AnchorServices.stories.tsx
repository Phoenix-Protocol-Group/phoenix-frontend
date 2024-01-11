import type { Meta, StoryObj } from "@storybook/react";
import { AnchorServices } from "./AnchorServices";
import { Anchor } from "@phoenix-protocol/types";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof AnchorServices> = {
  title: "Layout/AnchorServices",
  component: AnchorServices,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof AnchorServices>;

const anchor: Anchor = {
  name: "kado",
  logo: "anchors/kado.svg",
  sep: ["sep24"],
  domain: "",
  tokens: [
    {
      name: "USDT",
      icon: "cryptoIcons/usdt.svg",
      amount: 100,
      category: "Stable",
      usdValue: 1 * 100,
    },
    {
      name: "USD",
      icon: "cryptoIcons/usdt.svg",
      amount: 100,
      category: "Stable",
      usdValue: 1,
    },
  ],
};

const anchor2: Anchor = {
  name: "test",
  logo: "anchors/kado.svg",
  sep: ["sep24"],
  domain: "",
  tokens: [
    {
      name: "USDT",
      icon: "cryptoIcons/usdt.svg",
      amount: 100,
      category: "Stable",
      usdValue: 1 * 100,
    },
    {
      name: "USD",
      icon: "cryptoIcons/usdt.svg",
      amount: 100,
      category: "Stable",
      usdValue: 1,
    },
  ],
};

export const Anchors: Story = {
  args: {
    anchors: [anchor, anchor2],
    open: true,
    authenticate: async (anchor: Anchor) => {
      // Time out for 1 sec to test loading
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return true;
    },
    sign: async (anchor: Anchor) => {
      // Time out for 1 sec to test loading
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return true;
    },
    send: async (anchor: Anchor) => {
      // Time out for 1 sec to test loading
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return true;
    },
    setOpen: () => {
      return true;
    },
  },
};
