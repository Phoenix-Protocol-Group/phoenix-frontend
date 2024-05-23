import type { Meta, StoryObj } from "@storybook/react";
import { VestedTokensModal } from "./VestedTokensModal";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof VestedTokensModal> = {
  title: "Dashboard/VestedTokensModal",
  // @ts-ignore
  component: VestedTokensModal,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof VestedTokensModal>;

export const Primary: Story = {
  args: {
    open: true
  },
};
