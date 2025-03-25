import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material"; // Import Tabs and Tab
import { YieldSummary } from "./YieldSummary/YieldSummary";
import { StrategiesTable } from "./StrategiesTable/StrategiesTable";

const EarnPage = () => {
  const [assetsFilter, setAssetsFilter] = useState<
    "Your assets" | "All Assets"
  >("Your assets");
  const [typeFilter, setTypeFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [instantUnbondOnly, setInstantUnbondOnly] = useState(false);
  const [tabValue, setTabValue] = useState(0); // State for active tab

  const strategies = [
    {
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
      tvl: 123456,
      apr: 0.05,
      rewardToken: {
        name: "PHO",
        address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
        icon: "/cryptoIcons/pho.svg",
      },
      unbondTime: "Instant",
    },
    {
      assets: [
        {
          name: "XLM",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/xlm.svg",
        },
      ],
      name: "Phoenix Boost",
      tvl: 789012,
      apr: 0.1,
      rewardToken: {
        name: "PHO",
        address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
        icon: "/cryptoIcons/pho.svg",
      },
      unbondTime: "7 Days",
    },
  ];

  const types = ["Type1", "Type2", "Type3"];
  const platforms = ["Platform1", "Platform2", "Platform3"];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <YieldSummary
        totalValue={5000}
        claimableRewards={100}
        onClaimAll={() => alert("Claim All")}
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
          }}
          TabIndicatorProps={{
            style: {
              background:
                "linear-gradient(137deg, #F97316 0%, #F97316 17.08%, #F97316 42.71%, #F97316 100%)",
            },
          }}
        >
          <Tab label="Discover Strategies" />
          <Tab label="Your Strategies" />
        </Tabs>
        {tabValue === 0 && (
          <StrategiesTable
            title="Discover Strategies"
            strategies={strategies}
            showFilters={true} // Pass prop to show filters
          />
        )}
        {tabValue === 1 && (
          <StrategiesTable
            title="Your Strategies"
            strategies={strategies}
            showFilters={false} // Pass prop to hide filters
          />
        )}
      </Box>
    </Box>
  );
};

export { EarnPage };
