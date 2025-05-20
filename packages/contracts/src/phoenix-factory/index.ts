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

export const Errors = {
  100: { message: "AlreadyInitialized" },

  101: { message: "WhiteListeEmpty" },

  102: { message: "NotAuthorized" },

  103: { message: "LiquidityPoolNotFound" },

  104: { message: "TokenABiggerThanTokenB" },

  105: { message: "MinStakeInvalid" },

  106: { message: "MinRewardInvalid" },

  107: { message: "AdminNotSet" },

  108: { message: "OverflowingOps" },

  109: { message: "SameAdmin" },

  110: { message: "NoAdminChangeInPlace" },

  111: { message: "AdminChangeExpired" },

  112: { message: "TokenDecimalsInvalid" },
};

export interface PairTupleKey {
  token_a: string;
  token_b: string;
}

export interface Config {
  admin: string;
  lp_token_decimals: u32;
  lp_wasm_hash: Buffer;
  multihop_address: string;
  stake_wasm_hash: Buffer;
  token_wasm_hash: Buffer;
  whitelisted_accounts: Array<string>;
}

export interface UserPortfolio {
  lp_portfolio: Array<LpPortfolio>;
  stake_portfolio: Array<StakePortfolio>;
}

export interface LpPortfolio {
  assets: readonly [Asset, Asset];
}

export interface StakePortfolio {
  stakes: Array<Stake>;
  staking_contract: string;
}

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
  /**
   * The address of the Stake contract for the liquidity pool
   */
  stake_address: string;
}

export interface LiquidityPoolInfo {
  pool_address: string;
  pool_response: PoolResponse;
  total_fee_bps: i64;
}

export interface StakedResponse {
  stakes: Array<Stake>;
  total_stake: i128;
}

export interface Stake {
  /**
   * The amount of staked tokens
   */
  stake: i128;
  /**
   * The timestamp when the stake was made
   */
  stake_timestamp: u64;
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
   * Construct and simulate a create_liquidity_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_liquidity_pool: (
    {
      sender,
      lp_init_info,
      share_token_name,
      share_token_symbol,
      pool_type,
      amp,
      default_slippage_bps,
      max_allowed_fee_bps,
    }: {
      sender: string;
      lp_init_info: LiquidityPoolInitInfo;
      share_token_name: string;
      share_token_symbol: string;
      pool_type: PoolType;
      amp: Option<u64>;
      default_slippage_bps: i64;
      max_allowed_fee_bps: i64;
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
  ) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a update_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_config: (
    {
      multihop_address,
      lp_wasm_hash,
      stake_wasm_hash,
      token_wasm_hash,
      whitelisted_to_add,
      whitelisted_to_remove,
      lp_token_decimals,
    }: {
      multihop_address: Option<string>;
      lp_wasm_hash: Option<Buffer>;
      stake_wasm_hash: Option<Buffer>;
      token_wasm_hash: Option<Buffer>;
      whitelisted_to_add: Option<Array<string>>;
      whitelisted_to_remove: Option<Array<string>>;
      lp_token_decimals: Option<u32>;
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
  ) => Promise<AssembledTransaction<Result<Config>>>;

  /**
   * Construct and simulate a query_pools transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_pools: (options?: {
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
   * Construct and simulate a query_pool_details transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_pool_details: (
    { pool_address }: { pool_address: string },
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
  ) => Promise<AssembledTransaction<LiquidityPoolInfo>>;

  /**
   * Construct and simulate a query_all_pools_details transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_all_pools_details: (options?: {
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
  }) => Promise<AssembledTransaction<Array<LiquidityPoolInfo>>>;

  /**
   * Construct and simulate a query_for_pool_by_token_pair transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_for_pool_by_token_pair: (
    { token_a, token_b }: { token_a: string; token_b: string },
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
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin: (options?: {
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
   * Construct and simulate a get_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_config: (options?: {
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
  }) => Promise<AssembledTransaction<Config>>;

  /**
   * Construct and simulate a query_user_portfolio transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_user_portfolio: (
    { sender, staking }: { sender: string; staking: boolean },
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
  ) => Promise<AssembledTransaction<UserPortfolio>>;

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
    {
      new_wasm_hash,
      new_stable_pool_hash,
    }: { new_wasm_hash: Buffer; new_stable_pool_hash: Buffer },
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
    {
      admin,
      multihop_wasm_hash,
      lp_wasm_hash,
      stable_wasm_hash,
      stake_wasm_hash,
      token_wasm_hash,
      whitelisted_accounts,
      lp_token_decimals,
    }: {
      admin: string;
      multihop_wasm_hash: Buffer;
      lp_wasm_hash: Buffer;
      stable_wasm_hash: Buffer;
      stake_wasm_hash: Buffer;
      token_wasm_hash: Buffer;
      whitelisted_accounts: Array<string>;
      lp_token_decimals: u32;
    },
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
    return ContractClient.deploy(
      {
        admin,
        multihop_wasm_hash,
        lp_wasm_hash,
        stable_wasm_hash,
        stake_wasm_hash,
        token_wasm_hash,
        whitelisted_accounts,
        lp_token_decimals,
      },
      options
    );
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAVY3JlYXRlX2xpcXVpZGl0eV9wb29sAAAAAAAACAAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAxscF9pbml0X2luZm8AAAfQAAAAFUxpcXVpZGl0eVBvb2xJbml0SW5mbwAAAAAAAAAAAAAQc2hhcmVfdG9rZW5fbmFtZQAAABAAAAAAAAAAEnNoYXJlX3Rva2VuX3N5bWJvbAAAAAAAEAAAAAAAAAAJcG9vbF90eXBlAAAAAAAH0AAAAAhQb29sVHlwZQAAAAAAAAADYW1wAAAAA+gAAAAGAAAAAAAAABRkZWZhdWx0X3NsaXBwYWdlX2JwcwAAAAcAAAAAAAAAE21heF9hbGxvd2VkX2ZlZV9icHMAAAAABwAAAAEAAAAT",
        "AAAAAAAAAAAAAAANdXBkYXRlX2NvbmZpZwAAAAAAAAcAAAAAAAAAEG11bHRpaG9wX2FkZHJlc3MAAAPoAAAAEwAAAAAAAAAMbHBfd2FzbV9oYXNoAAAD6AAAA+4AAAAgAAAAAAAAAA9zdGFrZV93YXNtX2hhc2gAAAAD6AAAA+4AAAAgAAAAAAAAAA90b2tlbl93YXNtX2hhc2gAAAAD6AAAA+4AAAAgAAAAAAAAABJ3aGl0ZWxpc3RlZF90b19hZGQAAAAAA+gAAAPqAAAAEwAAAAAAAAAVd2hpdGVsaXN0ZWRfdG9fcmVtb3ZlAAAAAAAD6AAAA+oAAAATAAAAAAAAABFscF90b2tlbl9kZWNpbWFscwAAAAAAA+gAAAAEAAAAAQAAA+kAAAfQAAAABkNvbmZpZwAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAALcXVlcnlfcG9vbHMAAAAAAAAAAAEAAAPqAAAAEw==",
        "AAAAAAAAAAAAAAAScXVlcnlfcG9vbF9kZXRhaWxzAAAAAAABAAAAAAAAAAxwb29sX2FkZHJlc3MAAAATAAAAAQAAB9AAAAARTGlxdWlkaXR5UG9vbEluZm8AAAA=",
        "AAAAAAAAAAAAAAAXcXVlcnlfYWxsX3Bvb2xzX2RldGFpbHMAAAAAAAAAAAEAAAPqAAAH0AAAABFMaXF1aWRpdHlQb29sSW5mbwAAAA==",
        "AAAAAAAAAAAAAAAccXVlcnlfZm9yX3Bvb2xfYnlfdG9rZW5fcGFpcgAAAAIAAAAAAAAAB3Rva2VuX2EAAAAAEwAAAAAAAAAHdG9rZW5fYgAAAAATAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAKZ2V0X2NvbmZpZwAAAAAAAAAAAAEAAAfQAAAABkNvbmZpZwAA",
        "AAAAAAAAAAAAAAAUcXVlcnlfdXNlcl9wb3J0Zm9saW8AAAACAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAAB3N0YWtpbmcAAAAAAQAAAAEAAAfQAAAADVVzZXJQb3J0Zm9saW8AAAA=",
        "AAAAAAAAAAAAAAARbWlncmF0ZV9hZG1pbl9rZXkAAAAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAANcHJvcG9zZV9hZG1pbgAAAAAAAAIAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAAAAAACnRpbWVfbGltaXQAAAAAA+gAAAAGAAAAAQAAA+kAAAATAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAATcmV2b2tlX2FkbWluX2NoYW5nZQAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAMYWNjZXB0X2FkbWluAAAAAAAAAAEAAAPpAAAAEwAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAgAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAASbXVsdGlob3Bfd2FzbV9oYXNoAAAAAAPuAAAAIAAAAAAAAAAMbHBfd2FzbV9oYXNoAAAD7gAAACAAAAAAAAAAEHN0YWJsZV93YXNtX2hhc2gAAAPuAAAAIAAAAAAAAAAPc3Rha2Vfd2FzbV9oYXNoAAAAA+4AAAAgAAAAAAAAAA90b2tlbl93YXNtX2hhc2gAAAAD7gAAACAAAAAAAAAAFHdoaXRlbGlzdGVkX2FjY291bnRzAAAD6gAAABMAAAAAAAAAEWxwX3Rva2VuX2RlY2ltYWxzAAAAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAGdXBkYXRlAAAAAAACAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAAAAAAFG5ld19zdGFibGVfcG9vbF9oYXNoAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAANcXVlcnlfdmVyc2lvbgAAAAAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAAWYWRkX25ld19rZXlfdG9fc3RvcmFnZQAAAAAAAAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAANAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAGQAAAAAAAAAD1doaXRlTGlzdGVFbXB0eQAAAABlAAAAAAAAAA1Ob3RBdXRob3JpemVkAAAAAAAAZgAAAAAAAAAVTGlxdWlkaXR5UG9vbE5vdEZvdW5kAAAAAAAAZwAAAAAAAAAWVG9rZW5BQmlnZ2VyVGhhblRva2VuQgAAAAAAaAAAAAAAAAAPTWluU3Rha2VJbnZhbGlkAAAAAGkAAAAAAAAAEE1pblJld2FyZEludmFsaWQAAABqAAAAAAAAAAtBZG1pbk5vdFNldAAAAABrAAAAAAAAAA5PdmVyZmxvd2luZ09wcwAAAAAAbAAAAAAAAAAJU2FtZUFkbWluAAAAAAAAbQAAAAAAAAAUTm9BZG1pbkNoYW5nZUluUGxhY2UAAABuAAAAAAAAABJBZG1pbkNoYW5nZUV4cGlyZWQAAAAAAG8AAAAAAAAAFFRva2VuRGVjaW1hbHNJbnZhbGlkAAAAcA==",
        "AAAAAQAAAAAAAAAAAAAADFBhaXJUdXBsZUtleQAAAAIAAAAAAAAAB3Rva2VuX2EAAAAAEwAAAAAAAAAHdG9rZW5fYgAAAAAT",
        "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAABwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAABFscF90b2tlbl9kZWNpbWFscwAAAAAAAAQAAAAAAAAADGxwX3dhc21faGFzaAAAA+4AAAAgAAAAAAAAABBtdWx0aWhvcF9hZGRyZXNzAAAAEwAAAAAAAAAPc3Rha2Vfd2FzbV9oYXNoAAAAA+4AAAAgAAAAAAAAAA90b2tlbl93YXNtX2hhc2gAAAAD7gAAACAAAAAAAAAAFHdoaXRlbGlzdGVkX2FjY291bnRzAAAD6gAAABM=",
        "AAAAAQAAAAAAAAAAAAAADVVzZXJQb3J0Zm9saW8AAAAAAAACAAAAAAAAAAxscF9wb3J0Zm9saW8AAAPqAAAH0AAAAAtMcFBvcnRmb2xpbwAAAAAAAAAAD3N0YWtlX3BvcnRmb2xpbwAAAAPqAAAH0AAAAA5TdGFrZVBvcnRmb2xpbwAA",
        "AAAAAQAAAAAAAAAAAAAAC0xwUG9ydGZvbGlvAAAAAAEAAAAAAAAABmFzc2V0cwAAAAAD7QAAAAIAAAfQAAAABUFzc2V0AAAAAAAH0AAAAAVBc3NldAAAAA==",
        "AAAAAQAAAAAAAAAAAAAADlN0YWtlUG9ydGZvbGlvAAAAAAACAAAAAAAAAAZzdGFrZXMAAAAAA+oAAAfQAAAABVN0YWtlAAAAAAAAAAAAABBzdGFraW5nX2NvbnRyYWN0AAAAEw==",
        "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAABRBZGRyZXNzIG9mIHRoZSBhc3NldAAAAAdhZGRyZXNzAAAAABMAAAAsVGhlIHRvdGFsIGFtb3VudCBvZiB0aG9zZSB0b2tlbnMgaW4gdGhlIHBvb2wAAAAGYW1vdW50AAAAAAAL",
        "AAAAAQAAAG5UaGlzIHN0cnVjdCBpcyB1c2VkIHRvIHJldHVybiBhIHF1ZXJ5IHJlc3VsdCB3aXRoIHRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGFuZCBhc3NldHMgaW4gYSBzcGVjaWZpYyBwb29sLgAAAAAAAAAAAAxQb29sUmVzcG9uc2UAAAAEAAAAM1RoZSBhc3NldCBBIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYQAAAAfQAAAABUFzc2V0AAAAAAAAM1RoZSBhc3NldCBCIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYgAAAAfQAAAABUFzc2V0AAAAAAAALlRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGN1cnJlbnRseSBpc3N1ZWQAAAAAAA5hc3NldF9scF9zaGFyZQAAAAAH0AAAAAVBc3NldAAAAAAAADhUaGUgYWRkcmVzcyBvZiB0aGUgU3Rha2UgY29udHJhY3QgZm9yIHRoZSBsaXF1aWRpdHkgcG9vbAAAAA1zdGFrZV9hZGRyZXNzAAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAEUxpcXVpZGl0eVBvb2xJbmZvAAAAAAAAAwAAAAAAAAAMcG9vbF9hZGRyZXNzAAAAEwAAAAAAAAANcG9vbF9yZXNwb25zZQAAAAAAB9AAAAAMUG9vbFJlc3BvbnNlAAAAAAAAAA10b3RhbF9mZWVfYnBzAAAAAAAABw==",
        "AAAAAQAAAAAAAAAAAAAADlN0YWtlZFJlc3BvbnNlAAAAAAACAAAAAAAAAAZzdGFrZXMAAAAAA+oAAAfQAAAABVN0YWtlAAAAAAAAAAAAAAt0b3RhbF9zdGFrZQAAAAAL",
        "AAAAAQAAAAAAAAAAAAAABVN0YWtlAAAAAAAAAgAAABtUaGUgYW1vdW50IG9mIHN0YWtlZCB0b2tlbnMAAAAABXN0YWtlAAAAAAAACwAAACVUaGUgdGltZXN0YW1wIHdoZW4gdGhlIHN0YWtlIHdhcyBtYWRlAAAAAAAAD3N0YWtlX3RpbWVzdGFtcAAAAAAG",
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
    create_liquidity_pool: this.txFromJSON<string>,
    update_config: this.txFromJSON<Result<Config>>,
    query_pools: this.txFromJSON<Array<string>>,
    query_pool_details: this.txFromJSON<LiquidityPoolInfo>,
    query_all_pools_details: this.txFromJSON<Array<LiquidityPoolInfo>>,
    query_for_pool_by_token_pair: this.txFromJSON<string>,
    get_admin: this.txFromJSON<string>,
    get_config: this.txFromJSON<Config>,
    query_user_portfolio: this.txFromJSON<UserPortfolio>,
    migrate_admin_key: this.txFromJSON<Result<void>>,
    propose_admin: this.txFromJSON<Result<string>>,
    revoke_admin_change: this.txFromJSON<Result<void>>,
    accept_admin: this.txFromJSON<Result<string>>,
    update: this.txFromJSON<null>,
    query_version: this.txFromJSON<string>,
    add_new_key_to_storage: this.txFromJSON<Result<void>>,
  };
}
