import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TextArea from "./TextArea";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof TextArea> = {
  title: "Marketplace/Shared/TextArea",
  // @ts-ignore
  component: TextArea,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof TextArea>;

export const Primary: Story = {
  args: {
    label: "CONTRACT NAME",
    helpText: "Lorem ipsum dolor sit amet",
    placeholder: "My Collection Name",
    value: "",
    onChange: (val: string) => {},
  },
};
