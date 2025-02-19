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
  0: { message: "Std" },

  1: { message: "VestingNotFoundForAddress" },

  2: { message: "AllowanceNotFoundForGivenPair" },

  3: { message: "MinterNotFound" },

  4: { message: "NoBalanceFoundForAddress" },

  5: { message: "NoConfigFound" },

  6: { message: "NoAdminFound" },

  7: { message: "MissingBalance" },

  8: { message: "VestingComplexityTooHigh" },

  9: { message: "TotalVestedOverCapacity" },

  10: { message: "InvalidTransferAmount" },

  11: { message: "CantMoveVestingTokens" },

  12: { message: "NotEnoughCapacity" },

  13: { message: "NotAuthorized" },

  14: { message: "NeverFullyVested" },

  15: { message: "VestsMoreThanSent" },

  16: { message: "InvalidBurnAmount" },

  17: { message: "InvalidMintAmount" },

  18: { message: "InvalidAllowanceAmount" },

  19: { message: "DuplicateInitialBalanceAddresses" },

  20: { message: "CurveError" },

  21: { message: "NoWhitelistFound" },

  22: { message: "NoTokenInfoFound" },

  23: { message: "NoVestingComplexityValueFound" },

  24: { message: "NoAddressesToAdd" },

  25: { message: "NoEnoughtTokensToStart" },

  26: { message: "NotEnoughBalance" },

  27: { message: "VestingBothPresent" },

  28: { message: "VestingNonePresent" },

  29: { message: "CurveConstant" },

  30: { message: "CurveSLNotDecreasing" },

  31: { message: "AlreadyInitialized" },

  32: { message: "AdminNotFound" },

  33: { message: "ContractMathError" },
};

export interface VestingTokenInfo {
  address: string;
  decimals: u32;
  name: string;
  symbol: string;
}

export interface VestingSchedule {
  curve: Curve;
  recipient: string;
}

export interface VestingInfo {
  balance: u128;
  recipient: string;
  schedule: Curve;
}

export interface VestingCounterKey {
  recipient: string;
}

export interface MinterInfo {
  address: string;
  mint_capacity: u128;
}

export interface VestingInfoKey {
  index: u64;
  recipient: string;
}

export interface VestingInfoResponse {
  balance: u128;
  index: u64;
  recipient: string;
  schedule: Curve;
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
      vesting_token,
      max_vesting_complexity,
    }: {
      admin: string;
      vesting_token: VestingTokenInfo;
      max_vesting_complexity: u32;
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
   * Construct and simulate a initialize_with_minter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize_with_minter: (
    {
      admin,
      vesting_token,
      max_vesting_complexity,
      minter_info,
    }: {
      admin: string;
      vesting_token: VestingTokenInfo;
      max_vesting_complexity: u32;
      minter_info: MinterInfo;
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
   * Construct and simulate a create_vesting_schedules transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_vesting_schedules: (
    { vesting_schedules }: { vesting_schedules: Array<VestingSchedule> },
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
   * Construct and simulate a claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  claim: (
    { sender, index }: { sender: string; index: u64 },
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
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn: (
    { sender, amount }: { sender: string; amount: u128 },
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
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mint: (
    { sender, amount }: { sender: string; amount: i128 },
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
   * Construct and simulate a update_minter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_minter: (
    { sender, new_minter }: { sender: string; new_minter: string },
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
   * Construct and simulate a update_minter_capacity transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_minter_capacity: (
    { sender, new_capacity }: { sender: string; new_capacity: u128 },
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
   * Construct and simulate a query_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_balance: (
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
  ) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a query_vesting_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_vesting_info: (
    { address, index }: { address: string; index: u64 },
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
  ) => Promise<AssembledTransaction<VestingInfoResponse>>;

  /**
   * Construct and simulate a query_all_vesting_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_all_vesting_info: (
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
  ) => Promise<AssembledTransaction<Array<VestingInfoResponse>>>;

  /**
   * Construct and simulate a query_token_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_token_info: (options?: {
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
  }) => Promise<AssembledTransaction<VestingTokenInfo>>;

  /**
   * Construct and simulate a query_minter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_minter: (options?: {
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
  }) => Promise<AssembledTransaction<MinterInfo>>;

  /**
   * Construct and simulate a query_vesting_contract_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_vesting_contract_balance: (options?: {
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
   * Construct and simulate a query_available_to_claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_available_to_claim: (
    { address, index }: { address: string; index: u64 },
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
  ) => Promise<AssembledTransaction<i128>>;

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
    return ContractClient.deploy(null, options);
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAA12ZXN0aW5nX3Rva2VuAAAAAAAH0AAAABBWZXN0aW5nVG9rZW5JbmZvAAAAAAAAABZtYXhfdmVzdGluZ19jb21wbGV4aXR5AAAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAAWaW5pdGlhbGl6ZV93aXRoX21pbnRlcgAAAAAABAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAA12ZXN0aW5nX3Rva2VuAAAAAAAH0AAAABBWZXN0aW5nVG9rZW5JbmZvAAAAAAAAABZtYXhfdmVzdGluZ19jb21wbGV4aXR5AAAAAAAEAAAAAAAAAAttaW50ZXJfaW5mbwAAAAfQAAAACk1pbnRlckluZm8AAAAAAAA=",
        "AAAAAAAAAAAAAAAYY3JlYXRlX3Zlc3Rpbmdfc2NoZWR1bGVzAAAAAQAAAAAAAAARdmVzdGluZ19zY2hlZHVsZXMAAAAAAAPqAAAH0AAAAA9WZXN0aW5nU2NoZWR1bGUAAAAAAA==",
        "AAAAAAAAAAAAAAAFY2xhaW0AAAAAAAACAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAABWluZGV4AAAAAAAABgAAAAA=",
        "AAAAAAAAAAAAAAAEYnVybgAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAA==",
        "AAAAAAAAAAAAAAAEbWludAAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAANdXBkYXRlX21pbnRlcgAAAAAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAKbmV3X21pbnRlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAWdXBkYXRlX21pbnRlcl9jYXBhY2l0eQAAAAAAAgAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAxuZXdfY2FwYWNpdHkAAAAKAAAAAA==",
        "AAAAAAAAAAAAAAANcXVlcnlfYmFsYW5jZQAAAAAAAAEAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAScXVlcnlfdmVzdGluZ19pbmZvAAAAAAACAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAABWluZGV4AAAAAAAABgAAAAEAAAfQAAAAE1Zlc3RpbmdJbmZvUmVzcG9uc2UA",
        "AAAAAAAAAAAAAAAWcXVlcnlfYWxsX3Zlc3RpbmdfaW5mbwAAAAAAAQAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAQAAA+oAAAfQAAAAE1Zlc3RpbmdJbmZvUmVzcG9uc2UA",
        "AAAAAAAAAAAAAAAQcXVlcnlfdG9rZW5faW5mbwAAAAAAAAABAAAH0AAAABBWZXN0aW5nVG9rZW5JbmZv",
        "AAAAAAAAAAAAAAAMcXVlcnlfbWludGVyAAAAAAAAAAEAAAfQAAAACk1pbnRlckluZm8AAA==",
        "AAAAAAAAAAAAAAAecXVlcnlfdmVzdGluZ19jb250cmFjdF9iYWxhbmNlAAAAAAAAAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAYcXVlcnlfYXZhaWxhYmxlX3RvX2NsYWltAAAAAgAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAAAAAAVpbmRleAAAAAAAAAYAAAABAAAACw==",
        "AAAAAAAAAAAAAAAGdXBkYXRlAAAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAARbWlncmF0ZV9hZG1pbl9rZXkAAAAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAWYWRkX25ld19rZXlfdG9fc3RvcmFnZQAAAAAAAAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAiAAAAAAAAAANTdGQAAAAAAAAAAAAAAAAZVmVzdGluZ05vdEZvdW5kRm9yQWRkcmVzcwAAAAAAAAEAAAAAAAAAHUFsbG93YW5jZU5vdEZvdW5kRm9yR2l2ZW5QYWlyAAAAAAAAAgAAAAAAAAAOTWludGVyTm90Rm91bmQAAAAAAAMAAAAAAAAAGE5vQmFsYW5jZUZvdW5kRm9yQWRkcmVzcwAAAAQAAAAAAAAADU5vQ29uZmlnRm91bmQAAAAAAAAFAAAAAAAAAAxOb0FkbWluRm91bmQAAAAGAAAAAAAAAA5NaXNzaW5nQmFsYW5jZQAAAAAABwAAAAAAAAAYVmVzdGluZ0NvbXBsZXhpdHlUb29IaWdoAAAACAAAAAAAAAAXVG90YWxWZXN0ZWRPdmVyQ2FwYWNpdHkAAAAACQAAAAAAAAAVSW52YWxpZFRyYW5zZmVyQW1vdW50AAAAAAAACgAAAAAAAAAVQ2FudE1vdmVWZXN0aW5nVG9rZW5zAAAAAAAACwAAAAAAAAARTm90RW5vdWdoQ2FwYWNpdHkAAAAAAAAMAAAAAAAAAA1Ob3RBdXRob3JpemVkAAAAAAAADQAAAAAAAAAQTmV2ZXJGdWxseVZlc3RlZAAAAA4AAAAAAAAAEVZlc3RzTW9yZVRoYW5TZW50AAAAAAAADwAAAAAAAAARSW52YWxpZEJ1cm5BbW91bnQAAAAAAAAQAAAAAAAAABFJbnZhbGlkTWludEFtb3VudAAAAAAAABEAAAAAAAAAFkludmFsaWRBbGxvd2FuY2VBbW91bnQAAAAAABIAAAAAAAAAIER1cGxpY2F0ZUluaXRpYWxCYWxhbmNlQWRkcmVzc2VzAAAAEwAAAAAAAAAKQ3VydmVFcnJvcgAAAAAAFAAAAAAAAAAQTm9XaGl0ZWxpc3RGb3VuZAAAABUAAAAAAAAAEE5vVG9rZW5JbmZvRm91bmQAAAAWAAAAAAAAAB1Ob1Zlc3RpbmdDb21wbGV4aXR5VmFsdWVGb3VuZAAAAAAAABcAAAAAAAAAEE5vQWRkcmVzc2VzVG9BZGQAAAAYAAAAAAAAABZOb0Vub3VnaHRUb2tlbnNUb1N0YXJ0AAAAAAAZAAAAAAAAABBOb3RFbm91Z2hCYWxhbmNlAAAAGgAAAAAAAAASVmVzdGluZ0JvdGhQcmVzZW50AAAAAAAbAAAAAAAAABJWZXN0aW5nTm9uZVByZXNlbnQAAAAAABwAAAAAAAAADUN1cnZlQ29uc3RhbnQAAAAAAAAdAAAAAAAAABRDdXJ2ZVNMTm90RGVjcmVhc2luZwAAAB4AAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAHwAAAAAAAAANQWRtaW5Ob3RGb3VuZAAAAAAAACAAAAAAAAAAEUNvbnRyYWN0TWF0aEVycm9yAAAAAAAAIQ==",
        "AAAAAQAAAAAAAAAAAAAAEFZlc3RpbmdUb2tlbkluZm8AAAAEAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAACGRlY2ltYWxzAAAABAAAAAAAAAAEbmFtZQAAABAAAAAAAAAABnN5bWJvbAAAAAAAEA==",
        "AAAAAQAAAAAAAAAAAAAAD1Zlc3RpbmdTY2hlZHVsZQAAAAACAAAAAAAAAAVjdXJ2ZQAAAAAAB9AAAAAFQ3VydmUAAAAAAAAAAAAACXJlY2lwaWVudAAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAC1Zlc3RpbmdJbmZvAAAAAAMAAAAAAAAAB2JhbGFuY2UAAAAACgAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAIc2NoZWR1bGUAAAfQAAAABUN1cnZlAAAA",
        "AAAAAQAAAAAAAAAAAAAAEVZlc3RpbmdDb3VudGVyS2V5AAAAAAAAAQAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAACk1pbnRlckluZm8AAAAAAAIAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAAAAAANbWludF9jYXBhY2l0eQAAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAADlZlc3RpbmdJbmZvS2V5AAAAAAACAAAAAAAAAAVpbmRleAAAAAAAAAYAAAAAAAAACXJlY2lwaWVudAAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAE1Zlc3RpbmdJbmZvUmVzcG9uc2UAAAAABAAAAAAAAAAHYmFsYW5jZQAAAAAKAAAAAAAAAAVpbmRleAAAAAAAAAYAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAACHNjaGVkdWxlAAAH0AAAAAVDdXJ2ZQAAAA==",
        "AAAAAgAAAAtDdXJ2ZSB0eXBlcwAAAAAAAAAABUN1cnZlAAAAAAAAAwAAAAEAAAAxQ29uc3RhbiBjdXJ2ZSwgaXQgd2lsbCBhbHdheXMgaGF2ZSB0aGUgc2FtZSB2YWx1ZQAAAAAAAAhDb25zdGFudAAAAAEAAAAKAAAAAQAAAE5MaW5lYXIgY3VydmUgdGhhdCBncm93IGxpbmVhcmx5IGJ1dCBsYXRlcgp0ZW5kcyB0byBhIGNvbnN0YW50IHNhdHVyYXRlZCB2YWx1ZS4AAAAAABBTYXR1cmF0aW5nTGluZWFyAAAAAQAAB9AAAAAQU2F0dXJhdGluZ0xpbmVhcgAAAAEAAAAbQ3VydmUgd2l0aCBkaWZmZXJlbnQgc2xvcGVzAAAAAA9QaWVjZXdpc2VMaW5lYXIAAAAAAQAAB9AAAAAPUGllY2V3aXNlTGluZWFyAA==",
        "AAAAAQAAAQ1TYXR1cmF0aW5nIExpbmVhcgokJGYoeCk9XGJlZ2lue2Nhc2VzfQpbbWluKHkpICogYW1vdW50XSwgICYgXHRleHR7aWYgeCA8PSAkeF8xJCB9IFxcXFwKW3kgKiBhbW91bnRdLCAgJiBcdGV4dHtpZiAkeF8xJCA+PSB4IDw9ICR4XzIkIH0gXFxcXApbbWF4KHkpICogYW1vdW50XSwgICYgXHRleHR7aWYgeCA+PSAkeF8yJCB9ClxlbmR7Y2FzZXN9JCQKCm1pbl95IGZvciBhbGwgeCA8PSBtaW5feCwgbWF4X3kgZm9yIGFsbCB4ID49IG1heF94LCBsaW5lYXIgaW4gYmV0d2VlbgAAAAAAAAAAAAAQU2F0dXJhdGluZ0xpbmVhcgAAAAQAAAAjdGltZSB3aGVuIGN1cnZlIGhhcyBmdWxseSBzYXR1cmF0ZWQAAAAABW1heF94AAAAAAAABgAAABttYXggdmFsdWUgYXQgc2F0dXJhdGVkIHRpbWUAAAAABW1heF95AAAAAAAACgAAABV0aW1lIHdoZW4gY3VydmUgc3RhcnQAAAAAAAAFbWluX3gAAAAAAAAGAAAAF21pbiB2YWx1ZSBhdCBzdGFydCB0aW1lAAAAAAVtaW5feQAAAAAAAAo=",
        "AAAAAQAAAVlUaGlzIGlzIGEgZ2VuZXJhbGl6YXRpb24gb2YgU2F0dXJhdGluZ0xpbmVhciwgc3RlcHMgbXVzdCBiZSBhcnJhbmdlZCB3aXRoIGluY3JlYXNpbmcgdGltZSBbYHU2NGBdLgpBbnkgcG9pbnQgYmVmb3JlIGZpcnN0IHN0ZXAgZ2V0cyB0aGUgZmlyc3QgdmFsdWUsIGFmdGVyIGxhc3Qgc3RlcCB0aGUgbGFzdCB2YWx1ZS4KT3RoZXJ3aXNlLCBpdCBpcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdGhlIHR3byBjbG9zZXN0IHBvaW50cy4KVmVjIG9mIGxlbmd0aCAxIC0+IFtgQ29uc3RhbnRgXShDdXJ2ZTo6Q29uc3RhbnQpIC4KVmVjIG9mIGxlbmd0aCAyIC0+IFtgU2F0dXJhdGluZ0xpbmVhcmBdIC4AAAAAAAAAAAAABFN0ZXAAAAACAAAAAAAAAAR0aW1lAAAABgAAAAAAAAAFdmFsdWUAAAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAAD1BpZWNld2lzZUxpbmVhcgAAAAABAAAABXN0ZXBzAAAAAAAABXN0ZXBzAAAAAAAD6gAAB9AAAAAEU3RlcA==",
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
    initialize_with_minter: this.txFromJSON<null>,
    create_vesting_schedules: this.txFromJSON<null>,
    claim: this.txFromJSON<null>,
    burn: this.txFromJSON<null>,
    mint: this.txFromJSON<null>,
    update_minter: this.txFromJSON<null>,
    update_minter_capacity: this.txFromJSON<null>,
    query_balance: this.txFromJSON<i128>,
    query_vesting_info: this.txFromJSON<VestingInfoResponse>,
    query_all_vesting_info: this.txFromJSON<Array<VestingInfoResponse>>,
    query_token_info: this.txFromJSON<VestingTokenInfo>,
    query_minter: this.txFromJSON<MinterInfo>,
    query_vesting_contract_balance: this.txFromJSON<i128>,
    query_available_to_claim: this.txFromJSON<i128>,
    update: this.txFromJSON<null>,
    migrate_admin_key: this.txFromJSON<Result<void>>,
    add_new_key_to_storage: this.txFromJSON<Result<void>>,
  };
}
