import type { Meta, StoryObj } from "@storybook/react";
import CryptoCTA from "./CryptoCTA";
import { Grid } from "@mui/material";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof CryptoCTA> = {
  title: "Dashboard/CryptoCallToAction",
  // @ts-ignore
  component: CryptoCTA,
  decorators: [
    (Story) => (
      <Grid container gap={3} style={{ margin: "3em" }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Grid item xs={3}>
          <Story />
        </Grid>
      </Grid>
    ),
  ],
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof CryptoCTA>;

export const Primary: Story = {
  args: {},
};
