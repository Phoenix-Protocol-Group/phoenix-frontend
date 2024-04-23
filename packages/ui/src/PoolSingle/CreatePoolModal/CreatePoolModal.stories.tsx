import type { Meta, StoryObj } from "@storybook/react";
import CreatePoolModal from "./CreatePoolModal";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof CreatePoolModal> = {
  title: "Pool/CreatePoolModal",
  // @ts-ignore
  component: CreatePoolModal,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof CreatePoolModal>;

export const Primary: Story = {
  args: {
    isOpen: true,
    setOpen: () => {},
  },
};
