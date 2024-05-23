import { ContractSpec, Address } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import {
  AssembledTransaction,
  ContractClient,
  ContractClientOptions,
} from "@stellar/stellar-sdk/lib/contract_client/index.js";
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
} from "@stellar/stellar-sdk/lib/contract_client";
import { Result } from "@stellar/stellar-sdk/lib/rust_types/index.js";
export * from "@stellar/stellar-sdk";
export * from "@stellar/stellar-sdk/lib/contract_client/index.js";
export * from "@stellar/stellar-sdk/lib/rust_types/index.js";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  unknown: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    contractId: "CCLZRD4E72T7JCZCN3P7KNPYNXFYKQCL64ECLX7WP5GNVYPYJGU2IO2G",
  },
} as const;

export const Errors = {
  1: { message: "" },
  2: { message: "" },
  3: { message: "" },
  4: { message: "" },
};

export interface Swap {
  ask_asset: string;
  ask_asset_min_amount: Option<i128>;
  offer_asset: string;
}

export interface Pair {
  token_a: string;
  token_b: string;
}

export type DataKey =
  | { tag: "PairKey"; values: readonly [Pair] }
  | { tag: "FactoryKey"; values: void }
  | { tag: "Admin"; values: void }
  | { tag: "Initialized"; values: void };

export interface Asset {
  /**
   * Address of the asset
   */
  address: string;
  /**
   * The total amount of those tokens in the pool
   */
  amount: i128;
}

/**
 * This struct is used to return a query result with the total amount of LP tokens and assets in a specific pool.
 */
export interface PoolResponse {
  /**
   * The asset A in the pool together with asset amounts
   */
  asset_a: Asset;
  /**
   * The asset B in the pool together with asset amounts
   */
  asset_b: Asset;
  /**
   * The total amount of LP tokens currently issued
   */
  asset_lp_share: Asset;
}

export interface SimulateSwapResponse {
  ask_amount: i128;
  /**
   * tuple of ask_asset denom and commission amount for the swap
   */
  commission_amounts: Array<readonly [string, i128]>;
  spread_amount: Array<i128>;
}

export interface SimulateReverseSwapResponse {
  /**
   * tuple of offer_asset denom and commission amount for the swap
   */
  commission_amounts: Array<readonly [string, i128]>;
  offer_amount: i128;
  spread_amount: Array<i128>;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    { admin, factory }: { admin: string; factory: string },
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
   * Construct and simulate a swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  swap: (
    {
      recipient,
      operations,
      max_spread_bps,
      amount,
    }: {
      recipient: string;
      operations: Array<Swap>;
      max_spread_bps: Option<i64>;
      amount: i128;
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
   * Construct and simulate a simulate_swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  simulate_swap: (
    { operations, amount }: { operations: Array<Swap>; amount: i128 },
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
  ) => Promise<AssembledTransaction<SimulateSwapResponse>>;

  /**
   * Construct and simulate a simulate_reverse_swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  simulate_reverse_swap: (
    { operations, amount }: { operations: Array<Swap>; amount: i128 },
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
  ) => Promise<AssembledTransaction<SimulateReverseSwapResponse>>;

  /**
   * Construct and simulate a update transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update: (
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
  ) => Promise<AssembledTransaction<null>>;
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAdmYWN0b3J5AAAAABMAAAAA",
        "AAAAAAAAAAAAAAAEc3dhcAAAAAQAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAACm9wZXJhdGlvbnMAAAAAA+oAAAfQAAAABFN3YXAAAAAAAAAADm1heF9zcHJlYWRfYnBzAAAAAAPoAAAABwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAANc2ltdWxhdGVfc3dhcAAAAAAAAAIAAAAAAAAACm9wZXJhdGlvbnMAAAAAA+oAAAfQAAAABFN3YXAAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAfQAAAAFFNpbXVsYXRlU3dhcFJlc3BvbnNl",
        "AAAAAAAAAAAAAAAVc2ltdWxhdGVfcmV2ZXJzZV9zd2FwAAAAAAAAAgAAAAAAAAAKb3BlcmF0aW9ucwAAAAAD6gAAB9AAAAAEU3dhcAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAB9AAAAAbU2ltdWxhdGVSZXZlcnNlU3dhcFJlc3BvbnNlAA==",
        "AAAAAAAAAAAAAAAGdXBkYXRlAAAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAEAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAD09wZXJhdGlvbnNFbXB0eQAAAAACAAAAAAAAABJJbmNvcnJlY3RBc3NldFN3YXAAAAAAAAMAAAAAAAAAC0FkbWluTm90U2V0AAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAABFN3YXAAAAADAAAAAAAAAAlhc2tfYXNzZXQAAAAAAAATAAAAAAAAABRhc2tfYXNzZXRfbWluX2Ftb3VudAAAA+gAAAALAAAAAAAAAAtvZmZlcl9hc3NldAAAAAAT",
        "AAAAAQAAAAAAAAAAAAAABFBhaXIAAAACAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEw==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAEAAAAAAAAAB1BhaXJLZXkAAAAAAQAAB9AAAAAEUGFpcgAAAAAAAAAAAAAACkZhY3RvcnlLZXkAAAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAALSW5pdGlhbGl6ZWQA",
        "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAABRBZGRyZXNzIG9mIHRoZSBhc3NldAAAAAdhZGRyZXNzAAAAABMAAAAsVGhlIHRvdGFsIGFtb3VudCBvZiB0aG9zZSB0b2tlbnMgaW4gdGhlIHBvb2wAAAAGYW1vdW50AAAAAAAL",
        "AAAAAQAAAG5UaGlzIHN0cnVjdCBpcyB1c2VkIHRvIHJldHVybiBhIHF1ZXJ5IHJlc3VsdCB3aXRoIHRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGFuZCBhc3NldHMgaW4gYSBzcGVjaWZpYyBwb29sLgAAAAAAAAAAAAxQb29sUmVzcG9uc2UAAAADAAAAM1RoZSBhc3NldCBBIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYQAAAAfQAAAABUFzc2V0AAAAAAAAM1RoZSBhc3NldCBCIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYgAAAAfQAAAABUFzc2V0AAAAAAAALlRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGN1cnJlbnRseSBpc3N1ZWQAAAAAAA5hc3NldF9scF9zaGFyZQAAAAAH0AAAAAVBc3NldAAAAA==",
        "AAAAAQAAAAAAAAAAAAAAFFNpbXVsYXRlU3dhcFJlc3BvbnNlAAAAAwAAAAAAAAAKYXNrX2Ftb3VudAAAAAAACwAAADt0dXBsZSBvZiBhc2tfYXNzZXQgZGVub20gYW5kIGNvbW1pc3Npb24gYW1vdW50IGZvciB0aGUgc3dhcAAAAAASY29tbWlzc2lvbl9hbW91bnRzAAAAAAPqAAAD7QAAAAIAAAAQAAAACwAAAAAAAAANc3ByZWFkX2Ftb3VudAAAAAAAA+oAAAAL",
        "AAAAAQAAAAAAAAAAAAAAG1NpbXVsYXRlUmV2ZXJzZVN3YXBSZXNwb25zZQAAAAADAAAAPXR1cGxlIG9mIG9mZmVyX2Fzc2V0IGRlbm9tIGFuZCBjb21taXNzaW9uIGFtb3VudCBmb3IgdGhlIHN3YXAAAAAAAAASY29tbWlzc2lvbl9hbW91bnRzAAAAAAPqAAAD7QAAAAIAAAAQAAAACwAAAAAAAAAMb2ZmZXJfYW1vdW50AAAACwAAAAAAAAANc3ByZWFkX2Ftb3VudAAAAAAAA+oAAAAL",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    swap: this.txFromJSON<null>,
    simulate_swap: this.txFromJSON<SimulateSwapResponse>,
    simulate_reverse_swap: this.txFromJSON<SimulateReverseSwapResponse>,
    update: this.txFromJSON<null>,
  };
}
