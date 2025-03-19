import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FinancialChart } from "./FinancialChart";

const meta: Meta<typeof FinancialChart> = {
  title: "Transactions/FinancialChart",
  component: FinancialChart,
  argTypes: {
    period: {
      options: ["W", "M", "Y"],
      control: { type: "select" },
    },
    setPeriod: { action: "setPeriod" },
  },
};

export default meta;

type Story = StoryObj<typeof FinancialChart>;

const mockHistoricalPrices = [
  { txTime: "1672531200", price: 10, id: "1", txHash: "0x123" },
  { txTime: "1672617600", price: 12, id: "2", txHash: "0x456" },
  { txTime: "1672704000", price: 15, id: "3", txHash: "0x789" },
  { txTime: "1672790400", price: 13, id: "4", txHash: "0xabc" },
  { txTime: "1672876800", price: 16, id: "5", txHash: "0xdef" },
];

export const General: Story = {
  args: {
    historicalPrices: mockHistoricalPrices,
    period: "W",
    setPeriod: (period: "W" | "M" | "Y") =>
      console.log(`Selected period: ${period}`),
  },
};
