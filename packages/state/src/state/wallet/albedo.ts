import freighterApi from "@stellar/freighter-api";
import { Connector, NetworkDetails } from "@phoenix-protocol/types";
import albedoSDK from "@albedo-link/intent";

export function albedo(): Connector {
  return {
    id: "albedo",
    name: "Albedo",
    iconUrl: "https://stellar.creit.tech/wallet-icons/albedo.png",
    iconBackground: "#fff",
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    },
    async isConnected(): Promise<boolean> {
      return true; // Albedo does not have a direct connection check, so we assume it's always connected
    },
    async getNetworkDetails(): Promise<NetworkDetails> {
      // !TODO - find a better solution here
      return {
        ...(await freighterApi.getNetworkDetails()),
        networkUrl:
          "https://mainnet.stellar.validationcloud.io/v1/YcyPYotN_b6-_656rpr0CabDwlGgkT42NCzPVIqcZh0",
      };
    },
    async isAvailable(): Promise<boolean> {
      return true;
    },
    async getPublicKey(): Promise<string> {
      const result = await albedoSDK.publicKey({});
      return result.pubkey;
    },
    async signTransaction(
      xdr: string,
      opts?: {
        network?: string;
        networkPassphrase?: string;
        accountToSign?: string;
      }
    ): Promise<string> {
      return albedoSDK
        .tx({
          xdr,
          pubkey: opts?.accountToSign,
          network: opts?.networkPassphrase,
        })
        .then(({ signed_envelope_xdr }) => signed_envelope_xdr);
    },
  };
}
