import {
  isConnected,
  getPublicKey,
  signTransaction,
} from "@lobstrco/signer-extension-api";
import { NetworkDetails, Connector } from "@phoenix-protocol/types";

export function lobstr(): Connector {
  return {
    id: "lobstr",
    name: "Lobstr",
    iconUrl: "https://i.epvpimg.com/7tDxdab.png",
    iconBackground: "#fff",
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    },
    async isConnected(): Promise<boolean> {
      return isConnected();
    },
    async getNetworkDetails(): Promise<NetworkDetails> {
      // TODO
      return {
        network: "public",
        networkUrl: "https://horizon.stellar.org",
        networkPassphrase: "Public Global Stellar Network ; September 2015",
      };
    },
    getPublicKey(): Promise<string> {
      return getPublicKey();
    },
    signTransaction(
      xdr: string,
      opts?: {
        network?: string;
        networkPassphrase?: string;
        accountToSign?: string;
      }
    ): Promise<string> {
      return signTransaction(xdr);
    },
  };
}
