import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TextSelect from "./TextSelect";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof TextSelect> = {
  title: "Marketplace/Shared/TextSelect",
  // @ts-ignore
  component: TextSelect,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof TextSelect>;

export const Primary: Story = {
  args: {
    label: "CONTRACT NAME",
    helpText: "Lorem ipsum dolor sit amet",
    value: "option1",
    onChange: (value: string) => {},
    items: [
      {
        label: "Option 1",
        value: "option1",
      },
      {
        label: "Option 2",
        value: "option2",
      },
      {
        label: "Option 3",
        value: "option3",
      },
    ],
  },
};
