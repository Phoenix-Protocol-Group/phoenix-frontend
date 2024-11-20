import { xBullWalletConnect } from "@creit.tech/xbull-wallet-connect";
import { Wallet } from "./types";

/**
 * xBull wallet implementation
 * @implements {Wallet}
 * @class xBull
 * @export xBull
 * @see {https://github.com/Creit-Tech/xBull-Wallet}
 */
export class xBull implements Wallet {
  /**
   * Check if xBull is connected
   * @returns {Promise<boolean>}
   * @memberof xBull
   * @instance isConnected
   */
  async isConnected(): Promise<boolean> {
    const bridge: xBullWalletConnect = new xBullWalletConnect();
    await bridge.connect();
    return true;
  }

  /**
   * Check if xBull is allowed
   * @returns {Promise<boolean>}
   * @memberof xBull
   * @instance isAllowed
   */
  async isAllowed(): Promise<boolean> {
    return true;
  }

  /**
   * Get user info from xBull
   * @returns {Promise<{ publicKey?: string }>}
   * @memberof xBull
   * @instance getUserInfo
   */
  async getUserInfo(): Promise<{ publicKey?: string }> {
    const bridge: xBullWalletConnect = new xBullWalletConnect();
    const publicKey: string = await bridge.connect();
    bridge.closeConnections();
    return { publicKey };
  }

  /**
   * Sign a transaction using xBull
   * @param {string} tx - Transaction XDR
   * @param {{ network?: string; networkPassphrase?: string; accountToSign?: string }} [opts] - Options
   * @returns {Promise<string>}
   * @memberof xBull
   * @instance signTransaction
   */
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

  /**
   * Sign an authorization entry using xBull
   * @param {string} entryXdr - Authorization entry XDR
   * @param {{ accountToSign?: string }} [opts] - Options
   * @returns {Promise<string>}
   * @memberof xBull
   * @instance signAuthEntry
   */
  async signAuthEntry(
    entryXdr: string,
    opts?: { accountToSign?: string }
  ): Promise<string> {
    throw new Error("xBull does not support signing authorization entries");
  }
}
