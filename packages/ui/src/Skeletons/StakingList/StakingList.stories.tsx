import type { Meta, StoryObj } from "@storybook/react";
import StakingList from "./StakingList";
import { Grid } from "@mui/material";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof StakingList> = {
  title: "Skeletons/StakingList",
  // @ts-ignore
  component: StakingList,
  decorators: [
    (Story) => (
      <Grid container>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Grid item xs={12} md={7}>
          <Story />
        </Grid>
      </Grid>
    ),
  ],
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof StakingList>;

export const Primary: Story = {};
