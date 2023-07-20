"use client";
import { freighter } from "@phoenix-protocol/state";
import { AppBar, ConnectWallet } from "@phoenix-protocol/ui";
import React from "react";

const TopBar = ({
  navOpen,
  setNavOpen,
}: {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}) => {
  return (
    <>
      <AppBar
        mobileNavOpen={navOpen}
        toggleMobileNav={(open) => setNavOpen(open)}
        balance={1}
        walletAddress={undefined}
        connectWallet={() => {}}
        disconnectWallet={() => {}}
      />
      <ConnectWallet
        open={true}
        // @ts-ignore
        connectors={[freighter()]}
        setOpen={() => {}}
        connect={async (connector) => {}}
      />
    </>
  );
};

export default TopBar;
