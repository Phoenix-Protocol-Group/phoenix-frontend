import freighterApi from "@stellar/freighter-api";
import {Connector, NetworkDetails} from "@phoenix-protocol/types";

export function freighter(): Connector {
  return {
    id: "freighter",
    name: "Freighter",
    iconUrl: "http://i.epvpimg.com/o9f6fab.png",
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
        networkUrl: "https://mainnet.stellar.validationcloud.io/v1/YcyPYotN_b6-_656rpr0CabDwlGgkT42NCzPVIqcZh0",
      };
    },
    async getPublicKey(): Promise<string> {
      const address = await freighterApi.getAddress();

      if (address.error) {
        console.log("error getting public key");
        return "";
      } else {
        return address.address;
      }
    },
    async signTransaction(
      xdr: string,
      opts?: {
        network?: string;
        networkPassphrase?: string;
        accountToSign?: string;
      }
    ): Promise<string> {
      const res = await freighterApi.signTransaction(xdr, opts);

      if (res.error) {
        console.log("error signing transaction", xdr);
        return "";
      } else {
        return res.signedTxXdr;
      }
    },
  };
}
