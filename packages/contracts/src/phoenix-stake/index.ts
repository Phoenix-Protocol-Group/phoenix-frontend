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

export type DistributionDataKey =
  | { tag: "RewardHistory"; values: readonly [string] }
  | { tag: "TotalStakedHistory"; values: void };

export const Errors = {
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
  13: { message: "" },
};

export interface ConfigResponse {
  config: Config;
}

export interface StakedResponse {
  last_reward_time: u64;
  stakes: Array<Stake>;
  total_stake: i128;
}

export interface AnnualizedReward {
  amount: string;
  asset: string;
}

export interface AnnualizedRewardsResponse {
  rewards: Array<AnnualizedReward>;
}

export interface WithdrawableReward {
  reward_address: string;
  reward_amount: u128;
}

export interface WithdrawableRewardsResponse {
  /**
   * Amount of rewards assigned for withdrawal from the given address.
   */
  rewards: Array<WithdrawableReward>;
}

export interface Config {
  lp_token: string;
  manager: string;
  max_complexity: u32;
  min_bond: i128;
  min_reward: i128;
  owner: string;
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

export interface BondingInfo {
  /**
   * Last time when user has claimed rewards
   */
  last_reward_time: u64;
  /**
   * The rewards debt is a mechanism to determine how much a user has already been credited in terms of staking rewards.
   * Whenever a user deposits or withdraws staked tokens to the pool, the rewards for the user is updated based on the
   * accumulated rewards per share, and the difference is stored as reward debt. When claiming rewards, this reward debt
   * is used to determine how much rewards a user can actually claim.
   */
  reward_debt: u128;
  /**
   * Vec of stakes sorted by stake timestamp
   */
  stakes: Array<Stake>;
  /**
   * Total amount of staked tokens
   */
  total_stake: i128;
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

export enum PoolType {
  Xyk = 0,
  Stable = 1,
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    {
      admin,
      lp_token,
      min_bond,
      min_reward,
      manager,
      owner,
      max_complexity,
    }: {
      admin: string;
      lp_token: string;
      min_bond: i128;
      min_reward: i128;
      manager: string;
      owner: string;
      max_complexity: u32;
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
   * Construct and simulate a bond transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  bond: (
    { sender, tokens }: { sender: string; tokens: i128 },
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
   * Construct and simulate a unbond transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unbond: (
    {
      sender,
      stake_amount,
      stake_timestamp,
    }: { sender: string; stake_amount: i128; stake_timestamp: u64 },
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
   * Construct and simulate a create_distribution_flow transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_distribution_flow: (
    { sender, asset }: { sender: string; asset: string },
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
   * Construct and simulate a distribute_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  distribute_rewards: (
    {
      sender,
      amount,
      reward_token,
    }: { sender: string; amount: i128; reward_token: string },
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
   * Construct and simulate a withdraw_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_rewards: (
    { sender }: { sender: string },
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
   * Construct and simulate a query_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_config: (options?: {
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
  }) => Promise<AssembledTransaction<ConfigResponse>>;

  /**
   * Construct and simulate a query_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_admin: (options?: {
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
   * Construct and simulate a query_staked transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_staked: (
    { address }: { address: string },
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
  ) => Promise<AssembledTransaction<StakedResponse>>;

  /**
   * Construct and simulate a query_total_staked transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_total_staked: (options?: {
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
  }) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a query_withdrawable_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_withdrawable_rewards: (
    { user }: { user: string },
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
  ) => Promise<AssembledTransaction<WithdrawableRewardsResponse>>;

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
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAhscF90b2tlbgAAABMAAAAAAAAACG1pbl9ib25kAAAACwAAAAAAAAAKbWluX3Jld2FyZAAAAAAACwAAAAAAAAAHbWFuYWdlcgAAAAATAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAADm1heF9jb21wbGV4aXR5AAAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAAEYm9uZAAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAGdG9rZW5zAAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAGdW5ib25kAAAAAAADAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAADHN0YWtlX2Ftb3VudAAAAAsAAAAAAAAAD3N0YWtlX3RpbWVzdGFtcAAAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAAYY3JlYXRlX2Rpc3RyaWJ1dGlvbl9mbG93AAAAAgAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAVhc3NldAAAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAASZGlzdHJpYnV0ZV9yZXdhcmRzAAAAAAADAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAMcmV3YXJkX3Rva2VuAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAQd2l0aGRyYXdfcmV3YXJkcwAAAAEAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAMcXVlcnlfY29uZmlnAAAAAAAAAAEAAAfQAAAADkNvbmZpZ1Jlc3BvbnNlAAA=",
        "AAAAAAAAAAAAAAALcXVlcnlfYWRtaW4AAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAMcXVlcnlfc3Rha2VkAAAAAQAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAQAAB9AAAAAOU3Rha2VkUmVzcG9uc2UAAA==",
        "AAAAAAAAAAAAAAAScXVlcnlfdG90YWxfc3Rha2VkAAAAAAAAAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAacXVlcnlfd2l0aGRyYXdhYmxlX3Jld2FyZHMAAAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAB9AAAAAbV2l0aGRyYXdhYmxlUmV3YXJkc1Jlc3BvbnNlAA==",
        "AAAAAAAAAAAAAAAGdXBkYXRlAAAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAgAAAAAAAAAAAAAAE0Rpc3RyaWJ1dGlvbkRhdGFLZXkAAAAAAgAAAAEAAAAAAAAADVJld2FyZEhpc3RvcnkAAAAAAAABAAAAEwAAAAAAAAAAAAAAElRvdGFsU3Rha2VkSGlzdG9yeQAA",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAANAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAADkludmFsaWRNaW5Cb25kAAAAAAACAAAAAAAAABBJbnZhbGlkTWluUmV3YXJkAAAAAwAAAAAAAAALSW52YWxpZEJvbmQAAAAABAAAAAAAAAAMVW5hdXRob3JpemVkAAAABQAAAAAAAAASTWluUmV3YXJkTm90RW5vdWdoAAAAAAAGAAAAAAAAAA5SZXdhcmRzSW52YWxpZAAAAAAABwAAAAAAAAANU3Rha2VOb3RGb3VuZAAAAAAAAAgAAAAAAAAAC0ludmFsaWRUaW1lAAAAAAkAAAAAAAAAEkRpc3RyaWJ1dGlvbkV4aXN0cwAAAAAACgAAAAAAAAATSW52YWxpZFJld2FyZEFtb3VudAAAAAALAAAAAAAAABRJbnZhbGlkTWF4Q29tcGxleGl0eQAAAAwAAAAAAAAAFERpc3RyaWJ1dGlvbk5vdEZvdW5kAAAADQ==",
        "AAAAAQAAAAAAAAAAAAAADkNvbmZpZ1Jlc3BvbnNlAAAAAAABAAAAAAAAAAZjb25maWcAAAAAB9AAAAAGQ29uZmlnAAA=",
        "AAAAAQAAAAAAAAAAAAAADlN0YWtlZFJlc3BvbnNlAAAAAAADAAAAAAAAABBsYXN0X3Jld2FyZF90aW1lAAAABgAAAAAAAAAGc3Rha2VzAAAAAAPqAAAH0AAAAAVTdGFrZQAAAAAAAAAAAAALdG90YWxfc3Rha2UAAAAACw==",
        "AAAAAQAAAAAAAAAAAAAAEEFubnVhbGl6ZWRSZXdhcmQAAAACAAAAAAAAAAZhbW91bnQAAAAAABAAAAAAAAAABWFzc2V0AAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAGUFubnVhbGl6ZWRSZXdhcmRzUmVzcG9uc2UAAAAAAAABAAAAAAAAAAdyZXdhcmRzAAAAA+oAAAfQAAAAEEFubnVhbGl6ZWRSZXdhcmQ=",
        "AAAAAQAAAAAAAAAAAAAAEldpdGhkcmF3YWJsZVJld2FyZAAAAAAAAgAAAAAAAAAOcmV3YXJkX2FkZHJlc3MAAAAAABMAAAAAAAAADXJld2FyZF9hbW91bnQAAAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAAG1dpdGhkcmF3YWJsZVJld2FyZHNSZXNwb25zZQAAAAABAAAAQUFtb3VudCBvZiByZXdhcmRzIGFzc2lnbmVkIGZvciB3aXRoZHJhd2FsIGZyb20gdGhlIGdpdmVuIGFkZHJlc3MuAAAAAAAAB3Jld2FyZHMAAAAD6gAAB9AAAAASV2l0aGRyYXdhYmxlUmV3YXJkAAA=",
        "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAABgAAAAAAAAAIbHBfdG9rZW4AAAATAAAAAAAAAAdtYW5hZ2VyAAAAABMAAAAAAAAADm1heF9jb21wbGV4aXR5AAAAAAAEAAAAAAAAAAhtaW5fYm9uZAAAAAsAAAAAAAAACm1pbl9yZXdhcmQAAAAAAAsAAAAAAAAABW93bmVyAAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAABVN0YWtlAAAAAAAAAgAAABtUaGUgYW1vdW50IG9mIHN0YWtlZCB0b2tlbnMAAAAABXN0YWtlAAAAAAAACwAAACVUaGUgdGltZXN0YW1wIHdoZW4gdGhlIHN0YWtlIHdhcyBtYWRlAAAAAAAAD3N0YWtlX3RpbWVzdGFtcAAAAAAG",
        "AAAAAQAAAAAAAAAAAAAAC0JvbmRpbmdJbmZvAAAAAAQAAAAnTGFzdCB0aW1lIHdoZW4gdXNlciBoYXMgY2xhaW1lZCByZXdhcmRzAAAAABBsYXN0X3Jld2FyZF90aW1lAAAABgAAAZpUaGUgcmV3YXJkcyBkZWJ0IGlzIGEgbWVjaGFuaXNtIHRvIGRldGVybWluZSBob3cgbXVjaCBhIHVzZXIgaGFzIGFscmVhZHkgYmVlbiBjcmVkaXRlZCBpbiB0ZXJtcyBvZiBzdGFraW5nIHJld2FyZHMuCldoZW5ldmVyIGEgdXNlciBkZXBvc2l0cyBvciB3aXRoZHJhd3Mgc3Rha2VkIHRva2VucyB0byB0aGUgcG9vbCwgdGhlIHJld2FyZHMgZm9yIHRoZSB1c2VyIGlzIHVwZGF0ZWQgYmFzZWQgb24gdGhlCmFjY3VtdWxhdGVkIHJld2FyZHMgcGVyIHNoYXJlLCBhbmQgdGhlIGRpZmZlcmVuY2UgaXMgc3RvcmVkIGFzIHJld2FyZCBkZWJ0LiBXaGVuIGNsYWltaW5nIHJld2FyZHMsIHRoaXMgcmV3YXJkIGRlYnQKaXMgdXNlZCB0byBkZXRlcm1pbmUgaG93IG11Y2ggcmV3YXJkcyBhIHVzZXIgY2FuIGFjdHVhbGx5IGNsYWltLgAAAAAAC3Jld2FyZF9kZWJ0AAAAAAoAAAAnVmVjIG9mIHN0YWtlcyBzb3J0ZWQgYnkgc3Rha2UgdGltZXN0YW1wAAAAAAZzdGFrZXMAAAAAA+oAAAfQAAAABVN0YWtlAAAAAAAAHVRvdGFsIGFtb3VudCBvZiBzdGFrZWQgdG9rZW5zAAAAAAAAC3RvdGFsX3N0YWtlAAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAADVRva2VuSW5pdEluZm8AAAAAAAACAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAADVN0YWtlSW5pdEluZm8AAAAAAAAEAAAAAAAAAAdtYW5hZ2VyAAAAABMAAAAAAAAADm1heF9jb21wbGV4aXR5AAAAAAAEAAAAAAAAAAhtaW5fYm9uZAAAAAsAAAAAAAAACm1pbl9yZXdhcmQAAAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAAFUxpcXVpZGl0eVBvb2xJbml0SW5mbwAAAAAAAAkAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAUZGVmYXVsdF9zbGlwcGFnZV9icHMAAAAHAAAAAAAAAA1mZWVfcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAYbWF4X2FsbG93ZWRfc2xpcHBhZ2VfYnBzAAAABwAAAAAAAAAWbWF4X2FsbG93ZWRfc3ByZWFkX2JwcwAAAAAABwAAAAAAAAAQbWF4X3JlZmVycmFsX2JwcwAAAAcAAAAAAAAAD3N0YWtlX2luaXRfaW5mbwAAAAfQAAAADVN0YWtlSW5pdEluZm8AAAAAAAAAAAAADHN3YXBfZmVlX2JwcwAAAAcAAAAAAAAAD3Rva2VuX2luaXRfaW5mbwAAAAfQAAAADVRva2VuSW5pdEluZm8AAAA=",
        "AAAAAwAAAAAAAAAAAAAACFBvb2xUeXBlAAAAAgAAAAAAAAADWHlrAAAAAAAAAAAAAAAABlN0YWJsZQAAAAAAAQ==",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    bond: this.txFromJSON<null>,
    unbond: this.txFromJSON<null>,
    create_distribution_flow: this.txFromJSON<null>,
    distribute_rewards: this.txFromJSON<null>,
    withdraw_rewards: this.txFromJSON<null>,
    query_config: this.txFromJSON<ConfigResponse>,
    query_admin: this.txFromJSON<string>,
    query_staked: this.txFromJSON<StakedResponse>,
    query_total_staked: this.txFromJSON<i128>,
    query_withdrawable_rewards: this.txFromJSON<WithdrawableRewardsResponse>,
    update: this.txFromJSON<null>,
  };
}
