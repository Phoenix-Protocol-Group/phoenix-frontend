import type { Meta, StoryObj } from "@storybook/react";
import { VolumeChart } from "./VolumeChart";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof VolumeChart> = {
  title: "Transactions/VolumeChart",
  component: VolumeChart,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof VolumeChart>;

const data = [
  { name: "12 AM", value: 1200000 },
  { name: "1 AM", value: 800000 },
  { name: "2 AM", value: 500000 },
  { name: "3 AM", value: 300000 },
  { name: "4 AM", value: 200000 },
  { name: "5 AM", value: 250000 },
  { name: "6 AM", value: 600000 },
  { name: "7 AM", value: 960000 },
  { name: "8 AM", value: 1280000 },
  { name: "9 AM", value: 1600000 },
  { name: "10 AM", value: 1880000 },
  { name: "11 AM", value: 2200000 },
  { name: "12 PM", value: 2100000 },
  { name: "1 PM", value: 2000000 },
  { name: "2 PM", value: 1800000 },
  { name: "3 PM", value: 1700000 },
  { name: "4 PM", value: 1500000 },
  { name: "5 PM", value: 1400000 },
  { name: "6 PM", value: 1300000 },
  { name: "7 PM", value: 1250000 },
  { name: "8 PM", value: 1300000 },
  { name: "9 PM", value: 1350000 },
  { name: "10 PM", value: 1400000 },
  { name: "11 PM", value: 1450000 },
];

export const Primary: Story = {
  args: {
    data,
  },
};
