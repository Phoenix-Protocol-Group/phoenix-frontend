"use client";
import React, { useState } from "react";
import { Card, Container, Typography, Button } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
  contractTransaction,
  useContractSign,
  useSorobanReact,
} from "@phoenix-protocol/state";
import WelcomeMessage from "../components/WelcomeMessage";
import Balance from "../components/Balance";
import ProvideLp from "../components/ProvideLp";

export default function Page() {
  const { address, activeChain, server } = useSorobanReact();

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
            <Button onClick={() => {}} variant="contained" sx={{ mb: 3 }}>
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
        <Grid2 xs={4}>
          <Card sx={{ p: 4 }}>
            {address && server && (
              <ProvideLp address={address} server={server} />
            )}
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
