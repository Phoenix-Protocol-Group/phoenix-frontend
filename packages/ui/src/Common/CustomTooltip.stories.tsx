import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { CustomTooltip } from "./CustomTooltip";
import { Box } from "@mui/material";

export default {
  title: "Common/CustomTooltip",
  component: CustomTooltip,
  parameters: {
    layout: "centered",
  },
} as Meta<typeof CustomTooltip>;

const Template: StoryFn<typeof CustomTooltip> = (args) => (
  <Box sx={{ padding: "2rem", backgroundColor: "#171717" }}>
    <CustomTooltip {...args} />
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  active: true,
  payload: [
    { name: "Volume", value: 1234567 },
    { name: "Transactions", value: 456 },
  ],
  label: "January 1, 2023",
};

export const SingleValue = Template.bind({});
SingleValue.args = {
  active: true,
  payload: [
    { name: "Price", value: 0.0485 },
  ],
  label: "Today",
};

export const MultipleValues = Template.bind({});
MultipleValues.args = {
  active: true,
  payload: [
    { name: "Open", value: 0.0445 },
    { name: "Close", value: 0.0485 },
    { name: "High", value: 0.0492 },
    { name: "Low", value: 0.0438 },
  ],
  label: "October 15, 2023",
};
