"use client";
import React, { useState } from "react";
import { Card, Container, Typography, Button } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { PairClient, useAppStore } from "@phoenix-protocol/state";
import WelcomeMessage from "../components/WelcomeMessage";
import { convert } from "@phoenix-protocol/utils";
import * as SorobanClient from "soroban-client";

export default function Page() {
  const { wallet, connectWallet, disconnectWallet } = useAppStore();
  console.log(wallet);

  const { address, server, activeChain } = wallet;

  const test = async () => {
    if (!server || !activeChain || !address) {
      return;
    }

    const pairClient = new PairClient(
      server,
      activeChain.networkPassphrase,
      "b39b7afe36930c98d247fd203795d977bbef6f2fb617f1fe50532b45b10114ae",
      await server.getAccount(address)
    );

    const res = await pairClient.swap(true, 1000, undefined, 1);
    console.log(res);
  };

  return (
    <Container>
      <Typography variant="h1">Phoenix Demo UI</Typography>
      <Grid2 container spacing={2}>
        <Grid2 xs={4}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h4">Your assets</Typography>
          </Card>
        </Grid2>
        <Grid2 xs={4}>
          <Card sx={{ p: 4 }}>
            <Button onClick={() => test()}>Test</Button>
            <Typography variant="body1">
              {!wallet.address ? (
                <Button onClick={() => connectWallet()}>Connect Wallet</Button>
              ) : (
                <>
                  <Button onClick={() => disconnectWallet()}>
                    Disconnect Wallet
                  </Button>
                  Wallet Connected: {address?.substring(0, 10)}...
                </>
              )}
            </Typography>
            <Typography variant="body1">
              On Chain: {activeChain?.name}
            </Typography>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}
