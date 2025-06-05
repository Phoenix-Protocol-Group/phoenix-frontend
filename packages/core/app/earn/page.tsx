"use client";
import {
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
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

      const strategyInstance = allStrategies.find(
        (s) => s.metadata.id === selectedStrategy.id
      )?.strategy;

      if (!strategyInstance) {
        console.error("Strategy instance not found for bonding.");
        // Potentially show a toast error to the user
        return;
      }

      const amountA = tokenAmounts[0]?.amount;
      const amountB =
        tokenAmounts.length > 1 ? tokenAmounts[1]?.amount : undefined;

      if (amountA === undefined) {
        console.error("Amount A is undefined for bonding");
        // Potentially show a toast error
        return;
      }
      // Note: The strategy's bond method should internally check if amountB is required.

      await executeContractTransaction({
        contractType: selectedStrategy.contractType, // This is indicative; strategy uses its own client
        contractAddress: selectedStrategy.contractAddress, // This is indicative
        transactionFunction: async (_client, _restore) => {
          // _client and _restore from useContractTransaction are ignored here.
          // The strategyInstance.bond method now returns the AssembledTransaction.
          return strategyInstance.bond(walletAddress!, amountA, amountB);
        },
        options: {
          onSuccess: () => {
            loadStrategies(); // Refresh data on success
            handleCloseModals();
          },
        },
      });
    },
    [
      selectedStrategy,
      walletAddress,
      executeContractTransaction,
      allStrategies,
      loadStrategies,
      // handleCloseModals, // Added if it's stable or include its dependencies
    ]
  );

  const handleConfirmUnbond = useCallback(
    async (params: number | { lpAmount: bigint; timestamp: bigint }) => {
      if (!selectedStrategy || !walletAddress) return;

      const strategyInstance = allStrategies.find(
        (s) => s.metadata.id === selectedStrategy.id
      )?.strategy;

      if (!strategyInstance) {
        console.error("Strategy instance not found for unbonding.");
        return;
      }

      await executeContractTransaction({
        contractType: selectedStrategy.contractType, // Indicative
        contractAddress: selectedStrategy.contractAddress, // Indicative
        transactionFunction: async (_client, _restore) => {
          return strategyInstance.unbond(walletAddress!, params);
        },
        options: {
          onSuccess: () => {
            loadStrategies();
            handleCloseModals();
          },
        },
      });
    },
    [
      selectedStrategy,
      walletAddress,
      executeContractTransaction,
      allStrategies,
      loadStrategies,
      // handleCloseModals, // Added if it's stable or include its dependencies
    ]
  );

  const handleClaimStrategy = useCallback(
    (strategy: Strategy, metadata: StrategyMetadata): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!walletAddress) {
          console.warn(
            "Claim attempt with no wallet address for strategy:",
            metadata.id
          );
          reject(new Error("Wallet not connected. Cannot claim."));
          return;
        }

        executeContractTransaction({
          contractType: metadata.contractType,
          contractAddress: metadata.contractAddress,
          transactionFunction: (_client, _restore) => {
            // Ensure walletAddress is not null here, though checked above.
            // The strategy.claim method itself should handle Soroban client interactions.
            return strategy.claim(walletAddress!);
          },
          options: {
            onSuccess: () => {
              console.log(
                `Claim successful for ${metadata.name}. Refreshing strategies.`
              );
              loadStrategies(); // Refresh data on success
              resolve(); // Resolve the promise that ClaimAllModal is awaiting
            },
            // Errors from executeContractTransaction (e.g. user rejection, network issues)
            // will be caught by the .catch() below.
          },
        }).catch((error) => {
          // This catches rejections from the promise returned by executeContractTransaction.
          console.error(`Claim failed for ${metadata.name}:`, error);
          reject(error); // Reject the promise that ClaimAllModal is awaiting
        });
      });
    },
    [walletAddress, executeContractTransaction, loadStrategies]
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
  const userStrategyIds = userStrategies.map((s) => s.metadata.id);
  const discoverableRawStrategies = allStrategies.filter(
    (s) => !userStrategyIds.includes(s.metadata.id)
  );

  const discoverStrategiesUI = discoverableRawStrategies.map((s) => ({
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
        width: "100%",
        maxWidth: "1440px",
        mt: { xs: 8, md: 12 },
        px: { xs: 2, sm: 3, md: 4 },
        mx: "auto",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <input type="hidden" value="Phoenix DeFi Hub - Earn" />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            position: "relative",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 800,
              background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 2,
              fontFamily: "Ubuntu",
            }}
          >
            Earn
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.125rem", md: "1.25rem" },
              color: "#A3A3A3",
              fontFamily: "Ubuntu",
              maxWidth: "600px",
              mx: "auto",
              mb: 4,
            }}
          >
            Maximize your yields with advanced DeFi strategies. Stake, farm, and
            earn passive income on your crypto assets.
          </Typography>
        </Box>
      </motion.div>
      {/* Yield Summary - Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <YieldSummary
          totalValue={totalValue}
          claimableRewards={claimableRewards}
          onClaimAll={handleClaimAllClick}
        />
      </motion.div>

      {/* Strategies Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Box sx={{ mt: 4 }}>
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
                  color: "#FAFAFA",
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  height: "48px",
                  minHeight: "48px",
                  lineHeight: "48px",
                  alignItems: "center",
                  flexShrink: 0,
                  color: "#A3A3A3",
                  fontFamily: "Ubuntu",
                  fontSize: "1rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#FAFAFA",
                  },
                },
                maxWidth: { xs: "100%", md: "60%" },
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                mb: 3,
              }}
              TabIndicatorProps={{
                style: {
                  background:
                    "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                  height: "3px",
                  borderRadius: "2px",
                },
              }}
            >
              <Tab
                label="Discover Strategies"
                sx={{
                  mr: 3,
                }}
              />
              <Tab
                label="Your Strategies"
                sx={{
                  mr: 3,
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
                  walletAddress &&
                  !isLoading &&
                  discoverStrategiesUI.length === 0 &&
                  userStrategies.length > 0 ? (
                    <Box sx={{ textAlign: "center", mt: 4, p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          color: "#FAFAFA",
                          fontFamily: "Ubuntu",
                          fontWeight: 500,
                        }}
                      >
                        You&apos;ve explored all available strategies!
                      </Typography>
                      <Typography
                        sx={{
                          mb: 3,
                          color: "#A3A3A3",
                          fontFamily: "Ubuntu",
                        }}
                      >
                        All strategies are currently part of &apos;Your
                        Strategies&apos;.
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => setTabValue(1)}
                        sx={{
                          fontFamily: "Ubuntu",
                          textTransform: "none",
                          background:
                            "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
                          },
                        }}
                      >
                        View Your Strategies
                      </Button>
                    </Box>
                  ) : (
                    <StrategiesTable
                      title="Discover Strategies"
                      strategies={discoverStrategiesUI}
                      showFilters={true}
                      isLoading={isLoading}
                      onViewDetails={handleViewStrategyDetails}
                      onBondClick={handleBondClick}
                      onUnbondClick={handleUnbondClick}
                      emptyStateMessage={
                        !walletAddress
                          ? "Connect your wallet to discover strategies."
                          : "No strategies available to discover at the moment."
                      }
                    />
                  )
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
        </Box>
      </motion.div>

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
