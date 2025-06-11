"use client";

import { Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useAppStore } from "@phoenix-protocol/state";
import {
  AuctionStatus,
  AuctionType,
  Currency,
  NftListingEntryProps,
  TextSelectItemProps,
} from "@phoenix-protocol/types";
import { Shared } from "@phoenix-protocol/ui";
import PopularNfts from "@phoenix-protocol/ui/src/Marketplace/Frontpage/PopularNfts/PopularNfts";
import NftCategories from "@phoenix-protocol/ui/src/Marketplace/Frontpage/NftCategories/NftCategories";
import GettingStarted from "@phoenix-protocol/ui/src/Marketplace/Frontpage/GettingStarted/GettingStarted";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Enhanced demo data with realistic NFT entries
const demoNftEntries: NftListingEntryProps[] = [
  {
    id: "1001",
    image:
      "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop",
    collectionName: "Cosmic Visions",
    nftName: "Stellar Dreams #42",
    price: "2.85",
    ownedBy: "0x42...8f9a",
  },
  {
    id: "1002",
    image:
      "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&h=400&fit=crop",
    collectionName: "Digital Abstracts",
    nftName: "Neon Pulse",
    price: "1.25",
    ownedBy: "0x7b...3c2d",
  },
  {
    id: "1003",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    collectionName: "Future Cities",
    nftName: "Cyberpunk Skyline",
    price: "4.75",
    ownedBy: "0x9d...1e8a",
  },
  {
    id: "1004",
    image:
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=400&h=400&fit=crop",
    collectionName: "Ethereal Beings",
    nftName: "Ancient Guardian",
    price: "3.50",
    ownedBy: "0x3f...6b4c",
  },
  {
    id: "1005",
    image:
      "https://images.unsplash.com/photo-1626282874430-c11ae32d2e69?w=400&h=400&fit=crop",
    collectionName: "My Collection",
    nftName: "Crystal Formation",
    price: "0.00",
    ownedBy: "You",
    listForSale: true,
  },
  {
    id: "1006",
    image:
      "https://images.unsplash.com/photo-1635776062043-223faf322554?w=400&h=400&fit=crop",
    collectionName: "Phoenix Art",
    nftName: "Digital Phoenix #1",
    price: "5.20",
    ownedBy: "0x8a...9f2e",
  },
  {
    id: "1007",
    image:
      "https://images.unsplash.com/photo-1614729552198-60d53c23ce71?w=400&h=400&fit=crop",
    collectionName: "Space Odyssey",
    nftName: "Galactic Explorer",
    price: "2.10",
    ownedBy: "0x5c...4d8b",
  },
  {
    id: "1008",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop",
    collectionName: "Abstract Worlds",
    nftName: "Dimensional Shift",
    price: "1.80",
    ownedBy: "0x2b...7a5f",
  },
];

// Demo data for PopularNfts component
const demoPopularNftItems = [
  {
    id: "pop1",
    _onClick: () => {},
    image:
      "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop",
    collectionName: "Cosmic Visions",
    nftName: "Stellar Dreams #42",
    price: "2.85",
    volume: "145.2",
    icon: "/cryptoIcons/pho.svg",
  },
  {
    id: "pop2",
    _onClick: () => {},
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    collectionName: "Future Cities",
    nftName: "Cyberpunk Skyline",
    price: "4.75",
    volume: "89.7",
    icon: "/cryptoIcons/pho.svg",
  },
  {
    id: "pop3",
    _onClick: () => {},
    image:
      "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&h=400&fit=crop",
    collectionName: "Digital Abstracts",
    nftName: "Neon Pulse",
    price: "1.25",
    volume: "203.4",
    icon: "/cryptoIcons/pho.svg",
  },
  {
    id: "pop4",
    _onClick: () => {},
    image:
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=400&h=400&fit=crop",
    collectionName: "Ethereal Beings",
    nftName: "Ancient Guardian",
    price: "3.50",
    volume: "67.8",
    icon: "/cryptoIcons/pho.svg",
  },
];

// Demo data for NFT Categories
const demoCategoryItems = [
  {
    id: "cat1",
    _onClick: () => {},
    image:
      "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=300&h=300&fit=crop",
    name: "Digital Art",
  },
  {
    id: "cat2",
    _onClick: () => {},
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=300&fit=crop",
    name: "Gaming",
  },
  {
    id: "cat3",
    _onClick: () => {},
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=300&fit=crop",
    name: "Music",
  },
  {
    id: "cat4",
    _onClick: () => {},
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=300&fit=crop",
    name: "Photography",
  },
  {
    id: "cat5",
    _onClick: () => {},
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop",
    name: "Sports",
  },
  {
    id: "cat6",
    _onClick: () => {},
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=300&fit=crop",
    name: "Virtual Worlds",
  },
];

// Demo data for Getting Started
const demoGettingStartedItems = [
  {
    image:
      "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=300&h=300&fit=crop",
    name: "Mint Your First NFT",
    description:
      "Create and mint your unique digital artwork on the blockchain.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=300&h=300&fit=crop",
    name: "List Your NFT",
    description: "Put your NFTs up for sale and reach collectors worldwide.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1626282874430-c11ae32d2e69?w=300&h=300&fit=crop",
    name: "Build Your Collection",
    description:
      "Discover and collect NFTs that match your interests and investment goals.",
  },
];

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  const [entries, setEntries] = useState<NftListingEntryProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>("crypto");
  const [orderItems, setOrderItems] = useState<TextSelectItemProps[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [status, setStatus] = useState<AuctionStatus>("ALL");
  const [type, setType] = useState<AuctionType>("ALL");

  const onEntryClick = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  const handleShareClick = () => {
    alert("share");
  };

  const handleCollectionOfferClick = () => {
    alert("offer");
  };

  const appStore = useAppStore();
  // Mock appStore.loading after 1 sec
  useEffect(() => {
    const timer = setTimeout(() => {
      appStore.setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [appStore]);

  const fetchEntries = () => {
    setEntries(demoNftEntries);
  };

  const fetchCollectionInfo = () => {
    //set all collection infos
  };

  const handleListForSaleClick = (id: string) => {
    alert(`list for sale ${id}`);
  };

  useEffect(() => {
    fetchCollectionInfo();
    fetchEntries();
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
            NFT Marketplace
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
            Explore unique digital collectibles, rare artworks, and exclusive
            NFTs from creators around the world. Buy, sell, and trade
            one-of-a-kind digital assets on the Phoenix marketplace.
          </Typography>
        </Box>
      </motion.div>

      {/* Main NFT Listing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Box mx={2} position="relative" mb={{ xs: 4, md: 6 }}>
          <Shared.NftListing
            nftEntries={entries}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            order={order}
            setOrder={setOrder}
            orderItems={orderItems}
            activeCurrency={currency}
            setActiveCurrency={setCurrency}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            status={status}
            setStatus={setStatus}
            type={type}
            setType={setType}
            onEntryClick={onEntryClick}
            listForSaleClick={handleListForSaleClick}
          />
        </Box>
      </motion.div>

      {/* Additional Sections */}
      <Grid container spacing={{ xs: 3, md: 4, lg: 6 }} sx={{ px: 2 }}>
        {/* Popular NFTs */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PopularNfts
              entries={demoPopularNftItems}
              onEntryClick={onEntryClick}
              activeTime="1d"
              setActiveTime={(time) => console.log("Time changed:", time)}
              onViewAllClick={() => router.push("/marketplace/nfts")}
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
              entries={demoCategoryItems}
              onEntryClick={(id) =>
                router.push(`/marketplace/nfts?category=${id}`)
              }
              onViewAllClick={() => router.push("/marketplace/collections")}
            />
          </motion.div>
        </Grid>

        {/* Getting Started for NFT Creators */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GettingStarted
              entries={demoGettingStartedItems}
              onViewAllClick={() => router.push("/help-center")}
            />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
