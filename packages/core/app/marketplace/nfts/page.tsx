"use client";

import { Box, Typography } from "@mui/material";
import { AuctionStatus, AuctionType, Currency, NftListingEntryProps, TextSelectItemProps } from "@phoenix-protocol/types";
import {
  Shared,
} from "@phoenix-protocol/ui";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const demoEntry: NftListingEntryProps = {
  id: "2137",
  image: "/nftPreview.png",
  collectionName: "Collection Name",
  nftName: "NFT Name",
  price: "0.00",
  ownedBy: "You"
}

const demoEntryOwned: NftListingEntryProps = {
  id: "2137",
  image: "/nftPreview.png",
  collectionName: "Collection Name",
  nftName: "NFT Name",
  price: "0.00",
  ownedBy: "You",
  listForSale: true,
}

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
  const [status, setStatus] = useState<AuctionStatus>('ALL');
  const [type, setType] = useState<AuctionType>("ALL");

  const onEntryClick = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  const handleShareClick = () => {
    alert("share")
  };

  const handleCollectionOfferClick = () => {
    alert("offer")
  };

  const fetchEntries = () => {
    setEntries([demoEntry, demoEntry, demoEntry, demoEntry, demoEntryOwned])
  }

  const fetchCollectionInfo = () => {
    //set all collection infos
  }

  const handleListForSaleClick = (id: string) => {
    alert(`list for sale ${id}`)
  };

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
    </Box>
  );
}
