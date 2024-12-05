import { XDR_BASE64 } from "@stellar/stellar-sdk/lib/contract";
import { Wallet } from "./types";

import {
  getAddress,
  isAllowed,
  isConnected,
  signAuthEntry,
  signTransaction,
} from "@stellar/freighter-api";

export class Freighter implements Wallet {
  async isConnected(): Promise<boolean> {
    const res = await isConnected();
    return res.error ? false : res.isConnected;
  }

  async isAllowed(): Promise<boolean> {
    const res = await isAllowed();
    return res.error ? false : res.isAllowed;
  }

  async getUserInfo(): Promise<{ publicKey?: string }> {
    const res = await getAddress();
    return res.error ? {} : { publicKey: res.address };
  }

  async signTransaction(
    tx: XDR_BASE64,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ): Promise<XDR_BASE64> {
    const res = await signTransaction(tx);

    return res.error ? "" : res.signedTxXdr;
  }

  async signAuthEntry(
    entryXdr: XDR_BASE64,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ): Promise<XDR_BASE64> {
    const res = await signAuthEntry(entryXdr, opts);
    return res.error ? "" : String(res.signedAuthEntry);
  }
}
