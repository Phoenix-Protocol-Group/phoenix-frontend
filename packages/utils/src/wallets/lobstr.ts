import { Wallet } from "./types";
import {
  isConnected,
  getPublicKey,
  signTransaction,
} from "@lobstrco/signer-extension-api";

export class lobstr implements Wallet {
  async isConnected(): Promise<boolean> {
    return isConnected();
  }
  async isAllowed(): Promise<boolean> {
    return true;
  }
  async getUserInfo(): Promise<{ publicKey?: string }> {
    if (!(await isConnected())) {
      throw new Error(`Lobstr is not connected`);
    }

    return { publicKey: await getPublicKey() };
  }
  async signTransaction(
    tx: string,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ): Promise<string> {
    if (!(await isConnected())) {
      throw new Error(`Lobstr is not connected`);
    }

    return await signTransaction(tx);
  }
  async signAuthEntry(
    entryXdr: string,
    opts?: { accountToSign?: string }
  ): Promise<string> {
    throw new Error("Lobstr does not support signing authorization entries");
  }
}
