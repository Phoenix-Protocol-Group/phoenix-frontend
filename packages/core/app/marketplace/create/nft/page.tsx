"use client";

import { Box, Typography } from "@mui/material";
import {
  CreateSomething,
} from "@phoenix-protocol/ui";
import { usePathname, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (subroute: string) => {
    const path = `${pathname}${subroute}`;
    router.push(path);
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
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
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
      <Box mx={2} position="relative">
        <CreateSomething
          title="Create NFT"
          subTitle="Choose how you want to create your NFT"
          title1="Mint Single NFT"
          description1="Create a single NFT from scratch"
          option1Click={() => {navigateTo("/single")}}
          title2="Mint Multiple NFTs"
          description2="Create NFTs in bulk, you will need NFT metadata files for this"
          option2Click={() => {navigateTo("/bulk")}}
        />
      </Box>
    </Box>
  );
}
