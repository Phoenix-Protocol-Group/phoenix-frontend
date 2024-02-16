import type { Meta, StoryObj } from "@storybook/react";
import { VolumeChart } from "./VolumeChart";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof VolumeChart> = {
  title: "Transactions/VolumeChart",
  component: VolumeChart,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#timestampd-story-exports
type Story = StoryObj<typeof VolumeChart>;

const data = [
  { timestamp: "12 AM", volume: 1200000 },
  { timestamp: "1 AM", volume: 800000 },
  { timestamp: "2 AM", volume: 500000 },
  { timestamp: "3 AM", volume: 300000 },
  { timestamp: "4 AM", volume: 200000 },
  { timestamp: "5 AM", volume: 250000 },
  { timestamp: "6 AM", volume: 600000 },
  { timestamp: "7 AM", volume: 960000 },
  { timestamp: "8 AM", volume: 1280000 },
  { timestamp: "9 AM", volume: 1600000 },
  { timestamp: "10 AM", volume: 1880000 },
  { timestamp: "11 AM", volume: 2200000 },
  { timestamp: "12 PM", volume: 2100000 },
  { timestamp: "1 PM", volume: 2000000 },
  { timestamp: "2 PM", volume: 1800000 },
  { timestamp: "3 PM", volume: 1700000 },
  { timestamp: "4 PM", volume: 1500000 },
  { timestamp: "5 PM", volume: 1400000 },
  { timestamp: "6 PM", volume: 1300000 },
  { timestamp: "7 PM", volume: 1250000 },
  { timestamp: "8 PM", volume: 1300000 },
  { timestamp: "9 PM", volume: 1350000 },
  { timestamp: "10 PM", volume: 1400000 },
  { timestamp: "11 PM", volume: 1450000 },
];

export const Primary: Story = {
  args: {
    data,
  },
};
