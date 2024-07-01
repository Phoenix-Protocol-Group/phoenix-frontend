import { Buffer } from "buffer";
import type { i128, Option, u32, u64 } from "@stellar/stellar-sdk/contract";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";

export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}
export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDTFIHRDY7LRUN4BSD7TQOF44NQZPWKQG3JKFVAI6YDO6XAZMEPCJYUJ",
  },
} as const;

export interface ApprovalAll {
  operator: string;
  owner: string;
}

export type ApprovalKey =
  | { tag: "All"; values: readonly [ApprovalAll] }
  | { tag: "ID"; values: readonly [i128] };

export type DataKey =
  | { tag: "Balance"; values: readonly [string] }
  | { tag: "Nonce"; values: readonly [string] }
  | { tag: "Minted"; values: readonly [string] }
  | { tag: "Admin"; values: void }
  | { tag: "Name"; values: void }
  | { tag: "Symbol"; values: void }
  | { tag: "URI"; values: readonly [i128] }
  | { tag: "Approval"; values: readonly [ApprovalKey] }
  | { tag: "Owner"; values: readonly [i128] }
  | { tag: "Supply"; values: void };

export type ContentType =
  | { tag: "Image"; values: void }
  | { tag: "Gif"; values: void }
  | { tag: "Video"; values: void }
  | { tag: "MP3"; values: void }
  | { tag: "Ticket"; values: void }
  | { tag: "Avatar"; values: readonly [AvatarAttributes] };

export interface Trait {
  score: u64;
  trait_type: string;
  value: string;
}

export interface AvatarAttributes {
  background: Trait;
  clothes: Trait;
  earring: Option<Trait>;
  eyes: Trait;
  fur: Trait;
  hat: Trait;
  mouth: Trait;
}

export interface NFT {
  content_type: ContentType;
  creator: string;
  id: u64;
  owner: string;
  royalties: u32;
  traits: Array<Trait>;
  uri: string;
}

export const Errors = {};

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    {
      admin,
      name,
      symbol,
      royalties,
      content_type,
      traits,
    }: {
      admin: string;
      name: Buffer;
      symbol: Buffer;
      royalties: u32;
      content_type: ContentType;
      traits: Option<Array<Trait>>;
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a nonce transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  nonce: (
    { id }: { id: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  admin: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admin: (
    {
      admin,
      nonce,
      new_admin,
    }: { admin: string; nonce: i128; new_admin: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  name: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Buffer>>;

  /**
   * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  symbol: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Buffer>>;

  /**
   * Construct and simulate a token_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  token_uri: (
    { id }: { id: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Buffer>>;

  /**
   * Construct and simulate a appr transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  appr: (
    {
      owner,
      nonce,
      operator,
      id,
    }: { owner: string; nonce: i128; operator: string; id: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a appr_all transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  appr_all: (
    {
      owner,
      nonce,
      operator,
      approved,
    }: { owner: string; nonce: i128; operator: string; approved: boolean },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a get_appr transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_appr: (
    { id }: { id: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a is_appr transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_appr: (
    { owner, operator }: { owner: string; operator: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<boolean>>;

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance: (
    { owner }: { owner: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  owner: (
    { id }: { id: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer: (
    {
      from,
      nonce,
      to,
      id,
    }: { from: string; nonce: i128; to: string; id: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_from: (
    {
      spender,
      from,
      to,
      nonce,
      id,
    }: { spender: string; from: string; to: string; nonce: i128; id: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mint: (
    {
      admin,
      nonce,
      to,
      id,
      uri,
    }: { admin: string; nonce: i128; to: string; id: i128; uri: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a mint_next transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mint_next: (
    { uri }: { uri: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn: (
    { admin, nonce, id }: { admin: string; nonce: i128; id: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;
}

export class Client extends ContractClient {
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    nonce: this.txFromJSON<i128>,
    admin: this.txFromJSON<string>,
    set_admin: this.txFromJSON<null>,
    name: this.txFromJSON<Buffer>,
    symbol: this.txFromJSON<Buffer>,
    token_uri: this.txFromJSON<Buffer>,
    appr: this.txFromJSON<null>,
    appr_all: this.txFromJSON<null>,
    get_appr: this.txFromJSON<string>,
    is_appr: this.txFromJSON<boolean>,
    balance: this.txFromJSON<i128>,
    owner: this.txFromJSON<string>,
    transfer: this.txFromJSON<null>,
    transfer_from: this.txFromJSON<null>,
    mint: this.txFromJSON<null>,
    mint_next: this.txFromJSON<null>,
    burn: this.txFromJSON<null>,
  };

  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAARuYW1lAAAADgAAAAAAAAAGc3ltYm9sAAAAAAAOAAAAAAAAAAlyb3lhbHRpZXMAAAAAAAAEAAAAAAAAAAxjb250ZW50X3R5cGUAAAfQAAAAC0NvbnRlbnRUeXBlAAAAAAAAAAAGdHJhaXRzAAAAAAPoAAAD6gAAB9AAAAAFVHJhaXQAAAAAAAAA",
        "AAAAAAAAAAAAAAAFbm9uY2UAAAAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAFYWRtaW4AAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAVub25jZQAAAAAAAAsAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAADg==",
        "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAAA4=",
        "AAAAAAAAAAAAAAAJdG9rZW5fdXJpAAAAAAAAAQAAAAAAAAACaWQAAAAAAAsAAAABAAAADg==",
        "AAAAAAAAAAAAAAAEYXBwcgAAAAQAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAFbm9uY2UAAAAAAAALAAAAAAAAAAhvcGVyYXRvcgAAABMAAAAAAAAAAmlkAAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAIYXBwcl9hbGwAAAAEAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAABW5vbmNlAAAAAAAACwAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAAAAAAhhcHByb3ZlZAAAAAEAAAAA",
        "AAAAAAAAAAAAAAAIZ2V0X2FwcHIAAAABAAAAAAAAAAJpZAAAAAAACwAAAAEAAAAT",
        "AAAAAAAAAAAAAAAHaXNfYXBwcgAAAAACAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAEAAAAB",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAVvd25lcgAAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAFb3duZXIAAAAAAAABAAAAAAAAAAJpZAAAAAAACwAAAAEAAAAT",
        "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAAEAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAFbm9uY2UAAAAAAAALAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAACaWQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAUAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAVub25jZQAAAAAAAAsAAAAAAAAAAmlkAAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAEbWludAAAAAUAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAFbm9uY2UAAAAAAAALAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAACaWQAAAAAAAsAAAAAAAAAA3VyaQAAAAAOAAAAAA==",
        "AAAAAAAAAAAAAAAJbWludF9uZXh0AAAAAAAAAQAAAAAAAAADdXJpAAAAAA4AAAAA",
        "AAAAAAAAAAAAAAAEYnVybgAAAAMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAFbm9uY2UAAAAAAAALAAAAAAAAAAJpZAAAAAAACwAAAAA=",
        "AAAAAQAAAAAAAAAAAAAAC0FwcHJvdmFsQWxsAAAAAAIAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAAAAAAFb3duZXIAAAAAAAAT",
        "AAAAAgAAAAAAAAAAAAAAC0FwcHJvdmFsS2V5AAAAAAIAAAABAAAAAAAAAANBbGwAAAAAAQAAB9AAAAALQXBwcm92YWxBbGwAAAAAAQAAAAAAAAACSUQAAAAAAAEAAAAL",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACgAAAAEAAAAAAAAAB0JhbGFuY2UAAAAAAQAAABMAAAABAAAAAAAAAAVOb25jZQAAAAAAAAEAAAATAAAAAQAAAAAAAAAGTWludGVkAAAAAAABAAAAEwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAETmFtZQAAAAAAAAAAAAAABlN5bWJvbAAAAAAAAQAAAAAAAAADVVJJAAAAAAEAAAALAAAAAQAAAAAAAAAIQXBwcm92YWwAAAABAAAH0AAAAAtBcHByb3ZhbEtleQAAAAABAAAAAAAAAAVPd25lcgAAAAAAAAEAAAALAAAAAAAAAAAAAAAGU3VwcGx5AAA=",
        "AAAAAgAAAAAAAAAAAAAAC0NvbnRlbnRUeXBlAAAAAAYAAAAAAAAAAAAAAAVJbWFnZQAAAAAAAAAAAAAAAAAAA0dpZgAAAAAAAAAAAAAAAAVWaWRlbwAAAAAAAAAAAAAAAAAAA01QMwAAAAAAAAAAAAAAAAZUaWNrZXQAAAAAAAEAAAAAAAAABkF2YXRhcgAAAAAAAQAAB9AAAAAQQXZhdGFyQXR0cmlidXRlcw==",
        "AAAAAQAAAAAAAAAAAAAABVRyYWl0AAAAAAAAAwAAAAAAAAAFc2NvcmUAAAAAAAAGAAAAAAAAAAp0cmFpdF90eXBlAAAAAAARAAAAAAAAAAV2YWx1ZQAAAAAAABE=",
        "AAAAAQAAAAAAAAAAAAAAEEF2YXRhckF0dHJpYnV0ZXMAAAAHAAAAAAAAAApiYWNrZ3JvdW5kAAAAAAfQAAAABVRyYWl0AAAAAAAAAAAAAAdjbG90aGVzAAAAB9AAAAAFVHJhaXQAAAAAAAAAAAAAB2VhcnJpbmcAAAAD6AAAB9AAAAAFVHJhaXQAAAAAAAAAAAAABGV5ZXMAAAfQAAAABVRyYWl0AAAAAAAAAAAAAANmdXIAAAAH0AAAAAVUcmFpdAAAAAAAAAAAAAADaGF0AAAAB9AAAAAFVHJhaXQAAAAAAAAAAAAABW1vdXRoAAAAAAAH0AAAAAVUcmFpdAAAAA==",
        "AAAAAQAAAAAAAAAAAAAAA05GVAAAAAAHAAAAAAAAAAxjb250ZW50X3R5cGUAAAfQAAAAC0NvbnRlbnRUeXBlAAAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAlyb3lhbHRpZXMAAAAAAAAEAAAAAAAAAAZ0cmFpdHMAAAAAA+oAAAfQAAAABVRyYWl0AAAAAAAAAAAAAAN1cmkAAAAAEQ==",
      ]),
      options
    );
  }
}
