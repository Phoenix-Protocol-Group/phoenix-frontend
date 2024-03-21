import freighterApi from "@stellar/freighter-api";
import { NetworkDetails, Connector } from "@phoenix-protocol/types";
import { xBullWalletConnect } from "xBull-Wallet-Connect";

export function xbull(): Connector {
  return {
    id: "xbull",
    name: "xBull",
    iconUrl: "http://i.epvpimg.com/wYBJfab.png",
    iconBackground: "#fff",
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    },
    isConnected(): boolean {
      const bridge: xBullWalletConnect = new xBullWalletConnect();
      return bridge.publicKey !== undefined;
    },
    async getNetworkDetails(): Promise<NetworkDetails> {
      // !TODO - find a better solution here
      return {
        ...(await freighterApi.getNetworkDetails()),
        networkUrl: "https://bitter-alpha-layer.stellar-mainnet.quiknode.pro/54b50c548864e1470fd52dbd629b647d556b983e",
      };
    },
    async getPublicKey(): Promise<string> {
      const bridge: xBullWalletConnect = new xBullWalletConnect();
      const publicKey: string = await bridge.connect();
      return publicKey;
    },
    async signTransaction(
      xdr: string,
      opts?: {
        network?: string;
        networkPassphrase?: string;
        accountToSign?: string;
      }
    ): Promise<string> {
      const bridge: xBullWalletConnect = new xBullWalletConnect();

      const signature = await bridge.sign({
        xdr,
        network: opts?.networkPassphrase,
        publicKey: opts?.accountToSign,
      });

      bridge.closeConnections();
      return signature;
    },
  };
}
