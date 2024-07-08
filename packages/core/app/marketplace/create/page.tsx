"use client";

import { Box, Typography } from "@mui/material";
import {
  CreateCollection,
  CreateNft,
  CreateNftBulk,
  CreateSomething,
} from "@phoenix-protocol/ui";
import { useState } from "react";

export default function Page() {
  const [step, setStep] = useState<
    | undefined
    | "createCollection"
    | "createNft"
    | "createNftSingle"
    | "CreateNftBulk"
  >(undefined);

  const renderCurrentStep = () => {
    switch (step) {
      case "createCollection":
        return <CreateCollection />;
      case "createNft":
        return (
          <CreateSomething
            title="Create NFT"
            subTitle="Choose how you want to create your NFT"
            title1="Mint Single NFT"
            title2="Mint Multiple NFTs"
            description1="Create a single NFT from scratch."
            description2="Create NFTs in bulk, you will need NFT metadata files for this."
            option1Click={() => setStep("createNftSingle")}
            option2Click={() => setStep("CreateNftBulk")}
          />
        );
      case "createNftSingle":
        return <CreateNft />;
      case "CreateNftBulk":
        return <CreateNftBulk />;
      default:
        return (
          <CreateSomething
            title="Create something!"
            subTitle="Please select what would you like to create today"
            title1="Drop a Collection"
            title2="Mint an NFT"
            description1="Launch your NFT collection for others to purchase. Your items won't display until they've been minted."
            description2="Create a public collection and immediately mint NFTs directly to your wallet to own or list for sale."
            option1Click={() => setStep("createCollection")}
            option2Click={() => setStep("createNft")}
          />
        );
    }
  };

  return (
    <Box
      sx={{
        pt: 1.2,
        width: "100%",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          display: step ? "none" : "block",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        <Box
          component="img"
          sx={{
            width: "100%",
          }}
          alt="The house from the offer."
          src="/create_something_background.svg"
        />
      </Box>
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
      <Box mx={2}>{renderCurrentStep()}</Box>
    </Box>
  );
}
