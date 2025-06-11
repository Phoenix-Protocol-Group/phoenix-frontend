import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ImageUpload from "./ImageUpload";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof ImageUpload> = {
  title: "Marketplace/Shared/ImageUpload",
  // @ts-ignore
  component: ImageUpload,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof ImageUpload>;

export const Primary: Story = {
  args: {
    title: "LOGO IMAGE",
    helpText: "Lorem ipsum dolor sit amet",
    onFileDrop: (file: File) => {
      console.log(file);
    },
    description1: "You may change this after deploying your contract.",
  },
};
