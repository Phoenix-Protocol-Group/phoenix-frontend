import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { SwapAssetsButton } from "./SwapAssetsButton";
import { Box } from "@mui/material";

export default {
  title: "Swap/SwapAssetsButton",
  component: SwapAssetsButton,
  parameters: {
    layout: "centered",
  },
} as Meta<typeof SwapAssetsButton>;

const Template: StoryFn<typeof SwapAssetsButton> = (args) => (
  <Box sx={{ padding: "4rem", backgroundColor: "#171717", position: "relative" }}>
    <SwapAssetsButton {...args} />
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  onClick: () => console.log("Swap assets clicked"),
};
