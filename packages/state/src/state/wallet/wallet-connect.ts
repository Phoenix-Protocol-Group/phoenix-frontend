import {Connector, NetworkDetails} from "@phoenix-protocol/types";
import {WalletConnect as WalletClient} from "@phoenix-protocol/utils";
import {WalletConnectAllowedMethods} from "@phoenix-protocol/utils/build/wallets/wallet-connect";
import {NETWORK_PASSPHRASE} from "@phoenix-protocol/utils/build/constants";

export function WalletConnect(): Connector {
  return {
    id: "wallet-connect",
    name: "Wallet Connect",
    iconUrl: "https://stellar.creit.tech/wallet-icons/walletconnect.svg",
    iconBackground: "#fff",
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    },
    isConnected(): boolean {
      return true;
    },
    async getNetworkDetails(): Promise<NetworkDetails> {
      // !TODO - find a better solution here
      return {
        network: "public",
        networkPassphrase: NETWORK_PASSPHRASE,
        networkUrl:
          "https://mainnet.stellar.validationcloud.io/v1/YcyPYotN_b6-_656rpr0CabDwlGgkT42NCzPVIqcZh0",
      };
    },
    getPublicKey(): Promise<string> {
      const Client = new WalletClient({
        projectId: "1cca500fbafdda38a70f8bf3bcb91b15",
        name: "Phoenix DeFi Hub",
        description: "Serving only the tastiest DeFi",
        url: "https://app.phoenix-hub.io",
        icons: ["https://app.phoenix-hub.io/logoIcon.png"],
        method: WalletConnectAllowedMethods.SIGN_AND_SUBMIT,
        network: "stellar:pubnet",
      });

      return Client.getPublicKey();
    },
    signTransaction(
      xdr: string,
      opts?: {
        network?: string;
        networkPassphrase?: string;
        accountToSign?: string;
      }
    ): Promise<string> {
      const Client = new WalletClient({
        projectId: "1cca500fbafdda38a70f8bf3bcb91b15",
        name: "Phoenix DeFi Hub",
        description: "Serving only the tastiest DeFi",
        url: "https://app.phoenix-hub.io",
        icons: ["https://app.phoenix-hub.io/logoIcon.png"],
        method: WalletConnectAllowedMethods.SIGN_AND_SUBMIT,
        network: NETWORK_PASSPHRASE,
      });

      return Client.signTransaction(xdr, opts);
    },
  };
}
