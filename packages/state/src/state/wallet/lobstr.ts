import {
  getPublicKey,
  isConnected,
  signTransaction,
} from "@lobstrco/signer-extension-api";
import { Connector, NetworkDetails } from "@phoenix-protocol/types";
import { NETWORK, NETWORK_PASSPHRASE, RPC_URL } from "../../constants";

export function lobstr(): Connector {
  return {
    async isConnected(): Promise<boolean> {
      return await isConnected();
    },
    id: "lobstr",
    name: "LOBSTR",
    iconUrl:
      "https://raw.githubusercontent.com/Lobstrco/lobstr-browser-extension/main/extension/public/static/images/icon128.png",
    iconBackground: "#fff",
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    },
    async getNetworkDetails(): Promise<NetworkDetails> {
      // TODO
      return {
        network: NETWORK,
        networkUrl: RPC_URL,
        networkPassphrase: NETWORK_PASSPHRASE,
      };
    },
    getPublicKey(): Promise<string> {
      const pubKey: Promise<string> = getAddressFromLocalStorageByKey(
        "app-storage"
      )
        ? new Promise((resolve, reject) => {
            const pub: string =
              getAddressFromLocalStorageByKey("app-storage") || "";
            return pub;
          })
        : getPublicKey();

      return pubKey;
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

function getAddressFromLocalStorageByKey(key: string): string | undefined {
  const localStorageData = JSON.parse(localStorage.getItem(key) || "{}");
  if (
    localStorageData &&
    localStorageData.state &&
    localStorageData.state.wallet &&
    localStorageData.state.wallet.address
  ) {
    return localStorageData.state.wallet.address;
  } else {
    return undefined;
  }
}
