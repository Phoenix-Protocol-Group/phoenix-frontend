import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
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
    contractId: "0",
  },
} as const;

export const Errors = {
  0: { message: "" },
  1: { message: "" },
  2: { message: "" },
  3: { message: "" },
  4: { message: "" },
  5: { message: "" },
  6: { message: "" },
  7: { message: "" },
  8: { message: "" },
  9: { message: "" },
  10: { message: "" },
  11: { message: "" },
  12: { message: "" },
};

export interface OperatorApprovalKey {
  operator: string;
  owner: string;
}

export type DataKey =
  | { tag: "Balance"; values: readonly [string] }
  | { tag: "OperatorApproval"; values: readonly [OperatorApprovalKey] }
  | { tag: "Uri"; values: readonly [u64] }
  | { tag: "CollectionUri"; values: void }
  | { tag: "Config"; values: void }
  | { tag: "IsInitialized"; values: void };

export interface URIValue {
  uri: Buffer;
}

export interface Config {
  name: string;
  symbol: string;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    { admin, name, symbol }: { admin: string; name: string; symbol: string },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a balance_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance_of: (
    { account, id }: { account: string; id: u64 },
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
  ) => Promise<AssembledTransaction<Result<u64>>>;

  /**
   * Construct and simulate a balance_of_batch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance_of_batch: (
    { accounts, ids }: { accounts: Array<string>; ids: Array<u64> },
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
  ) => Promise<AssembledTransaction<Result<Array<u64>>>>;

  /**
   * Construct and simulate a set_approval_for_all transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_approval_for_all: (
    {
      sender,
      operator,
      approved,
    }: { sender: string; operator: string; approved: boolean },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a is_approved_for_all transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_approved_for_all: (
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
  ) => Promise<AssembledTransaction<Result<boolean>>>;

  /**
   * Construct and simulate a safe_transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  safe_transfer_from: (
    {
      from,
      to,
      id,
      transfer_amount,
    }: { from: string; to: string; id: u64; transfer_amount: u64 },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a safe_batch_transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  safe_batch_transfer_from: (
    {
      from,
      to,
      ids,
      amounts,
    }: { from: string; to: string; ids: Array<u64>; amounts: Array<u64> },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mint: (
    {
      sender,
      to,
      id,
      amount,
    }: { sender: string; to: string; id: u64; amount: u64 },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a mint_batch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mint_batch: (
    {
      sender,
      to,
      ids,
      amounts,
    }: { sender: string; to: string; ids: Array<u64>; amounts: Array<u64> },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn: (
    { from, id, amount }: { from: string; id: u64; amount: u64 },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a burn_batch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn_batch: (
    {
      from,
      ids,
      amounts,
    }: { from: string; ids: Array<u64>; amounts: Array<u64> },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a set_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_uri: (
    { sender, id, uri }: { sender: string; id: u64; uri: Buffer },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a set_collection_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_collection_uri: (
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  uri: (
    { id }: { id: u64 },
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
  ) => Promise<AssembledTransaction<Result<URIValue>>>;

  /**
   * Construct and simulate a collection_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  collection_uri: (options?: {
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
  }) => Promise<AssembledTransaction<Result<URIValue>>>;

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: (
    { new_wasm_hash }: { new_wasm_hash: Buffer },
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
  ) => Promise<AssembledTransaction<Result<void>>>;
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAKYmFsYW5jZV9vZgAAAAAAAgAAAAAAAAAHYWNjb3VudAAAAAATAAAAAAAAAAJpZAAAAAAABgAAAAEAAAPpAAAABgAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAQYmFsYW5jZV9vZl9iYXRjaAAAAAIAAAAAAAAACGFjY291bnRzAAAD6gAAABMAAAAAAAAAA2lkcwAAAAPqAAAABgAAAAEAAAPpAAAD6gAAAAYAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAUc2V0X2FwcHJvdmFsX2Zvcl9hbGwAAAADAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAAAAAAIYXBwcm92ZWQAAAABAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAATaXNfYXBwcm92ZWRfZm9yX2FsbAAAAAACAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAEAAAPpAAAAAQAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAASc2FmZV90cmFuc2Zlcl9mcm9tAAAAAAAEAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAA90cmFuc2Zlcl9hbW91bnQAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAYc2FmZV9iYXRjaF90cmFuc2Zlcl9mcm9tAAAABAAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAANpZHMAAAAD6gAAAAYAAAAAAAAAB2Ftb3VudHMAAAAD6gAAAAYAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAEbWludAAAAAQAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAZhbW91bnQAAAAAAAYAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAKbWludF9iYXRjaAAAAAAABAAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAADaWRzAAAAA+oAAAAGAAAAAAAAAAdhbW91bnRzAAAAA+oAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAEYnVybgAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAGYW1vdW50AAAAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAKYnVybl9iYXRjaAAAAAAAAwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAA2lkcwAAAAPqAAAABgAAAAAAAAAHYW1vdW50cwAAAAPqAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAHc2V0X3VyaQAAAAADAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAN1cmkAAAAADgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAASc2V0X2NvbGxlY3Rpb25fdXJpAAAAAAABAAAAAAAAAAN1cmkAAAAADgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAADdXJpAAAAAAEAAAAAAAAAAmlkAAAAAAAGAAAAAQAAA+kAAAfQAAAACFVSSVZhbHVlAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAOY29sbGVjdGlvbl91cmkAAAAAAAAAAAABAAAD6QAAB9AAAAAIVVJJVmFsdWUAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAANAAAAAAAAABpBY2NvdW50c0lkc0xlbmd0aE1pc3NtYXRjaAAAAAAAAAAAAAAAAAARQ2Fubm90QXBwcm92ZVNlbGYAAAAAAAABAAAAAAAAABNJbnN1ZmZpY2llbnRCYWxhbmNlAAAAAAIAAAAAAAAAGElkc0Ftb3VudHNMZW5ndGhNaXNtYXRjaAAAAAMAAAAAAAAACE5vVXJpU2V0AAAABAAAAAAAAAALQWRtaW5Ob3RTZXQAAAAABQAAAAAAAAAOQ29uZmlnTm90Rm91bmQAAAAAAAYAAAAAAAAADFVuYXV0aG9yaXplZAAAAAcAAAAAAAAAE0ludmFsaWRBY2NvdW50SW5kZXgAAAAACAAAAAAAAAAOSW52YWxpZElkSW5kZXgAAAAAAAkAAAAAAAAADU5mdElkTm90Rm91bmQAAAAAAAAKAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAsAAAAAAAAAEUVudHJ5RG9lc05vdEV4aXN0AAAAAAAADA==",
        "AAAAAQAAAAAAAAAAAAAAE09wZXJhdG9yQXBwcm92YWxLZXkAAAAAAgAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAAAAAAVvd25lcgAAAAAAABM=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABgAAAAEAAAAAAAAAB0JhbGFuY2UAAAAAAQAAABMAAAABAAAAAAAAABBPcGVyYXRvckFwcHJvdmFsAAAAAQAAB9AAAAATT3BlcmF0b3JBcHByb3ZhbEtleQAAAAABAAAAAAAAAANVcmkAAAAAAQAAB9AAAAAFTmZ0SWQAAAAAAAAAAAAAAAAAAA1Db2xsZWN0aW9uVXJpAAAAAAAAAAAAAAAAAAAGQ29uZmlnAAAAAAAAAAAAAAAAAA1Jc0luaXRpYWxpemVkAAAA",
        "AAAAAQAAAAAAAAAAAAAACFVSSVZhbHVlAAAAAQAAAAAAAAADdXJpAAAAAA4=",
        "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAAAgAAAAAAAAAEbmFtZQAAABAAAAAAAAAABnN5bWJvbAAAAAAAEA==",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<Result<void>>,
    balance_of: this.txFromJSON<Result<u64>>,
    balance_of_batch: this.txFromJSON<Result<Array<u64>>>,
    set_approval_for_all: this.txFromJSON<Result<void>>,
    is_approved_for_all: this.txFromJSON<Result<boolean>>,
    safe_transfer_from: this.txFromJSON<Result<void>>,
    safe_batch_transfer_from: this.txFromJSON<Result<void>>,
    mint: this.txFromJSON<Result<void>>,
    mint_batch: this.txFromJSON<Result<void>>,
    burn: this.txFromJSON<Result<void>>,
    burn_batch: this.txFromJSON<Result<void>>,
    set_uri: this.txFromJSON<Result<void>>,
    set_collection_uri: this.txFromJSON<Result<void>>,
    uri: this.txFromJSON<Result<URIValue>>,
    collection_uri: this.txFromJSON<Result<URIValue>>,
    upgrade: this.txFromJSON<Result<void>>,
  };
}
