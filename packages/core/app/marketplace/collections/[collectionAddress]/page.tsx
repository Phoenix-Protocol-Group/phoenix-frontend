"use client";

import { Box, Typography } from "@mui/material";
import { AuctionStatus, AuctionType, Currency, NftListingEntryProps, TextSelectItemProps } from "@phoenix-protocol/types";
import {
  CollectionSingle,
} from "@phoenix-protocol/ui";
import { useEffect, useState } from "react";

const demoEntry: NftListingEntryProps = {
  id: "2137",
  image: "/nftPreview.png",
  collectionName: "Collection Name",
  nftName: "NFT Name",
  price: "0.00",
  ownedBy: "You"
}

interface CollectionPageProps {
  readonly params: {
    readonly collectionAddress: string;
  };
}

export default function Page({ params }: CollectionPageProps) {
  const [name, setName] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [creator, setCreator] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [likes, setLikes] = useState<number>(0);
  const [floorPrice, setFloorPrice] = useState<string>("");
  const [bestOffer, setBestOffer] = useState<string>("");
  const [volume7d, setVolume7d] = useState<string>("");
  const [owners, setOwners] = useState<string>("");
  const [forSale, setForSale] = useState<string>("");
  const [total, setTotal] = useState<string>("");
  const [royalities, setRoyalities] = useState<string>("");
  const [entries, setEntries] = useState<NftListingEntryProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>("crypto");
  const [orderItems, setOrderItems] = useState<TextSelectItemProps[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [status, setStatus] = useState<AuctionStatus>('ALL');
  const [type, setType] = useState<AuctionType>("ALL");

  const handleEntryClick = (id: string) => {
    alert(id)
  };

  const handleShareClick = () => {
    alert("share")
  };

  const handleCollectionOfferClick = () => {
    alert("offer")
  };

  const fetchEntries = () => {
    setEntries([demoEntry, demoEntry, demoEntry, demoEntry])
  }

  const fetchCollectionInfo = () => {
    //set all collection infos
  }

  useEffect(() => {
    fetchCollectionInfo();
    fetchEntries();
  }, [])

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
        <CollectionSingle
          name={name}
          previewImage={previewImage}
          creator={creator}
          description={description}
          likes={likes}
          onShareClick={handleShareClick}
          onMakeCollectionOfferClick={handleCollectionOfferClick}
          floorPrice={floorPrice}
          bestOffer={bestOffer}
          volume7d={volume7d}
          owners={owners}
          forSale={forSale}
          total={total}
          royalities={royalities}
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
          onEntryClick={handleEntryClick}
        />
      </Box>
    </Box>
  );
}
