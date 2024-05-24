import {Buffer} from "buffer";
import type {i128, u128, u32, u64,} from '@stellar/stellar-sdk/contract';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';

export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  unknown: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    contractId: "CDP6DT2YU75ZMOPTTCQ563H2XZDDWHPWKRQ6N2W5LNVE5HHRSB4MMRNQ",
  },
} as const;

export interface WithdrawAdjustmentKey {
  asset: string;
  user: string;
}

export type DistributionDataKey =
  | { tag: "Curve"; values: readonly [string] }
  | { tag: "Distribution"; values: readonly [string] }
  | { tag: "WithdrawAdjustment"; values: readonly [WithdrawAdjustmentKey] };

export interface Distribution {
  /**
   * Bonus per staking day
   */
  bonus_per_day_bps: u64;
  /**
   * Total rewards distributed by this contract.
   */
  distributed_total: u128;
  /**
   * Max bonus for staking after 60 days
   */
  max_bonus_bps: u64;
  /**
   * Shares which were not fully distributed on previous distributions, and should be redistributed
   */
  shares_leftover: u64;
  /**
   * How many shares is single point worth
   */
  shares_per_point: u128;
  /**
   * Total rewards not yet withdrawn.
   */
  withdrawable_total: u128;
}

export interface WithdrawAdjustment {
  /**
   * Represents a correction to the reward points for the user. This can be positive or negative.
   * A positive value indicates that the user should receive additional points (e.g., from a bonus or an error correction),
   * while a negative value signifies a reduction (e.g., due to a penalty or an adjustment for past over-allocations).
   */
  shares_correction: i128;
  /**
   * Represents the total amount of rewards that the user has withdrawn so far.
   * This value ensures that a user doesn't withdraw more than they are owed and is used to
   * calculate the net rewards a user can withdraw at any given time.
   */
  withdrawn_rewards: u128;
}

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
};

export interface ConfigResponse {
  config: Config;
}

export interface StakedResponse {
  stakes: Array<Stake>;
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

/**
 * Curve types
 */
export type Curve =
  | { tag: "Constant"; values: readonly [u128] }
  | { tag: "SaturatingLinear"; values: readonly [SaturatingLinear] }
  | { tag: "PiecewiseLinear"; values: readonly [PiecewiseLinear] };

/**
 * Saturating Linear
 * $$f(x)=\begin{cases}
 * [min(y) * amount],  & \text{if x <= $x_1$ } \\\\
 * [y * amount],  & \text{if $x_1$ >= x <= $x_2$ } \\\\
 * [max(y) * amount],  & \text{if x >= $x_2$ }
 * \end{cases}$$
 *
 * min_y for all x <= min_x, max_y for all x >= max_x, linear in between
 */
export interface SaturatingLinear {
  /**
   * time when curve has fully saturated
   */
  max_x: u64;
  /**
   * max value at saturated time
   */
  max_y: u128;
  /**
   * time when curve start
   */
  min_x: u64;
  /**
   * min value at start time
   */
  min_y: u128;
}

/**
 * This is a generalization of SaturatingLinear, steps must be arranged with increasing time [`u64`].
 * Any point before first step gets the first value, after last step the last value.
 * Otherwise, it is a linear interpolation between the two closest points.
 * Vec of length 1 -> [`Constant`](Curve::Constant) .
 * Vec of length 2 -> [`SaturatingLinear`] .
 */
export interface Step {
  time: u64;
  value: u128;
}

export interface PiecewiseLinear {
  /**
   * steps
   */
  steps: Array<Step>;
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
  distribute_rewards: (options?: {
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
  }) => Promise<AssembledTransaction<null>>;

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
   * Construct and simulate a fund_distribution transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  fund_distribution: (
    {
      sender,
      start_time,
      distribution_duration,
      token_address,
      token_amount,
    }: {
      sender: string;
      start_time: u64;
      distribution_duration: u64;
      token_address: string;
      token_amount: i128;
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
   * Construct and simulate a query_annualized_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_annualized_rewards: (options?: {
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
  }) => Promise<AssembledTransaction<AnnualizedRewardsResponse>>;

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
   * Construct and simulate a query_distributed_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_distributed_rewards: (
    { asset }: { asset: string },
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
  ) => Promise<AssembledTransaction<u128>>;

  /**
   * Construct and simulate a query_undistributed_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_undistributed_rewards: (
    { asset }: { asset: string },
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
  ) => Promise<AssembledTransaction<u128>>;

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
        "AAAAAAAAAAAAAAASZGlzdHJpYnV0ZV9yZXdhcmRzAAAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAQd2l0aGRyYXdfcmV3YXJkcwAAAAEAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAARZnVuZF9kaXN0cmlidXRpb24AAAAAAAAFAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAACnN0YXJ0X3RpbWUAAAAAAAYAAAAAAAAAFWRpc3RyaWJ1dGlvbl9kdXJhdGlvbgAAAAAAAAYAAAAAAAAADXRva2VuX2FkZHJlc3MAAAAAAAATAAAAAAAAAAx0b2tlbl9hbW91bnQAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAMcXVlcnlfY29uZmlnAAAAAAAAAAEAAAfQAAAADkNvbmZpZ1Jlc3BvbnNlAAA=",
        "AAAAAAAAAAAAAAALcXVlcnlfYWRtaW4AAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAMcXVlcnlfc3Rha2VkAAAAAQAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAQAAB9AAAAAOU3Rha2VkUmVzcG9uc2UAAA==",
        "AAAAAAAAAAAAAAAScXVlcnlfdG90YWxfc3Rha2VkAAAAAAAAAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAYcXVlcnlfYW5udWFsaXplZF9yZXdhcmRzAAAAAAAAAAEAAAfQAAAAGUFubnVhbGl6ZWRSZXdhcmRzUmVzcG9uc2UAAAA=",
        "AAAAAAAAAAAAAAAacXVlcnlfd2l0aGRyYXdhYmxlX3Jld2FyZHMAAAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAB9AAAAAbV2l0aGRyYXdhYmxlUmV3YXJkc1Jlc3BvbnNlAA==",
        "AAAAAAAAAAAAAAAZcXVlcnlfZGlzdHJpYnV0ZWRfcmV3YXJkcwAAAAAAAAEAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAEAAAAK",
        "AAAAAAAAAAAAAAAbcXVlcnlfdW5kaXN0cmlidXRlZF9yZXdhcmRzAAAAAAEAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAEAAAAK",
        "AAAAAAAAAAAAAAAGdXBkYXRlAAAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAQAAAAAAAAAAAAAAFVdpdGhkcmF3QWRqdXN0bWVudEtleQAAAAAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAEdXNlcgAAABM=",
        "AAAAAgAAAAAAAAAAAAAAE0Rpc3RyaWJ1dGlvbkRhdGFLZXkAAAAAAwAAAAEAAAAAAAAABUN1cnZlAAAAAAAAAQAAABMAAAABAAAAAAAAAAxEaXN0cmlidXRpb24AAAABAAAAEwAAAAEAAAAAAAAAEldpdGhkcmF3QWRqdXN0bWVudAAAAAAAAQAAB9AAAAAVV2l0aGRyYXdBZGp1c3RtZW50S2V5AAAA",
        "AAAAAQAAAAAAAAAAAAAADERpc3RyaWJ1dGlvbgAAAAYAAAAVQm9udXMgcGVyIHN0YWtpbmcgZGF5AAAAAAAAEWJvbnVzX3Blcl9kYXlfYnBzAAAAAAAABgAAACtUb3RhbCByZXdhcmRzIGRpc3RyaWJ1dGVkIGJ5IHRoaXMgY29udHJhY3QuAAAAABFkaXN0cmlidXRlZF90b3RhbAAAAAAAAAoAAAAjTWF4IGJvbnVzIGZvciBzdGFraW5nIGFmdGVyIDYwIGRheXMAAAAADW1heF9ib251c19icHMAAAAAAAAGAAAAXlNoYXJlcyB3aGljaCB3ZXJlIG5vdCBmdWxseSBkaXN0cmlidXRlZCBvbiBwcmV2aW91cyBkaXN0cmlidXRpb25zLCBhbmQgc2hvdWxkIGJlIHJlZGlzdHJpYnV0ZWQAAAAAAA9zaGFyZXNfbGVmdG92ZXIAAAAABgAAACVIb3cgbWFueSBzaGFyZXMgaXMgc2luZ2xlIHBvaW50IHdvcnRoAAAAAAAAEHNoYXJlc19wZXJfcG9pbnQAAAAKAAAAIFRvdGFsIHJld2FyZHMgbm90IHlldCB3aXRoZHJhd24uAAAAEndpdGhkcmF3YWJsZV90b3RhbAAAAAAACg==",
        "AAAAAQAAAAAAAAAAAAAAEldpdGhkcmF3QWRqdXN0bWVudAAAAAAAAgAAAUVSZXByZXNlbnRzIGEgY29ycmVjdGlvbiB0byB0aGUgcmV3YXJkIHBvaW50cyBmb3IgdGhlIHVzZXIuIFRoaXMgY2FuIGJlIHBvc2l0aXZlIG9yIG5lZ2F0aXZlLgpBIHBvc2l0aXZlIHZhbHVlIGluZGljYXRlcyB0aGF0IHRoZSB1c2VyIHNob3VsZCByZWNlaXZlIGFkZGl0aW9uYWwgcG9pbnRzIChlLmcuLCBmcm9tIGEgYm9udXMgb3IgYW4gZXJyb3IgY29ycmVjdGlvbiksCndoaWxlIGEgbmVnYXRpdmUgdmFsdWUgc2lnbmlmaWVzIGEgcmVkdWN0aW9uIChlLmcuLCBkdWUgdG8gYSBwZW5hbHR5IG9yIGFuIGFkanVzdG1lbnQgZm9yIHBhc3Qgb3Zlci1hbGxvY2F0aW9ucykuAAAAAAAAEXNoYXJlc19jb3JyZWN0aW9uAAAAAAAACwAAAOJSZXByZXNlbnRzIHRoZSB0b3RhbCBhbW91bnQgb2YgcmV3YXJkcyB0aGF0IHRoZSB1c2VyIGhhcyB3aXRoZHJhd24gc28gZmFyLgpUaGlzIHZhbHVlIGVuc3VyZXMgdGhhdCBhIHVzZXIgZG9lc24ndCB3aXRoZHJhdyBtb3JlIHRoYW4gdGhleSBhcmUgb3dlZCBhbmQgaXMgdXNlZCB0bwpjYWxjdWxhdGUgdGhlIG5ldCByZXdhcmRzIGEgdXNlciBjYW4gd2l0aGRyYXcgYXQgYW55IGdpdmVuIHRpbWUuAAAAAAARd2l0aGRyYXduX3Jld2FyZHMAAAAAAAAK",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAMAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAADkludmFsaWRNaW5Cb25kAAAAAAACAAAAAAAAABBJbnZhbGlkTWluUmV3YXJkAAAAAwAAAAAAAAALSW52YWxpZEJvbmQAAAAABAAAAAAAAAAMVW5hdXRob3JpemVkAAAABQAAAAAAAAASTWluUmV3YXJkTm90RW5vdWdoAAAAAAAGAAAAAAAAAA5SZXdhcmRzSW52YWxpZAAAAAAABwAAAAAAAAANU3Rha2VOb3RGb3VuZAAAAAAAAAgAAAAAAAAAC0ludmFsaWRUaW1lAAAAAAkAAAAAAAAAEkRpc3RyaWJ1dGlvbkV4aXN0cwAAAAAACgAAAAAAAAATSW52YWxpZFJld2FyZEFtb3VudAAAAAALAAAAAAAAABRJbnZhbGlkTWF4Q29tcGxleGl0eQAAAAw=",
        "AAAAAQAAAAAAAAAAAAAADkNvbmZpZ1Jlc3BvbnNlAAAAAAABAAAAAAAAAAZjb25maWcAAAAAB9AAAAAGQ29uZmlnAAA=",
        "AAAAAQAAAAAAAAAAAAAADlN0YWtlZFJlc3BvbnNlAAAAAAABAAAAAAAAAAZzdGFrZXMAAAAAA+oAAAfQAAAABVN0YWtlAAAA",
        "AAAAAQAAAAAAAAAAAAAAEEFubnVhbGl6ZWRSZXdhcmQAAAACAAAAAAAAAAZhbW91bnQAAAAAABAAAAAAAAAABWFzc2V0AAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAGUFubnVhbGl6ZWRSZXdhcmRzUmVzcG9uc2UAAAAAAAABAAAAAAAAAAdyZXdhcmRzAAAAA+oAAAfQAAAAEEFubnVhbGl6ZWRSZXdhcmQ=",
        "AAAAAQAAAAAAAAAAAAAAEldpdGhkcmF3YWJsZVJld2FyZAAAAAAAAgAAAAAAAAAOcmV3YXJkX2FkZHJlc3MAAAAAABMAAAAAAAAADXJld2FyZF9hbW91bnQAAAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAAG1dpdGhkcmF3YWJsZVJld2FyZHNSZXNwb25zZQAAAAABAAAAQUFtb3VudCBvZiByZXdhcmRzIGFzc2lnbmVkIGZvciB3aXRoZHJhd2FsIGZyb20gdGhlIGdpdmVuIGFkZHJlc3MuAAAAAAAAB3Jld2FyZHMAAAAD6gAAB9AAAAASV2l0aGRyYXdhYmxlUmV3YXJkAAA=",
        "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAABgAAAAAAAAAIbHBfdG9rZW4AAAATAAAAAAAAAAdtYW5hZ2VyAAAAABMAAAAAAAAADm1heF9jb21wbGV4aXR5AAAAAAAEAAAAAAAAAAhtaW5fYm9uZAAAAAsAAAAAAAAACm1pbl9yZXdhcmQAAAAAAAsAAAAAAAAABW93bmVyAAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAABVN0YWtlAAAAAAAAAgAAABtUaGUgYW1vdW50IG9mIHN0YWtlZCB0b2tlbnMAAAAABXN0YWtlAAAAAAAACwAAACVUaGUgdGltZXN0YW1wIHdoZW4gdGhlIHN0YWtlIHdhcyBtYWRlAAAAAAAAD3N0YWtlX3RpbWVzdGFtcAAAAAAG",
        "AAAAAQAAAAAAAAAAAAAAC0JvbmRpbmdJbmZvAAAAAAQAAAAnTGFzdCB0aW1lIHdoZW4gdXNlciBoYXMgY2xhaW1lZCByZXdhcmRzAAAAABBsYXN0X3Jld2FyZF90aW1lAAAABgAAAZpUaGUgcmV3YXJkcyBkZWJ0IGlzIGEgbWVjaGFuaXNtIHRvIGRldGVybWluZSBob3cgbXVjaCBhIHVzZXIgaGFzIGFscmVhZHkgYmVlbiBjcmVkaXRlZCBpbiB0ZXJtcyBvZiBzdGFraW5nIHJld2FyZHMuCldoZW5ldmVyIGEgdXNlciBkZXBvc2l0cyBvciB3aXRoZHJhd3Mgc3Rha2VkIHRva2VucyB0byB0aGUgcG9vbCwgdGhlIHJld2FyZHMgZm9yIHRoZSB1c2VyIGlzIHVwZGF0ZWQgYmFzZWQgb24gdGhlCmFjY3VtdWxhdGVkIHJld2FyZHMgcGVyIHNoYXJlLCBhbmQgdGhlIGRpZmZlcmVuY2UgaXMgc3RvcmVkIGFzIHJld2FyZCBkZWJ0LiBXaGVuIGNsYWltaW5nIHJld2FyZHMsIHRoaXMgcmV3YXJkIGRlYnQKaXMgdXNlZCB0byBkZXRlcm1pbmUgaG93IG11Y2ggcmV3YXJkcyBhIHVzZXIgY2FuIGFjdHVhbGx5IGNsYWltLgAAAAAAC3Jld2FyZF9kZWJ0AAAAAAoAAAAnVmVjIG9mIHN0YWtlcyBzb3J0ZWQgYnkgc3Rha2UgdGltZXN0YW1wAAAAAAZzdGFrZXMAAAAAA+oAAAfQAAAABVN0YWtlAAAAAAAAHVRvdGFsIGFtb3VudCBvZiBzdGFrZWQgdG9rZW5zAAAAAAAAC3RvdGFsX3N0YWtlAAAAAAs=",
        "AAAAAgAAAAtDdXJ2ZSB0eXBlcwAAAAAAAAAABUN1cnZlAAAAAAAAAwAAAAEAAAAxQ29uc3RhbiBjdXJ2ZSwgaXQgd2lsbCBhbHdheXMgaGF2ZSB0aGUgc2FtZSB2YWx1ZQAAAAAAAAhDb25zdGFudAAAAAEAAAAKAAAAAQAAAE5MaW5lYXIgY3VydmUgdGhhdCBncm93IGxpbmVhcmx5IGJ1dCBsYXRlcgp0ZW5kcyB0byBhIGNvbnN0YW50IHNhdHVyYXRlZCB2YWx1ZS4AAAAAABBTYXR1cmF0aW5nTGluZWFyAAAAAQAAB9AAAAAQU2F0dXJhdGluZ0xpbmVhcgAAAAEAAAAbQ3VydmUgd2l0aCBkaWZmZXJlbnQgc2xvcGVzAAAAAA9QaWVjZXdpc2VMaW5lYXIAAAAAAQAAB9AAAAAPUGllY2V3aXNlTGluZWFyAA==",
        "AAAAAQAAAQ1TYXR1cmF0aW5nIExpbmVhcgokJGYoeCk9XGJlZ2lue2Nhc2VzfQpbbWluKHkpICogYW1vdW50XSwgICYgXHRleHR7aWYgeCA8PSAkeF8xJCB9IFxcXFwKW3kgKiBhbW91bnRdLCAgJiBcdGV4dHtpZiAkeF8xJCA+PSB4IDw9ICR4XzIkIH0gXFxcXApbbWF4KHkpICogYW1vdW50XSwgICYgXHRleHR7aWYgeCA+PSAkeF8yJCB9ClxlbmR7Y2FzZXN9JCQKCm1pbl95IGZvciBhbGwgeCA8PSBtaW5feCwgbWF4X3kgZm9yIGFsbCB4ID49IG1heF94LCBsaW5lYXIgaW4gYmV0d2VlbgAAAAAAAAAAAAAQU2F0dXJhdGluZ0xpbmVhcgAAAAQAAAAjdGltZSB3aGVuIGN1cnZlIGhhcyBmdWxseSBzYXR1cmF0ZWQAAAAABW1heF94AAAAAAAABgAAABttYXggdmFsdWUgYXQgc2F0dXJhdGVkIHRpbWUAAAAABW1heF95AAAAAAAACgAAABV0aW1lIHdoZW4gY3VydmUgc3RhcnQAAAAAAAAFbWluX3gAAAAAAAAGAAAAF21pbiB2YWx1ZSBhdCBzdGFydCB0aW1lAAAAAAVtaW5feQAAAAAAAAo=",
        "AAAAAQAAAVlUaGlzIGlzIGEgZ2VuZXJhbGl6YXRpb24gb2YgU2F0dXJhdGluZ0xpbmVhciwgc3RlcHMgbXVzdCBiZSBhcnJhbmdlZCB3aXRoIGluY3JlYXNpbmcgdGltZSBbYHU2NGBdLgpBbnkgcG9pbnQgYmVmb3JlIGZpcnN0IHN0ZXAgZ2V0cyB0aGUgZmlyc3QgdmFsdWUsIGFmdGVyIGxhc3Qgc3RlcCB0aGUgbGFzdCB2YWx1ZS4KT3RoZXJ3aXNlLCBpdCBpcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdGhlIHR3byBjbG9zZXN0IHBvaW50cy4KVmVjIG9mIGxlbmd0aCAxIC0+IFtgQ29uc3RhbnRgXShDdXJ2ZTo6Q29uc3RhbnQpIC4KVmVjIG9mIGxlbmd0aCAyIC0+IFtgU2F0dXJhdGluZ0xpbmVhcmBdIC4AAAAAAAAAAAAABFN0ZXAAAAACAAAAAAAAAAR0aW1lAAAABgAAAAAAAAAFdmFsdWUAAAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAAD1BpZWNld2lzZUxpbmVhcgAAAAABAAAABXN0ZXBzAAAAAAAABXN0ZXBzAAAAAAAD6gAAB9AAAAAEU3RlcA==",
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
    fund_distribution: this.txFromJSON<null>,
    query_config: this.txFromJSON<ConfigResponse>,
    query_admin: this.txFromJSON<string>,
    query_staked: this.txFromJSON<StakedResponse>,
    query_total_staked: this.txFromJSON<i128>,
    query_annualized_rewards: this.txFromJSON<AnnualizedRewardsResponse>,
    query_withdrawable_rewards: this.txFromJSON<WithdrawableRewardsResponse>,
    query_distributed_rewards: this.txFromJSON<u128>,
    query_undistributed_rewards: this.txFromJSON<u128>,
    update: this.txFromJSON<null>,
  };
}
