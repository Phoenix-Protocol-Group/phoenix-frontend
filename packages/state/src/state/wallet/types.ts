import { Server } from "soroban-client";
import { BigNumber } from "bignumber.js";

export type Token = {
  id: string;
  balance: BigNumber;
};

export type Wallet = {
  address: string | undefined;
  activeChain: WalletChain | undefined;
  server: Server | undefined;
};

export interface WalletActions {
  connectWallet: () => void;
  disconnectWallet: () => void;
  wallet: Wallet;
  tokens: Token[];
  fetchTokenBalance: (tokenId: string) => void;
}

export interface WalletChain {
  id: string;
  name?: string;
  networkPassphrase: string;
  iconBackground?: string;
  iconUrl?: string | null;
  // TODO: Use this to indicate which chains a dapp supports
  unsupported?: boolean;
}

export type Connector = {
  id: string;
  name: string;
  shortName?: string;
  iconUrl: string | (() => Promise<string>);
  iconBackground: string;
  installed?: boolean;
  downloadUrls?: {
    android?: string;
    ios?: string;
    browserExtension?: string;
    qrCode?: string;
  };
  isConnected: () => boolean;
  getNetworkDetails: () => Promise<NetworkDetails>;
  getPublicKey: () => Promise<string>;
  signTransaction: (
    xdr: string,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ) => Promise<string>;
};

export type InstructionStepName = "install" | "create" | "scan";

export interface NetworkDetails {
  network: string;
  networkUrl: string;
  networkPassphrase: string;
}

// Sourced from https://github.com/tmm/wagmi/blob/main/packages/core/src/constants/chains.ts
// This is just so we can clearly see which of wagmi's first-class chains we provide metadata for
export type ChainName =
  | "futurenet"
  | "public"
  | "testnet"
  | "sandbox"
  | "standalone";

export type ChainMetadata = WalletChain;
