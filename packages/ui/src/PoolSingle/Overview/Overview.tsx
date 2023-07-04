import { Box, Grid } from "@mui/material";
import PoolStats from "../PoolStats/PoolStats";
import LiquidityMining from "../LiquidityMining/LiquidityMining";
import StakingList from "../StakingList/StakingList";

const args = {
  poolStatArgs: {
    stats: [
      {
        title: "TVL",
        value: "$100,000.00",
      },
      {
        title: "My Share",
        value: "$0.00",
      },
      {
        title: "LP tokens",
        value: "0.00",
      },
      {
        title: "Swap fee",
        value: "0.3%",
      },
    ],
  },
  lpArgs: {
    rewards: [
      {
        name: "DAI",
        icon: "cryptoIcons/dai.svg",
        amount: 25,
        category: "Stable",
        usdValue: 1 * 25,
      },
      {
        name: "XLM",
        icon: "cryptoIcons/xlm.svg",
        amount: 200,
        category: "Non-Stable",
        usdValue: 0.85 * 200,
      },
    ],
    balance: 800,
  },
  stakingListArgs: {
    entries: [
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "3.5%",
        lockedPeriod: "1 day",
        amount: {
          tokenAmount: "10,000.5",
          tokenValueInUsd: "100,000.25",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "5.5%",
        lockedPeriod: "10 days",
        amount: {
          tokenAmount: "5,500.75",
          tokenValueInUsd: "55,000.50",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "7.5%",
        lockedPeriod: "20 days",
        amount: {
          tokenAmount: "2,250.25",
          tokenValueInUsd: "22,502.50",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "9.5%",
        lockedPeriod: "30 days",
        amount: {
          tokenAmount: "1,200.35",
          tokenValueInUsd: "12,003.75",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "11.5%",
        lockedPeriod: "40 days",
        amount: {
          tokenAmount: "800.75",
          tokenValueInUsd: "8,007.50",
        },
        onClick: () => {
          // Empty function
        },
      },
      // Add more entries as needed
    ],
  },
};

const Overview = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={7}>
        <Box sx={{ mb: 2 }}>
          <PoolStats {...args.poolStatArgs} />
        </Box>
        <Box sx={{ mb: 4 }}>
          <LiquidityMining
            {...args.lpArgs}
            onClaimRewards={() => {}}
            onStake={() => {}}
          />
        </Box>
        <StakingList {...args.stakingListArgs} />
      </Grid>
    </Grid>
  );
};

export default Overview;
