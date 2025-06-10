import albedo from "@albedo-link/intent";
import { Wallet } from "./types";

/**
 * Albedo wallet implementation
 * @implements {Wallet}
 * @class Albedo
 * @export Albedo
 * @see {https://github.com/Creit-Tech/Albedo-Wallet}
 */
export class Albedo implements Wallet {
  /**
   * Check if Albedo is connected
   * @returns {Promise<boolean>}
   * @memberof Albedo
   * @instance isConnected
   */
  async isConnected(): Promise<boolean> {
    return true;
  }

  /**
   * Check if Albedo is allowed
   * @returns {Promise<boolean>}
   * @memberof Albedo
   * @instance isAllowed
   */
  async isAllowed(): Promise<boolean> {
    return true;
  }

  /**
   * Get user info from Albedo
   * @returns {Promise<{ publicKey?: string }>}
   * @memberof Albedo
   * @instance getUserInfo
   */
  async getAddress(): Promise<{ address?: string }> {
    const result = await albedo.publicKey({});
    return { address: result.pubkey };
  }

  /**
   * Sign a transaction using Albedo
   * @param {string} tx - Transaction XDR
   * @param {{ network?: string; networkPassphrase?: string; accountToSign?: string }} [opts] - Options
   * @returns {Promise<string>}
   * @memberof Albedo
   * @instance signTransaction
   */
  async signTransaction(
    tx: string,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ): Promise<{
    signedTxXdr: string;
    signerAddress: string;
  }> {
    return albedo
      .tx({
        xdr: tx,
        pubkey: opts?.accountToSign,
        network: opts?.networkPassphrase,
      })
      .then(({ signed_envelope_xdr }) => ({
        signedTxXdr: signed_envelope_xdr,
        signerAddress: opts?.accountToSign || "",
      }));
  }

  /**
   * Sign an authorization entry using Albedo
   * @param {string} entryXdr - Authorization entry XDR
   * @param {{ accountToSign?: string }} [opts] - Options
   * @returns {Promise<string>}
   * @memberof Albedo
   * @instance signAuthEntry
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
    throw new Error("Albedo does not support signing authorization entries");
  }
}
