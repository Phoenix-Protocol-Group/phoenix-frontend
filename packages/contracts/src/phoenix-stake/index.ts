import { ContractSpec, Address, xdr } from "stellar-sdk";
import { Buffer } from "buffer";
import { AssembledTransaction, Ok, Err } from "@phoenix-protocol/utils";
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
  Error_,
  Result,
} from "@phoenix-protocol/utils";
import type { ClassOptions, XDR_BASE64 } from "@phoenix-protocol/utils";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  testnet: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    contractId: "0",
  },
} as const;

/**
    
    */
export interface WithdrawAdjustmentKey {
  /**
    
    */
  asset: string;
  /**
    
    */
  user: string;
}

/**
    
    */
export type DistributionDataKey =
  | { tag: "Curve"; values: readonly [string] }
  | { tag: "Distribution"; values: readonly [string] }
  | { tag: "WithdrawAdjustment"; values: readonly [WithdrawAdjustmentKey] };

/**
    
    */
export interface Distribution {
  /**
    Bonus per staking day
    */
  bonus_per_day_bps: u64;
  /**
    Total rewards distributed by this contract.
    */
  distributed_total: u128;
  /**
    Max bonus for staking after 60 days
    */
  max_bonus_bps: u64;
  /**
    Shares which were not fully distributed on previous distributions, and should be redistributed
    */
  shares_leftover: u64;
  /**
    How many shares is single point worth
    */
  shares_per_point: u128;
  /**
    Total rewards not yet withdrawn.
    */
  withdrawable_total: u128;
}

/**
    
    */
export interface WithdrawAdjustment {
  /**
    Represents a correction to the reward points for the user. This can be positive or negative.
    * A positive value indicates that the user should receive additional points (e.g., from a bonus or an error correction),
    * while a negative value signifies a reduction (e.g., due to a penalty or an adjustment for past over-allocations).
    */
  shares_correction: i128;
  /**
    Represents the total amount of rewards that the user has withdrawn so far.
    * This value ensures that a user doesn't withdraw more than they are owed and is used to
    * calculate the net rewards a user can withdraw at any given time.
    */
  withdrawn_rewards: u128;
}

/**
    
    */
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
};
/**
    
    */
export interface ConfigResponse {
  /**
    
    */
  config: Config;
}

/**
    
    */
export interface StakedResponse {
  /**
    
    */
  stakes: Array<Stake>;
}

/**
    
    */
export interface AnnualizedReward {
  /**
    
    */
  amount: string;
  /**
    
    */
  asset: string;
}

/**
    
    */
export interface AnnualizedRewardsResponse {
  /**
    
    */
  rewards: Array<AnnualizedReward>;
}

/**
    
    */
export interface WithdrawableReward {
  /**
    
    */
  reward_address: string;
  /**
    
    */
  reward_amount: u128;
}

/**
    
    */
export interface WithdrawableRewardsResponse {
  /**
    Amount of rewards assigned for withdrawal from the given address.
    */
  rewards: Array<WithdrawableReward>;
}

/**
    
    */
export interface Config {
  /**
    
    */
  lp_token: string;
  /**
    
    */
  manager: string;
  /**
    
    */
  min_bond: i128;
  /**
    
    */
  min_reward: i128;
  /**
    
    */
  owner: string;
}

/**
    
    */
export interface Stake {
  /**
    The amount of staked tokens
    */
  stake: i128;
  /**
    The timestamp when the stake was made
    */
  stake_timestamp: u64;
}

/**
    
    */
export interface BondingInfo {
  /**
    Last time when user has claimed rewards
    */
  last_reward_time: u64;
  /**
    The rewards debt is a mechanism to determine how much a user has already been credited in terms of staking rewards.
    * Whenever a user deposits or withdraws staked tokens to the pool, the rewards for the user is updated based on the
    * accumulated rewards per share, and the difference is stored as reward debt. When claiming rewards, this reward debt
    * is used to determine how much rewards a user can actually claim.
    */
  reward_debt: u128;
  /**
    Vec of stakes sorted by stake timestamp
    */
  stakes: Array<Stake>;
  /**
    Total amount of staked tokens
    */
  total_stake: u128;
}

/**
    Curve types
    */
export type Curve =
  | { tag: "Constant"; values: readonly [u128] }
  | { tag: "SaturatingLinear"; values: readonly [SaturatingLinear] }
  | { tag: "PiecewiseLinear"; values: readonly [PiecewiseLinear] };

/**
    Saturating Linear
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
    time when curve has fully saturated
    */
  max_x: u64;
  /**
    max value at saturated time
    */
  max_y: u128;
  /**
    time when curve start
    */
  min_x: u64;
  /**
    min value at start time
    */
  min_y: u128;
}

/**
    This is a generalization of SaturatingLinear, steps must be arranged with increasing time [`u64`].
    * Any point before first step gets the first value, after last step the last value.
    * Otherwise, it is a linear interpolation between the two closest points.
    * Vec of length 1 -> [`Constant`](Curve::Constant) .
    * Vec of length 2 -> [`SaturatingLinear`] .
    */
export interface Step {
  /**
    
    */
  time: u64;
  /**
    
    */
  value: u128;
}

/**
    
    */
export interface PiecewiseLinear {
  /**
    steps
    */
  steps: Array<Step>;
}

export class Contract {
  spec: ContractSpec;
  constructor(public readonly options: ClassOptions) {
    this.spec = new ContractSpec([
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAhscF90b2tlbgAAABMAAAAAAAAACG1pbl9ib25kAAAACwAAAAAAAAAKbWluX3Jld2FyZAAAAAAACwAAAAAAAAAHbWFuYWdlcgAAAAATAAAAAAAAAAVvd25lcgAAAAAAABMAAAAA",
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
      "AAAAAQAAAAAAAAAAAAAAFVdpdGhkcmF3QWRqdXN0bWVudEtleQAAAAAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAEdXNlcgAAABM=",
      "AAAAAgAAAAAAAAAAAAAAE0Rpc3RyaWJ1dGlvbkRhdGFLZXkAAAAAAwAAAAEAAAAAAAAABUN1cnZlAAAAAAAAAQAAABMAAAABAAAAAAAAAAxEaXN0cmlidXRpb24AAAABAAAAEwAAAAEAAAAAAAAAEldpdGhkcmF3QWRqdXN0bWVudAAAAAAAAQAAB9AAAAAVV2l0aGRyYXdBZGp1c3RtZW50S2V5AAAA",
      "AAAAAQAAAAAAAAAAAAAADERpc3RyaWJ1dGlvbgAAAAYAAAAVQm9udXMgcGVyIHN0YWtpbmcgZGF5AAAAAAAAEWJvbnVzX3Blcl9kYXlfYnBzAAAAAAAABgAAACtUb3RhbCByZXdhcmRzIGRpc3RyaWJ1dGVkIGJ5IHRoaXMgY29udHJhY3QuAAAAABFkaXN0cmlidXRlZF90b3RhbAAAAAAAAAoAAAAjTWF4IGJvbnVzIGZvciBzdGFraW5nIGFmdGVyIDYwIGRheXMAAAAADW1heF9ib251c19icHMAAAAAAAAGAAAAXlNoYXJlcyB3aGljaCB3ZXJlIG5vdCBmdWxseSBkaXN0cmlidXRlZCBvbiBwcmV2aW91cyBkaXN0cmlidXRpb25zLCBhbmQgc2hvdWxkIGJlIHJlZGlzdHJpYnV0ZWQAAAAAAA9zaGFyZXNfbGVmdG92ZXIAAAAABgAAACVIb3cgbWFueSBzaGFyZXMgaXMgc2luZ2xlIHBvaW50IHdvcnRoAAAAAAAAEHNoYXJlc19wZXJfcG9pbnQAAAAKAAAAIFRvdGFsIHJld2FyZHMgbm90IHlldCB3aXRoZHJhd24uAAAAEndpdGhkcmF3YWJsZV90b3RhbAAAAAAACg==",
      "AAAAAQAAAAAAAAAAAAAAEldpdGhkcmF3QWRqdXN0bWVudAAAAAAAAgAAAUVSZXByZXNlbnRzIGEgY29ycmVjdGlvbiB0byB0aGUgcmV3YXJkIHBvaW50cyBmb3IgdGhlIHVzZXIuIFRoaXMgY2FuIGJlIHBvc2l0aXZlIG9yIG5lZ2F0aXZlLgpBIHBvc2l0aXZlIHZhbHVlIGluZGljYXRlcyB0aGF0IHRoZSB1c2VyIHNob3VsZCByZWNlaXZlIGFkZGl0aW9uYWwgcG9pbnRzIChlLmcuLCBmcm9tIGEgYm9udXMgb3IgYW4gZXJyb3IgY29ycmVjdGlvbiksCndoaWxlIGEgbmVnYXRpdmUgdmFsdWUgc2lnbmlmaWVzIGEgcmVkdWN0aW9uIChlLmcuLCBkdWUgdG8gYSBwZW5hbHR5IG9yIGFuIGFkanVzdG1lbnQgZm9yIHBhc3Qgb3Zlci1hbGxvY2F0aW9ucykuAAAAAAAAEXNoYXJlc19jb3JyZWN0aW9uAAAAAAAACwAAAOJSZXByZXNlbnRzIHRoZSB0b3RhbCBhbW91bnQgb2YgcmV3YXJkcyB0aGF0IHRoZSB1c2VyIGhhcyB3aXRoZHJhd24gc28gZmFyLgpUaGlzIHZhbHVlIGVuc3VyZXMgdGhhdCBhIHVzZXIgZG9lc24ndCB3aXRoZHJhdyBtb3JlIHRoYW4gdGhleSBhcmUgb3dlZCBhbmQgaXMgdXNlZCB0bwpjYWxjdWxhdGUgdGhlIG5ldCByZXdhcmRzIGEgdXNlciBjYW4gd2l0aGRyYXcgYXQgYW55IGdpdmVuIHRpbWUuAAAAAAARd2l0aGRyYXduX3Jld2FyZHMAAAAAAAAK",
      "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAKAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAADkludmFsaWRNaW5Cb25kAAAAAAACAAAAAAAAABBJbnZhbGlkTWluUmV3YXJkAAAAAwAAAAAAAAALSW52YWxpZEJvbmQAAAAABAAAAAAAAAAMVW5hdXRob3JpemVkAAAABQAAAAAAAAASTWluUmV3YXJkTm90RW5vdWdoAAAAAAAGAAAAAAAAAA5SZXdhcmRzSW52YWxpZAAAAAAABwAAAAAAAAANU3Rha2VOb3RGb3VuZAAAAAAAAAgAAAAAAAAAC0ludmFsaWRUaW1lAAAAAAkAAAAAAAAAEkRpc3RyaWJ1dGlvbkV4aXN0cwAAAAAACg==",
      "AAAAAQAAAAAAAAAAAAAADkNvbmZpZ1Jlc3BvbnNlAAAAAAABAAAAAAAAAAZjb25maWcAAAAAB9AAAAAGQ29uZmlnAAA=",
      "AAAAAQAAAAAAAAAAAAAADlN0YWtlZFJlc3BvbnNlAAAAAAABAAAAAAAAAAZzdGFrZXMAAAAAA+oAAAfQAAAABVN0YWtlAAAA",
      "AAAAAQAAAAAAAAAAAAAAEEFubnVhbGl6ZWRSZXdhcmQAAAACAAAAAAAAAAZhbW91bnQAAAAAABAAAAAAAAAABWFzc2V0AAAAAAAAEw==",
      "AAAAAQAAAAAAAAAAAAAAGUFubnVhbGl6ZWRSZXdhcmRzUmVzcG9uc2UAAAAAAAABAAAAAAAAAAdyZXdhcmRzAAAAA+oAAAfQAAAAEEFubnVhbGl6ZWRSZXdhcmQ=",
      "AAAAAQAAAAAAAAAAAAAAEldpdGhkcmF3YWJsZVJld2FyZAAAAAAAAgAAAAAAAAAOcmV3YXJkX2FkZHJlc3MAAAAAABMAAAAAAAAADXJld2FyZF9hbW91bnQAAAAAAAAK",
      "AAAAAQAAAAAAAAAAAAAAG1dpdGhkcmF3YWJsZVJld2FyZHNSZXNwb25zZQAAAAABAAAAQUFtb3VudCBvZiByZXdhcmRzIGFzc2lnbmVkIGZvciB3aXRoZHJhd2FsIGZyb20gdGhlIGdpdmVuIGFkZHJlc3MuAAAAAAAAB3Jld2FyZHMAAAAD6gAAB9AAAAASV2l0aGRyYXdhYmxlUmV3YXJkAAA=",
      "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAABQAAAAAAAAAIbHBfdG9rZW4AAAATAAAAAAAAAAdtYW5hZ2VyAAAAABMAAAAAAAAACG1pbl9ib25kAAAACwAAAAAAAAAKbWluX3Jld2FyZAAAAAAACwAAAAAAAAAFb3duZXIAAAAAAAAT",
      "AAAAAQAAAAAAAAAAAAAABVN0YWtlAAAAAAAAAgAAABtUaGUgYW1vdW50IG9mIHN0YWtlZCB0b2tlbnMAAAAABXN0YWtlAAAAAAAACwAAACVUaGUgdGltZXN0YW1wIHdoZW4gdGhlIHN0YWtlIHdhcyBtYWRlAAAAAAAAD3N0YWtlX3RpbWVzdGFtcAAAAAAG",
      "AAAAAQAAAAAAAAAAAAAAC0JvbmRpbmdJbmZvAAAAAAQAAAAnTGFzdCB0aW1lIHdoZW4gdXNlciBoYXMgY2xhaW1lZCByZXdhcmRzAAAAABBsYXN0X3Jld2FyZF90aW1lAAAABgAAAZpUaGUgcmV3YXJkcyBkZWJ0IGlzIGEgbWVjaGFuaXNtIHRvIGRldGVybWluZSBob3cgbXVjaCBhIHVzZXIgaGFzIGFscmVhZHkgYmVlbiBjcmVkaXRlZCBpbiB0ZXJtcyBvZiBzdGFraW5nIHJld2FyZHMuCldoZW5ldmVyIGEgdXNlciBkZXBvc2l0cyBvciB3aXRoZHJhd3Mgc3Rha2VkIHRva2VucyB0byB0aGUgcG9vbCwgdGhlIHJld2FyZHMgZm9yIHRoZSB1c2VyIGlzIHVwZGF0ZWQgYmFzZWQgb24gdGhlCmFjY3VtdWxhdGVkIHJld2FyZHMgcGVyIHNoYXJlLCBhbmQgdGhlIGRpZmZlcmVuY2UgaXMgc3RvcmVkIGFzIHJld2FyZCBkZWJ0LiBXaGVuIGNsYWltaW5nIHJld2FyZHMsIHRoaXMgcmV3YXJkIGRlYnQKaXMgdXNlZCB0byBkZXRlcm1pbmUgaG93IG11Y2ggcmV3YXJkcyBhIHVzZXIgY2FuIGFjdHVhbGx5IGNsYWltLgAAAAAAC3Jld2FyZF9kZWJ0AAAAAAoAAAAnVmVjIG9mIHN0YWtlcyBzb3J0ZWQgYnkgc3Rha2UgdGltZXN0YW1wAAAAAAZzdGFrZXMAAAAAA+oAAAfQAAAABVN0YWtlAAAAAAAAHVRvdGFsIGFtb3VudCBvZiBzdGFrZWQgdG9rZW5zAAAAAAAAC3RvdGFsX3N0YWtlAAAAAAo=",
      "AAAAAgAAAAtDdXJ2ZSB0eXBlcwAAAAAAAAAABUN1cnZlAAAAAAAAAwAAAAEAAAAxQ29uc3RhbiBjdXJ2ZSwgaXQgd2lsbCBhbHdheXMgaGF2ZSB0aGUgc2FtZSB2YWx1ZQAAAAAAAAhDb25zdGFudAAAAAEAAAAKAAAAAQAAAE5MaW5lYXIgY3VydmUgdGhhdCBncm93IGxpbmVhcmx5IGJ1dCBsYXRlcgp0ZW5kcyB0byBhIGNvbnN0YW50IHNhdHVyYXRlZCB2YWx1ZS4AAAAAABBTYXR1cmF0aW5nTGluZWFyAAAAAQAAB9AAAAAQU2F0dXJhdGluZ0xpbmVhcgAAAAEAAAAbQ3VydmUgd2l0aCBkaWZmZXJlbnQgc2xvcGVzAAAAAA9QaWVjZXdpc2VMaW5lYXIAAAAAAQAAB9AAAAAPUGllY2V3aXNlTGluZWFyAA==",
      "AAAAAQAAAQ1TYXR1cmF0aW5nIExpbmVhcgokJGYoeCk9XGJlZ2lue2Nhc2VzfQpbbWluKHkpICogYW1vdW50XSwgICYgXHRleHR7aWYgeCA8PSAkeF8xJCB9IFxcXFwKW3kgKiBhbW91bnRdLCAgJiBcdGV4dHtpZiAkeF8xJCA+PSB4IDw9ICR4XzIkIH0gXFxcXApbbWF4KHkpICogYW1vdW50XSwgICYgXHRleHR7aWYgeCA+PSAkeF8yJCB9ClxlbmR7Y2FzZXN9JCQKCm1pbl95IGZvciBhbGwgeCA8PSBtaW5feCwgbWF4X3kgZm9yIGFsbCB4ID49IG1heF94LCBsaW5lYXIgaW4gYmV0d2VlbgAAAAAAAAAAAAAQU2F0dXJhdGluZ0xpbmVhcgAAAAQAAAAjdGltZSB3aGVuIGN1cnZlIGhhcyBmdWxseSBzYXR1cmF0ZWQAAAAABW1heF94AAAAAAAABgAAABttYXggdmFsdWUgYXQgc2F0dXJhdGVkIHRpbWUAAAAABW1heF95AAAAAAAACgAAABV0aW1lIHdoZW4gY3VydmUgc3RhcnQAAAAAAAAFbWluX3gAAAAAAAAGAAAAF21pbiB2YWx1ZSBhdCBzdGFydCB0aW1lAAAAAAVtaW5feQAAAAAAAAo=",
      "AAAAAQAAAVlUaGlzIGlzIGEgZ2VuZXJhbGl6YXRpb24gb2YgU2F0dXJhdGluZ0xpbmVhciwgc3RlcHMgbXVzdCBiZSBhcnJhbmdlZCB3aXRoIGluY3JlYXNpbmcgdGltZSBbYHU2NGBdLgpBbnkgcG9pbnQgYmVmb3JlIGZpcnN0IHN0ZXAgZ2V0cyB0aGUgZmlyc3QgdmFsdWUsIGFmdGVyIGxhc3Qgc3RlcCB0aGUgbGFzdCB2YWx1ZS4KT3RoZXJ3aXNlLCBpdCBpcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdGhlIHR3byBjbG9zZXN0IHBvaW50cy4KVmVjIG9mIGxlbmd0aCAxIC0+IFtgQ29uc3RhbnRgXShDdXJ2ZTo6Q29uc3RhbnQpIC4KVmVjIG9mIGxlbmd0aCAyIC0+IFtgU2F0dXJhdGluZ0xpbmVhcmBdIC4AAAAAAAAAAAAABFN0ZXAAAAACAAAAAAAAAAR0aW1lAAAABgAAAAAAAAAFdmFsdWUAAAAAAAAK",
      "AAAAAQAAAAAAAAAAAAAAD1BpZWNld2lzZUxpbmVhcgAAAAABAAAABXN0ZXBzAAAAAAAABXN0ZXBzAAAAAAAD6gAAB9AAAAAEU3RlcA==",
    ]);
  }
  private readonly parsers = {
    initialize: () => {},
    bond: () => {},
    unbond: () => {},
    createDistributionFlow: () => {},
    distributeRewards: () => {},
    withdrawRewards: () => {},
    fundDistribution: () => {},
    queryConfig: (result: XDR_BASE64 | xdr.ScVal): ConfigResponse =>
      this.spec.funcResToNative("query_config", result),
    queryAdmin: (result: XDR_BASE64 | xdr.ScVal): string =>
      this.spec.funcResToNative("query_admin", result),
    queryStaked: (result: XDR_BASE64 | xdr.ScVal): StakedResponse =>
      this.spec.funcResToNative("query_staked", result),
    queryTotalStaked: (result: XDR_BASE64 | xdr.ScVal): i128 =>
      this.spec.funcResToNative("query_total_staked", result),
    queryAnnualizedRewards: (
      result: XDR_BASE64 | xdr.ScVal
    ): AnnualizedRewardsResponse =>
      this.spec.funcResToNative("query_annualized_rewards", result),
    queryWithdrawableRewards: (
      result: XDR_BASE64 | xdr.ScVal
    ): WithdrawableRewardsResponse =>
      this.spec.funcResToNative("query_withdrawable_rewards", result),
    queryDistributedRewards: (result: XDR_BASE64 | xdr.ScVal): u128 =>
      this.spec.funcResToNative("query_distributed_rewards", result),
    queryUndistributedRewards: (result: XDR_BASE64 | xdr.ScVal): u128 =>
      this.spec.funcResToNative("query_undistributed_rewards", result),
  };
  private txFromJSON = <T>(json: string): AssembledTransaction<T> => {
    const { method, ...tx } = JSON.parse(json);
    return AssembledTransaction.fromJSON(
      {
        ...this.options,
        method,
        // @ts-ignore
        parseResultXdr: this.parsers[method],
      },
      tx
    );
  };
  public readonly fromJSON = {
    initialize: this.txFromJSON<
      ReturnType<(typeof this.parsers)["initialize"]>
    >,
    bond: this.txFromJSON<ReturnType<(typeof this.parsers)["bond"]>>,
    unbond: this.txFromJSON<ReturnType<(typeof this.parsers)["unbond"]>>,
    createDistributionFlow: this.txFromJSON<
      ReturnType<(typeof this.parsers)["createDistributionFlow"]>
    >,
    distributeRewards: this.txFromJSON<
      ReturnType<(typeof this.parsers)["distributeRewards"]>
    >,
    withdrawRewards: this.txFromJSON<
      ReturnType<(typeof this.parsers)["withdrawRewards"]>
    >,
    fundDistribution: this.txFromJSON<
      ReturnType<(typeof this.parsers)["fundDistribution"]>
    >,
    queryConfig: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryConfig"]>
    >,
    queryAdmin: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryAdmin"]>
    >,
    queryStaked: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryStaked"]>
    >,
    queryTotalStaked: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryTotalStaked"]>
    >,
    queryAnnualizedRewards: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryAnnualizedRewards"]>
    >,
    queryWithdrawableRewards: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryWithdrawableRewards"]>
    >,
    queryDistributedRewards: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryDistributedRewards"]>
    >,
    queryUndistributedRewards: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryUndistributedRewards"]>
    >,
  };
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize = async (
    {
      admin,
      lp_token,
      min_bond,
      min_reward,
      manager,
      owner,
    }: {
      admin: string;
      lp_token: string;
      min_bond: i128;
      min_reward: i128;
      manager: string;
      owner: string;
    },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "initialize",
      args: this.spec.funcArgsToScVals("initialize", {
        admin: new Address(admin),
        lp_token: new Address(lp_token),
        min_bond,
        min_reward,
        manager: new Address(manager),
        owner: new Address(owner),
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["initialize"],
    });
  };

  /**
   * Construct and simulate a bond transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  bond = async (
    { sender, tokens }: { sender: string; tokens: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "bond",
      args: this.spec.funcArgsToScVals("bond", {
        sender: new Address(sender),
        tokens,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["bond"],
    });
  };

  /**
   * Construct and simulate a unbond transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unbond = async (
    {
      sender,
      stake_amount,
      stake_timestamp,
    }: { sender: string; stake_amount: i128; stake_timestamp: u64 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "unbond",
      args: this.spec.funcArgsToScVals("unbond", {
        sender: new Address(sender),
        stake_amount,
        stake_timestamp,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["unbond"],
    });
  };

  /**
   * Construct and simulate a create_distribution_flow transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  createDistributionFlow = async (
    { sender, asset }: { sender: string; asset: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "create_distribution_flow",
      args: this.spec.funcArgsToScVals("create_distribution_flow", {
        sender: new Address(sender),
        asset: new Address(asset),
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["createDistributionFlow"],
    });
  };

  /**
   * Construct and simulate a distribute_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  distributeRewards = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "distribute_rewards",
      args: this.spec.funcArgsToScVals("distribute_rewards", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["distributeRewards"],
    });
  };

  /**
   * Construct and simulate a withdraw_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdrawRewards = async (
    { sender }: { sender: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "withdraw_rewards",
      args: this.spec.funcArgsToScVals("withdraw_rewards", {
        sender: new Address(sender),
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["withdrawRewards"],
    });
  };

  /**
   * Construct and simulate a fund_distribution transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  fundDistribution = async (
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
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "fund_distribution",
      args: this.spec.funcArgsToScVals("fund_distribution", {
        sender: new Address(sender),
        start_time,
        distribution_duration,
        token_address: new Address(token_address),
        token_amount,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["fundDistribution"],
    });
  };

  /**
   * Construct and simulate a query_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryConfig = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_config",
      args: this.spec.funcArgsToScVals("query_config", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryConfig"],
    });
  };

  /**
   * Construct and simulate a query_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryAdmin = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_admin",
      args: this.spec.funcArgsToScVals("query_admin", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryAdmin"],
    });
  };

  /**
   * Construct and simulate a query_staked transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryStaked = async (
    { address }: { address: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_staked",
      args: this.spec.funcArgsToScVals("query_staked", {
        address: new Address(address),
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryStaked"],
    });
  };

  /**
   * Construct and simulate a query_total_staked transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryTotalStaked = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_total_staked",
      args: this.spec.funcArgsToScVals("query_total_staked", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryTotalStaked"],
    });
  };

  /**
   * Construct and simulate a query_annualized_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryAnnualizedRewards = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_annualized_rewards",
      args: this.spec.funcArgsToScVals("query_annualized_rewards", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryAnnualizedRewards"],
    });
  };

  /**
   * Construct and simulate a query_withdrawable_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryWithdrawableRewards = async (
    { user }: { user: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_withdrawable_rewards",
      args: this.spec.funcArgsToScVals("query_withdrawable_rewards", {
        user: new Address(user),
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryWithdrawableRewards"],
    });
  };

  /**
   * Construct and simulate a query_distributed_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryDistributedRewards = async (
    { asset }: { asset: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_distributed_rewards",
      args: this.spec.funcArgsToScVals("query_distributed_rewards", {
        asset: new Address(asset),
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryDistributedRewards"],
    });
  };

  /**
   * Construct and simulate a query_undistributed_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryUndistributedRewards = async (
    { asset }: { asset: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_undistributed_rewards",
      args: this.spec.funcArgsToScVals("query_undistributed_rewards", {
        asset: new Address(asset),
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryUndistributedRewards"],
    });
  };
}
