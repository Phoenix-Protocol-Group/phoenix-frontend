import type { Meta, StoryObj } from "@storybook/react";
import DashboardPriceCharts from "./DashboardCharts";
import { Grid } from "@mui/material";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof DashboardPriceCharts> = {
  title: "Skeletons/DashboardPriceCharts",
  // @ts-ignore
  component: DashboardPriceCharts,
  decorators: [
    (Story) => (
      <Grid container gap={3} sx={{ margin: { md: "3rem" } }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}

        <Story />
      </Grid>
    ),
  ],
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof DashboardPriceCharts>;

export const OneItem: Story = {
  render: () => (
    <Grid item xs={12} md={2}>
      <DashboardPriceCharts />
    </Grid>
  ),
};
