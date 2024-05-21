import type { Meta, StoryObj } from "@storybook/react";
import TransactionsTable from "./TransactionsTable";
import { Grid } from "@mui/material";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof TransactionsTable> = {
  title: "Skeletons/TransactionsTable",
  // @ts-ignore
  component: TransactionsTable,
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
type Story = StoryObj<typeof TransactionsTable>;

export const Primary: Story = {};
