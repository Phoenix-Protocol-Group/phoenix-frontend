import { xBullWalletConnect } from "xBull-Wallet-Connect";
import { Wallet } from "./types";

export class xBull implements Wallet {
  async isConnected(): Promise<boolean> {
    const bridge: xBullWalletConnect = new xBullWalletConnect();
    await bridge.connect();
    return true;
  }
  async isAllowed(): Promise<boolean> {
    return true;
  }
  async getUserInfo(): Promise<{ publicKey?: string }> {
    const bridge: xBullWalletConnect = new xBullWalletConnect();
    const publicKey: string = await bridge.connect();
    bridge.closeConnections();
    return { publicKey };
  }
  async signTransaction(
    tx: string,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ): Promise<string> {
    // Get Bridge
    const bridge: xBullWalletConnect = new xBullWalletConnect();

    const signature = await bridge.sign({
      xdr: tx,
      network: opts?.networkPassphrase,
      publicKey: opts?.accountToSign,
    });

    bridge.closeConnections();
    return signature;
  }
  async signAuthEntry(
    entryXdr: string,
    opts?: { accountToSign?: string }
  ): Promise<string> {
    throw new Error("xBull does not support signing authorization entries");
  }
}
