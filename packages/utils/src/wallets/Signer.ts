/**
 * This class is getting the sign method of the connected wallet and returns the signature function
 * to pass it to the contract call
 */

import { scValToJs } from "../convert";
import { lobstr } from "./lobstr";
import { Wallet } from "./types";
import { xBull } from "./xbull";

export default class Signer {
  walletType: string;
  wallet: Wallet | undefined;

  /**
   * Fetch the connected wallet and store it in the class
   */
  constructor() {
    this.walletType = this.getWalletType();
  }

  /**
   *
   * @returns the wallet type from the local storage
   */
  getWalletType() {
    const appStorageValue = localStorage?.getItem("app-storage");
    if (appStorageValue !== null) {
      try {
        const parsedValue = JSON.parse(appStorageValue);
        const walletType = parsedValue?.state?.wallet?.walletType;
        return walletType;
      } catch (error) {
        console.error("Error parsing app-storage value:", error);
      }
    } else {
      console.error("app-storage key not found in localStorage.");
    }
    return "";
  }

  /**
   * Fetch the wallet based on the wallet type
   */
  async getWallet() {
    if (this.walletType === "freighter") {
      const freighter = await import("@stellar/freighter-api");
      this.wallet = freighter;
    } else if (this.walletType === "xbull") {
      this.wallet = new xBull();
    } else if (this.walletType === "lobstr") {
      this.wallet = new lobstr();
    } else {
      console.error("Wallet type not supported.");
    }
  }

  /**
   *
   * @param message
   * @returns
   */
  async sign(message: string) {
    if (this.wallet === undefined) {
      await this.getWallet();
    }
    if (this.wallet === undefined) {
      throw new Error("Wallet not found or not connected.");
    }
    return this.wallet.signTransaction(message);
  }
}
