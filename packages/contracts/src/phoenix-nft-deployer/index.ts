import { Buffer } from "buffer";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export interface CollectionByCreatorResponse {
  collection: string;
  name: string;
}

export type DataKey =
  | { tag: "IsInitialized"; values: void }
  | { tag: "CollectionsWasmHash"; values: void }
  | { tag: "AllCollections"; values: void }
  | { tag: "Creator"; values: readonly [string] };

export const ContractError = {
  0: { message: "WasmHashNotSet" },
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
  ) => Promise<AssembledTransaction<Result<string>>>;

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
  }) => Promise<AssembledTransaction<Array<string>>>;

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
  ) => Promise<AssembledTransaction<Array<CollectionByCreatorResponse>>>;
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
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAVY29sbGVjdGlvbnNfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAVZGVwbG95X25ld19jb2xsZWN0aW9uAAAAAAAABAAAAAAAAAAEc2FsdAAAA+4AAAAgAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABAAAAABAAAD6QAAABMAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAVcXVlcnlfYWxsX2NvbGxlY3Rpb25zAAAAAAAAAAAAAAEAAAPqAAAAEA==",
        "AAAAAAAAAAAAAAAbcXVlcnlfY29sbGVjdGlvbl9ieV9jcmVhdG9yAAAAAAEAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAEAAAPqAAAH0AAAABtDb2xsZWN0aW9uQnlDcmVhdG9yUmVzcG9uc2UA",
        "AAAAAQAAAAAAAAAAAAAAG0NvbGxlY3Rpb25CeUNyZWF0b3JSZXNwb25zZQAAAAACAAAAAAAAAApjb2xsZWN0aW9uAAAAAAATAAAAAAAAAARuYW1lAAAAEA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAADUlzSW5pdGlhbGl6ZWQAAAAAAAAAAAAAAAAAABNDb2xsZWN0aW9uc1dhc21IYXNoAAAAAAAAAAAAAAAADkFsbENvbGxlY3Rpb25zAAAAAAABAAAAAAAAAAdDcmVhdG9yAAAAAAEAAAAT",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAABAAAAAAAAAA5XYXNtSGFzaE5vdFNldAAAAAAAAA==",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    deploy_new_collection: this.txFromJSON<Result<string>>,
    query_all_collections: this.txFromJSON<Array<string>>,
    query_collection_by_creator: this.txFromJSON<
      Array<CollectionByCreatorResponse>
    >,
  };
}
