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

    const pubKey =
      getAddressFromLocalStorageByKey("app-storage") || (await getPublicKey());
    return { publicKey: pubKey };
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
