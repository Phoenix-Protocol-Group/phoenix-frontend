"use client";

import ModalOpenButton from "@/bridge/web3/components/ModalOpenButton";
import { Web3ModalProvider } from "@/bridge/web3/context/Web3Provider";
import {
  AllbridgeCoreSdk,
  nodeRpcUrlsDefault,
  ChainSymbol,
} from "@allbridge/bridge-core-sdk";
import { Box } from "@mui/material";
import Web3 from "web3";
import { useEffect } from "react";
import { useSignMessage, useAccount } from "wagmi";

export default function Page() {
  const sdk = new AllbridgeCoreSdk({
    ...nodeRpcUrlsDefault,
  });
  const { signMessage } = useSignMessage();
  const { address, isConnecting, isDisconnected } = useAccount();

  const bridge = async () => {
    // fetch information about supported chains
    const chains = await sdk.chainDetailsMap();

    // Get chain info and token info
    const bscChain = chains[ChainSymbol.ETH];
    const busdToken = bscChain.tokens.find((token) => token.symbol === "USDT");

    const trxChain = chains[ChainSymbol.STLR];
    const usdcToken = trxChain.tokens.find((token) => token.symbol === "USDC");

    const rawTx = await sdk.bridge.rawTxBuilder.approve({
      token: busdToken!,
      owner: address as string,
    });

    // Sign the transaction
    const signature = await signMessage({ message: rawTx.toString() });

    const rawTransactionApprove = await sdk.bridge.rawTxBuilder.send;
  };

  useEffect(() => {
    bridge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Web3ModalProvider>
      <Box
        sx={{
          width: "100%",
          padding: { xs: 0, md: "2.5rem" },
          mt: { xs: "4.5rem", md: 0 },
        }}
      >
        <ModalOpenButton />
      </Box>
    </Web3ModalProvider>
  );
}
