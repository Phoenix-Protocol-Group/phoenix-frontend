import freighterApi from "@stellar/freighter-api";
import { Connector, NetworkDetails } from "@phoenix-protocol/types";

export function freighter(): Connector {
  return {
    id: "freighter",
    name: "Freighter",
    iconUrl: "/freighter.svg",
    iconBackground: "#fff",
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    },
    async isConnected(): Promise<boolean> {
      return !!freighterApi?.isConnected();
    },
    async getNetworkDetails(): Promise<NetworkDetails> {
      // !TODO - find a better solution here
      return {
        ...(await freighterApi.getNetworkDetails()),
        networkUrl:
          "https://horizon-testnet.stellar.org",
      };
    },
    async getPublicKey(): Promise<string> {
      await freighterApi.requestAccess();
      return (await freighterApi.getAddress()).address;
    },
    async isAvailable(): Promise<boolean> {
      return freighterApi
        .isConnected()
        .then(({ isConnected, error }) => !error && isConnected)
        .catch((): boolean => false);
    },
    signTransaction(
      xdr: string,
      opts?: {
        network?: string;
        networkPassphrase?: string;
        accountToSign?: string;
      }
    ): Promise<any> {
      return freighterApi.signTransaction(xdr, opts);
    },
  };
}
