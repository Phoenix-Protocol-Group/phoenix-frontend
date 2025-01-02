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
  getAddress: () => Promise<{ address?: string }>;
  signTransaction: (
    transactionXdr: string,
    opts?:
      | {
          networkPassphrase?: string | undefined;
          address?: string | undefined;
        }
      | undefined
  ) => Promise<{
    signedTxXdr: string;
    signerAddress: string;
  }>;
  signAuthEntry: (
    entryXdr: string,
    opts?:
      | {
          networkPassphrase?: string | undefined;
          address?: string | undefined;
        }
      | undefined
  ) => Promise<{
    signedAuthEntry: Buffer | null;
    signerAddress: string;
  }>;
}
