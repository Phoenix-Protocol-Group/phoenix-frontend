import type { Meta, StoryObj } from "@storybook/react";
import DashboardStats from "./DashboardStats";
import { Grid } from "@mui/material";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof DashboardStats> = {
  title: "Skeletons/DashboardStats",
  // @ts-ignore
  component: DashboardStats,
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
type Story = StoryObj<typeof DashboardStats>;

export const Main: Story = {
  render: (args) => (
    <Grid item xs={12} md={8}>
      <DashboardStats {...args} />
    </Grid>
  ),
};
