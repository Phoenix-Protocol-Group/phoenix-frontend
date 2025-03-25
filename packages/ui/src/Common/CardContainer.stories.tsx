import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { CardContainer } from "./CardContainer";
import { Box, Typography } from "@mui/material";

export default {
  title: "Common/CardContainer",
  component: CardContainer,
  parameters: {
    layout: "centered",
  },
} as Meta<typeof CardContainer>;

const Template: StoryFn<typeof CardContainer> = (args) => (
  <Box sx={{ padding: "2rem", backgroundColor: "#171717" }}>
    <CardContainer {...args} />
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  children: (
    <Box sx={{ minWidth: "300px", minHeight: "150px" }}>
      <Typography sx={{ color: "#FAFAFA", fontWeight: 500, fontSize: "1.25rem" }}>
        Card Title
      </Typography>
      <Typography sx={{ color: "#D4D4D4", mt: 2 }}>
        This is a standard card with default styling. It can contain any content.
      </Typography>
    </Box>
  ),
};

export const Highlighted = Template.bind({});
Highlighted.args = {
  highlighted: true,
  children: (
    <Box sx={{ minWidth: "300px", minHeight: "150px" }}>
      <Typography sx={{ color: "#FAFAFA", fontWeight: 500, fontSize: "1.25rem" }}>
        Highlighted Card
      </Typography>
      <Typography sx={{ color: "#D4D4D4", mt: 2 }}>
        This card has special highlight styling to make it stand out.
      </Typography>
    </Box>
  ),
};

export const NoPadding = Template.bind({});
NoPadding.args = {
  noPadding: true,
  children: (
    <Box sx={{ minWidth: "300px", minHeight: "150px", p: 2 }}>
      <Typography sx={{ color: "#FAFAFA", fontWeight: 500, fontSize: "1.25rem" }}>
        No Padding Card
      </Typography>
      <Typography sx={{ color: "#D4D4D4", mt: 2 }}>
        This card has no built-in padding, allowing for custom content layouts.
      </Typography>
    </Box>
  ),
};

export const CustomStyling = Template.bind({});
CustomStyling.args = {
  sx: { 
    maxWidth: "400px",
    background: "linear-gradient(135deg, #262626 0%, #171717 100%)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
  children: (
    <Box sx={{ minHeight: "150px" }}>
      <Typography sx={{ color: "#FAFAFA", fontWeight: 500, fontSize: "1.25rem" }}>
        Custom Styled Card
      </Typography>
      <Typography sx={{ color: "#D4D4D4", mt: 2 }}>
        This card has custom styles applied via the sx prop, demonstrating how the component can be extended.
      </Typography>
    </Box>
  ),
};
