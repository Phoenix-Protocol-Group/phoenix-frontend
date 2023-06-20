"use client";
import React, { useState } from "react";
import { Card, Container, Typography, Button } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useContractSign, useSorobanReact } from "@phoenix-protocol/state";
import WelcomeMessage from "../components/WelcomeMessage";
import Balance from "../components/Balance";
import * as SorobanClient from "soroban-client";
import { convert } from "@phoenix-protocol/utils";
import BigNumber from "bignumber.js";

export default function Page() {
  const { address, activeChain, server } = useSorobanReact();
  const sorobanContext = useSorobanReact();
  const { sendTransaction } = useContractSign();
  const [submitting, setSubmitting] = useState(false);

  const swap = async () => {
    if (!server) throw new Error("Not connected to server");
    const networkPassphrase = sorobanContext.activeChain?.networkPassphrase;
    let walletSource;
    try {
      walletSource = await server.getAccount(address || "");
    } catch (error) {
      alert("Your wallet or the token admin wallet might not be funded");
      setSubmitting(false);
      return;
    }

    try {
      const contract = new SorobanClient.Contract(
        "b39b7afe36930c98d247fd203795d977bbef6f2fb617f1fe50532b45b10114ae"
      );
      const buf = SorobanClient.StrKey.decodeEd25519PublicKey(address || "");
      const params = [
        SorobanClient.xdr.ScVal.scvBool(true),
      ];

      const result = await sendTransaction(
        new SorobanClient.TransactionBuilder(walletSource, {
          networkPassphrase,
          fee: "1000", // arbitrary
        })
          .setTimeout(60)
          .addOperation(contract.call("swap"))
          .build(),
        {
          timeout: 60 * 1000, // should be enough time to approve the tx
          skipAddingFootprint: true, // classic = no footprint
          // omit `secretKey` to have Freighter prompt for signing
          // hence, we need to explicit the sorobanContext
          sorobanContext,
        }
      );
      console.debug(result);
    } catch (err) {
      console.log("Error while establishing the trustline: ", err);
      console.error(err);
    }

    setSubmitting(false);
  };

  return (
    <Container>
      <Typography variant="h1">Phoenix Demo UI</Typography>
      <Grid2 container spacing={2}>
        <Grid2 xs={4}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h4">Your assets</Typography>
            {address && (
              <>
                <Balance
                  address={address}
                  tokenId="984af61b50b042c0dad2f30b369513b12bf4b2f0b705e0165fce57c2105b7523"
                />
                <Balance
                  address={address}
                  tokenId="a407b0a76cd94a845196026af8d6240b4e709ecd969101baf5d58d3b63fb085d"
                />
              </>
            )}
          </Card>
        </Grid2>
        <Grid2 xs={4}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h4">Swap</Typography>
            <Button onClick={() => swap()} variant="contained" sx={{ mb: 3 }}>
              Swap 1000 $PHO {"->"} $FAK
            </Button>
            <Button variant="outlined">Swap 1000 $FAK {"->"} $PHO</Button>
          </Card>
        </Grid2>
        <Grid2 xs={4}>
          <Card sx={{ p: 4 }}>
            <Typography variant="body1">
              Wallet Connected: {address?.substring(0, 10)}...
            </Typography>
            <Typography variant="body1">
              On Chain: {activeChain?.name}
            </Typography>
          </Card>
        </Grid2>
        <Grid2 xs={12}>
          <Card sx={{ p: 4 }}>
            <WelcomeMessage />
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}
