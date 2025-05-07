"use client";
import { Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import {
  StrategiesTable,
  YieldSummary,
  BondModal,
  UnbondModal,
  ClaimAllModal,
} from "@phoenix-protocol/ui";

// Fix the imports to properly import StrategyRegistry
import { Strategy, StrategyMetadata } from "@phoenix-protocol/strategies";
import { StrategyRegistry } from "@phoenix-protocol/strategies";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useContractTransaction } from "../../hooks/useContractTransaction";

// Define the Token type
interface Token {
  name: string;
  icon: string;
  usdValue: number;
  amount: number;
  category: string;
}

export default function EarnPage(): JSX.Element {
  const router = useRouter();
  const appStore = useAppStore();
  const persistStore = usePersistStore();
  const walletAddress = persistStore.wallet.address;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { executeContractTransaction } = useContractTransaction();

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

  // Modal States
  const [bondModalOpen, setBondModalOpen] = useState(false);
  const [unbondModalOpen, setUnbondModalOpen] = useState(false);
  const [claimAllModalOpen, setClaimAllModalOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] =
    useState<StrategyMetadata | null>(null);

  // Filters
  const [tabValue, setTabValue] = useState(0);

  // Initialize strategies on first load
  useEffect(() => {
    // Don't register mock providers anymore - we're using real ones
    // registerMockProviders();

    appStore.setLoading(true);
    loadStrategies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load user-specific data when wallet changes
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

  // Set loading spinner timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      appStore.setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [appStore]);

  // Load all strategies with their metadata
  const loadStrategies = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Getting strategies from StrategyRegistry...");
      console.log("StrategyRegistry available?", !!StrategyRegistry);

      const providers = StrategyRegistry.getProviders();
      console.log("Available providers:", providers.length);
      providers.forEach((p) => console.log("- Provider:", p.id));

      const strategies = await StrategyRegistry.getAllStrategies();
      console.log("Strategies found:", strategies.length);

      const strategiesWithMetadata = await Promise.all(
        strategies.map(async (strategy) => {
          const metadata = await StrategyRegistry.getStrategyMetadata(strategy);
          // Fetch user data immediately if wallet is connected
          let userStake = 0;
          let userRewards = 0;
          let hasJoined = false;
          if (walletAddress) {
            try {
              userStake = await strategy.getUserStake(walletAddress);
              userRewards = await strategy.getUserRewards(walletAddress);
              hasJoined = await strategy.hasUserJoined(walletAddress);
            } catch (e) {
              console.error(
                "Error fetching user data for strategy",
                metadata.id,
                e
              );
            }
          }
          return {
            strategy,
            metadata: { ...metadata, userStake, userRewards, hasJoined },
          };
        })
      );
      setAllStrategies(strategiesWithMetadata);
    } catch (error) {
      console.error("Error loading strategies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  // Filter out strategies the user has joined
  const loadUserStrategies = useCallback(async () => {
    if (!walletAddress) return;
    const joined = allStrategies.filter((s) => s.metadata.hasJoined);
    setUserStrategies(joined);
  }, [walletAddress, allStrategies]);

  // Calculate total value and rewards from user strategies
  const calculateUserStats = useCallback(async () => {
    if (!walletAddress) return;
    let totalStaked = 0;
    let totalRewards = 0;
    allStrategies.forEach(({ metadata }) => {
      totalStaked += metadata.userStake || 0;
      totalRewards += metadata.userRewards || 0;
    });
    setTotalValue(totalStaked);
    setClaimableRewards(totalRewards);
  }, [walletAddress, allStrategies]);

  // Modal Handlers
  const handleBondClick = useCallback((strategyMeta: StrategyMetadata) => {
    setSelectedStrategy(strategyMeta);
    setBondModalOpen(true);
  }, []);

  const handleUnbondClick = useCallback(
    (strategyMeta: StrategyMetadata) => {
      if (!walletAddress) return;
      setSelectedStrategy(strategyMeta);
      setUnbondModalOpen(true);
    },
    [walletAddress]
  );

  const handleClaimAllClick = useCallback(() => {
    if (!walletAddress || claimableRewards <= 0) return;
    setClaimAllModalOpen(true);
  }, [walletAddress, claimableRewards]);

  const handleCloseModals = () => {
    setBondModalOpen(false);
    setUnbondModalOpen(false);
    setClaimAllModalOpen(false);
    setSelectedStrategy(null);
  };

  // Transaction Execution Handlers
  const handleConfirmBond = useCallback(
    async (tokenAmounts: { token: Token; amount: number }[]) => {
      if (!selectedStrategy || !walletAddress) return;

      const { contractAddress, contractType } = selectedStrategy;
      const strategyInstance = allStrategies.find(
        (s) => s.metadata.id === selectedStrategy.id
      )?.strategy;

      if (!strategyInstance) {
        console.error("Strategy instance not found for bonding");
        return;
      }

      // Define transaction function based on contract type
      const transactionFunction = async (client: any) => {
        const tokenA = tokenAmounts[0]?.amount || 0;
        const tokenB = tokenAmounts[1]?.amount || 0;

        if (contractType === "stake" || contractType === "vesting") {
          // For staking strategies, use single amount
          return strategyInstance.bond(walletAddress, tokenA);
        } else if (contractType === "pair") {
          // For liquidity provision strategies, pass both amounts
          return strategyInstance.bond(walletAddress, tokenA, tokenB);
        } else {
          throw new Error(
            `Unsupported contract type for bonding: ${contractType}`
          );
        }
      };

      // Close modal before transaction
      handleCloseModals();

      // Execute transaction
      await executeContractTransaction({
        contractAddress,
        contractType,
        transactionFunction,
      });

      // Reload data after transaction
      await loadStrategies();
    },
    [
      selectedStrategy,
      walletAddress,
      executeContractTransaction,
      allStrategies,
      loadStrategies,
    ]
  );

  const handleConfirmUnbond = useCallback(
    async (amount: number) => {
      if (!selectedStrategy || !walletAddress) return;

      const { contractAddress, contractType } = selectedStrategy;
      const strategyInstance = allStrategies.find(
        (s) => s.metadata.id === selectedStrategy.id
      )?.strategy;

      if (!strategyInstance) {
        console.error("Strategy instance not found for unbonding");
        return;
      }

      // Define transaction function based on contract type
      const transactionFunction = async (client: any) => {
        if (contractType === "stake" || contractType === "pair") {
          return strategyInstance.unbond(walletAddress, amount);
        } else {
          throw new Error(
            `Unsupported contract type for unbonding: ${contractType}`
          );
        }
      };

      // Close modal before transaction
      handleCloseModals();

      // Execute transaction
      await executeContractTransaction({
        contractAddress,
        contractType,
        transactionFunction,
      });

      // Reload data after transaction
      await loadStrategies();
    },
    [
      selectedStrategy,
      walletAddress,
      executeContractTransaction,
      allStrategies,
      loadStrategies,
    ]
  );

  const handleClaimStrategy = useCallback(
    async (strategy: Strategy, metadata: StrategyMetadata) => {
      if (!walletAddress) return;

      const { contractAddress, contractType } = metadata;

      const transactionFunction = async (client: any) => {
        return strategy.claim(walletAddress);
      };

      await executeContractTransaction({
        contractAddress,
        contractType,
        transactionFunction,
      });
    },
    [walletAddress, executeContractTransaction]
  );

  // Tab handling
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewStrategyDetails = useCallback(
    (strategyId: string) => {
      router.push(`/earn/${strategyId}`);
    },
    [router]
  );

  // Prepare data for UI components
  const allStrategiesUI = allStrategies.map((s) => ({
    ...s.metadata,
    isMobile,
  }));

  const userStrategiesUI = userStrategies.map((s) => ({
    ...s.metadata,
    isMobile,
  }));

  // Prepare claimable strategies for modal
  const claimableForModal = allStrategies
    .filter(
      (s) =>
        s.metadata.hasJoined &&
        s.metadata.userRewards &&
        s.metadata.userRewards > 0
    )
    .map((s) => ({
      strategy: s.strategy,
      metadata: s.metadata,
      rewards: s.metadata.userRewards || 0,
    }));

  return (
    <Box
      sx={{
        maxWidth: "1440px",
        width: "100%",
        padding: { xs: "1rem", md: "2.5rem" },
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
        onClaimAll={handleClaimAllClick}
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
            maxWidth: { xs: "100%", md: "50%" },
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
                onBondClick={handleBondClick}
                onUnbondClick={handleUnbondClick}
              />
            ) : (
              <StrategiesTable
                title="Your Strategies"
                strategies={userStrategiesUI}
                showFilters={false}
                isLoading={isLoading}
                onViewDetails={handleViewStrategyDetails}
                onBondClick={handleBondClick}
                onUnbondClick={handleUnbondClick}
                emptyStateMessage={
                  walletAddress
                    ? "You haven't joined any strategies yet. Discover strategies to start earning!"
                    : "Connect your wallet to see your strategies"
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Modals */}
      <BondModal
        open={bondModalOpen}
        onClose={handleCloseModals}
        strategy={selectedStrategy}
        onConfirm={handleConfirmBond}
      />
      <UnbondModal
        open={unbondModalOpen}
        onClose={handleCloseModals}
        strategy={selectedStrategy}
        maxAmount={selectedStrategy?.userStake || 0}
        onConfirm={handleConfirmUnbond}
      />
      <ClaimAllModal
        open={claimAllModalOpen}
        onClose={() => {
          handleCloseModals();
          loadStrategies();
        }}
        claimableStrategies={claimableForModal}
        onClaimStrategy={handleClaimStrategy}
      />
    </Box>
  );
}
