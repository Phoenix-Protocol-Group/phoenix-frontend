import { Wallet } from "./types";

interface SignTransactionProps {
  xdr: string;
  accountToSign?: string;
  networkPassphrase?: string;
}

interface SignBlobProps {
  blob: string;
  accountToSign: string;
}

interface SignAuthEntryProps {
  xdr: string;
  accountToSign?: string;
}

interface SignMessageProps {
  message: string;
  accountToSign?: string;
}

declare const window: Window & {
  hanaWallet?: {
    stellar?: {
      getPublicKey(): Promise<string>;
      signTransaction({
        xdr,
        accountToSign,
        networkPassphrase,
      }: SignTransactionProps): Promise<string>;
      signBlob({ blob, accountToSign }: SignBlobProps): Promise<string>;
      signAuthEntry({
        xdr,
        accountToSign,
      }: SignAuthEntryProps): Promise<string>;
      signMessage({
        message,
        accountToSign,
      }: SignMessageProps): Promise<string>;
    };
  };
};

/**
 * hana wallet implementation
 * @implements {Wallet}
 * @class hana
 * @export hana
 * @see {https://github.com/hanaco/hana-browser-extension}
 */
export class hana implements Wallet {
  /**
   * Check if hana is connected
   * @returns {Promise<boolean>}
   * @memberof hana
   * @instance isConnected
   */
  async isConnected(): Promise<boolean> {
    return window.hanaWallet!.stellar!.getPublicKey() !== undefined;
  }

  /**
   * Check if hana is allowed
   * @returns {Promise<boolean>}
   * @memberof hana
   * @instance isAllowed
   */
  async isAllowed(): Promise<boolean> {
    return true;
  }

  /**
   * Get user info from hana
   * @returns {Promise<{ publicKey?: string }>}
   * @memberof hana
   * @instance getUserInfo
   */
  async getAddress(): Promise<{ address?: string }> {
    if (!(await this.isConnected())) {
      throw new Error(`hana is not connected`);
    }

    const pubKey =
      getAddressFromLocalStorageByKey("app-storage") ||
      (await window.hanaWallet!.stellar!.getPublicKey());
    return { address: pubKey };
  }

  /**
   * Sign a transaction using hana
   * @param {string} tx - Transaction XDR
   * @param {{ network?: string; networkPassphrase?: string; accountToSign?: string }} [opts] - Options
   * @returns {Promise<string>}
   * @memberof hana
   * @instance signTransaction
   */
  async signTransaction(
    tx: string,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ): Promise<{ signedTxXdr: string; signerAddress: string }> {
    if (!(await this.isConnected())) {
      throw new Error(`hana is not connected`);
    }

    return {
      signedTxXdr: await window.hanaWallet!.stellar!.signTransaction({
        xdr: tx,
        accountToSign: opts?.accountToSign,
        networkPassphrase: opts?.networkPassphrase,
      }),
      signerAddress: (await this.getAddress()).address!,
    };
  }

  /**
   * Sign an authorization entry using hana
   * @param {string} entryXdr - Authorization entry XDR
   * @param {{ accountToSign?: string }} [opts] - Options
   * @returns {Promise<string>}
   * @memberof hana
   * @instance signAuthEntry
   * @throws {Error} hana does not support signing authorization entries
   */
  async signAuthEntry(
    entryXdr: string,
    opts?:
      | {
          networkPassphrase?: string | undefined;
          address?: string | undefined;
        }
      | undefined
  ): Promise<{
    signedAuthEntry: Buffer | null;
    signerAddress: string;
  }> {
    throw new Error("hana does not support signing authorization entries");
  }
}

/**
 * Get address from local storage by key
 * @param {string} key
 * @returns {string | undefined}
 * @memberof hana
 * @instance getAddressFromLocalStorageByKey
 */
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
