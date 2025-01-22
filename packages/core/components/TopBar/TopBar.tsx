"use client";
import { NoSsr } from "@mui/material";
import {
  freighter,
  lobstr,
  useAppStore,
  usePersistStore,
  WalletConnect,
  xbull,
} from "@phoenix-protocol/state";
import { AppBar, ConnectWallet } from "@phoenix-protocol/ui";
import React, { useEffect } from "react";

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
      "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA"
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
        connectWallet={() => store.setWalletModalOpen(true)}
        disconnectWallet={disconnectWallet}
      />
      <ConnectWallet
        open={store.walletModalOpen}
        // @ts-ignore
        connectors={[
          freighter(),
          /* xbull(), temp. disable xbull */ lobstr(),
          new WalletConnect(true),
        ]}
        setOpen={() => store.setWalletModalOpen(!store.walletModalOpen)}
        connect={connect}
      />
    </NoSsr>
  );
};

export default TopBar;
