import { Buffer } from "buffer";
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
  u64,
  i64,
  i128,
  Option,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const Errors = {
  200: { message: "AlreadyInitialized" },

  201: { message: "OperationsEmpty" },

  202: { message: "IncorrectAssetSwap" },

  203: { message: "AdminNotSet" },

  204: { message: "SameAdmin" },

  205: { message: "NoAdminChangeInPlace" },

  206: { message: "AdminChangeExpired" },
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

export interface TokenInitInfo {
  token_a: string;
  token_b: string;
}

export interface StakeInitInfo {
  manager: string;
  max_complexity: u32;
  min_bond: i128;
  min_reward: i128;
}

export interface LiquidityPoolInitInfo {
  admin: string;
  default_slippage_bps: i64;
  fee_recipient: string;
  max_allowed_slippage_bps: i64;
  max_allowed_spread_bps: i64;
  max_referral_bps: i64;
  stake_init_info: StakeInitInfo;
  swap_fee_bps: i64;
  token_init_info: TokenInitInfo;
}

export interface AdminChange {
  new_admin: string;
  time_limit: Option<u64>;
}

export interface AutoUnstakeInfo {
  stake_amount: i128;
  stake_timestamp: u64;
}

export enum PoolType {
  Xyk = 0,
  Stable = 1,
}

export interface Client {
  /**
   * Construct and simulate a swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  swap: (
    {
      recipient,
      operations,
      max_spread_bps,
      amount,
      pool_type,
      deadline,
      max_allowed_fee_bps,
    }: {
      recipient: string;
      operations: Array<Swap>;
      max_spread_bps: Option<i64>;
      amount: i128;
      pool_type: PoolType;
      deadline: Option<u64>;
      max_allowed_fee_bps: Option<i64>;
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
    {
      operations,
      amount,
      pool_type,
    }: { operations: Array<Swap>; amount: i128; pool_type: PoolType },
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
    {
      operations,
      amount,
      pool_type,
    }: { operations: Array<Swap>; amount: i128; pool_type: PoolType },
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
   * Construct and simulate a migrate_admin_key transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  migrate_admin_key: (options?: {
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
   * Construct and simulate a propose_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  propose_admin: (
    { new_admin, time_limit }: { new_admin: string; time_limit: Option<u64> },
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
   * Construct and simulate a revoke_admin_change transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  revoke_admin_change: (options?: {
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
   * Construct and simulate a accept_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  accept_admin: (options?: {
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

  /**
   * Construct and simulate a query_version transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_version: (options?: {
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
   * Construct and simulate a add_new_key_to_storage transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_new_key_to_storage: (options?: {
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
}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin, factory }: { admin: string; factory: string },
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
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
    return ContractClient.deploy({ admin, factory }, options);
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAEc3dhcAAAAAcAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAACm9wZXJhdGlvbnMAAAAAA+oAAAfQAAAABFN3YXAAAAAAAAAADm1heF9zcHJlYWRfYnBzAAAAAAPoAAAABwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAlwb29sX3R5cGUAAAAAAAfQAAAACFBvb2xUeXBlAAAAAAAAAAhkZWFkbGluZQAAA+gAAAAGAAAAAAAAABNtYXhfYWxsb3dlZF9mZWVfYnBzAAAAA+gAAAAHAAAAAA==",
        "AAAAAAAAAAAAAAANc2ltdWxhdGVfc3dhcAAAAAAAAAMAAAAAAAAACm9wZXJhdGlvbnMAAAAAA+oAAAfQAAAABFN3YXAAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAJcG9vbF90eXBlAAAAAAAH0AAAAAhQb29sVHlwZQAAAAEAAAfQAAAAFFNpbXVsYXRlU3dhcFJlc3BvbnNl",
        "AAAAAAAAAAAAAAAVc2ltdWxhdGVfcmV2ZXJzZV9zd2FwAAAAAAAAAwAAAAAAAAAKb3BlcmF0aW9ucwAAAAAD6gAAB9AAAAAEU3dhcAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAlwb29sX3R5cGUAAAAAAAfQAAAACFBvb2xUeXBlAAAAAQAAB9AAAAAbU2ltdWxhdGVSZXZlcnNlU3dhcFJlc3BvbnNlAA==",
        "AAAAAAAAAAAAAAARbWlncmF0ZV9hZG1pbl9rZXkAAAAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAANcHJvcG9zZV9hZG1pbgAAAAAAAAIAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAAAAAACnRpbWVfbGltaXQAAAAAA+gAAAAGAAAAAQAAA+kAAAATAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAATcmV2b2tlX2FkbWluX2NoYW5nZQAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAMYWNjZXB0X2FkbWluAAAAAAAAAAEAAAPpAAAAEwAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAHZmFjdG9yeQAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAGdXBkYXRlAAAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAANcXVlcnlfdmVyc2lvbgAAAAAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAAWYWRkX25ld19rZXlfdG9fc3RvcmFnZQAAAAAAAAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAHAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAMgAAAAAAAAAD09wZXJhdGlvbnNFbXB0eQAAAADJAAAAAAAAABJJbmNvcnJlY3RBc3NldFN3YXAAAAAAAMoAAAAAAAAAC0FkbWluTm90U2V0AAAAAMsAAAAAAAAACVNhbWVBZG1pbgAAAAAAAMwAAAAAAAAAFE5vQWRtaW5DaGFuZ2VJblBsYWNlAAAAzQAAAAAAAAASQWRtaW5DaGFuZ2VFeHBpcmVkAAAAAADO",
        "AAAAAQAAAAAAAAAAAAAABFN3YXAAAAADAAAAAAAAAAlhc2tfYXNzZXQAAAAAAAATAAAAAAAAABRhc2tfYXNzZXRfbWluX2Ftb3VudAAAA+gAAAALAAAAAAAAAAtvZmZlcl9hc3NldAAAAAAT",
        "AAAAAQAAAAAAAAAAAAAABFBhaXIAAAACAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEw==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAEAAAAAAAAAB1BhaXJLZXkAAAAAAQAAB9AAAAAEUGFpcgAAAAAAAAAAAAAACkZhY3RvcnlLZXkAAAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAALSW5pdGlhbGl6ZWQA",
        "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAABRBZGRyZXNzIG9mIHRoZSBhc3NldAAAAAdhZGRyZXNzAAAAABMAAAAsVGhlIHRvdGFsIGFtb3VudCBvZiB0aG9zZSB0b2tlbnMgaW4gdGhlIHBvb2wAAAAGYW1vdW50AAAAAAAL",
        "AAAAAQAAAAAAAAAAAAAAFFNpbXVsYXRlU3dhcFJlc3BvbnNlAAAAAwAAAAAAAAAKYXNrX2Ftb3VudAAAAAAACwAAADt0dXBsZSBvZiBhc2tfYXNzZXQgZGVub20gYW5kIGNvbW1pc3Npb24gYW1vdW50IGZvciB0aGUgc3dhcAAAAAASY29tbWlzc2lvbl9hbW91bnRzAAAAAAPqAAAD7QAAAAIAAAAQAAAACwAAAAAAAAANc3ByZWFkX2Ftb3VudAAAAAAAA+oAAAAL",
        "AAAAAQAAAAAAAAAAAAAAG1NpbXVsYXRlUmV2ZXJzZVN3YXBSZXNwb25zZQAAAAADAAAAPXR1cGxlIG9mIG9mZmVyX2Fzc2V0IGRlbm9tIGFuZCBjb21taXNzaW9uIGFtb3VudCBmb3IgdGhlIHN3YXAAAAAAAAASY29tbWlzc2lvbl9hbW91bnRzAAAAAAPqAAAD7QAAAAIAAAAQAAAACwAAAAAAAAAMb2ZmZXJfYW1vdW50AAAACwAAAAAAAAANc3ByZWFkX2Ftb3VudAAAAAAAA+oAAAAL",
        "AAAAAQAAAG5UaGlzIHN0cnVjdCBpcyB1c2VkIHRvIHJldHVybiBhIHF1ZXJ5IHJlc3VsdCB3aXRoIHRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGFuZCBhc3NldHMgaW4gYSBzcGVjaWZpYyBwb29sLgAAAAAAAAAAAAxQb29sUmVzcG9uc2UAAAADAAAAM1RoZSBhc3NldCBBIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYQAAAAfQAAAABUFzc2V0AAAAAAAAM1RoZSBhc3NldCBCIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYgAAAAfQAAAABUFzc2V0AAAAAAAALlRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGN1cnJlbnRseSBpc3N1ZWQAAAAAAA5hc3NldF9scF9zaGFyZQAAAAAH0AAAAAVBc3NldAAAAA==",
        "AAAAAQAAAAAAAAAAAAAADVRva2VuSW5pdEluZm8AAAAAAAACAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAADVN0YWtlSW5pdEluZm8AAAAAAAAEAAAAAAAAAAdtYW5hZ2VyAAAAABMAAAAAAAAADm1heF9jb21wbGV4aXR5AAAAAAAEAAAAAAAAAAhtaW5fYm9uZAAAAAsAAAAAAAAACm1pbl9yZXdhcmQAAAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAAFUxpcXVpZGl0eVBvb2xJbml0SW5mbwAAAAAAAAkAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAUZGVmYXVsdF9zbGlwcGFnZV9icHMAAAAHAAAAAAAAAA1mZWVfcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAYbWF4X2FsbG93ZWRfc2xpcHBhZ2VfYnBzAAAABwAAAAAAAAAWbWF4X2FsbG93ZWRfc3ByZWFkX2JwcwAAAAAABwAAAAAAAAAQbWF4X3JlZmVycmFsX2JwcwAAAAcAAAAAAAAAD3N0YWtlX2luaXRfaW5mbwAAAAfQAAAADVN0YWtlSW5pdEluZm8AAAAAAAAAAAAADHN3YXBfZmVlX2JwcwAAAAcAAAAAAAAAD3Rva2VuX2luaXRfaW5mbwAAAAfQAAAADVRva2VuSW5pdEluZm8AAAA=",
        "AAAAAQAAAAAAAAAAAAAAC0FkbWluQ2hhbmdlAAAAAAIAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAAAAAACnRpbWVfbGltaXQAAAAAA+gAAAAG",
        "AAAAAQAAAAAAAAAAAAAAD0F1dG9VbnN0YWtlSW5mbwAAAAACAAAAAAAAAAxzdGFrZV9hbW91bnQAAAALAAAAAAAAAA9zdGFrZV90aW1lc3RhbXAAAAAABg==",
        "AAAAAwAAAAAAAAAAAAAACFBvb2xUeXBlAAAAAgAAAAAAAAADWHlrAAAAAAAAAAAAAAAABlN0YWJsZQAAAAAAAQ==",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    swap: this.txFromJSON<null>,
    simulate_swap: this.txFromJSON<SimulateSwapResponse>,
    simulate_reverse_swap: this.txFromJSON<SimulateReverseSwapResponse>,
    migrate_admin_key: this.txFromJSON<Result<void>>,
    propose_admin: this.txFromJSON<Result<string>>,
    revoke_admin_change: this.txFromJSON<Result<void>>,
    accept_admin: this.txFromJSON<Result<string>>,
    update: this.txFromJSON<null>,
    query_version: this.txFromJSON<string>,
    add_new_key_to_storage: this.txFromJSON<Result<void>>,
  };
}
