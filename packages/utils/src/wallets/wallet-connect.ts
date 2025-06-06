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
  private initializingClient?: Promise<void>;

  constructor(public wcParams: IWalletConnectConstructorParams) {
    if (wcParams.sessionId) {
      this.setSession(wcParams.sessionId);
    }

    this.initializingClient = this.initializeClient();
  }

  private async initializeClient() {
    if (this.client) return;

    this.client = (await SignClient.init({
      projectId: this.wcParams.projectId,
      metadata: {
        name: this.wcParams.name,
        url: this.wcParams.url,
        description: this.wcParams.description,
        icons: this.wcParams.icons,
      },
    })) as any;

    this.qrModal = new WalletConnectModal({
      projectId: this.wcParams.projectId,
    });

    console.log("WalletConnect client and modal initialized.");
  }

  private async ensureClientReady() {
    if (!this.client) {
      await this.initializingClient;
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

    const targetSession = await this.getTargetSession();
    return targetSession.accounts[0].publicKey;
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
        if (uri) {
          this.qrModal.openModal({ uri, theme: { zIndex: 99999 } });
        }

        approval()
          .then((session) => {
            this.qrModal.closeModal();
            resolve(session);
          })
          .catch((error) => {
            this.qrModal.closeModal();
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

    const targetSession =
      activeSessions.find(
        (s) =>
          s.id === this.activeSession ||
          s.accounts.some((a) => a.publicKey === params?.publicKey)
      ) || activeSessions[0];

    if (!targetSession) {
      throw new Error("No valid WalletConnect session available");
    }

    return targetSession;
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
