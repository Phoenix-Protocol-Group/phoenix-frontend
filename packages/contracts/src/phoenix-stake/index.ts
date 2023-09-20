import * as SorobanClient from "soroban-client";
import { ContractSpec, Address } from "soroban-client";
import { Buffer } from "buffer";
import { invoke as Invoke } from "@phoenix-protocol/utils";
import { methodOptions } from "@phoenix-protocol/utils";
import { i128, u128, u32, u64 } from "../types";

/// Error interface containing the error message
export interface Error_ {
  message: string;
}

export interface Result<T, E extends Error_> {
  unwrap(): T;
  unwrapErr(): E;
  isOk(): boolean;
  isErr(): boolean;
}

export class Ok<T, E extends Error_ = Error_> implements Result<T, E> {
  constructor(readonly value: T) {}
  unwrapErr(): E {
    throw new Error("No error");
  }
  unwrap(): T {
    return this.value;
  }

  isOk(): boolean {
    return true;
  }

  isErr(): boolean {
    return !this.isOk();
  }
}

export class Err<E extends Error_ = Error_> implements Result<any, E> {
  constructor(readonly error: E) {}
  unwrapErr(): E {
    return this.error;
  }
  unwrap(): never {
    throw new Error(this.error.message);
  }

  isOk(): boolean {
    return false;
  }

  isErr(): boolean {
    return !this.isOk();
  }
}

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

const regex = /Error\(Contract, #(\d+)\)/;

function parseError(message: string): Err | undefined {
  const match = message.match(regex);
  if (!match) {
    return undefined;
  }
  if (Errors === undefined) {
    return undefined;
  }
  let i = parseInt(match[1], 10);
  let err: any = Errors[i];
  if (err) {
    return new Err(err);
  }
  return undefined;
}

export const networks = {
  futurenet: {
    networkPassphrase: "Test SDF Future Network ; October 2022",
    contractId: "0",
  },
} as const;

export type DistributionDataKey =
  | { tag: "Curve"; values: readonly [Address] }
  | { tag: "Distribution"; values: readonly [Address] }
  | { tag: "WithdrawAdjustment"; values: readonly [Address] };

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
   * The manager of this distribution
   */
  manager: Address;
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
  shared_correction: i128;
  /**
   * Represents the total amount of rewards that the user has withdrawn so far.
   * This value ensures that a user doesn't withdraw more than they are owed and is used to
   * calculate the net rewards a user can withdraw at any given time.
   */
  withdrawn_rewards: u128;
}

const Errors: Record<number, any> = {
  1: { message: "Initialization errors" },
  2: { message: "Reward errors" },
  3: { message: "" },
  4: { message: "" },
  12: { message: "" },
  13: { message: "" },
  14: { message: "" },
  15: { message: "" },
  16: { message: "" },
  17: { message: "" },
  5: { message: "Stake errros" },
  6: { message: "" },
  7: { message: "" },
  8: { message: "" },
  9: { message: "Storage errors" },
  10: { message: "" },
  11: { message: "Other errors" },
};
export interface ConfigResponse {
  config: Config;
}

export interface StakedResponse {
  stakes: Array<Stake>;
}

export interface AnnualizedRewardsResponse {
  /**
   * None means contract does not know the value - total_staked or total_power could be 0.
   */
  amount: OptionUint;
  info: Address;
}

export interface WithdrawableReward {
  reward_address: Address;
  reward_amount: u128;
}

export interface WithdrawableRewardsResponse {
  /**
   * Amount of rewards assigned for withdrawal from the given address.
   */
  rewards: Array<WithdrawableReward>;
}

export interface Config {
  lp_token: Address;
  max_distributions: u32;
  min_bond: i128;
  min_reward: i128;
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
  total_stake: u128;
}

export type OptionUint =
  | { tag: "Some"; values: readonly [u128] }
  | { tag: "None"; values: void };

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

export class Contract {
  spec: ContractSpec;
  constructor(public readonly options: methodOptions.ClassOptions) {
    this.spec = new ContractSpec([
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAhscF90b2tlbgAAABMAAAAAAAAACG1pbl9ib25kAAAACwAAAAAAAAARbWF4X2Rpc3RyaWJ1dGlvbnMAAAAAAAAEAAAAAAAAAAptaW5fcmV3YXJkAAAAAAALAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAEYm9uZAAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAGdG9rZW5zAAAAAAALAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAGdW5ib25kAAAAAAADAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAADHN0YWtlX2Ftb3VudAAAAAsAAAAAAAAAD3N0YWtlX3RpbWVzdGFtcAAAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAYY3JlYXRlX2Rpc3RyaWJ1dGlvbl9mbG93AAAAAwAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAdtYW5hZ2VyAAAAABMAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAASZGlzdHJpYnV0ZV9yZXdhcmRzAAAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAQd2l0aGRyYXdfcmV3YXJkcwAAAAEAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAARZnVuZF9kaXN0cmlidXRpb24AAAAAAAAFAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAACnN0YXJ0X3RpbWUAAAAAAAYAAAAAAAAAFWRpc3RyaWJ1dGlvbl9kdXJhdGlvbgAAAAAAAAYAAAAAAAAADXRva2VuX2FkZHJlc3MAAAAAAAATAAAAAAAAAAx0b2tlbl9hbW91bnQAAAALAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAMcXVlcnlfY29uZmlnAAAAAAAAAAEAAAPpAAAH0AAAAA5Db25maWdSZXNwb25zZQAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAALcXVlcnlfYWRtaW4AAAAAAAAAAAEAAAPpAAAAEwAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAMcXVlcnlfc3Rha2VkAAAAAQAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAQAAA+kAAAfQAAAADlN0YWtlZFJlc3BvbnNlAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAAScXVlcnlfdG90YWxfc3Rha2VkAAAAAAAAAAAAAQAAA+kAAAALAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAAYcXVlcnlfYW5udWFsaXplZF9yZXdhcmRzAAAAAAAAAAEAAAPpAAAH0AAAABlBbm51YWxpemVkUmV3YXJkc1Jlc3BvbnNlAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAAacXVlcnlfd2l0aGRyYXdhYmxlX3Jld2FyZHMAAAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAA+kAAAfQAAAAG1dpdGhkcmF3YWJsZVJld2FyZHNSZXNwb25zZQAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAAZcXVlcnlfZGlzdHJpYnV0ZWRfcmV3YXJkcwAAAAAAAAEAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAEAAAPpAAAACgAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAbcXVlcnlfdW5kaXN0cmlidXRlZF9yZXdhcmRzAAAAAAEAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAEAAAPpAAAACgAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAgAAAAAAAAAAAAAAE0Rpc3RyaWJ1dGlvbkRhdGFLZXkAAAAAAwAAAAEAAAAAAAAABUN1cnZlAAAAAAAAAQAAABMAAAABAAAAAAAAAAxEaXN0cmlidXRpb24AAAABAAAAEwAAAAEAAAAAAAAAEldpdGhkcmF3QWRqdXN0bWVudAAAAAAAAQAAABM=",
      "AAAAAQAAAAAAAAAAAAAADERpc3RyaWJ1dGlvbgAAAAcAAAAVQm9udXMgcGVyIHN0YWtpbmcgZGF5AAAAAAAAEWJvbnVzX3Blcl9kYXlfYnBzAAAAAAAABgAAACtUb3RhbCByZXdhcmRzIGRpc3RyaWJ1dGVkIGJ5IHRoaXMgY29udHJhY3QuAAAAABFkaXN0cmlidXRlZF90b3RhbAAAAAAAAAoAAAAgVGhlIG1hbmFnZXIgb2YgdGhpcyBkaXN0cmlidXRpb24AAAAHbWFuYWdlcgAAAAATAAAAI01heCBib251cyBmb3Igc3Rha2luZyBhZnRlciA2MCBkYXlzAAAAAA1tYXhfYm9udXNfYnBzAAAAAAAABgAAAF5TaGFyZXMgd2hpY2ggd2VyZSBub3QgZnVsbHkgZGlzdHJpYnV0ZWQgb24gcHJldmlvdXMgZGlzdHJpYnV0aW9ucywgYW5kIHNob3VsZCBiZSByZWRpc3RyaWJ1dGVkAAAAAAAPc2hhcmVzX2xlZnRvdmVyAAAAAAYAAAAlSG93IG1hbnkgc2hhcmVzIGlzIHNpbmdsZSBwb2ludCB3b3J0aAAAAAAAABBzaGFyZXNfcGVyX3BvaW50AAAACgAAACBUb3RhbCByZXdhcmRzIG5vdCB5ZXQgd2l0aGRyYXduLgAAABJ3aXRoZHJhd2FibGVfdG90YWwAAAAAAAo=",
      "AAAAAQAAAAAAAAAAAAAAEldpdGhkcmF3QWRqdXN0bWVudAAAAAAAAgAAAUVSZXByZXNlbnRzIGEgY29ycmVjdGlvbiB0byB0aGUgcmV3YXJkIHBvaW50cyBmb3IgdGhlIHVzZXIuIFRoaXMgY2FuIGJlIHBvc2l0aXZlIG9yIG5lZ2F0aXZlLgpBIHBvc2l0aXZlIHZhbHVlIGluZGljYXRlcyB0aGF0IHRoZSB1c2VyIHNob3VsZCByZWNlaXZlIGFkZGl0aW9uYWwgcG9pbnRzIChlLmcuLCBmcm9tIGEgYm9udXMgb3IgYW4gZXJyb3IgY29ycmVjdGlvbiksCndoaWxlIGEgbmVnYXRpdmUgdmFsdWUgc2lnbmlmaWVzIGEgcmVkdWN0aW9uIChlLmcuLCBkdWUgdG8gYSBwZW5hbHR5IG9yIGFuIGFkanVzdG1lbnQgZm9yIHBhc3Qgb3Zlci1hbGxvY2F0aW9ucykuAAAAAAAAEXNoYXJlZF9jb3JyZWN0aW9uAAAAAAAACwAAAOJSZXByZXNlbnRzIHRoZSB0b3RhbCBhbW91bnQgb2YgcmV3YXJkcyB0aGF0IHRoZSB1c2VyIGhhcyB3aXRoZHJhd24gc28gZmFyLgpUaGlzIHZhbHVlIGVuc3VyZXMgdGhhdCBhIHVzZXIgZG9lc24ndCB3aXRoZHJhdyBtb3JlIHRoYW4gdGhleSBhcmUgb3dlZCBhbmQgaXMgdXNlZCB0bwpjYWxjdWxhdGUgdGhlIG5ldCByZXdhcmRzIGEgdXNlciBjYW4gd2l0aGRyYXcgYXQgYW55IGdpdmVuIHRpbWUuAAAAAAARd2l0aGRyYXduX3Jld2FyZHMAAAAAAAAK",
      "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAARAAAAFUluaXRpYWxpemF0aW9uIGVycm9ycwAAAAAAABlUb2tlblBlclBvd2VyQ2Fubm90QmVaZXJvAAAAAAAAAQAAAA1SZXdhcmQgZXJyb3JzAAAAAAAAEU1pblJld2FyZFRvb1NtYWxsAAAAAAAAAgAAAAAAAAATTWluUmV3YXJkTm90UmVhY2hlZAAAAAADAAAAAAAAABVOb1Jld2FyZHNGb3JUaGlzQXNzZXQAAAAAAAAEAAAAAAAAACFGdW5kRGlzdHJpYnV0aW9uU3RhcnRUaW1lVG9vRWFybHkAAAAAAAAMAAAAAAAAABdSZXdhcmRzVmFsaWRhdGlvbkZhaWxlZAAAAAANAAAAAAAAABhEaXN0cmlidXRpb25BbHJlYWR5QWRkZWQAAAAOAAAAAAAAABlXaXRoZHJhd0FkanVzdG1lbnRNaXNzaW5nAAAAAAAADwAAAAAAAAAURGlzdHJpYnV0aW9uTm90Rm91bmQAAAAQAAAAAAAAAC1SZXdhcmRzTm90RGlzdHJpYnV0ZWRPckRpc3RyaWJ1dGlvbk5vdENyZWF0ZWQAAAAAAAARAAAADFN0YWtlIGVycnJvcwAAABdNaW5TdGFrZUxlc3NPckVxdWFsWmVybwAAAAAFAAAAAAAAABRTdGFrZUxlc3NUaGVuTWluQm9uZAAAAAYAAAAAAAAADVN0YWtlTm90Rm91bmQAAAAAAAAHAAAAAAAAAB1Ub3RhbFN0YWtlZENhbm5vdEJlWmVyb09yTGVzcwAAAAAAAAgAAAAOU3RvcmFnZSBlcnJvcnMAAAAAAAxDb25maWdOb3RTZXQAAAAJAAAAAAAAAB9GYWlsZWRUb0dldEFkbWluQWRkckZyb21TdG9yYWdlAAAAAAoAAAAMT3RoZXIgZXJyb3JzAAAADFVuYXV0aG9yaXplZAAAAAs=",
      "AAAAAQAAAAAAAAAAAAAADkNvbmZpZ1Jlc3BvbnNlAAAAAAABAAAAAAAAAAZjb25maWcAAAAAB9AAAAAGQ29uZmlnAAA=",
      "AAAAAQAAAAAAAAAAAAAADlN0YWtlZFJlc3BvbnNlAAAAAAABAAAAAAAAAAZzdGFrZXMAAAAAA+oAAAfQAAAABVN0YWtlAAAA",
      "AAAAAQAAAAAAAAAAAAAAGUFubnVhbGl6ZWRSZXdhcmRzUmVzcG9uc2UAAAAAAAACAAAAVU5vbmUgbWVhbnMgY29udHJhY3QgZG9lcyBub3Qga25vdyB0aGUgdmFsdWUgLSB0b3RhbF9zdGFrZWQgb3IgdG90YWxfcG93ZXIgY291bGQgYmUgMC4AAAAAAAAGYW1vdW50AAAAAAfQAAAACk9wdGlvblVpbnQAAAAAAAAAAAAEaW5mbwAAABM=",
      "AAAAAQAAAAAAAAAAAAAAEldpdGhkcmF3YWJsZVJld2FyZAAAAAAAAgAAAAAAAAAOcmV3YXJkX2FkZHJlc3MAAAAAABMAAAAAAAAADXJld2FyZF9hbW91bnQAAAAAAAAK",
      "AAAAAQAAAAAAAAAAAAAAG1dpdGhkcmF3YWJsZVJld2FyZHNSZXNwb25zZQAAAAABAAAAQUFtb3VudCBvZiByZXdhcmRzIGFzc2lnbmVkIGZvciB3aXRoZHJhd2FsIGZyb20gdGhlIGdpdmVuIGFkZHJlc3MuAAAAAAAAB3Jld2FyZHMAAAAD6gAAB9AAAAASV2l0aGRyYXdhYmxlUmV3YXJkAAA=",
      "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAABAAAAAAAAAAIbHBfdG9rZW4AAAATAAAAAAAAABFtYXhfZGlzdHJpYnV0aW9ucwAAAAAAAAQAAAAAAAAACG1pbl9ib25kAAAACwAAAAAAAAAKbWluX3Jld2FyZAAAAAAACw==",
      "AAAAAQAAAAAAAAAAAAAABVN0YWtlAAAAAAAAAgAAABtUaGUgYW1vdW50IG9mIHN0YWtlZCB0b2tlbnMAAAAABXN0YWtlAAAAAAAACwAAACVUaGUgdGltZXN0YW1wIHdoZW4gdGhlIHN0YWtlIHdhcyBtYWRlAAAAAAAAD3N0YWtlX3RpbWVzdGFtcAAAAAAG",
      "AAAAAQAAAAAAAAAAAAAAC0JvbmRpbmdJbmZvAAAAAAQAAAAnTGFzdCB0aW1lIHdoZW4gdXNlciBoYXMgY2xhaW1lZCByZXdhcmRzAAAAABBsYXN0X3Jld2FyZF90aW1lAAAABgAAAZpUaGUgcmV3YXJkcyBkZWJ0IGlzIGEgbWVjaGFuaXNtIHRvIGRldGVybWluZSBob3cgbXVjaCBhIHVzZXIgaGFzIGFscmVhZHkgYmVlbiBjcmVkaXRlZCBpbiB0ZXJtcyBvZiBzdGFraW5nIHJld2FyZHMuCldoZW5ldmVyIGEgdXNlciBkZXBvc2l0cyBvciB3aXRoZHJhd3Mgc3Rha2VkIHRva2VucyB0byB0aGUgcG9vbCwgdGhlIHJld2FyZHMgZm9yIHRoZSB1c2VyIGlzIHVwZGF0ZWQgYmFzZWQgb24gdGhlCmFjY3VtdWxhdGVkIHJld2FyZHMgcGVyIHNoYXJlLCBhbmQgdGhlIGRpZmZlcmVuY2UgaXMgc3RvcmVkIGFzIHJld2FyZCBkZWJ0LiBXaGVuIGNsYWltaW5nIHJld2FyZHMsIHRoaXMgcmV3YXJkIGRlYnQKaXMgdXNlZCB0byBkZXRlcm1pbmUgaG93IG11Y2ggcmV3YXJkcyBhIHVzZXIgY2FuIGFjdHVhbGx5IGNsYWltLgAAAAAAC3Jld2FyZF9kZWJ0AAAAAAoAAAAnVmVjIG9mIHN0YWtlcyBzb3J0ZWQgYnkgc3Rha2UgdGltZXN0YW1wAAAAAAZzdGFrZXMAAAAAA+oAAAfQAAAABVN0YWtlAAAAAAAAHVRvdGFsIGFtb3VudCBvZiBzdGFrZWQgdG9rZW5zAAAAAAAAC3RvdGFsX3N0YWtlAAAAAAo=",
      "AAAAAgAAAAAAAAAAAAAACk9wdGlvblVpbnQAAAAAAAIAAAABAAAAAAAAAARTb21lAAAAAQAAAAoAAAAAAAAAAAAAAAROb25l",
      "AAAAAgAAAAtDdXJ2ZSB0eXBlcwAAAAAAAAAABUN1cnZlAAAAAAAAAwAAAAEAAAAxQ29uc3RhbiBjdXJ2ZSwgaXQgd2lsbCBhbHdheXMgaGF2ZSB0aGUgc2FtZSB2YWx1ZQAAAAAAAAhDb25zdGFudAAAAAEAAAAKAAAAAQAAAE5MaW5lYXIgY3VydmUgdGhhdCBncm93IGxpbmVhcmx5IGJ1dCBsYXRlcgp0ZW5kcyB0byBhIGNvbnN0YW50IHNhdHVyYXRlZCB2YWx1ZS4AAAAAABBTYXR1cmF0aW5nTGluZWFyAAAAAQAAB9AAAAAQU2F0dXJhdGluZ0xpbmVhcgAAAAEAAAAbQ3VydmUgd2l0aCBkaWZmZXJlbnQgc2xvcGVzAAAAAA9QaWVjZXdpc2VMaW5lYXIAAAAAAQAAB9AAAAAPUGllY2V3aXNlTGluZWFyAA==",
      "AAAAAQAAAQ1TYXR1cmF0aW5nIExpbmVhcgokJGYoeCk9XGJlZ2lue2Nhc2VzfQpbbWluKHkpICogYW1vdW50XSwgICYgXHRleHR7aWYgeCA8PSAkeF8xJCB9IFxcXFwKW3kgKiBhbW91bnRdLCAgJiBcdGV4dHtpZiAkeF8xJCA+PSB4IDw9ICR4XzIkIH0gXFxcXApbbWF4KHkpICogYW1vdW50XSwgICYgXHRleHR7aWYgeCA+PSAkeF8yJCB9ClxlbmR7Y2FzZXN9JCQKCm1pbl95IGZvciBhbGwgeCA8PSBtaW5feCwgbWF4X3kgZm9yIGFsbCB4ID49IG1heF94LCBsaW5lYXIgaW4gYmV0d2VlbgAAAAAAAAAAAAAQU2F0dXJhdGluZ0xpbmVhcgAAAAQAAAAjdGltZSB3aGVuIGN1cnZlIGhhcyBmdWxseSBzYXR1cmF0ZWQAAAAABW1heF94AAAAAAAABgAAABttYXggdmFsdWUgYXQgc2F0dXJhdGVkIHRpbWUAAAAABW1heF95AAAAAAAACgAAABV0aW1lIHdoZW4gY3VydmUgc3RhcnQAAAAAAAAFbWluX3gAAAAAAAAGAAAAF21pbiB2YWx1ZSBhdCBzdGFydCB0aW1lAAAAAAVtaW5feQAAAAAAAAo=",
      "AAAAAQAAAVlUaGlzIGlzIGEgZ2VuZXJhbGl6YXRpb24gb2YgU2F0dXJhdGluZ0xpbmVhciwgc3RlcHMgbXVzdCBiZSBhcnJhbmdlZCB3aXRoIGluY3JlYXNpbmcgdGltZSBbYHU2NGBdLgpBbnkgcG9pbnQgYmVmb3JlIGZpcnN0IHN0ZXAgZ2V0cyB0aGUgZmlyc3QgdmFsdWUsIGFmdGVyIGxhc3Qgc3RlcCB0aGUgbGFzdCB2YWx1ZS4KT3RoZXJ3aXNlLCBpdCBpcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdGhlIHR3byBjbG9zZXN0IHBvaW50cy4KVmVjIG9mIGxlbmd0aCAxIC0+IFtgQ29uc3RhbnRgXShDdXJ2ZTo6Q29uc3RhbnQpIC4KVmVjIG9mIGxlbmd0aCAyIC0+IFtgU2F0dXJhdGluZ0xpbmVhcmBdIC4AAAAAAAAAAAAABFN0ZXAAAAACAAAAAAAAAAR0aW1lAAAABgAAAAAAAAAFdmFsdWUAAAAAAAAK",
      "AAAAAQAAAAAAAAAAAAAAD1BpZWNld2lzZUxpbmVhcgAAAAABAAAABXN0ZXBzAAAAAAAABXN0ZXBzAAAAAAAD6gAAB9AAAAAEU3RlcA==",
    ]);
  }
  async initialize<R extends methodOptions.ResponseTypes = undefined>(
    {
      admin,
      lp_token,
      min_bond,
      max_distributions,
      min_reward,
    }: {
      admin: Address;
      lp_token: Address;
      min_bond: i128;
      max_distributions: u32;
      min_reward: i128;
    },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "initialize",
        args: this.spec.funcArgsToScVals("initialize", {
          admin,
          lp_token,
          min_bond,
          max_distributions,
          min_reward,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("initialize", xdr));
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async bond<R extends methodOptions.ResponseTypes = undefined>(
    { sender, tokens }: { sender: Address; tokens: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "bond",
        args: this.spec.funcArgsToScVals("bond", { sender, tokens }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("bond", xdr));
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async unbond<R extends methodOptions.ResponseTypes = undefined>(
    {
      sender,
      stake_amount,
      stake_timestamp,
    }: { sender: Address; stake_amount: i128; stake_timestamp: u64 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "unbond",
        args: this.spec.funcArgsToScVals("unbond", {
          sender,
          stake_amount,
          stake_timestamp,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("unbond", xdr));
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async createDistributionFlow<
    R extends methodOptions.ResponseTypes = undefined
  >(
    {
      sender,
      manager,
      asset,
    }: { sender: Address; manager: Address; asset: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "create_distribution_flow",
        args: this.spec.funcArgsToScVals("create_distribution_flow", {
          sender,
          manager,
          asset,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
          return new Ok(
            this.spec.funcResToNative("create_distribution_flow", xdr)
          );
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async distributeRewards<R extends methodOptions.ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "distribute_rewards",
        args: this.spec.funcArgsToScVals("distribute_rewards", {}),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("distribute_rewards", xdr));
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async withdrawRewards<R extends methodOptions.ResponseTypes = undefined>(
    { sender }: { sender: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "withdraw_rewards",
        args: this.spec.funcArgsToScVals("withdraw_rewards", { sender }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("withdraw_rewards", xdr));
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async fundDistribution<R extends methodOptions.ResponseTypes = undefined>(
    {
      sender,
      start_time,
      distribution_duration,
      token_address,
      token_amount,
    }: {
      sender: Address;
      start_time: u64;
      distribution_duration: u64;
      token_address: Address;
      token_amount: i128;
    },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "fund_distribution",
        args: this.spec.funcArgsToScVals("fund_distribution", {
          sender,
          start_time,
          distribution_duration,
          token_address,
          token_amount,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("fund_distribution", xdr));
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async queryConfig<R extends methodOptions.ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<ConfigResponse> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "query_config",
        args: this.spec.funcArgsToScVals("query_config", {}),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<ConfigResponse> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("query_config", xdr));
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async queryAdmin<R extends methodOptions.ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<Address> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "query_admin",
        args: this.spec.funcArgsToScVals("query_admin", {}),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<Address> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("query_admin", xdr));
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async queryStaked<R extends methodOptions.ResponseTypes = undefined>(
    { address }: { address: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<StakedResponse> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "query_staked",
        args: this.spec.funcArgsToScVals("query_staked", { address }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<StakedResponse> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("query_staked", xdr));
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async queryTotalStaked<R extends methodOptions.ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<i128> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "query_total_staked",
        args: this.spec.funcArgsToScVals("query_total_staked", {}),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<i128> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("query_total_staked", xdr));
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async queryAnnualizedRewards<
    R extends methodOptions.ResponseTypes = undefined
  >(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<AnnualizedRewardsResponse> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "query_annualized_rewards",
        args: this.spec.funcArgsToScVals("query_annualized_rewards", {}),
        ...options,
        ...this.options,
        parseResultXdr: (
          xdr
        ): Ok<AnnualizedRewardsResponse> | Err<Error_> | undefined => {
          return new Ok(
            this.spec.funcResToNative("query_annualized_rewards", xdr)
          );
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async queryWithdrawableRewards<
    R extends methodOptions.ResponseTypes = undefined
  >(
    { user }: { user: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<WithdrawableRewardsResponse> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "query_withdrawable_rewards",
        args: this.spec.funcArgsToScVals("query_withdrawable_rewards", {
          user,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (
          xdr
        ): Ok<WithdrawableRewardsResponse> | Err<Error_> | undefined => {
          return new Ok(
            this.spec.funcResToNative("query_withdrawable_rewards", xdr)
          );
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async queryDistributedRewards<
    R extends methodOptions.ResponseTypes = undefined
  >(
    { asset }: { asset: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<u128> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "query_distributed_rewards",
        args: this.spec.funcArgsToScVals("query_distributed_rewards", {
          asset,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<u128> | Err<Error_> | undefined => {
          return new Ok(
            this.spec.funcResToNative("query_distributed_rewards", xdr)
          );
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }

  async queryUndistributedRewards<
    R extends methodOptions.ResponseTypes = undefined
  >(
    { asset }: { asset: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<u128> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "query_undistributed_rewards",
        args: this.spec.funcArgsToScVals("query_undistributed_rewards", {
          asset,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<u128> | Err<Error_> | undefined => {
          return new Ok(
            this.spec.funcResToNative("query_undistributed_rewards", xdr)
          );
        },
      });
    } catch (e) {
      if (typeof e === "string") {
        let err = parseError(e);
        if (err) return err;
      }
      throw e;
    }
  }
}
