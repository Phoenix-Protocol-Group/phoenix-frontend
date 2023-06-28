import type { Meta, StoryObj } from "@storybook/react";
import DashboardPriceCharts from "./DashboardCharts";
import { Grid } from "@mui/material";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof DashboardPriceCharts> = {
  title: "Dashboard/DashboardPriceCharts",
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

const mockDataset = [
  [1687392000000, 0.08683713332799949],
  [1687478400000, 0.08669248419239592],
  [1687564800000, 0.0893807322702632],
  [1687651200000, 0.09057594512560627],
  [1687737600000, 0.09168837759904613],
  [1687824000000, 0.09213058385843788],
  [1687859473000, 0.09397611798887386],
];

const mockDataset2 = [
  [1687392000000, 0.08683713332799949],
  [1687478400000, 0.08669248419239592],
  [1687564800000, 0.0893807322702632],
  [1687651200000, 0.09057594512560627],
  [1687737600000, 0.09168837759904613],
  [1687824000000, 0.09213058385843788],
  [1687859473000, 0.06397611798887386],
];

export const OneItem: Story = {
  args: {
    data: mockDataset,
    icon: {
      small: "image-103.png",
      large: "image-stellar.png",
    },
    assetName: "XLM",
  },
  render: (args) => (
    <Grid item xs={12} md={2}>
      <DashboardPriceCharts {...args} />
    </Grid>
  ),
};

export const TwoItems: Story = {
  // This is the data that will be used by the component
  args: {
    data: mockDataset,
    icon: {
      small: "image-103.png",
      large: "image-stellar.png",
    },
    assetName: "XLM",
  },
  render: (args) => (
    // The grid is a component that allows us to
    // easily organize the layout of our UI
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <DashboardPriceCharts {...args} />
      </Grid>
      <Grid item xs={12} md={2}>
        <DashboardPriceCharts
          assetName="Fake"
          icon={args.icon}
          data={mockDataset2}
        />
      </Grid>
    </Grid>
  ),
};
