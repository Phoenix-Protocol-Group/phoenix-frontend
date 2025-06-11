"use client";

import { Box, Typography } from "@mui/material";
import { useAppStore } from "@phoenix-protocol/state";
import { CreateSomething } from "@phoenix-protocol/ui";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (subroute: string) => {
    const path = `${pathname}${subroute}`;
    router.push(path);
  };

  const appStore = useAppStore();
  // Mock appStore.loading after 1 sec
  useEffect(() => {
    const timer = setTimeout(() => {
      appStore.setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [appStore]);

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
        Create
      </Typography>
      <Box mx={2} position="relative">
        <CreateSomething
          title="Create something!"
          subTitle="Please select what would you like to create today"
          title1="Drop a Collection"
          description1="Launch your NFT collection for others to purchase. Your items won't display until they've been minted."
          option1Click={() => {
            navigateTo("/collection");
          }}
          title2="Mint an NFT"
          description2="Create a public collection and immediately mint NFTs directly to your wallet to own or list for sale."
          option2Click={() => {
            navigateTo("/nft");
          }}
        />
      </Box>
    </Box>
  );
}
