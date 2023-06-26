import * as SorobanClient from "soroban-client";
import { WalletChain } from "./types";

export const public_chain: WalletChain = {
  id: "public",
  name: "Public",
  networkPassphrase: SorobanClient.Networks.PUBLIC,
};

export const futurenet: WalletChain = {
  id: "public",
  name: "Futurenet",
  networkPassphrase: SorobanClient.Networks.FUTURENET,
};

export const testnet: WalletChain = {
  id: "public",
  name: "Testnet",
  networkPassphrase: SorobanClient.Networks.TESTNET,
};

export const sandbox: WalletChain = {
  id: "public",
  name: "Sandbox",
  networkPassphrase: SorobanClient.Networks.SANDBOX,
};

export const standalone: WalletChain = {
  id: "public",
  name: "Standalone",
  networkPassphrase: "Standalone Network ; February 2017",
};

export const allChains: WalletChain[] = [
  public_chain,
  futurenet,
  testnet,
  sandbox,
  standalone,
];

export const networkToActiveChain = (networkDetails: any, chains: any) => {
  // Find the chain that matches the network passphrase.
  const supported = chains.find(
    (chain: any) =>
      chain.networkPassphrase === networkDetails?.networkPassphrase
  );
  // If the network is supported, use the supported chain's properties.
  // Otherwise, use the network's properties.
  const activeChain = {
    id: supported?.id ?? networkDetails.networkPassphrase,
    name: supported?.name ?? networkDetails.network,
    networkPassphrase: networkDetails.networkPassphrase,
    iconBackground: supported?.iconBackground,
    iconUrl: supported?.iconUrl,
    unsupported: !supported,
  };
  return activeChain;
};
