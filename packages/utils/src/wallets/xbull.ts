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
    const bridge: xBullWalletConnect = new xBullWalletConnect();

    let updatedXdr: string = tx;

    updatedXdr = await bridge.sign({
      xdr: updatedXdr,
      publicKey: opts?.accountToSign,
      network: opts?.networkPassphrase,
    });

    bridge.closeConnections();
    return updatedXdr;
  }
  async signAuthEntry(
    entryXdr: string,
    opts?: { accountToSign?: string }
  ): Promise<string> {
    throw new Error("xBull does not support signing authorization entries");
  }
}
