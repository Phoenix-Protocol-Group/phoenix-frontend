"use client";
import { Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useAppStore } from "@phoenix-protocol/state";
import { usePersistStore } from "@phoenix-protocol/state";
import { StrategiesTable, YieldSummary } from "@phoenix-protocol/ui";
import {
  Strategy,
  StrategyMetadata,
  StrategyRegistry,
} from "@phoenix-protocol/strategies";
import { registerMockProviders } from "@phoenix-protocol/strategies/build/mock";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function EarnPage(): JSX.Element {
  const router = useRouter();
  const appStore = useAppStore();
  const persistStore = usePersistStore();
  const walletAddress = persistStore.wallet.address;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Strategy state
  const [allStrategies, setAllStrategies] = useState<
    { strategy: Strategy; metadata: StrategyMetadata }[]
  >([]);
  const [userStrategies, setUserStrategies] = useState<
    { strategy: Strategy; metadata: StrategyMetadata }[]
  >([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [claimableRewards, setClaimableRewards] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [assetsFilter, setAssetsFilter] = useState<
    "Your assets" | "All Assets"
  >("Your assets");
  const [typeFilter, setTypeFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [instantUnbondOnly, setInstantUnbondOnly] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Initialize strategy registry
  useEffect(() => {
    // Register mock providers (in production, you'd do this elsewhere, maybe during app initialization)
    registerMockProviders();

    // Initial load of strategies
    loadStrategies();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to update when wallet changes
  useEffect(() => {
    if (walletAddress) {
      loadUserStrategies();
      calculateUserStats();
    } else {
      setUserStrategies([]);
      setTotalValue(0);
      setClaimableRewards(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, allStrategies]);

  const loadStrategies = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load all strategies from the registry
      const strategies = await StrategyRegistry.getAllStrategies();

      // Load metadata for each strategy
      const strategiesWithMetadata = await Promise.all(
        strategies.map(async (strategy) => {
          const metadata = await StrategyRegistry.getStrategyMetadata(strategy);
          return { strategy, metadata };
        })
      );

      setAllStrategies(strategiesWithMetadata);
    } catch (error) {
      console.error("Error loading strategies:", error);
    } finally {
      setIsLoading(false);
      appStore.setLoading(false);
    }
  }, [appStore]);

  useEffect(() => {
    // Set loading for mock after 1 sec to false
    const timer = setTimeout(() => {
      appStore.setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const loadUserStrategies = useCallback(async () => {
    if (!walletAddress) return;

    try {
      // Get strategies user has joined
      const strategies = await StrategyRegistry.getUserStrategies(
        walletAddress
      );

      // Load metadata for each strategy
      const strategiesWithMetadata = await Promise.all(
        strategies.map(async (strategy) => {
          const metadata = await StrategyRegistry.getStrategyMetadata(strategy);
          return { strategy, metadata };
        })
      );

      setUserStrategies(strategiesWithMetadata);
    } catch (error) {
      console.error("Error loading user strategies:", error);
    }
  }, [walletAddress]);

  const calculateUserStats = useCallback(async () => {
    if (!walletAddress) return;

    try {
      let totalStaked = 0;
      let totalRewards = 0;

      // Calculate total value staked across all strategies
      for (const { strategy } of allStrategies) {
        const userStake = await strategy.getUserStake(walletAddress);
        totalStaked += userStake;

        // In a real implementation, you'd also calculate rewards here
        totalRewards += userStake * 0.01; // Mock 1% rewards for example
      }

      setTotalValue(totalStaked);
      setClaimableRewards(totalRewards);
    } catch (error) {
      console.error("Error calculating user stats:", error);
    }
  }, [walletAddress, allStrategies]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewStrategyDetails = useCallback(
    (strategyId: string) => {
      // Navigate to the strategy details page
      router.push(`/earn/${strategyId}`);
    },
    [router]
  );

  const handleClaimAll = useCallback(async () => {
    if (!walletAddress || claimableRewards <= 0) return;

    try {
      // Reset claimable rewards for demo
      setClaimableRewards(0);

      // In a real app, you'd show a success notification here
    } catch (error) {
      console.error("Error claiming rewards:", error);
    }
  }, [walletAddress, claimableRewards]);

  // Map strategy data to UI format
  const mapStrategiesToUI = useCallback(
    (
      strategiesWithMetadata: {
        strategy: Strategy;
        metadata: StrategyMetadata;
      }[]
    ) => {
      return Promise.all(
        strategiesWithMetadata.map(async ({ strategy, metadata }) => {
          // Get user-specific data if wallet is connected
          let userStake = 0;
          let userRewards = 0;
          let hasJoined = false;

          if (walletAddress) {
            userStake = await strategy.getUserStake(walletAddress);
            userRewards = await strategy.getUserRewards(walletAddress);
            hasJoined = await strategy.hasUserJoined(walletAddress);
          }

          return {
            id: metadata.id,
            assets: metadata.assets,
            name: metadata.name,
            description: metadata.description,
            tvl: metadata.tvl,
            apr: metadata.apr,
            rewardToken: metadata.rewardToken,
            unbondTime: metadata.unbondTime,
            isMobile: isMobile,
            link: `/earn/${metadata.id}`,
            userStake,
            userRewards,
            hasJoined,
          };
        })
      );
    },
    [isMobile, walletAddress]
  );

  // Update to use async/await and handle the Promise
  const loadTableData = useCallback(
    async (data) => {
      const mappedData = await mapStrategiesToUI(data);
      return mappedData;
    },
    [mapStrategiesToUI]
  );

  // State for UI data
  const [allStrategiesUI, setAllStrategiesUI] = useState([]);
  const [userStrategiesUI, setUserStrategiesUI] = useState([]);

  // Effect to update UI data when underlying data changes
  useEffect(() => {
    const updateUIData = async () => {
      setAllStrategiesUI(await loadTableData(allStrategies));
      setUserStrategiesUI(await loadTableData(userStrategies));
    };

    updateUIData();
  }, [allStrategies, userStrategies, loadTableData]);

  return (
    <Box
      sx={{
        maxWidth: "1440px",
        width: "100%",
        padding: { xs: 0, md: "2.5rem" },
        mt: { xs: "4.5rem", md: 1 },
      }}
    >
      <input type="hidden" value="Phoenix DeFi Hub - Earn" />
      <Typography
        sx={{
          color: "#FFF",
          fontFamily: "Ubuntu",
          fontSize: "2rem",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "normal",
          mb: "1.5rem",
        }}
      >
        Earn
      </Typography>
      <YieldSummary
        totalValue={totalValue}
        claimableRewards={claimableRewards}
        onClaimAll={handleClaimAll}
      />
      <Box sx={{ mt: 3 }}></Box>
      {/* Tabs */}
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="strategies-tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root.Mui-selected": {
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--neutral-50, #FAFAFA)",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              height: "40px",
              minHeight: "40px",
              lineHeight: "40px",
              alignItems: "center",
              flexShrink: 0,
              color: "var(--neutral-300, #D4D4D4)",
            },
            maxWidth: "50%",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          TabIndicatorProps={{
            style: {
              background:
                "linear-gradient(137deg, #F97316 0%, #F97316 17.08%, #F97316 42.71%, #F97316 100%)",
              height: "3px",
            },
          }}
        >
          <Tab
            label="Discover Strategies"
            sx={{
              mr: 2,
              ":hover": { color: "#FAFAFA" },
            }}
          />
          <Tab
            label="Your Strategies"
            sx={{
              mr: 2,
              ":hover": { color: "#FAFAFA" },
            }}
          />
        </Tabs>

        <AnimatePresence mode="wait">
          <motion.div
            key={tabValue}
            initial={{ opacity: 0, x: tabValue === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tabValue === 0 ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {tabValue === 0 ? (
              <StrategiesTable
                title="Discover Strategies"
                strategies={allStrategiesUI}
                showFilters={true}
                isLoading={isLoading}
                onViewDetails={handleViewStrategyDetails}
              />
            ) : (
              <StrategiesTable
                title="Your Strategies"
                strategies={userStrategiesUI}
                showFilters={false}
                isLoading={isLoading}
                onViewDetails={handleViewStrategyDetails}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
