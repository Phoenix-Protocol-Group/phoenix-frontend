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

  async getPublicKey(): Promise<string> {
    if (!this.client) throw new Error("Wallet client is not initialized");
    await this.client.initializingClient;

    try {
      // First, check if we have a valid existing session
      const hasValidSession = await this.client.hasValidSession();
      if (hasValidSession) {
        return await this.client.getPublicKey();
      }
    } catch (error) {
      console.log("No existing session found:", error);
    }

    // No valid session exists, establish a new connection
    try {
      const session = await this.client.ensureConnection();
      return session.accounts[0].publicKey;
    } catch (error) {
      console.error("Failed to establish WalletConnect session:", error);
      throw new Error("Failed to connect wallet. Please try again.");
    }
  }

  async signTransaction(xdr: string, opts?: any): Promise<any> {
    if (!this.client) throw new Error("Wallet client is not initialized");
    await this.client.initializingClient;
    return this.client.signTransaction(xdr, opts);
  }

  async disconnect(): Promise<void> {
    if (!this.client) return;
    await this.client.initializingClient;
    return this.client.disconnect();
  }

  async verifyAllSessionsClosed(): Promise<boolean> {
    if (!this.client) return true;
    await this.client.initializingClient;
    return this.client.verifyAllSessionsClosed();
  }

  async forceNewConnection(): Promise<any> {
    if (!this.client) throw new Error("Wallet client is not initialized");
    await this.client.initializingClient;
    return this.client.forceNewConnection();
  }
}
