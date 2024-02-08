import type { Meta, StoryObj } from "@storybook/react";
import HistoryPage from "./page";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof HistoryPage> = {
  title: "Transactions/HistoryPage",
  component: HistoryPage,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof HistoryPage>;

export const Primary: Story = {
  args: {},
};
