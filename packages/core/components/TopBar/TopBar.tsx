"use client";
import { Typography } from "@mui/material";
import { freighter, useAppStore } from "@phoenix-protocol/state";
import { AppBar, ConnectWallet } from "@phoenix-protocol/ui";
import React, { useState } from "react";

const TopBar = ({
  navOpen,
  setNavOpen,
}: {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}) => {
  const store = useAppStore();
  const [connectWalletOpen, setConnectWalletOpen] = useState(false);

  const connect = async (connector: any) => {
    await store.connectWallet();
    await store.fetchTokenBalance(
      "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT"
    );
    return;
  };

  const disconnectWallet = async () => {
    store.disconnectWallet();
    return;
  };

  const token = store.tokens.find(
    (el) => el.id === "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT"
  );

  const tokenBalance = token
    ? Number(token?.balance) / 10 ** token?.decimals
    : 0;

  return (
    <>
      <AppBar
        mobileNavOpen={navOpen}
        toggleMobileNav={(open) => setNavOpen(open)}
        balance={tokenBalance}
        walletAddress={store.wallet.address}
        connectWallet={() => setConnectWalletOpen(true)}
        disconnectWallet={disconnectWallet}
      />
      <ConnectWallet
        open={connectWalletOpen}
        // @ts-ignore
        connectors={[freighter()]}
        setOpen={() => setConnectWalletOpen(!connectWalletOpen)}
        connect={connect}
      />
    </>
  );
};

export default TopBar;
