type XDR_BASE64 = string;

/**
 * Wallet interface
 * @interface Wallet
 * @export Wallet
 * @module wallets
 * @description Wallet interface
 * @example
 * import { Wallet } from "./wallets/types";
 * import { lobstr } from "./wallets/lobstr";
 * import { xBull } from "./wallets/xbull";
 */
export interface Wallet {
  isConnected: () => Promise<boolean>;
  isAllowed: () => Promise<boolean>;
  getUserInfo: () => Promise<{ publicKey?: string }>;
  signTransaction: (
    tx: XDR_BASE64,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ) => Promise<XDR_BASE64>;
  signAuthEntry: (
    entryXdr: XDR_BASE64,
    opts?: {
      accountToSign?: string;
    }
  ) => Promise<XDR_BASE64>;
}
