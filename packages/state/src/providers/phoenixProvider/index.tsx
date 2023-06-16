import React from "react";
import { WalletProvider } from "../walletProvider";
import { Connector, WalletChain } from "../walletProvider/types";

interface PhoenixProviderProps {
  appName?: string;
  autoconnect?: boolean;
  chains: WalletChain[];
  children: React.ReactNode;
  connectors: Connector[];
}

export const PhoenixProvider = ({
  appName,
  autoconnect = false,
  chains,
  children,
  connectors,
}: PhoenixProviderProps) => {
  return (
    <WalletProvider
      appName={appName}
      autoconnect={autoconnect}
      chains={chains}
      connectors={connectors}
    >
      {children}
    </WalletProvider>
  );
};
