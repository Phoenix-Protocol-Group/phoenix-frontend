"use client";
import {
  Alert,
  Box,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { Helmet } from "react-helmet";
import "./style.css";
import {
  CryptoCTA,
  DashboardPriceCharts,
  DashboardStats,
  MainStats,
  WalletBalanceTable,
  AnchorServices,
  Skeleton,
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
  fetchTokenPrices2,
  formatCurrency,
  scValToJs,
} from "@phoenix-protocol/utils";
import { PhoenixFactoryContract } from "@phoenix-protocol/contracts";
import DisclaimerModal from "@/components/Disclaimer";

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
  const [xlmPrice, setXlmPrice] = useState(0);
  const [xlmPriceChange, setXlmPriceChange] = useState(0);
  const [usdcPrice, setUsdcPrice] = useState(0);
  const [disclaimer, setDisclaimer] = useState(true);

  // Loading states
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

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
    setLoadingDashboard(true);
    const { winner, loser } = await fetchBiggestWinnerAndLoser();

    // Resolve names by fetching all assets
    const _allTokens = await appStore.getAllTokens();

    console.log(winner, loser);

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
    setLoadingDashboard(false);
  };

  const loadAllBalances = async () => {
    setLoadingBalances(true);
    const _allTokens = await appStore.getAllTokens();
    setAllTokens(_allTokens);
    setLoadingBalances(false);
  };

  useEffect(() => {
    loadAllBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistStore.wallet.address]);

  useEffect(() => {
    initAnchor();
    getBiggestGainerAndLoser();
    getXlmPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getXlmPrice = async () => {
    const price = await fetchTokenPrices("XLM");
    const price2 = await fetchTokenPrices("USDC");
    const priceChangeXLM = await fetchTokenPrices2("XLM");
    setXlmPrice(price);
    setUsdcPrice(price2);
    setXlmPriceChange(priceChangeXLM);
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
    dashboardArgs1: {
      data: [
        [1687392000000, Number(xlmPrice) + Number(xlmPrice) * (Number(xlmPriceChange) / 100) ],
        [1687859473000, xlmPrice],
      ],
      icon: {
        small: "/image-103.png",
        large: "/image-stellar.png",
      },
      assetName: "XLM",
    },
    dashboardArgs2: {
      data: [
        [1687392000000, 0.99983713332799949],
        [1687478400000, 0.99669248419239592],
        [1687564800000, 0.99893807322702632],
        [1687651200000, 1],
        [1687737600000, 1.01],
        [1687824000000, 1],
        [1687859473000, usdcPrice],
      ],
      icon: {
        small: "/cryptoIcons/usdc.svg",
        large: "/pho-bg.png",
      },
      assetName: "USDC",
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
    <Box sx={{ marginTop: { md: 0, xs: 12 } }}>
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
          height: "100%",
        }}
        container
        spacing={largerThenMd ? 3 : 1}
      >
        <Grid item xs={12}>
          <Typography sx={{ fontSize: "2rem", fontWeight: "700" }}>
            Hello 👋
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={8} mt={!largerThenMd ? 2 : undefined}>
          {loadingDashboard ? (
            <Skeleton.DashboardStats />
          ) : (
            <DashboardStats {...args.dashboardStatsArgs} />
          )}
        </Grid>
        <Grid
          item
          xs={6}
          md={6}
          lg={2}
          mt={!largerThenMd ? 2 : undefined}
          sx={{
            pr: {
              xs: 0,
              md: 0.5,
              lg: 0,
            },
          }}
        >
          <DashboardPriceCharts {...args.dashboardArgs1} />
        </Grid>
        <Grid
          item
          xs={6}
          md={6}
          lg={2}
          mt={!largerThenMd ? 2 : undefined}
          sx={{
            pl: {
              xs: 0,
              md: 0.5,
              lg: 0,
            },
          }}
        >
          <DashboardPriceCharts {...args.dashboardArgs2} />
        </Grid>
        <Grid item xs={12} md={5} lg={4} sx={{ mt: 2 }}>
          <CryptoCTA
            onClick={() =>
              window.open(
                `https://app.kado.money/
?onPayAmount=250
&onPayCurrency=USD
&onRevCurrency=USDC
&cryptoList=XLM,USDC
&network=STELLAR
&networkList=STELLAR
&product=BUY
&productList=BUY
&mode=minimal`,
                "_blank",
                "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=480,height=620"
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={7} lg={8} sx={{ mt: 2 }}>
          {loadingBalances ? (
            <Skeleton.WalletBalanceTable />
          ) : (
            <WalletBalanceTable {...args.walletBalanceArgs} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
