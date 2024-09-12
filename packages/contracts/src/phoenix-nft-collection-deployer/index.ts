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

export type DataKey =
  | { tag: "IsInitialized"; values: void }
  | { tag: "CollectionsWasmHash"; values: void }
  | { tag: "AllCollections"; values: void }
  | { tag: "Creator"; values: readonly [string] };

export const Errors = {
  0: { message: "" },
  1: { message: "" },
};

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    { collections_wasm_hash }: { collections_wasm_hash: Buffer },
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
   * Construct and simulate a deploy_new_collection transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deploy_new_collection: (
    {
      salt,
      admin,
      name,
      symbol,
    }: { salt: Buffer; admin: string; name: string; symbol: string },
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
   * Construct and simulate a query_all_collections transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_all_collections: (options?: {
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
  }) => Promise<AssembledTransaction<Result<Array<string>>>>;

  /**
   * Construct and simulate a query_collection_by_creator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_collection_by_creator: (
    { creator }: { creator: string },
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
  ) => Promise<AssembledTransaction<Result<Array<string>>>>;
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAVY29sbGVjdGlvbnNfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAVZGVwbG95X25ld19jb2xsZWN0aW9uAAAAAAAABAAAAAAAAAAEc2FsdAAAA+4AAAAgAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAVcXVlcnlfYWxsX2NvbGxlY3Rpb25zAAAAAAAAAAAAAAEAAAPpAAAD6gAAABAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAbcXVlcnlfY29sbGVjdGlvbl9ieV9jcmVhdG9yAAAAAAEAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAEAAAPpAAAD6gAAABAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAADUlzSW5pdGlhbGl6ZWQAAAAAAAAAAAAAAAAAABNDb2xsZWN0aW9uc1dhc21IYXNoAAAAAAAAAAAAAAAADkFsbENvbGxlY3Rpb25zAAAAAAABAAAAAAAAAAdDcmVhdG9yAAAAAAEAAAAT",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAACAAAAAAAAABJOb0NvbGxlY3Rpb25zU2F2ZWQAAAAAAAAAAAAAAAAAF0NyZWF0b3JIYXNOb0NvbGxlY3Rpb25zAAAAAAE=",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    deploy_new_collection: this.txFromJSON<string>,
    query_all_collections: this.txFromJSON<Result<Array<string>>>,
    query_collection_by_creator: this.txFromJSON<Result<Array<string>>>,
  };
}
