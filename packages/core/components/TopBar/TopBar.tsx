"use client";
import { NoSsr, Typography } from "@mui/material";
import {
  freighter,
  useAppStore,
  usePersistStore,
  xbull,
  lobstr,
} from "@phoenix-protocol/state";
import { AppBar, ConnectWallet } from "@phoenix-protocol/ui";
import React, { useEffect, useState } from "react";
import { Address } from "@stellar/stellar-sdk";

const TopBar = ({
  navOpen,
  setNavOpen,
}: {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}) => {
  const store = useAppStore();
  const storePersist = usePersistStore();

  const connect = async (connector: any) => {
    await storePersist.connectWallet(connector.id);

    return;
  };

  const disconnectWallet = async () => {
    storePersist.disconnectWallet();
    return;
  };

  const token = store.tokens.find(
    (el) => el.id === "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA"
  );

  const tokenBalance = token
    ? Number(token?.balance) / 10 ** token?.decimals
    : 0;

  const fetch = async () =>
    await store.fetchTokenInfo(
      Address.fromString(
        "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA"
      )
    );

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storePersist.wallet.address]);

  useEffect(() => {
    if (!store.walletModalOpen) return;
    if (!storePersist.userTour.active) return;
    if (storePersist.userTour.skipped) return;
    // Delay the tour start to allow the modal to open
    setTimeout(() => {
      store.setTourStep(1);
      store.setTourRunning(true);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.walletModalOpen]);

  return (
    <NoSsr>
      <AppBar
        mobileNavOpen={navOpen}
        toggleMobileNav={(open) => setNavOpen(open)}
        balance={tokenBalance}
        walletAddress={storePersist.wallet.address}
        connectWallet={() => store.setWalletModalOpen(true)}
        disconnectWallet={disconnectWallet}
      />
      <ConnectWallet
        open={store.walletModalOpen}
        // @ts-ignore
        connectors={[freighter(), xbull(), lobstr()]}
        setOpen={() => store.setWalletModalOpen(!store.walletModalOpen)}
        connect={connect}
      />
    </NoSsr>
  );
};

export default TopBar;
