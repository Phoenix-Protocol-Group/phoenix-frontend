import { WalletConnectModal } from "@walletconnect/modal";
import { SignClient } from "@walletconnect/sign-client";
import { ISignClient } from "@walletconnect/types/dist/types/sign-client/client";
import { SessionTypes } from "@walletconnect/types/dist/types/sign-client/session";
import { Wallet } from "./types";

const parseWalletConnectSession = (
  session: SessionTypes.Struct
): IParsedWalletConnectSession => {
  const accounts = session.namespaces.stellar.accounts.map(
    (account: string) => ({
      network: account.split(":")[1] as "pubnet" | "testnet",
      publicKey: account.split(":")[2],
    })
  );

  return {
    id: session.topic,
    name: session.peer.metadata.name,
    description: session.peer.metadata.description,
    url: session.peer.metadata.url,
    icons: session.peer.metadata.icons[0],
    accounts,
  };
};

export interface IParsedWalletConnectSession {
  id: string;
  name: string;
  description: string;
  url: string;
  icons: string;
  accounts: Array<{
    network: "pubnet" | "testnet";
    publicKey: string;
  }>;
}

export const WALLET_CONNECT_ID = "wallet_connect";

export class WalletConnect implements Wallet {
  private client?: ISignClient & {
    on: (event: string, cb: (data: { topic: string }) => void) => void;
  };
  private activeSession?: string;
  private qrModal!: WalletConnectModal;
  public initializingClient?: Promise<void>;
  private connectionPromise?: Promise<IParsedWalletConnectSession>;

  constructor(public wcParams: IWalletConnectConstructorParams) {
    if (wcParams.sessionId) {
      this.setSession(wcParams.sessionId);
    }

    this.initializingClient = this.initializeClient();
  }

  private async initializeClient() {
    if (this.client) return;

    // Prevent multiple initializations
    try {
      this.client = (await SignClient.init({
        projectId: this.wcParams.projectId,
        metadata: {
          name: this.wcParams.name,
          url: this.wcParams.url,
          description: this.wcParams.description,
          icons: this.wcParams.icons,
        },
        // Add storage options to prevent init warnings
        logger: "error", // Reduce log noise
      })) as any;

      this.qrModal = new WalletConnectModal({
        projectId: this.wcParams.projectId,
        themeMode: "dark",
        themeVariables: {
          "--wcm-z-index": "99999",
        },
        // Configure mobile wallet support
        mobileWallets: [
          {
            id: "lobstr",
            name: "Lobstr",
            links: {
              native: "lobstr://",
              universal: "https://lobstr.co",
            },
          },
          {
            id: "freighter",
            name: "Freighter",
            links: {
              native: "freighter://",
              universal: "https://freighter.app",
            },
          },
        ],
      });

      // Set up session event listeners
      if (this.client) {
        this.client.on("session_delete", (event) => {
          console.log("Session deleted:", event.topic);
          if (this.activeSession === event.topic) {
            this.activeSession = undefined;
          }
        });
      }

      // Clean up expired sessions on initialization
      await this.cleanupExpiredSessions();

      console.log("WalletConnect client and modal initialized.");
    } catch (error) {
      console.error("Failed to initialize WalletConnect client:", error);
      throw error;
    }
  }

  private async cleanupExpiredSessions() {
    try {
      if (!this.client) return;

      const sessions = await this.getSessions();
      const now = Date.now();

      for (const session of sessions) {
        try {
          // Check if session exists in client
          const clientSession = this.client.session.get(session.id);
          if (!clientSession) {
            console.log(
              `Session ${session.id} not found in client, skipping cleanup`
            );
            continue;
          }

          // Sessions typically expire after 7 days, but we'll check if they're still valid
          // by attempting to get the session from the client
        } catch (sessionError) {
          console.log(`Cleaning up invalid session: ${session.id}`);
          try {
            await this.closeSession(session.id, "Invalid session");
          } catch (closeError) {
            console.log(
              `Failed to close invalid session ${session.id}:`,
              closeError
            );
          }
        }
      }
    } catch (error) {
      console.log("Error cleaning up expired sessions:", error);
    }
  }

  private async ensureClientReady() {
    if (!this.client) {
      await this.initializingClient;
    }
    if (!this.client) {
      throw new Error("Failed to initialize WalletConnect client");
    }
  }

  async isAllowed(): Promise<boolean> {
    return true;
  }

  async isConnected(): Promise<boolean> {
    await this.ensureClientReady();
    return !!this.client;
  }

  public async isReady(): Promise<boolean> {
    await this.ensureClientReady();
    return !!this.client;
  }

  async getAddress(): Promise<{ address?: string }> {
    return { address: await this.getPublicKey() };
  }

  async getPublicKey(): Promise<string> {
    await this.ensureClientReady();

    try {
      const targetSession = await this.getTargetSession();
      return targetSession.accounts[0].publicKey;
    } catch (error) {
      // No valid session found, need to connect
      throw new Error(
        "No active WalletConnect session. Call connectWalletConnect() first."
      );
    }
  }

  async ensureConnection(): Promise<IParsedWalletConnectSession> {
    await this.ensureClientReady();

    // Check if we have a valid existing session
    try {
      const targetSession = await this.getTargetSession();
      return targetSession;
    } catch (error) {
      // No valid session, create a new one
      return await this.connectWalletConnect();
    }
  }

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
    await this.ensureClientReady();

    const targetSession = await this.getTargetSession({
      publicKey: await this.getPublicKey(),
    });

    const updatedXdr = await this.client!.request({
      topic: targetSession.id,
      chainId: "stellar:pubnet",
      request: {
        method: this.wcParams.method,
        params: { xdr: tx },
      },
    });

    return {
      signedTxXdr: updatedXdr as string,
      signerAddress: (await this.getAddress()).address!,
    };
  }

  async signBlob(params: {
    blob: string;
    publicKey?: string;
  }): Promise<{ result: string }> {
    throw new Error("xBull does not support signing random blobs");
  }

  public setSession(sessionId: string) {
    this.activeSession = sessionId;
  }

  public async onSessionDeleted(cb: (sessionId: string) => void) {
    await this.ensureClientReady();
    this.client!.on("session_delete", (data) => {
      cb(data.topic);
    });
  }

  public async connectWalletConnect(): Promise<IParsedWalletConnectSession> {
    await this.ensureClientReady();

    // Prevent multiple simultaneous connection attempts
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.performConnection();

    try {
      const session = await this.connectionPromise;
      return session;
    } finally {
      this.connectionPromise = undefined;
    }
  }

  private async performConnection(): Promise<IParsedWalletConnectSession> {
    const { uri, approval } = await this.client!.connect({
      requiredNamespaces: {
        stellar: {
          methods: [this.wcParams.method],
          chains: ["stellar:pubnet"],
          events: [],
        },
      },
    });

    const session: IParsedWalletConnectSession =
      await new Promise<SessionTypes.Struct>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          this.qrModal.closeModal();
          reject(
            new Error(
              "Connection timeout - wallet did not respond within 5 minutes"
            )
          );
        }, 300000); // 5 minute timeout

        if (uri) {
          // Check if we're on mobile
          const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            );

          this.qrModal.openModal({
            uri,
            theme: { zIndex: 99999 },
            // Enable mobile linking
            mobileLinks: [
              "lobstr",
              "freighter",
              "rainbow",
              "metamask",
              "trust",
              "argentx",
              "zerion",
              "phantom",
            ],
            desktopLinks: ["ledger", "walletconnect"],
          });

          // For mobile, try to open the deep link directly after a short delay
          if (isMobile) {
            setTimeout(() => {
              // Try to trigger deep link for common Stellar wallets
              const deepLinks = [
                `lobstr://wc?uri=${encodeURIComponent(uri)}`,
                `freighter://wc?uri=${encodeURIComponent(uri)}`,
              ];

              // Try each deep link (browser will only open the one that's installed)
              deepLinks.forEach((link) => {
                try {
                  window.location.href = link;
                } catch (e) {
                  console.log("Deep link failed:", link);
                }
              });
            }, 1000);
          }
        }

        approval()
          .then((session) => {
            clearTimeout(timeoutId);
            this.qrModal.closeModal();
            console.log("WalletConnect session established:", session.topic);
            resolve(session);
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            this.qrModal.closeModal();
            console.error("WalletConnect connection failed:", error);
            reject(error);
          });
      }).then(parseWalletConnectSession);

    this.setSession(session.id);
    return session;
  }

  public async closeSession(sessionId: string, reason?: string): Promise<void> {
    await this.ensureClientReady();

    await this.client!.disconnect({
      topic: sessionId,
      reason: {
        message: reason || "Session closed",
        code: -1,
      },
    });
  }

  public async getSessions(): Promise<IParsedWalletConnectSession[]> {
    await this.ensureClientReady();
    return this.client!.session.values.map(parseWalletConnectSession);
  }

  async signAuthEntry(
    entryXdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
    }
  ): Promise<{
    signedAuthEntry: Buffer | null;
    signerAddress: string;
  }> {
    throw new Error(
      "Wallet Connect does not support signing authorization entries"
    );
  }

  private async getTargetSession(params?: { publicKey?: string }) {
    await this.ensureClientReady();
    const activeSessions = await this.getSessions();

    // Filter out expired or invalid sessions
    const validSessions = activeSessions.filter((session) => {
      try {
        return this.client?.session.get(session.id) !== undefined;
      } catch {
        return false;
      }
    });

    const targetSession =
      validSessions.find(
        (s) =>
          s.id === this.activeSession ||
          s.accounts.some((a) => a.publicKey === params?.publicKey)
      ) || validSessions[0];

    if (!targetSession) {
      throw new Error("No valid WalletConnect session available");
    }

    return targetSession;
  }

  // Method to check for existing sessions without triggering connection
  async hasValidSession(): Promise<boolean> {
    await this.ensureClientReady();

    try {
      const sessions = await this.getSessions();
      return (
        sessions.length > 0 &&
        sessions.some((session) => {
          try {
            return this.client?.session.get(session.id) !== undefined;
          } catch {
            return false;
          }
        })
      );
    } catch {
      return false;
    }
  }

  // Method to restore a session by ID
  async restoreSession(sessionId: string): Promise<boolean> {
    await this.ensureClientReady();

    try {
      const session = this.client?.session.get(sessionId);
      if (session) {
        this.setSession(sessionId);
        return true;
      }
    } catch (error) {
      console.log("Failed to restore session:", sessionId, error);
    }

    return false;
  }

  // Method to disconnect all sessions and reset state
  async disconnect(): Promise<void> {
    await this.ensureClientReady();

    try {
      const sessions = await this.getSessions();

      // Close all active sessions
      for (const session of sessions) {
        try {
          await this.closeSession(session.id, "User disconnected");
        } catch (error) {
          console.log("Failed to close session:", session.id, error);
        }
      }

      // Reset active session
      this.activeSession = undefined;

      // Close modal if open
      this.qrModal.closeModal();

      console.log("WalletConnect disconnected successfully");
    } catch (error) {
      console.error("Error during WalletConnect disconnect:", error);
    }
  }
}

export interface IWalletConnectConstructorParams {
  projectId: string;
  name: string;
  description: string;
  url: string;
  icons: string[];
  method: WalletConnectAllowedMethods;
  network: string;
  sessionId?: string;
}

export enum WalletConnectTargetChain {
  PUBLIC = "stellar:pubnet",
  TESTNET = "stellar:testnet",
}

export enum WalletConnectAllowedMethods {
  SIGN = "stellar_signXDR",
  SIGN_AND_SUBMIT = "stellar_signAndSubmitXDR",
}
