"use client";

import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useAppStore } from "@phoenix-protocol/state";
import { Frontpage } from "@phoenix-protocol/ui";
import { constants } from "@phoenix-protocol/utils";
import { useEffect } from "react";

const demoFeaturedItem = {
  id: "1337",
  image: "/banklocker.png",
  name: "Collection Name",
  price: "21.3K",
  volume: "42.5K",
  icon: "/cryptoIcons/btc.svg",
};

const demoTopCollectionItem = {
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

const demoPopularNftItem = {
  id: "24327824",
  image: "/banklocker.png",
  collectionName: "collection",
  nftName: "NFT Name",
  price: "21.3K",
  volume: "42.5K",
  icon: "/cryptoIcons/btc.svg",
};

const demoRisingStartItem = {
  id: "24327824",
  image: "/demo_nft.png",
  collectionName: "Testcollection",
  percent: 50,
};

const demoCategoryItem = {
  id: "foo",
  image: "/banklocker.png",
  name: "category 1",
};

const demoGettingStartedItem = {
  image: "/banklocker.png",
  name: "Create",
  description: "Lorem ipsum dolor sit amet consectetur adipiscing.",
};

export default function Page() {
  const fetchFeaturedCollections = () => {
    // const collectionContract = new PhoenixNFTCollectionContract.MockClient({
    //  contractId: "",
    //  networkPassphrase: constants.NETWORK_PASSPHRASE,
    //  rpcUrl: constants.RPC_URL,
    // })
  };

  const appStore = useAppStore();

  const fetchTopCollections = () => {};

  const fetchPopularNfts = () => {};

  const fetchRisingStars = () => {};

  const fetchNftCategories = () => {};

  // Mock appStore.loading after 1 sec
  useEffect(() => {
    const timer = setTimeout(() => {
      appStore.setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [appStore]);

  return (
    <Container
      maxWidth={false}
      sx={{
        position: "relative",
        minHeight: "100vh",
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 4 },
        overflow: "hidden",
      }}
    >
      {/* Main content */}
      <Box
        sx={{
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 2, md: 4 },
        }}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: { xs: 4, md: 6 },
              pb: 3,
              borderBottom: `1px solid rgba(64, 64, 64, 0.5)`,
            }}
          >
            <Box>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                  fontWeight: 700,
                  fontFamily: "Ubuntu, sans-serif",
                  background:
                    "linear-gradient(135deg, #FAFAFA 0%, #F97316 50%, #FAFAFA 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  lineHeight: 1.2,
                }}
              >
                NFT Marketplace
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: "#D4D4D4",
                  fontWeight: 400,
                  maxWidth: "600px",
                }}
              >
                Discover, collect, and trade unique digital assets on Phoenix
                Protocol
              </Typography>
            </Box>

            {/* Quick stats or action button could go here */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(145deg, #262626 0%, #1a1a1a 100%)",
                  border: "1px solid #404040",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: "0.875rem", color: "#A3A3A3", mb: 0.5 }}
                >
                  Total Volume
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#FAFAFA",
                  }}
                >
                  2.4M XLM
                </Typography>
              </Box>
              <Box
                sx={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(145deg, #262626 0%, #1a1a1a 100%)",
                  border: "1px solid #404040",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: "0.875rem", color: "#A3A3A3", mb: 0.5 }}
                >
                  Collections
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#FAFAFA",
                  }}
                >
                  1,247
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Marketplace Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <Frontpage
            featuredProps={{
              entries: [
                demoFeaturedItem,
                demoFeaturedItem,
                demoFeaturedItem,
                demoFeaturedItem,
                demoFeaturedItem,
                demoFeaturedItem,
              ],
              onEntryClick: (id) => {
                alert(id);
              },
              forwardClick: () => {},
              backwardClick: () => {},
            }}
            topCollectionsProps={{
              activeSort: { column: "collection", direction: "asc" },
              handleSort: (column) => {},
              activeCurrency: "crypto",
              setActiveCurrency: (view) => {},
              activeTime: "1d",
              setActiveTime: (time) => {},
              entries: [
                demoTopCollectionItem,
                demoTopCollectionItem,
                demoTopCollectionItem,
                demoTopCollectionItem,
                demoTopCollectionItem,
              ],
              onEntryClick: (id) => {
                alert(id);
              },
              onViewAllClick: () => {},
            }}
            popularNftsProps={{
              entries: [
                demoPopularNftItem,
                demoPopularNftItem,
                demoPopularNftItem,
                demoPopularNftItem,
                demoPopularNftItem,
                demoPopularNftItem,
              ],
              onEntryClick: (id) => {
                alert(id);
              },
              forwardClick: () => {},
              backwardClick: () => {},
              activeTime: "7d",
              setActiveTime: (time) => {},
              onViewAllClick: () => {},
            }}
            risingStarsProps={{
              entries: [
                demoRisingStartItem,
                demoRisingStartItem,
                demoRisingStartItem,
                demoRisingStartItem,
                demoRisingStartItem,
                demoRisingStartItem,
                demoRisingStartItem,
                demoRisingStartItem,
                demoRisingStartItem,
              ],
              onEntryClick: (id) => {
                alert(id);
              },
              activeTime: "7d",
              setActiveTime: (time) => {},
            }}
            nftCategoriesProps={{
              entries: [
                demoCategoryItem,
                demoCategoryItem,
                demoCategoryItem,
                demoCategoryItem,
                demoCategoryItem,
                demoCategoryItem,
              ],
              onEntryClick: (id) => {
                alert(id);
              },
              onViewAllClick: () => {},
            }}
            gettingStartedProps={{
              entries: [
                demoGettingStartedItem,
                demoGettingStartedItem,
                demoGettingStartedItem,
              ],
              onViewAllClick: () => {},
            }}
          />
        </motion.div>
      </Box>
    </Container>
  );
}
