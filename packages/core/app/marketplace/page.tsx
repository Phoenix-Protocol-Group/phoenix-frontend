"use client";

import { Box, Typography } from "@mui/material";
import { PhoenixNFTCollectionContract } from "@phoenix-protocol/contracts";
import { Frontpage } from "@phoenix-protocol/ui";
import { constants } from "@phoenix-protocol/utils";

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

export default function page() {
  const fetchFeaturedCollections = () => {
    // const collectionContract = new PhoenixNFTCollectionContract.MockClient({
    //  contractId: "",
    //  networkPassphrase: constants.NETWORK_PASSPHRASE,
    //  rpcUrl: constants.RPC_URL,
    // })
  };

  const fetchTopCollections = () => {};

  const fetchPopularNfts = () => {};

  const fetchRisingStars = () => {};

  const fetchNftCategories = () => {};

  return (
    <Box
      sx={{
        pt: 1.2,
        width: "100%",
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontSize: "24px",
          lineHeight: "28px",
          fontWeight: 700,
          mb: 6,
        }}
      >
        Marketplace
      </Typography>
      <Box mx={2}>
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
      </Box>
    </Box>
  );
}
