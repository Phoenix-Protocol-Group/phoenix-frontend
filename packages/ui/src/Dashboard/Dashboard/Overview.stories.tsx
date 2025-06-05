import type { Meta, StoryObj } from "@storybook/react";
import Overview from "./Overview";
import React from "react";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Overview> = {
  title: "Dashboard/Overview",
  // @ts-ignore
  component: Overview,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Overview>;

export const Dashboard: Story = {
  // This is the data that will be used by the component

  render: (args: any) => (
    <>
      <Overview />
    </>
  ),
};
