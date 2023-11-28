"use client";
import { NoSsr, Typography } from "@mui/material";
import {
  freighter,
  useAppStore,
  usePersistStore,
} from "@phoenix-protocol/state";
import { AppBar, ConnectWallet } from "@phoenix-protocol/ui";
import React, { useEffect, useState } from "react";
import { Address } from "soroban-client";

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
    (el) => el.id === "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
  );

  const tokenBalance = token
    ? Number(token?.balance) / 10 ** token?.decimals
    : 0;

  const fetch = async () =>
    await store.fetchTokenInfo(
      Address.fromString(
        "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
      )
    );

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storePersist.wallet.address]);

  return (
    <NoSsr>
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
    </NoSsr>
  );
};

export default TopBar;
