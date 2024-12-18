import type { Meta, StoryObj } from "@storybook/react";
import { MainStats } from "./MainStats";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof MainStats> = {
  title: "Dashboard/MainStats",
  // @ts-ignore
  component: MainStats,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof MainStats>;

export const Primary: Story = {
  args: {
    stats: [
      {
        title: "Total Assets",
        value: "$100,000",
        link: "https://google.com",
      },
      {
        title: "Total Rewards",
        value: "$100,000",
        link: "https://google.com",
      },
      {
        title: "Staked Phoenix",
        value: "$100,000",
        link: "https://google.com",
      },
    ],
  },
};
