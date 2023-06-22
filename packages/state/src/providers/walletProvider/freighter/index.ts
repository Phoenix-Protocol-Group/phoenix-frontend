import freighterApi from "@stellar/freighter-api";
import { NetworkDetails, Connector } from "../types";

export function freighter(): Connector {
  return {
    id: "freighter",
    name: "Freighter",
    iconUrl: async () => "",
    // iconUrl: async () => (await import('./freighter.svg')).default,
    iconBackground: "#fff",
    // TODO: Check this
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    },
    isConnected(): boolean {
      return !!freighterApi?.isConnected();
    },
    async getNetworkDetails(): Promise<NetworkDetails> {
      // !TODO - find a better solution here
      return {
        ...(await freighterApi.getNetworkDetails()),
        networkUrl: "https://rpc-futurenet.stellar.org/",
      };
    },
    getPublicKey(): Promise<string> {
      return freighterApi.getPublicKey();
    },
    signTransaction(
      xdr: string,
      opts?: {
        network?: string;
        networkPassphrase?: string;
        accountToSign?: string;
      }
    ): Promise<string> {
      return freighterApi.signTransaction(xdr, opts);
    },
  };
}
