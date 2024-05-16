"use client";

import ModalOpenButton from "@/bridge/web3/components/ModalOpenButton";
import { Web3ModalProvider } from "@/bridge/web3/context/Web3Provider";
import {
  AllbridgeCoreSdk,
  nodeRpcUrlsDefault,
  ChainSymbol,
  Messenger,
} from "@allbridge/bridge-core-sdk";
import { Box, Button } from "@mui/material";
import Web3 from "web3";
import { useEffect } from "react";
import { useSignMessage, useAccount } from "wagmi";

export default function Page() {
  return (
    <Web3ModalProvider>
      <ContentComponent />
    </Web3ModalProvider>
  );
}

const ContentComponent = () => {
  const sdk = new AllbridgeCoreSdk({
    ...nodeRpcUrlsDefault,
  });

  const { address } = useAccount();

  const bridge = async () => {
    // fetch information about supported chains
    const tokens = await sdk.tokens();

    // Get chain info and token info
    const ethUSDT = tokens.find(
      (token) => token.symbol === "USDT" && token.chainSymbol === "ETH"
    );

    const stlrUSDT = tokens.find(
      (token) => token.symbol === "USDT" && token.chainSymbol === "SRB"
    );

    // @ts-ignore
    const web3 = new Web3(window.ethereum);
    // authorize a transfer of tokens from sender's address
    await sdk.bridge.approve(web3, {
      token: ethUSDT!,
      owner: address!,
    });

    // initiate transfer
    const response = await sdk.bridge.send(web3, {
      amount: "0.5",
      fromAccountAddress: address!,
      toAccountAddress:
        "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
      sourceToken: ethUSDT!,
      destinationToken: stlrUSDT!,
      messenger: Messenger.ALLBRIDGE,
    });

    console.log("Tokens sent:", response.txId);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: { xs: 0, md: "2.5rem" },
          mt: { xs: "4.5rem", md: 0 },
        }}
      >
        <ModalOpenButton />
      </Box>
      <Button onClick={() => bridge()}>Bridge</Button>
    </>
  );
};
