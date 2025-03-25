import type { Meta, StoryObj } from "@storybook/react";
import { VestingTokensModal } from "./VestingTokensModal";
import { PhoenixVestingContract } from "@phoenix-protocol/contracts";
import { Grid } from "@mui/material";
import React from "react";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof VestingTokensModal> = {
  title: "Dashboard/VestingTokensModal",
  // @ts-ignore
  component: VestingTokensModal,
  decorators: [
    (Story) => (
      <Grid container gap={3} style={{ margin: "3em" }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Grid item xs={9}>
          <Story />
        </Grid>
      </Grid>
    ),
  ],
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof VestingTokensModal>;

const mockVestingInfoResponses: PhoenixVestingContract.VestingInfoResponse[] = [
  {
    balance: "50000000", // Convert BigInt to string
    index: "1", // Convert BigInt to string
    recipient: "GABCD1234567890EXAMPLERECIPIENT1",
    schedule: {
      tag: "SaturatingLinear",
      values: [
        {
          min_x: "1739883660",
          min_y: "10000000000",
          max_x: "1739966225",
          max_y: "0",
        },
      ],
    },
  },
  {
    balance: "100000000",
    index: "2",
    recipient: "GABCD1234567890EXAMPLERECIPIENT2",
    schedule: {
      tag: "PiecewiseLinear",
      values: [
        {
          steps: [
            { time: "1708340640", value: "100000000" },
            { time: "1725889440", value: "50000000" },
            { time: "1739876640", value: "0" },
          ],
        },
      ],
    },
  },
  {
    balance: "200000000",
    index: "3",
    recipient: "GABCD1234567890EXAMPLERECIPIENT3",
    schedule: {
      tag: "Constant",
      values: ["200000000"],
    },
  },
];

export const Primary: Story = {
  args: {
    vestingInfo: mockVestingInfoResponses,
    open: true,
    // mock available to claim
    queryAvailableToClaim: async (index) => {
      switch (Number(index)) {
        case 0:
          return BigInt(50000000);
        case 1:
          return BigInt(100000000);
      }
    },
    // mock claim function
    claim: async (index) => {
      console.log(`Claiming for index ${index}`);
    },
  },
};
