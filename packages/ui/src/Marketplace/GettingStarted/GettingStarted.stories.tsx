import type { Meta, StoryObj } from "@storybook/react";
import GettingStarted from "./GettingStarted";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof GettingStarted> = {
  title: "Marketplace/GettingStarted",
  // @ts-ignore
  component: GettingStarted,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof GettingStarted>;

const demoItem = {
  image: "/banklocker.png",
  name: "Create",
  description: "Lorem ipsum dolor sit amet consectetur adipiscing."
};

export const Primary: Story = {
  args: {
    entries: [demoItem, demoItem, demoItem],
    onViewAllClick: () => {},
  },
};
