"use client";
import { NoSsr, useMediaQuery, useTheme } from "@mui/material";
import {
  freighter,
  lobstr,
  useAppStore,
  usePersistStore,
  WalletConnect,
  xbull,
  hana,
} from "@phoenix-protocol/state";
import { AppBar, ConnectWallet } from "@phoenix-protocol/ui";
import React, { useEffect } from "react";
import { useScrollDirection } from "../../hooks/useScrollDirection";

const TopBar = ({
  navOpen,
  setNavOpen,
}: {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}) => {
  const store = useAppStore();
  const storePersist = usePersistStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { scrollDirection, isAtTop } = useScrollDirection();

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
        sidebarOpen={navOpen}
        toggleMobileNav={(open) => setNavOpen(open)}
        balance={tokenBalance}
        walletAddress={storePersist.wallet.address}
        connectWallet={() => store.setWalletModalOpen(true)}
        disconnectWallet={disconnectWallet}
        scrollDirection={isMobile ? scrollDirection : null}
        isAtTop={isAtTop}
      />
      <ConnectWallet
        open={store.walletModalOpen}
        // @ts-ignore
        connectors={[
          freighter(),
          xbull(),
          lobstr(),
          hana(),
          new WalletConnect(true),
        ]}
        setOpen={() => store.setWalletModalOpen(!store.walletModalOpen)}
        connect={connect}
      />
    </NoSsr>
  );
};

export default TopBar;
