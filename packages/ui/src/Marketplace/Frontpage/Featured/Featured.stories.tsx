import type { Meta, StoryObj } from "@storybook/react";
import Featured from "./Featured";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Featured> = {
  title: "Marketplace/Frontpage/Featured",
  // @ts-ignore
  component: Featured,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Featured>;

const demoItem = {
  id: "1234",
  image: "/banklocker.png",
  name: "Collection Name",
  price: "21.3K",
  volume: "42.5K",
  icon: "/cryptoIcons/btc.svg"
};

export const Primary: Story = {
  args: {
    entries: [demoItem, demoItem, demoItem, demoItem, demoItem, demoItem],
  },
};

export const Slider: Story = {
  args: {
    entries: [demoItem, demoItem, demoItem, demoItem, demoItem, demoItem],
    onClick: (id: string) => {},
    forwardClick: () => {},
    backwardClick: () => {}
  },
};
