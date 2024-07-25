"use client";

import { Box, Typography } from "@mui/material";
import {
  AuctionStatus,
  AuctionType,
  Currency,
  NftListingEntryProps,
  TextSelectItemProps,
} from "@phoenix-protocol/types";
import { CollectionSingle, NftSingle } from "@phoenix-protocol/ui";
import { useEffect, useState } from "react";

const demoEntry: NftListingEntryProps = {
  id: "2137",
  image: "/nftPreview.png",
  collectionName: "Collection Name",
  nftName: "NFT Name",
  price: "0.00",
  ownedBy: "You",
};

const demoEntryOwned: NftListingEntryProps = {
  id: "2137",
  image: "/nftPreview.png",
  collectionName: "Collection Name",
  nftName: "NFT Name",
  price: "0.00",
  ownedBy: "You",
  listForSale: true,
};

interface NftPageProps {
  readonly params: {
    readonly nftAddress: string;
  };
}

export default function Page({ params }: NftPageProps) {
  const now = new Date();
  const auctionEndTime = new Date(
    now.getTime() +
      2 * 24 * 60 * 60 * 1000 +
      3 * 60 * 60 * 1000 +
      45 * 60 * 1000 +
      30 * 1000
  );

  const [previewImage, setPreviewImage] = useState<string>("/demo_nft.png");
  const [collectionName, setCollectionName] = useState<string>("Collection Name");
  const [nftName, setNftName] = useState<string>("NFT Name");
  const [nftDescription, setNftDescription] = useState<string>("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.");
  const [lastSale, setLastSale] = useState<string>("103.1K PHO");
  const [bestOffer, setBestOffer] = useState<string>("162.5K PHO");
  const [floorPrice, setFloorPrice] = useState<string>("177.89K PHO");
  const [owner, setOwner] = useState<string>("GARX7YOCGEIOA5YQXCHA6ZM7764KLCFRVTTQJQZMPLJPCZKHY4KATVM3");
  const [auctionEnds, setAuctionEnds] = useState<Date>(auctionEndTime);
  const [availableSupply, setAvailableSupply] = useState<string>("1");
  const [totalSupply, setTotalSupply] = useState<string>("20");
  const [price, setPrice] = useState<string>("150,68K PHO");
  const [priceUsd, setPriceUsd] = useState<string>("2,407.04");
  const [listForSale, setListForSale] = useState<boolean>(false);

  const fetchNftInfo = () => {
    
  };

  const handleBuyNowClick = () => {
    alert("buy now")
  };

  const handleMakeOfferClick = () => {
    alert("make offer")
  };

  const handleListForSaleClick = () => {
    alert("list for sale")
  };

  useEffect(() => {
    fetchNftInfo();
  }, []);

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
        Collection Overview
      </Typography>
      <Box mx={2} position="relative">
        <NftSingle
          previewImage={previewImage}
          collectionName={collectionName}
          nftName={nftName}
          nftDescription={nftDescription}
          lastSale={lastSale}
          bestOffer={bestOffer}
          floorPrice={floorPrice}
          owner={owner}
          auctionEnds={auctionEnds}
          availableSupply={availableSupply}
          totalSupply={totalSupply}
          price={price}
          priceUsd={priceUsd}
          onBuyNowClick={handleBuyNowClick}
          onMakeOfferClick={handleMakeOfferClick}
          listForSale={listForSale}
          listForSaleClick={handleListForSaleClick}
        />
      </Box>
    </Box>
  );
}
