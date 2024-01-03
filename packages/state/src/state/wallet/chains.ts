import { WalletChain } from "./types";
import { Networks } from "stellar-sdk";

export const public_chain: WalletChain = {
  id: "public",
  name: "Public",
  networkPassphrase: Networks.PUBLIC,
};

export const futurenet: WalletChain = {
  id: "public",
  name: "Futurenet",
  networkPassphrase: Networks.FUTURENET,
};

export const testnet: WalletChain = {
  id: "public",
  name: "Testnet",
  networkPassphrase: Networks.TESTNET,
};

export const sandbox: WalletChain = {
  id: "public",
  name: "Sandbox",
  networkPassphrase: Networks.SANDBOX,
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
