import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { YieldSummary } from "./YieldSummary/YieldSummary";
import { StrategiesTable } from "./StrategiesTable/StrategiesTable";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../Theme/styleConstants";

interface EarnPageProps {
  isLoadingOverride?: boolean;
  onViewStrategyDetails?: (id: string) => void;
}

const EarnPage = ({
  isLoadingOverride,
  onViewStrategyDetails,
}: EarnPageProps = {}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [assetsFilter, setAssetsFilter] = useState<
    "Your assets" | "All Assets"
  >("Your assets");
  const [typeFilter, setTypeFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [instantUnbondOnly, setInstantUnbondOnly] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(isLoadingOverride || false);

  const handleViewDetails = (id: string) => {
    console.log(`View details for strategy: ${id}`);
    if (onViewStrategyDetails) {
      onViewStrategyDetails(id);
    } else {
      // For storybook, just show an alert
      alert(`View details for strategy: ${id}`);
    }
  };

  const strategies = [
    {
      id: "stellar-yield-strategy",
      assets: [
        {
          name: "XLM",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/xlm.svg",
        },
        {
          name: "USDC",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/usdc.svg",
        },
      ],
      name: "Stellar Yield",
      description: "Stake XLM and USDC to earn PHO rewards",
      tvl: 123456,
      apr: 0.05,
      rewardToken: {
        name: "PHO",
        address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
        icon: "/cryptoIcons/pho.svg",
      },
      unbondTime: 0,
      isMobile: isMobile,
      link: "/earn/stellar-yield-strategy",
      category: "yield",
      providerId: "stellar",
      hasJoined: true,
      userStake: 2500,
      userRewards: 12.5,
    },
    {
      id: "phoenix-boost-strategy",
      assets: [
        {
          name: "XLM",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/xlm.svg",
        },
      ],
      name: "Phoenix Boost",
      description: "Stake XLM to earn PHO rewards at a boosted rate",
      tvl: 789012,
      apr: 0.1,
      rewardToken: {
        name: "PHO",
        address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
        icon: "/cryptoIcons/pho.svg",
      },
      unbondTime: 604800,
      isMobile: isMobile,
      link: "/earn/phoenix-boost-strategy",
      category: "staking",
      providerId: "phoenix",
    },
    // Add a third strategy for visual diversity
    {
      id: "liquidity-farming-strategy",
      assets: [
        {
          name: "USDC",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/usdc.svg",
        },
        {
          name: "PHO",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/pho.svg",
        },
      ],
      name: "Liquidity Farming",
      description:
        "Provide liquidity to the USDC-PHO pair and earn PHO rewards",
      tvl: 345000,
      apr: 0.08,
      rewardToken: {
        name: "PHO",
        address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
        icon: "/cryptoIcons/pho.svg",
      },
      unbondTime: 259200, // 3 days
      isMobile: isMobile,
      link: "/earn/liquidity-farming-strategy",
      category: "farming",
      providerId: "phoenix",
    },
  ];

  const types = ["staking", "yield", "farming"];
  const platforms = ["phoenix", "stellar"];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Prepare filtered strategies for "Your Strategies" tab
  // For storybook, show strategies marked as "joined"
  const yourStrategies = strategies.filter((s) => s.hasJoined);

  return (
    <Container maxWidth="xl">
      <Box sx={{ padding: isMobile ? spacing.md : spacing.xl }}>
        <YieldSummary
          totalValue={5000}
          claimableRewards={100}
          onClaimAll={() => alert("Claim All")}
        />

        <Box sx={{ mt: spacing.lg, mb: spacing.md }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="strategies-tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root.Mui-selected": {
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeights.bold,
                color: colors.neutral[50],
              },
              "& .MuiTab-root": {
                textTransform: "none",
                height: "40px",
                minHeight: "40px",
                alignItems: "center",
                color: colors.neutral[300],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.medium,
                transition: "all 0.3s ease",
              },
              maxWidth: isMobile ? "100%" : "50%",
              borderBottom: `1px solid ${colors.neutral[800]}`,
            }}
            TabIndicatorProps={{
              style: {
                background: `linear-gradient(137deg, ${colors.primary.main} 0%, ${colors.primary.main} 100%)`,
                height: "3px",
              },
            }}
          >
            <Tab
              label="Discover Strategies"
              sx={{
                mr: spacing.md,
                ":hover": { color: colors.neutral[100] },
              }}
            />
            <Tab
              label="Your Strategies"
              sx={{
                mr: spacing.md,
                ":hover": { color: colors.neutral[100] },
              }}
            />
          </Tabs>
        </Box>

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
                strategies={strategies}
                showFilters={true}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <StrategiesTable
                title="Your Strategies"
                strategies={yourStrategies}
                showFilters={false}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Container>
  );
};

export { EarnPage };
