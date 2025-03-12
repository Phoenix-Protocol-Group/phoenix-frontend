import { Connector, NetworkDetails } from "@phoenix-protocol/types";
import { WalletConnect as WalletClient } from "@phoenix-protocol/utils";
import { WalletConnectAllowedMethods } from "@phoenix-protocol/utils/build/wallets/wallet-connect";
import { NETWORK_PASSPHRASE } from "@phoenix-protocol/utils/build/constants";

export class WalletConnect implements Connector {
  id: string;
  name: string;
  iconUrl: string;
  iconBackground: string;
  installed: boolean;
  downloadUrls: {
    browserExtension: string;
  };
  client?: WalletClient;
  publicKey?: string;

  constructor(ignoreClient = false) {
    this.id = "wallet-connect";
    this.name = "Wallet Connect";
    this.iconUrl = "https://stellar.creit.tech/wallet-icons/walletconnect.svg";
    this.iconBackground = "#fff";
    this.installed = true;
    this.downloadUrls = {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    };
    if (ignoreClient) return;
    this.client = new WalletClient({
      projectId: "1cca500fbafdda38a70f8bf3bcb91b15",
      name: "Phoenix DeFi Hub",
      description: "Serving only the tastiest DeFi",
      url: "https://app.phoenix-hub.io",
      icons: ["https://app.phoenix-hub.io/logoIcon.png"],
      method: WalletConnectAllowedMethods.SIGN_AND_SUBMIT,
      network: "stellar:pubnet",
    });
  }

  async isConnected(): Promise<boolean> {
    return true;
  }
  async isAvailable(): Promise<boolean> {
    return true;
  }
  async getNetworkDetails(): Promise<NetworkDetails> {
    return {
      network: "public",
      networkPassphrase: NETWORK_PASSPHRASE,
      networkUrl:
        "https://mainnet.stellar.validationcloud.io/v1/YcyPYotN_b6-_656rpr0CabDwlGgkT42NCzPVIqcZh0",
    };
  }

  getPublicKey(): Promise<string> {
    return this.client?.getPublicKey()!;
  }

  signTransaction(
    xdr: string,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ): Promise<any> {
    return this.client!.signTransaction(xdr, opts);
  }
}
