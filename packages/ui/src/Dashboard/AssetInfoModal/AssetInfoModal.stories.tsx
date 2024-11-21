import type { Meta, StoryObj } from "@storybook/react";
import { AssetInfoModal } from "./AssetInfoModal";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof AssetInfoModal> = {
  title: "Dashboard/AssetInfoModal",
  // @ts-ignore
  component: AssetInfoModal,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof AssetInfoModal>;

export const Primary: Story = {
  args: {
    open: true,
    asset: {
      asset: "PHO-GAX5TXB5RYJNLBUR477PEXM4X75APK2PGMTN6KEFQSESGWFXEAKFSXJO-1",
      supply: 2000897775221742,
      traded_amount: 6831936130,
      payments_amount: 2330868044789,
      created: 1715112013,
      trustlines: [178, 178, 87],
      payments: 2336,
      domain: "app.phoenix-hub.io",
      rating: {
        age: 0,
        trades: 4,
        payments: 4,
        trustlines: 3,
        volume7d: 7,
        interop: 4,
        liquidity: 1,
        average: 3.3,
      },
      price7d: [
        [1715126400, 4.918545635483871],
        [1715212800, 1.493419405263158],
        [1715299200, 1.7245551875],
        [1715385600, 2.519457714285714],
        [1715472000, 52.90474066666667],
        [1715558400, 2.6065395625],
        [1715644800, 2.2936092857142856],
      ],
      volume7d: 43761816818,
      tomlInfo: {
        code: "PHO",
        issuer: "GAX5TXB5RYJNLBUR477PEXM4X75APK2PGMTN6KEFQSESGWFXEAKFSXJO",
        image: "/cryptoIcons/pho.svg",
        decimals: 7,
        orgName: "Phoenix Protocol Group",
        orgLogo: "/cryptoIcons/pho.svg",
      },
      paging_token: 1,
    },
  },
};
