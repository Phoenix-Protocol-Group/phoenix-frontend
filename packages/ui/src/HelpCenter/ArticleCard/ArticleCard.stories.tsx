import type { Meta, StoryObj } from "@storybook/react";
import { ArticleCard } from "./ArticleCard";
import example from "./example.json";
import { Grid, Container } from "@mui/material";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof ArticleCard> = {
  title: "HelpCenter/ArticleCard",
  component: ArticleCard,
  decorators: [
    (Story) => (
      <Container>
        <Grid container spacing={3}>
          {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
          <Grid item xs={12} md={4}>
            <Story />
          </Grid>
          <Grid item xs={12} md={4}>
            <Story />
          </Grid>
          <Grid item xs={12} md={4}>
            <Story />
          </Grid>
        </Grid>
      </Container>
    ),
  ],
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof ArticleCard>;

export const Primary: Story = {
  args: {
    // @ts-ignore
    article: example.items[0],
  },
};
