import { Horizon } from "@stellar/stellar-sdk";

export type StateToken = {
  id: string;
  balance: bigint;
  decimals: number;
  symbol: string;
  isStakingToken?: boolean;
};

export type Wallet = {
  address: string | undefined;
  activeChain: WalletChain | undefined;
  server: Horizon.Server | undefined;
  walletType:
    | "freighter"
    | "xbull"
    | "lobstr"
    | "wallet-connect"
    | "hana"
    | undefined;
};

export interface WalletActions {
  tokens: StateToken[];
  allTokens: any;
  fetchTokenInfo: (
    tokenAddress: string,
    isStakingToken?: boolean
  ) => Promise<StateToken | undefined>;
  getAllTokens: () => Promise<any[]>;
  walletConnectInstance?: any;
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

export interface NetworkDetails {
  network: string;
  networkUrl: string;
  networkPassphrase: string;
}

export interface Connector {
  id: string;
  name: string;
  iconUrl: string;
  iconBackground: string;
  installed: boolean;
  downloadUrls: {
    browserExtension: string;
  };
  client?: any;

  isConnected(): Promise<boolean>;

  getNetworkDetails(): Promise<NetworkDetails>;

  getPublicKey(): Promise<string>;

  isAvailable(): Promise<boolean>;

  signTransaction(
    xdr: string,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ): Promise<string>;
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
