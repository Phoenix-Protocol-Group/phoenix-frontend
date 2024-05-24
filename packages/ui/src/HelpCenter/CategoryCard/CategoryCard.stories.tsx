import type { Meta, StoryObj } from "@storybook/react";
import CategoryCard from "./CategoryCard";
import { Container, Grid } from "@mui/material";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof CategoryCard> = {
  title: "HelpCenter/CategoryCard",
  component: CategoryCard,
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
type Story = StoryObj<typeof CategoryCard>;

export const Primary: Story = {
  args: {
    category: {
      name: "Getting Started",
      description: "This is a category description",
      thumbnail: "https://via.placeholder.com/300",
    },
  },
};
