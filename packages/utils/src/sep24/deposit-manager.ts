import { Anchor } from "@phoenix-protocol/types";
import { TransferServer, openTransferServer } from "./transfer-server";
import { TransferServerInfo, fetchTransferInfos } from "./info";
import { Asset, Networks } from "stellar-sdk";
import { sep10AuthSend, sep10AuthSign, sep10AuthStart } from "../sep10";
import { NETWORK_PASSPHRASE } from "../constants";
import { Deposit } from "./deposit";

/**
 * DepositManager class
 * Usage:
 *  const transferServer = await this.openTransferServer();
 *  const transferInfos = await this.fetchTransferInfos(transferServer);
 *  const { depositableAssets } = transferInfos;
 *  const token = await this.startSep10Auth(transferServer);
 *  return await this.handleDeposit(transferServer, depositableAssets, token);
 */
export class DepositManager {
  private anchor: Anchor;
  private walletAddress: string;

  constructor(anchor: Anchor, walletAddress: string) {
    this.anchor = anchor;
    this.walletAddress = walletAddress;
  }

  // Method to open the transfer server
  async openTransferServer(): Promise<TransferServer> {
    console.log("Opening transfer server", this.anchor);
    try {
      return await openTransferServer(this.anchor.domain, Networks.TESTNET, {
        lang: "en",
        walletName: "Demo wallet",
      });
    } catch (error) {
      console.error("Error opening transfer server:", error);
      throw error;
    }
  }

  // Method to fetch transfer information
  async fetchTransferInfos(
    transferServer: TransferServer
  ): Promise<TransferServerInfo> {
    try {
      return await fetchTransferInfos(transferServer);
    } catch (error) {
      console.error("Error fetching transfer info:", error);
      throw error;
    }
  }

  // Method to start SEP-10 Authentication
  async startSep10Auth(transferServer: TransferServer): Promise<string> {
    try {
      const challengeTransaction = await sep10AuthStart({
        authEndpoint: transferServer.auth,
        serverSigningKey: transferServer.signingKey,
        publicKey: this.walletAddress,
        homeDomain: transferServer.domain,
        clientDomain:
          "phoenix-frontend-core-9pwvyuc1w-phoenix-protocol.vercel.app",
      });

      const signedChallengeTransaction = await sep10AuthSign({
        networkPassphrase: NETWORK_PASSPHRASE,
        challengeTransaction,
        wallet: (await import("@stellar/freighter-api")).default,
      });

      return await sep10AuthSend({
        authEndpoint: transferServer.auth,
        signedChallengeTransaction,
      });
    } catch (error) {
      console.error("Error in SEP-10 Authentication:", error);
      throw error;
    }
  }

  // Method to handle the deposit process
  async handleDeposit(
    transferServer: TransferServer,
    depositableAssets: Asset[],
    token: string
  ): Promise<Window | null> {
    try {
      const deposit = Deposit(
        transferServer,
        depositableAssets[1],
        "GAFNG7UOA2FDD745PVHFYHSZEIMJ6NYY2BY7ONJ74MRZGHSU2NEHBZ74"
      );

      const instructions = await deposit.interactive(token);

      //@ts-ignore
      const url = new URL(instructions.data.url);
      return open(url.toString(), "popup", "width=500,height=800");
    } catch (error) {
      console.error("Error handling deposit:", error);
      throw error;
    }
  }
}
