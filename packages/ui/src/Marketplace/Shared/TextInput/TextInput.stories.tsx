import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TextInput from "./TextInput";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof TextInput> = {
  title: "Marketplace/Shared/TextInput",
  // @ts-ignore
  component: TextInput,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof TextInput>;

export const Primary: Story = {
  args: {
    label: "CONTRACT NAME",
    helpText: "Lorem ipsum dolor sit amet",
    placeholder: "My Collection Name",
    value: "",
    onChange: (val: string) => {},
  },
};
