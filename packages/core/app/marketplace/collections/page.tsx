"use client";

import { Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useAppStore } from "@phoenix-protocol/state";
import {
  CollectionsOverviewActiveSort,
  CollectionsOverviewEntryProps,
  CollectionsOverviewTimeOptions,
  Currency,
  TextSelectItemProps,
} from "@phoenix-protocol/types";
import { CollectionsOverview } from "@phoenix-protocol/ui";
import RisingStars from "@phoenix-protocol/ui/src/Marketplace/Frontpage/RisingStars/RisingStars";
import NftCategories from "@phoenix-protocol/ui/src/Marketplace/Frontpage/NftCategories/NftCategories";
import GettingStarted from "@phoenix-protocol/ui/src/Marketplace/Frontpage/GettingStarted/GettingStarted";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const demoItem = {
  id: "1234",
  previewImage: "/demo_nft.png",
  collectionName: "Demo Name",
  floorPrice: "1500.00",
  bestOffer: "1500.00",
  volume: "1500.00",
  volumePercent: "+20%",
  owners: "2137",
  ownersPercent: "20% Unique",
  forSalePercent: "16.19%",
  forSaleNumbers: "68 / 421",
};

// Demo data for RisingStars component
const demoRisingStarsItem = {
  id: "star1",
  _onClick: () => {},
  image: "/demo_nft.png",
  collectionName: "Rising Collection",
  percent: 45,
};

// Demo data for NFT Categories
const demoCategoryItem = {
  id: "cat1",
  _onClick: () => {},
  image: "/demo_nft.png",
  name: "Digital Art",
};

// Demo data for Getting Started
const demoGettingStartedItem = {
  image: "/demo_nft.png",
  name: "Create Your Collection",
  description:
    "Start by creating your first NFT collection with our easy-to-use tools.",
};

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entries, setEntries] = useState<CollectionsOverviewEntryProps[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [categories, setCategories] = useState<TextSelectItemProps[]>([]);
  const [activeSort, setActiveSort] = useState<CollectionsOverviewActiveSort>({
    column: "collection",
    direction: "asc",
  });
  const [currency, setCurrency] = useState<Currency>("crypto");
  const [timeOption, setTimeOption] =
    useState<CollectionsOverviewTimeOptions>("1d");

  const fetchEntries = () => {
    setEntries([demoItem, demoItem, demoItem, demoItem, demoItem]);
  };
  const appStore = useAppStore();
  // Mock appStore.loading after 1 sec
  useEffect(() => {
    const timer = setTimeout(() => {
      appStore.setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [appStore]);

  const fetchCategories = () => {
    setCategories([
      { value: "all", label: "All Categories" },
      { value: "foo", label: "Foo" },
      { value: "bar", label: "Bar" },
    ]);
  };

  const onEntryClick = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  useEffect(() => {
    fetchEntries();
    fetchCategories();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 1440,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        mt: { xs: 2, md: 4 },
      }}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 4, md: 6 },
            px: { xs: 2, md: 4 },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              fontFamily: "Ubuntu, sans-serif",
              background: "linear-gradient(135deg, #FAFAFA 0%, #F97316 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            Discover Collections
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              fontFamily: "Ubuntu, sans-serif",
              color: "#A3A3A3",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            Explore curated collections of unique NFTs from talented artists and
            creators. Find your next favorite piece or discover emerging trends
            in the digital art world.
          </Typography>
        </Box>
      </motion.div>

      {/* Main Collections Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Box mx={2} position="relative" mb={{ xs: 4, md: 6 }}>
          <CollectionsOverview
            onEntryClick={onEntryClick}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            entries={entries}
            category={category}
            setCategory={setCategory}
            categoryItems={categories}
            activeSort={activeSort}
            setSort={setActiveSort}
            activeCurrency={currency}
            setActiveCurrency={setCurrency}
            activeTime={timeOption}
            setActiveTime={setTimeOption}
          />
        </Box>
      </motion.div>

      {/* Additional Sections */}
      <Grid container spacing={{ xs: 3, md: 4, lg: 6 }} sx={{ px: 2 }}>
        {/* Rising Stars Collections */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <RisingStars
              entries={[
                demoRisingStarsItem,
                demoRisingStarsItem,
                demoRisingStarsItem,
              ]}
              onEntryClick={onEntryClick}
              activeTime="1d"
              setActiveTime={(time) => console.log("Time changed:", time)}
            />
          </motion.div>
        </Grid>

        {/* NFT Categories */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <NftCategories
              entries={[
                demoCategoryItem,
                demoCategoryItem,
                demoCategoryItem,
                demoCategoryItem,
              ]}
              onEntryClick={(id) =>
                router.push(`/marketplace/collections?category=${id}`)
              }
              onViewAllClick={() => router.push("/marketplace/collections")}
            />
          </motion.div>
        </Grid>

        {/* Getting Started Guide */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GettingStarted
              entries={[
                demoGettingStartedItem,
                {
                  image: "/demo_nft.png",
                  name: "Buy Your First NFT",
                  description:
                    "Browse collections and find the perfect NFT to add to your portfolio.",
                },
                {
                  image: "/demo_nft.png",
                  name: "Track Performance",
                  description:
                    "Monitor your collection's value and discover trending collections.",
                },
              ]}
              onViewAllClick={() => router.push("/help-center")}
            />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
