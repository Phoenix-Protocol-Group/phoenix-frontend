"use client";

import { Box, Typography } from "@mui/material";
import { PhoenixNFTCollectionContract } from "@phoenix-protocol/contracts";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { AuctionStatus, AuctionType, Currency, NftListingEntryProps, TextSelectItemProps } from "@phoenix-protocol/types";
import {
  CollectionSingle,
} from "@phoenix-protocol/ui";
import { constants } from "@phoenix-protocol/utils";
import { PinataSDK } from "pinata";
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

interface CollectionPageProps {
  readonly params: {
    readonly collectionAddress: string;
  };
}

export default function Page({ params }: CollectionPageProps) {
  const store = useAppStore();
  const storePersist = usePersistStore();

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

  const CollectionContract = new PhoenixNFTCollectionContract.Client({
    contractId: params.collectionAddress,
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });

  const pinata = new PinataSDK({
    pinataJwt: //@todo must be moved to server side place
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1Mjk1ZmIzNy1jYmU3LTQ0YTYtYmU1OS0yNTE0MTg5ZTc1YTYiLCJlbWFpbCI6InZhcm5vdHVzZWRAcHJvdG9ubWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTYwZDY3YmM5NThjZTYwNTc5YjMiLCJzY29wZWRLZXlTZWNyZXQiOiJiMzlhM2MwOTRiZGQwMDk4OWYzYmY4ODk1MzE0NDk2MjljM2U4MDEwZjNmYzJjM2Q1NjBmNDMzZDZjZjAxOWFjIiwiaWF0IjoxNzI2NDk0OTA3fQ.g98zhDPGIzNwKk2H4PlxQDWQLH7X9YK_BYhX1LvpJiA",
    pinataGateway: "lime-genetic-whitefish-192.mypinata.cloud",
  });

  const handleEntryClick = (id: string) => {
    alert(id)
  };

  const handleShareClick = () => {
    alert("share")
  };

  const handleCollectionOfferClick = () => {
    alert("offer")
  };

  const handleListForSaleClick = (id: string) => {
    alert(`list for sale ${id}`)
  };

  const fetchEntries = () => {
    setEntries([demoEntry, demoEntry, demoEntry, demoEntry, demoEntryOwned])
  }

  const fetchCollectionInfo = async () => {
    try {
      const previewImageObj = (await CollectionContract.collection_uri()).result.unwrap();
      const previewImageCid = previewImageObj.uri.toString();

      const url = await pinata.gateways.createSignedURL({
        cid: previewImageCid,
        expires: 1800,
      });

      setPreviewImage(url);
      
    } catch(e) {
      console.error(e);
    }
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
          listForSaleClick={handleListForSaleClick}
        />
      </Box>
    </Box>
  );
}
