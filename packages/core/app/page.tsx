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
import {
  constants,
  fetchBiggestWinnerAndLoser,
  fetchTokenPrices,
  formatCurrency,
  scValToJs,
} from "@phoenix-protocol/utils";
import { PhoenixFactoryContract } from "@phoenix-protocol/contracts";

export default function Page() {
  const theme = useTheme();
  const appStore = useAppStore();
  const persistStore = usePersistStore();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [gainerAsset, setGainerAsset] = useState<any>({});
  const [loserAsset, setLoserAsset] = useState<any>({});
  const [allTokens, setAllTokens] = useState<any[]>([]);

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

  const getBiggestGainerAndLoser = async () => {
    const { winner, loser } = await fetchBiggestWinnerAndLoser();

    // Resolve names by fetching all assets
    const _allTokens = await appStore.getAllTokens();

    const _winner = _allTokens.find((token) => token.name === winner.symbol);
    const _loser = _allTokens.find((token) => token.name === loser.symbol);

    const _gainerAsset = {
      name: _winner.name,
      symbol: _winner.name,
      price: formatCurrency("USD", winner.price.toString(), navigator.language),
      change: winner.percent_change_24,
      icon: `/cryptoIcons/${winner.symbol.toLowerCase()}.svg`,
      volume: "TBD",
    };

    const _loserAsset = {
      name: _loser.name,
      symbol: _loser.name,
      price: formatCurrency("USD", loser.price.toString(), navigator.language),
      change: loser.percent_change_24,
      icon: `/cryptoIcons/${loser.symbol.toLowerCase()}.svg`,
      volume: "TBD",
    };

    setGainerAsset(_gainerAsset);
    setLoserAsset(_loserAsset);
  };

  const loadAllBalances = async () => {
    const _allTokens = await appStore.getAllTokens();
    setAllTokens(_allTokens);
  };

  useEffect(() => {
    loadAllBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistStore.wallet.address]);

  useEffect(() => {
    initAnchor();
    getBiggestGainerAndLoser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      tokens: allTokens,
    },
    dashboardStatsArgs: {
      gainer: gainerAsset,
      loser: loserAsset,
      availableAssets: "$100,000",
      lockedAssets: "$100,000",
    },
  };

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
          mt: 6,
        }}
        container
        spacing={largerThenMd ? 3 : 1}
      >
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
