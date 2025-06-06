import { lobstr } from "./lobstr";
import { Wallet } from "./types";
import { xBull } from "./xbull";
import { hana } from "./hana";
import {
  WalletConnect as WalletClient,
  WalletConnectAllowedMethods,
} from "./wallet-connect";
import { NETWORK_PASSPHRASE } from "../constants";
let walletConnectInstance: WalletClient | undefined;
const initializeWalletConnect = async () => {
  if (walletConnectInstance) return walletConnectInstance;

  walletConnectInstance = new WalletClient({
    projectId: "1cca500fbafdda38a70f8bf3bcb91b15",
    name: "Phoenix DeFi Hub",
    description: "Serving only the tastiest DeFi",
    url: "https://app.phoenix-hub.io",
    icons: ["https://app.phoenix-hub.io/logoIcon.png"],
    method: WalletConnectAllowedMethods.SIGN_AND_SUBMIT,
    network: NETWORK_PASSPHRASE,
  });

  console.log("Initialized Wallet Connect");

  // If already connected (restored session), skip waiting
  if (await walletConnectInstance.isConnected()) {
    console.log("Restored WalletConnect session");
    return walletConnectInstance;
  }

  // Otherwise, wait for connection
  while (!(await walletConnectInstance.isConnected())) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("New WalletConnect session established");
  return walletConnectInstance;
};
/**
 * Signer class
 * @class Signer
 * @export Signer
 * @description This class is getting the sign method of the connected wallet and returns the signature function
 * to pass it to the contract call
 *
 * @example
 * const signer = new Signer();
 * const signature = await signer.sign("message");
 */
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
        console.log("Error parsing app-storage value:", error);
      }
    } else {
      console.log("app-storage key not found in localStorage.");
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
    } else if (this.walletType === "hana") {
      this.wallet = new hana();
    } else if (this.walletType === "wallet-connect") {
      const wc = await initializeWalletConnect();

      this.wallet = {
        signTransaction: async (tx: string) => {
          return wc.signTransaction(tx); // or wc.signAndSubmit(tx), depending on the WalletConnectAllowedMethods
        },
        getAddress: async () => {
          if (typeof wc.getAddress === "function") {
            return wc.getAddress();
          }
          throw new Error("getAddress not implemented for WalletConnect");
        },
        signAuthEntry: async (entry: string) => {
          if (typeof wc.signAuthEntry === "function") {
            return wc.signAuthEntry(entry);
          }
          throw new Error("signAuthEntry not implemented for WalletConnect");
        },
      };
    } else {
      console.log("Wallet type not supported.");
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
