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
    <Box mx={2} position="relative" sx={{ maxWidth: "900px", mx: "auto" }}>
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
  );
}
