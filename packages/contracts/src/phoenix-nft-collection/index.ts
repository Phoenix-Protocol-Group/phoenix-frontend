import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
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

export const ContractError = {
  0: { message: "AccountsIdsLengthMissmatch" },
  1: { message: "CannotApproveSelf" },
  2: { message: "InsufficientBalance" },
  3: { message: "IdsAmountsLengthMismatch" },
  4: { message: "NoUriSet" },
  5: { message: "AdminNotSet" },
  6: { message: "ConfigNotFound" },
  7: { message: "Unauthorized" },
  8: { message: "InvalidAccountIndex" },
  9: { message: "InvalidIdIndex" },
  10: { message: "AlreadyInitialized" },
  11: { message: "InvalidAmountIndex" },
  12: { message: "InvalidId" },
};

export interface OperatorApprovalKey {
  operator: string;
  owner: string;
}

/**
 * Struct that represents the Transfer approval status
 * Description.
 *
 * * `owner` - The `Address` of the owner of the collection.
 * * `operator` - The `Address` of the operator that we will authorize to do transfer/batch
 * transfer
 */
export interface TransferApprovalKey {
  nft_id: u64;
  operator: string;
  owner: string;
}

export type DataKey =
  | { tag: "Admin"; values: void }
  | { tag: "Balance"; values: readonly [string] }
  | { tag: "OperatorApproval"; values: readonly [OperatorApprovalKey] }
  | { tag: "TransferApproval"; values: readonly [TransferApprovalKey] }
  | { tag: "Uri"; values: readonly [string] }
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
    { operator, approved }: { operator: string; approved: boolean },
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
   * Construct and simulate a set_approval_for_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_approval_for_transfer: (
    {
      operator,
      nft_id,
      approved,
    }: { operator: string; nft_id: u64; approved: boolean },
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
  ) => Promise<AssembledTransaction<boolean>>;

  /**
   * Construct and simulate a is_approved_for_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_approved_for_transfer: (
    {
      owner,
      operator,
      nft_id,
    }: { owner: string; operator: string; nft_id: u64 },
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
   * Construct and simulate a safe_transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  safe_transfer_from: (
    {
      sender,
      from,
      to,
      id,
      transfer_amount,
    }: {
      sender: string;
      from: string;
      to: string;
      id: u64;
      transfer_amount: u64;
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a safe_batch_transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  safe_batch_transfer_from: (
    {
      sender,
      from,
      to,
      ids,
      amounts,
    }: {
      sender: string;
      from: string;
      to: string;
      ids: Array<u64>;
      amounts: Array<u64>;
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
    {
      sender,
      from,
      id,
      amount,
    }: { sender: string; from: string; id: u64; amount: u64 },
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
      sender,
      from,
      ids,
      amounts,
    }: { sender: string; from: string; ids: Array<u64>; amounts: Array<u64> },
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
    { sender, uri }: { sender: string; uri: Buffer },
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

  /**
   * Construct and simulate a migrate_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  migrate_admin: (options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a show_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  show_admin: (options?: {
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
  }) => Promise<AssembledTransaction<Result<string>>>;

  /**
   * Construct and simulate a show_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  show_config: (options?: {
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
  }) => Promise<AssembledTransaction<Result<Config>>>;
}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options);
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAKYmFsYW5jZV9vZgAAAAAAAgAAAAAAAAAHYWNjb3VudAAAAAATAAAAAAAAAAJpZAAAAAAABgAAAAEAAAPpAAAABgAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAQYmFsYW5jZV9vZl9iYXRjaAAAAAIAAAAAAAAACGFjY291bnRzAAAD6gAAABMAAAAAAAAAA2lkcwAAAAPqAAAABgAAAAEAAAPpAAAD6gAAAAYAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAUc2V0X2FwcHJvdmFsX2Zvcl9hbGwAAAACAAAAAAAAAAhvcGVyYXRvcgAAABMAAAAAAAAACGFwcHJvdmVkAAAAAQAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAZc2V0X2FwcHJvdmFsX2Zvcl90cmFuc2ZlcgAAAAAAAAMAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAAAAAAGbmZ0X2lkAAAAAAAGAAAAAAAAAAhhcHByb3ZlZAAAAAEAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAATaXNfYXBwcm92ZWRfZm9yX2FsbAAAAAACAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAEAAAAB",
        "AAAAAAAAAAAAAAAYaXNfYXBwcm92ZWRfZm9yX3RyYW5zZmVyAAAAAwAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAhvcGVyYXRvcgAAABMAAAAAAAAABm5mdF9pZAAAAAAABgAAAAEAAAAB",
        "AAAAAAAAAAAAAAASc2FmZV90cmFuc2Zlcl9mcm9tAAAAAAAFAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAACaWQAAAAAAAYAAAAAAAAAD3RyYW5zZmVyX2Ftb3VudAAAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAYc2FmZV9iYXRjaF90cmFuc2Zlcl9mcm9tAAAABQAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAAA2lkcwAAAAPqAAAABgAAAAAAAAAHYW1vdW50cwAAAAPqAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAEbWludAAAAAQAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAZhbW91bnQAAAAAAAYAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAKbWludF9iYXRjaAAAAAAABAAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAADaWRzAAAAA+oAAAAGAAAAAAAAAAdhbW91bnRzAAAAA+oAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAEYnVybgAAAAQAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAZhbW91bnQAAAAAAAYAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAKYnVybl9iYXRjaAAAAAAABAAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAARmcm9tAAAAEwAAAAAAAAADaWRzAAAAA+oAAAAGAAAAAAAAAAdhbW91bnRzAAAAA+oAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAHc2V0X3VyaQAAAAADAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAN1cmkAAAAADgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAASc2V0X2NvbGxlY3Rpb25fdXJpAAAAAAACAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAAA3VyaQAAAAAOAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAADdXJpAAAAAAEAAAAAAAAAAmlkAAAAAAAGAAAAAQAAA+kAAAfQAAAACFVSSVZhbHVlAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAOY29sbGVjdGlvbl91cmkAAAAAAAAAAAABAAAD6QAAB9AAAAAIVVJJVmFsdWUAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAANbWlncmF0ZV9hZG1pbgAAAAAAAAAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAKc2hvd19hZG1pbgAAAAAAAAAAAAEAAAPpAAAAEwAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAALc2hvd19jb25maWcAAAAAAAAAAAEAAAPpAAAH0AAAAAZDb25maWcAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAANAAAAAAAAABpBY2NvdW50c0lkc0xlbmd0aE1pc3NtYXRjaAAAAAAAAAAAAAAAAAARQ2Fubm90QXBwcm92ZVNlbGYAAAAAAAABAAAAAAAAABNJbnN1ZmZpY2llbnRCYWxhbmNlAAAAAAIAAAAAAAAAGElkc0Ftb3VudHNMZW5ndGhNaXNtYXRjaAAAAAMAAAAAAAAACE5vVXJpU2V0AAAABAAAAAAAAAALQWRtaW5Ob3RTZXQAAAAABQAAAAAAAAAOQ29uZmlnTm90Rm91bmQAAAAAAAYAAAAAAAAADFVuYXV0aG9yaXplZAAAAAcAAAAAAAAAE0ludmFsaWRBY2NvdW50SW5kZXgAAAAACAAAAAAAAAAOSW52YWxpZElkSW5kZXgAAAAAAAkAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAACgAAAAAAAAASSW52YWxpZEFtb3VudEluZGV4AAAAAAALAAAAAAAAAAlJbnZhbGlkSWQAAAAAAAAM",
        "AAAAAQAAAAAAAAAAAAAAE09wZXJhdG9yQXBwcm92YWxLZXkAAAAAAgAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAAAAAAVvd25lcgAAAAAAABM=",
        "AAAAAQAAAN1TdHJ1Y3QgdGhhdCByZXByZXNlbnRzIHRoZSBUcmFuc2ZlciBhcHByb3ZhbCBzdGF0dXMKRGVzY3JpcHRpb24uCgoqIGBvd25lcmAgLSBUaGUgYEFkZHJlc3NgIG9mIHRoZSBvd25lciBvZiB0aGUgY29sbGVjdGlvbi4KKiBgb3BlcmF0b3JgIC0gVGhlIGBBZGRyZXNzYCBvZiB0aGUgb3BlcmF0b3IgdGhhdCB3ZSB3aWxsIGF1dGhvcml6ZSB0byBkbyB0cmFuc2Zlci9iYXRjaAp0cmFuc2ZlcgAAAAAAAAAAAAATVHJhbnNmZXJBcHByb3ZhbEtleQAAAAADAAAAAAAAAAZuZnRfaWQAAAAAAAYAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAAAAAAFb3duZXIAAAAAAAAT",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAQAAAAAAAAAHQmFsYW5jZQAAAAABAAAAEwAAAAEAAAAAAAAAEE9wZXJhdG9yQXBwcm92YWwAAAABAAAH0AAAABNPcGVyYXRvckFwcHJvdmFsS2V5AAAAAAEAAAAAAAAAEFRyYW5zZmVyQXBwcm92YWwAAAABAAAH0AAAABNUcmFuc2ZlckFwcHJvdmFsS2V5AAAAAAEAAAAAAAAAA1VyaQAAAAABAAAH0AAAAAVOZnRJZAAAAAAAAAAAAAAAAAAADUNvbGxlY3Rpb25VcmkAAAAAAAAAAAAAAAAAAAZDb25maWcAAAAAAAAAAAAAAAAADUlzSW5pdGlhbGl6ZWQAAAA=",
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
    set_approval_for_transfer: this.txFromJSON<Result<void>>,
    is_approved_for_all: this.txFromJSON<boolean>,
    is_approved_for_transfer: this.txFromJSON<boolean>,
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
    migrate_admin: this.txFromJSON<Result<void>>,
    show_admin: this.txFromJSON<Result<string>>,
    show_config: this.txFromJSON<Result<Config>>,
  };
}
