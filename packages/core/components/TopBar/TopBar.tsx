"use client";
import { Typography } from "@mui/material";
import { freighter, useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { AppBar, ConnectWallet } from "@phoenix-protocol/ui";
import React, { useEffect, useState } from "react";

const TopBar = ({
  navOpen,
  setNavOpen,
}: {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}) => {
  const store = useAppStore();
  const storePersist = usePersistStore();
  const [connectWalletOpen, setConnectWalletOpen] = useState(false);

  const connect = async (connector: any) => {
    await storePersist.connectWallet();
  
    return;
  };

  const disconnectWallet = async () => {
    storePersist.disconnectWallet();
    return;
  };

  const token = store.tokens.find(
    (el) => el.id === "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT"
  );

  const tokenBalance = token
    ? Number(token?.balance) / 10 ** token?.decimals
    : 0;

  const fetch = async () => await store.fetchTokenInfo(
    "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT"
  );

  useEffect(() => {
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storePersist.wallet.address]);

  return (
    <>
      <AppBar
        mobileNavOpen={navOpen}
        toggleMobileNav={(open) => setNavOpen(open)}
        balance={tokenBalance}
        walletAddress={storePersist.wallet.address}
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
