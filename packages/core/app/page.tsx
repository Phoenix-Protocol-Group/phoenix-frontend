"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import Head from "next/head";
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
import { useRouter } from "next/navigation";
import {
  fetchBiggestWinnerAndLoser,
  fetchHistoricalPrices,
  formatCurrency,
} from "@phoenix-protocol/utils";
import { getAllAnchors } from "@phoenix-protocol/utils/build/sep24";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import {
  Anchor,
  AssetInfo,
  GainerOrLooserAsset,
} from "@phoenix-protocol/types";

export default function Page() {
  const theme = useTheme();
  const router = useRouter();
  const appStore = useAppStore();

  // State management
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [gainerAsset, setGainerAsset] = useState<GainerOrLooserAsset>(
    {} as GainerOrLooserAsset
  );
  const [loserAsset, setLoserAsset] = useState<GainerOrLooserAsset>(
    {} as GainerOrLooserAsset
  );
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const [xlmPriceChart, setXlmPriceChart] = useState<any[]>([]);
  const [phoPriceChart, setPhoPriceChart] = useState<any[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [selectedTokenForInfo, setSelectedTokenForInfo] =
    useState<AssetInfo | null>(null);
  const [tokenInfoOpen, setTokenInfoOpen] = useState(false);

  // Fetch and initialize data
  useEffect(() => {
    const initData = async () => {
      try {
        console.log(1);
        setLoadingDashboard(true);

        // Fetch anchors
        const anchors = await getAllAnchors();
        setAnchors(anchors);

        // Fetch gainer and loser
        const { winner, loser } = await fetchBiggestWinnerAndLoser();
        console.log("Winner", winner);
        const allTokens = await appStore.getAllTokens();
        console.log("Winner", winner);
        const gainer = allTokens.find((token) => token.name === winner.symbol);
        const loserAsset = allTokens.find(
          (token) => token.name === loser.symbol
        );

        console.log("Winner", winner);

        if (gainer && loserAsset) {
          setGainerAsset({
            name: gainer.name,
            symbol: gainer.symbol,
            price: formatCurrency(
              "USD",
              winner.price.toString(),
              navigator.language
            ),
            change: winner.percent_change_24,
            icon: `/cryptoIcons/${winner.symbol.toLowerCase()}.svg`,
            volume: "TBD",
          });

          setLoserAsset({
            name: loserAsset.name,
            symbol: loserAsset.symbol,
            price: formatCurrency(
              "USD",
              loser.price.toString(),
              navigator.language
            ),
            change: loser.percent_change_24,
            icon: `/cryptoIcons/${loser.symbol.toLowerCase()}.svg`,
            volume: "TBD",
          });
        }

        // Fetch historical prices
        const [xlmPrices, phoPrices] = await Promise.all([
          fetchHistoricalPrices(1440, "XLM", undefined, 20),
          fetchHistoricalPrices(1440, "PHO", undefined, 20),
        ]);

        setXlmPriceChart(xlmPrices);
        setPhoPriceChart(phoPrices);

        // Load all token balances
        setAllTokens(allTokens);
      } catch (error) {
        console.log("Failed to initialize data:", error);
      } finally {
        setLoadingDashboard(false);
        setLoadingBalances(false);
      }
    };

    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoized props for child components
  const args = useMemo(
    () => ({
      dashboardStatsArgs: {
        gainer: gainerAsset!,
        loser: loserAsset!,
        availableAssets: "$100,000",
        lockedAssets: "$100,000",
      },
      walletBalanceArgs: {
        tokens: allTokens,
        onTokenClick: (tokenAddress: string) => {
          const token = allTokens.find((t) => t.contractId === tokenAddress);
          if (token) {
            setSelectedTokenForInfo(token);
            setTokenInfoOpen(true);
          }
        },
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
    }),
    [gainerAsset, loserAsset, allTokens, xlmPriceChart, phoPriceChart]
  );

  return (
    <Box sx={{ marginTop: { md: 0, xs: 12 } }}>
      <Head>
        <title>Phoenix DeFi Hub - Dashboard</title>
      </Head>

      {/* Anchor Services */}
      {anchors.length > 0 && (
        <AnchorServices
          anchors={anchors}
          open={Boolean(anchorOpen)}
          authenticate={() => Promise.resolve(true)}
          sign={() => Promise.resolve(true)}
          send={() => Promise.resolve(true)}
          setOpen={setAnchorOpen}
        />
      )}

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Banner */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Box
              sx={{
                background: "url('/banner.png') center/cover",
                padding: "3rem",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "left",
              }}
            >
              <Box>
                <Typography
                  variant="h1"
                  sx={{ fontSize: "2rem", fontWeight: 700, color: "#fff" }}
                >
                  Are you an artist?
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 400,
                    opacity: 0.8,
                    color: "#fff",
                    mt: 1,
                  }}
                >
                  Be one of the first and become a genesis NFT creator!
                </Typography>
              </Box>
              <Button type="primary" onClick={() => router.push("/nft")}>
                Apply Now!
              </Button>
            </Box>
          </motion.div>
        </Grid>

        {/* Dashboard Stats */}
        <Grid item xs={12} lg={6}>
          {loadingDashboard ? (
            <Skeleton.DashboardStats />
          ) : (
            <DashboardStats {...args.dashboardStatsArgs} />
          )}
        </Grid>

        {/* Price Charts */}
        <Grid item xs={6} md={4} lg={3}>
          <DashboardPriceCharts {...args.dashboardArgs1} />
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <DashboardPriceCharts {...args.dashboardArgs2} />
        </Grid>

        {/* Crypto CTA */}
        <Grid item xs={12} md={4}>
          <CryptoCTA onClick={() => window.open("https://app.kado.money")} />
        </Grid>

        {/* Wallet Balance Table */}
        <Grid item xs={12} md={8}>
          {loadingBalances ? (
            <Skeleton.WalletBalanceTable />
          ) : (
            <WalletBalanceTable {...args.walletBalanceArgs} />
          )}
        </Grid>
      </Grid>

      {/* Asset Info Modal */}
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
