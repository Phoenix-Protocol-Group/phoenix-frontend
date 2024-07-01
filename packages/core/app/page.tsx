"use client";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { Helmet } from "react-helmet";
import "./style.css";
import {
  AnchorServices,
  AssetInfoModal,
  Button,
  CryptoCTA,
  DashboardPriceCharts,
  DashboardStats,
  Skeleton,
  WalletBalanceTable,
} from "@phoenix-protocol/ui";

import { fetchPho, SorobanTokenContract } from "@phoenix-protocol/contracts";

import { useEffect, useState } from "react";
import {
  DepositManager,
  getAllAnchors,
} from "@phoenix-protocol/utils/build/sep24";
import { Anchor, AssetInfo } from "@phoenix-protocol/types";
import {
  constants,
  fetchBiggestWinnerAndLoser,
  fetchHistoricalPrices,
  fetchTokenPrices,
  fetchTokenPrices2,
  formatCurrency,
} from "@phoenix-protocol/utils";
import { useRouter } from "next/navigation";

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
  const [xlmPrice, setXlmPrice] = useState<number>(0);
  const [xlmPriceChange, setXlmPriceChange] = useState<number>(0);
  const [usdcPrice, setUsdcPrice] = useState(0);
  const [disclaimer, setDisclaimer] = useState(true);
  const [selectedTokenForInfo, setSelectedTokenForInfo] = useState<AssetInfo>();
  const [tokenInfoOpen, setTokenInfoOpen] = useState<boolean>(false);
  const [xlmPriceChart, setXlmPriceChart] = useState<any[]>([]);
  const [phoPriceChart, setPhoPriceChart] = useState<any[]>([]);

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
    const phoPrice = await fetchPho();

    setXlmPrice(price);
    setUsdcPrice(phoPrice);
    setXlmPriceChange(priceChangeXLM);

    const xlmPrices = await fetchHistoricalPrices(1440, "XLM", undefined, 20);
    setXlmPriceChart(xlmPrices);

    const phoPrices = await fetchHistoricalPrices(1440, "PHO", undefined, 20);
    setPhoPriceChart(phoPrices);
  };

  const fetchTokenInfo = async (tokenId: string) => {
    const TokenContract = new SorobanTokenContract.Client({
      contractId: tokenId,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });
    const tokenName = (await TokenContract.name()).result
      .toLowerCase()
      .replace(":", "-");

    const fetchedInfo = await (
      await fetch(
        `https://api.stellar.expert/explorer/public/asset?search=${tokenName}`
      )
    ).json();

    const info = fetchedInfo._embedded.records.find(
      (el: any) =>
        el.asset === tokenName.toUpperCase() ||
        el.asset === tokenName.toUpperCase() + "-1" ||
        el.asset === tokenName.toUpperCase() + "-2"
    );

    setSelectedTokenForInfo(info);
    setTokenInfoOpen(true);
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
      data: xlmPriceChart,
      icon: {
        small: "/image-103.png",
        large: "/image-stellar.png",
      },
      assetName: "XLM",
    },
    dashboardArgs2: {
      data: phoPriceChart,
      icon: {
        small: "/cryptoIcons/pho.svg",
        large: "/pho-bg.png",
      },
      assetName: "PHO",
    },
    walletBalanceArgs: {
      tokens: allTokens,
      onTokenClick: (token: string) => {
        fetchTokenInfo(token);
      },
    },
    dashboardStatsArgs: {
      gainer: gainerAsset,
      loser: loserAsset,
      availableAssets: "$100,000",
      lockedAssets: "$100,000",
    },
  };

  const router = useRouter();

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
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                backgroundImage: "url('/banner.png')",
                padding: 8,
                borderRadius: "16px",
                opacity: 0.7,
                backdropFilter: "blur(42px)",
                backgroundPosition: "center",
                backgroundSize: "cover",
                position: "relative",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                padding: { md: "2rem", lg: "2rem 8rem", xs: 1 },
                margin: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: { md: "2.5rem", xs: "1.5rem" },
                    lineHeight: "3rem",
                  }}
                >
                  Are you an artist?
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    color: "#fff",
                    fontWeight: 400,
                    fontSize: { md: "1rem", xs: "0.75rem" },
                    lineHeight: "2rem",
                    opacity: 0.8,
                  }}
                >
                  Be one of the first and become a genesis NFT creator!
                </Typography>
              </Box>
              <Button type="primary" onClick={() => router.push("/nft")}>
                Apply now!
              </Button>
            </Box>
          </Box>
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
&productList=BUY` +
                  (persistStore.wallet.address
                    ? `&onToAddress=${persistStore.wallet.address}`
                    : ""),
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
      {selectedTokenForInfo && (
        <AssetInfoModal
          open={tokenInfoOpen}
          onClose={() => setTokenInfoOpen(false)}
          asset={selectedTokenForInfo}
        />
      )}
    </Box>
  );
}
