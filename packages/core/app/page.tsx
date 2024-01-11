"use client";
import { Alert, Grid, useMediaQuery, useTheme } from "@mui/material";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { Helmet } from "react-helmet";
import {
  CryptoCTA,
  DashboardPriceCharts,
  DashboardStats,
  MainStats,
  WalletBalanceTable,
  AnchorServices,
} from "@phoenix-protocol/ui";
import Link from "next/link";

import { useEffect, useState } from "react";
import {
  DepositManager,
  getAllAnchors,
} from "@phoenix-protocol/utils/build/sep24";
import { Anchor } from "@phoenix-protocol/types";

const stellarGainerAsset = {
  name: "Stellar",
  symbol: "XLM",
  price: "$3.00",
  change: 22.5,
  icon: "/cryptoIcons/xlm.svg",
  volume: "$100,000",
};

const usdcLoserAsset = {
  name: "USDC",
  symbol: "USDC",
  price: "$1",
  change: -0.8,
  icon: "/cryptoIcons/usdc.svg",
  volume: "$100,000",
};

const args = {
  mainstatsArgs: {
    stats: [
      {
        title: "Total Assets",
        value: "$100,000",
        link: "https://google.com",
      },
      {
        title: "Total Rewards",
        value: "$100,000",
        link: "https://google.com",
      },
      {
        title: "Staked Phoenix",
        value: "$100,000",
        link: "https://google.com",
      },
    ],
  },
  dashboardArgs: {
    data: [
      [1687392000000, 0.08683713332799949],
      [1687478400000, 0.08669248419239592],
      [1687564800000, 0.0893807322702632],
      [1687651200000, 0.09057594512560627],
      [1687737600000, 0.09168837759904613],
      [1687824000000, 0.09213058385843788],
      [1687859473000, 0.09397611798887386],
    ],
    icon: {
      small: "image-103.png",
      large: "image-stellar.png",
    },
    assetName: "XLM",
  },
  walletBalanceArgs: {
    tokens: [
      {
        name: "USDT",
        icon: "cryptoIcons/usdt.svg",
        amount: 100,
        category: "Stable",
        usdValue: 1 * 100,
      },
      {
        name: "USDC",
        icon: "cryptoIcons/usdc.svg",
        amount: 50,
        category: "Stable",
        usdValue: 1 * 50,
      },
    ],
  },
  dashboardStatsArgs: {
    gainer: stellarGainerAsset,
    loser: usdcLoserAsset,
    availableAssets: "$100,000",
    lockedAssets: "$100,000",
  },
};

export default function Page() {
  const theme = useTheme();
  const appStore = useAppStore();
  const persistStore = usePersistStore();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [anchors, setAnchors] = useState<Anchor[]>([]);

  const authenticate = async (anchor: Anchor) => {
    const manager = new DepositManager(anchor, persistStore.wallet.address!);
    const transferServer = await manager.openTransferServer();
    return true;
  };

  const sign = async (anchor: Anchor) => {
    const manager = new DepositManager(anchor, persistStore.wallet.address!);
    const transferServer = await manager.openTransferServer();
    const { depositableAssets: supportedAssets } =
      await manager.fetchTransferInfos(transferServer);
    const token = await manager.startSep10Auth(transferServer);
    await manager.handleDeposit(transferServer, supportedAssets, token);
    return true;
  };

  const initAnchor = async () => {
    const allAnchors = await getAllAnchors();
    setAnchors(allAnchors);
  };

  useEffect(() => {
    initAnchor();
  }, []);

  return (
    <>
      <Helmet>
        <title>Phoenix DeFi Hub - Dashboard</title>
      </Helmet>
      {anchors.length > 0 && (
        <AnchorServices
          anchors={anchors}
          open={anchorOpen}
          authenticate={(anchor) => authenticate(anchor)}
          // Wait 2 seconds
          sign={() => new Promise((resolve) => setTimeout(resolve, 2000))}
          send={(anchor) => sign(anchor)}
          setOpen={(open) => setAnchorOpen(open)}
        />
      )}
      <Grid
        sx={{
          transition: "all 0.2s ease-in-out",
        }}
        container
        spacing={largerThenMd ? 3 : 1}
      >
        <Grid item xs={12}>
          <Alert severity="warning" sx={{ zIndex: 2, mt: 6 }}>
            This dashboard is currently work in progress. The data you see here
            is just mocked. Follow our next{" "}
            <Link
              href="https://dashboard.communityfund.stellar.org/scfawards/scf-test/submission/suggestion/34"
              target="_blank"
              color="white"
            >
              grant submission
            </Link>{" "}
            to see the progress on this.
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <MainStats {...args.mainstatsArgs} />
        </Grid>
        <Grid item xs={12} md={8} mt={!largerThenMd ? 2 : undefined}>
          <DashboardStats {...args.dashboardStatsArgs} />
        </Grid>
        <Grid item xs={6} md={2} mt={!largerThenMd ? 2 : undefined}>
          <DashboardPriceCharts {...args.dashboardArgs} />
        </Grid>
        <Grid item xs={6} md={2} mt={!largerThenMd ? 2 : undefined}>
          <DashboardPriceCharts {...args.dashboardArgs} />
        </Grid>
        <Grid item xs={12} md={4} mt={!largerThenMd ? 2 : undefined}>
          <CryptoCTA onClick={() => setAnchorOpen(true)} />
        </Grid>
        <Grid item xs={12} md={8} mt={!largerThenMd ? 2 : undefined}>
          <WalletBalanceTable {...args.walletBalanceArgs} />
        </Grid>
      </Grid>
    </>
  );
}
