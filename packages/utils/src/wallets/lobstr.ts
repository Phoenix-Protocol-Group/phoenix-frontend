import { Wallet } from "./types";
import {
  getPublicKey,
  isConnected,
  signTransaction,
} from "@lobstrco/signer-extension-api";

/**
 * Lobstr wallet implementation
 * @implements {Wallet}
 * @class lobstr
 * @export lobstr
 * @see {https://github.com/Lobstrco/lobstr-browser-extension}
 */
export class lobstr implements Wallet {
  /**
   * Check if Lobstr is connected
   * @returns {Promise<boolean>}
   * @memberof lobstr
   * @instance isConnected
   */
  async isConnected(): Promise<boolean> {
    return isConnected();
  }

  /**
   * Check if Lobstr is allowed
   * @returns {Promise<boolean>}
   * @memberof lobstr
   * @instance isAllowed
   */
  async isAllowed(): Promise<boolean> {
    return true;
  }

  /**
   * Get user info from Lobstr
   * @returns {Promise<{ publicKey?: string }>}
   * @memberof lobstr
   * @instance getUserInfo
   */
  async getAddress(): Promise<{ address?: string }> {
    if (!(await isConnected())) {
      throw new Error(`Lobstr is not connected`);
    }

    const pubKey =
      getAddressFromLocalStorageByKey("app-storage") || (await getPublicKey());
    return { address: pubKey };
  }

  /**
   * Sign a transaction using Lobstr
   * @param {string} tx - Transaction XDR
   * @param {{ network?: string; networkPassphrase?: string; accountToSign?: string }} [opts] - Options
   * @returns {Promise<string>}
   * @memberof lobstr
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
    if (!(await isConnected())) {
      throw new Error(`Lobstr is not connected`);
    }

    return {
      signedTxXdr: await signTransaction(tx),
      signerAddress: (await this.getAddress()).address!,
    };
  }

  /**
   * Sign an authorization entry using Lobstr
   * @param {string} entryXdr - Authorization entry XDR
   * @param {{ accountToSign?: string }} [opts] - Options
   * @returns {Promise<string>}
   * @memberof lobstr
   * @instance signAuthEntry
   * @throws {Error} Lobstr does not support signing authorization entries
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
    throw new Error("Lobstr does not support signing authorization entries");
  }
}

/**
 * Get address from local storage by key
 * @param {string} key
 * @returns {string | undefined}
 * @memberof lobstr
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
