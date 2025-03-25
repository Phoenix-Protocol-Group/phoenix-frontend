import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { SwapDetails } from "./SwapDetails";
import { Box } from "@mui/material";

export default {
  title: "Swap/SwapDetails",
  component: SwapDetails,
  parameters: {
    layout: "centered",
  },
} as Meta<typeof SwapDetails>;

const Template: StoryFn<typeof SwapDetails> = (args) => (
  <Box sx={{ padding: "2rem", backgroundColor: "#171717", width: "400px" }}>
    <SwapDetails {...args} />
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  exchangeRate: "1 PHO = 0.0452 USDC",
  networkFee: "0.1%",
  route: "PHO → USDC",
  slippageTolerance: "0.5%",
};

export const ComplexRoute = Template.bind({});
ComplexRoute.args = {
  exchangeRate: "1 PHO = 0.0452 USDC",
  networkFee: "0.25%",
  route: "PHO → XLM → USDC",
  slippageTolerance: "1.0%",
};
