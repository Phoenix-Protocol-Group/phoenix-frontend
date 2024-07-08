import type { Meta, StoryObj } from "@storybook/react";
import CreateSomething from "./CreateSomething";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof CreateSomething> = {
  title: "Marketplace/CreateSomething",
  // @ts-ignore
  component: CreateSomething,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof CreateSomething>;

export const Primary: Story = {
  args: {
    title: "Create NFT",
    subTitle: "Choose how you want to create your NFT",
    title1: "foo",
    title2: "bar",
    description1: "desc1",
    description2: "desc2",
    option1Click: () => {alert("collection")},
    option2Click: () => {alert("nft")},
  },
};
