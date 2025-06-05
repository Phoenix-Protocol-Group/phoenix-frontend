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
  u128,
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
  700: { message: "VestingNotFoundForAddress" },

  701: { message: "AllowanceNotFoundForGivenPair" },

  702: { message: "MinterNotFound" },

  703: { message: "NoBalanceFoundForAddress" },

  704: { message: "NoConfigFound" },

  705: { message: "NoAdminFound" },

  706: { message: "MissingBalance" },

  707: { message: "VestingComplexityTooHigh" },

  708: { message: "TotalVestedOverCapacity" },

  709: { message: "InvalidTransferAmount" },

  710: { message: "CantMoveVestingTokens" },

  711: { message: "NotEnoughCapacity" },

  712: { message: "NotAuthorized" },

  713: { message: "NeverFullyVested" },

  714: { message: "VestsMoreThanSent" },

  715: { message: "InvalidBurnAmount" },

  716: { message: "InvalidMintAmount" },

  717: { message: "InvalidAllowanceAmount" },

  718: { message: "DuplicateInitialBalanceAddresses" },

  719: { message: "CurveError" },

  720: { message: "NoWhitelistFound" },

  721: { message: "NoTokenInfoFound" },

  722: { message: "NoVestingComplexityValueFound" },

  723: { message: "NoAddressesToAdd" },

  724: { message: "NoEnoughtTokensToStart" },

  725: { message: "NotEnoughBalance" },

  726: { message: "VestingBothPresent" },

  727: { message: "VestingNonePresent" },

  728: { message: "CurveConstant" },

  729: { message: "CurveSLNotDecreasing" },

  730: { message: "AlreadyInitialized" },

  731: { message: "AdminNotFound" },

  732: { message: "ContractMathError" },

  733: { message: "SameAdmin" },

  734: { message: "NoAdminChangeInPlace" },

  735: { message: "AdminChangeExpired" },

  745: { message: "SameTokenAddress" },

  746: { message: "InvalidMaxComplexity" },
};

export interface Config {
  is_with_minter: boolean;
}

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
  }) => Promise<AssembledTransaction<Config>>;

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
   * Construct and simulate a update_vesting_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_vesting_token: (
    { new_token_address }: { new_token_address: string },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a update_max_complexity transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_max_complexity: (
    { new_max_complexity }: { new_max_complexity: u32 },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

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
}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    {
      admin,
      vesting_token,
      max_vesting_complexity,
      minter_info,
    }: {
      admin: string;
      vesting_token: VestingTokenInfo;
      max_vesting_complexity: u32;
      minter_info: Option<MinterInfo>;
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
      { admin, vesting_token, max_vesting_complexity, minter_info },
      options
    );
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
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
        "AAAAAAAAAAAAAAAMcXVlcnlfY29uZmlnAAAAAAAAAAEAAAfQAAAABkNvbmZpZwAA",
        "AAAAAAAAAAAAAAAecXVlcnlfdmVzdGluZ19jb250cmFjdF9iYWxhbmNlAAAAAAAAAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAYcXVlcnlfYXZhaWxhYmxlX3RvX2NsYWltAAAAAgAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAAAAAAVpbmRleAAAAAAAAAYAAAABAAAACw==",
        "AAAAAAAAAAAAAAAUdXBkYXRlX3Zlc3RpbmdfdG9rZW4AAAABAAAAAAAAABFuZXdfdG9rZW5fYWRkcmVzcwAAAAAAABMAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAVdXBkYXRlX21heF9jb21wbGV4aXR5AAAAAAAAAQAAAAAAAAASbmV3X21heF9jb21wbGV4aXR5AAAAAAAEAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAGdXBkYXRlAAAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAARbWlncmF0ZV9hZG1pbl9rZXkAAAAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAANcHJvcG9zZV9hZG1pbgAAAAAAAAIAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAAAAAACnRpbWVfbGltaXQAAAAAA+gAAAAGAAAAAQAAA+kAAAATAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAATcmV2b2tlX2FkbWluX2NoYW5nZQAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAMYWNjZXB0X2FkbWluAAAAAAAAAAEAAAPpAAAAEwAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAQAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAANdmVzdGluZ190b2tlbgAAAAAAB9AAAAAQVmVzdGluZ1Rva2VuSW5mbwAAAAAAAAAWbWF4X3Zlc3RpbmdfY29tcGxleGl0eQAAAAAABAAAAAAAAAALbWludGVyX2luZm8AAAAD6AAAB9AAAAAKTWludGVySW5mbwAAAAAAAA==",
        "AAAAAAAAAAAAAAAWYWRkX25ld19rZXlfdG9fc3RvcmFnZQAAAAAAAAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAANcXVlcnlfdmVyc2lvbgAAAAAAAAAAAAABAAAAEA==",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAmAAAAAAAAABlWZXN0aW5nTm90Rm91bmRGb3JBZGRyZXNzAAAAAAACvAAAAAAAAAAdQWxsb3dhbmNlTm90Rm91bmRGb3JHaXZlblBhaXIAAAAAAAK9AAAAAAAAAA5NaW50ZXJOb3RGb3VuZAAAAAACvgAAAAAAAAAYTm9CYWxhbmNlRm91bmRGb3JBZGRyZXNzAAACvwAAAAAAAAANTm9Db25maWdGb3VuZAAAAAAAAsAAAAAAAAAADE5vQWRtaW5Gb3VuZAAAAsEAAAAAAAAADk1pc3NpbmdCYWxhbmNlAAAAAALCAAAAAAAAABhWZXN0aW5nQ29tcGxleGl0eVRvb0hpZ2gAAALDAAAAAAAAABdUb3RhbFZlc3RlZE92ZXJDYXBhY2l0eQAAAALEAAAAAAAAABVJbnZhbGlkVHJhbnNmZXJBbW91bnQAAAAAAALFAAAAAAAAABVDYW50TW92ZVZlc3RpbmdUb2tlbnMAAAAAAALGAAAAAAAAABFOb3RFbm91Z2hDYXBhY2l0eQAAAAAAAscAAAAAAAAADU5vdEF1dGhvcml6ZWQAAAAAAALIAAAAAAAAABBOZXZlckZ1bGx5VmVzdGVkAAACyQAAAAAAAAARVmVzdHNNb3JlVGhhblNlbnQAAAAAAALKAAAAAAAAABFJbnZhbGlkQnVybkFtb3VudAAAAAAAAssAAAAAAAAAEUludmFsaWRNaW50QW1vdW50AAAAAAACzAAAAAAAAAAWSW52YWxpZEFsbG93YW5jZUFtb3VudAAAAAACzQAAAAAAAAAgRHVwbGljYXRlSW5pdGlhbEJhbGFuY2VBZGRyZXNzZXMAAALOAAAAAAAAAApDdXJ2ZUVycm9yAAAAAALPAAAAAAAAABBOb1doaXRlbGlzdEZvdW5kAAAC0AAAAAAAAAAQTm9Ub2tlbkluZm9Gb3VuZAAAAtEAAAAAAAAAHU5vVmVzdGluZ0NvbXBsZXhpdHlWYWx1ZUZvdW5kAAAAAAAC0gAAAAAAAAAQTm9BZGRyZXNzZXNUb0FkZAAAAtMAAAAAAAAAFk5vRW5vdWdodFRva2Vuc1RvU3RhcnQAAAAAAtQAAAAAAAAAEE5vdEVub3VnaEJhbGFuY2UAAALVAAAAAAAAABJWZXN0aW5nQm90aFByZXNlbnQAAAAAAtYAAAAAAAAAElZlc3RpbmdOb25lUHJlc2VudAAAAAAC1wAAAAAAAAANQ3VydmVDb25zdGFudAAAAAAAAtgAAAAAAAAAFEN1cnZlU0xOb3REZWNyZWFzaW5nAAAC2QAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAALaAAAAAAAAAA1BZG1pbk5vdEZvdW5kAAAAAAAC2wAAAAAAAAARQ29udHJhY3RNYXRoRXJyb3IAAAAAAALcAAAAAAAAAAlTYW1lQWRtaW4AAAAAAALdAAAAAAAAABROb0FkbWluQ2hhbmdlSW5QbGFjZQAAAt4AAAAAAAAAEkFkbWluQ2hhbmdlRXhwaXJlZAAAAAAC3wAAAAAAAAAQU2FtZVRva2VuQWRkcmVzcwAAAukAAAAAAAAAFEludmFsaWRNYXhDb21wbGV4aXR5AAAC6g==",
        "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAAAQAAAAAAAAAOaXNfd2l0aF9taW50ZXIAAAAAAAE=",
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
        "AAAAAQAAAAAAAAAAAAAAC0FkbWluQ2hhbmdlAAAAAAIAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAAAAAACnRpbWVfbGltaXQAAAAAA+gAAAAG",
        "AAAAAQAAAAAAAAAAAAAAD0F1dG9VbnN0YWtlSW5mbwAAAAACAAAAAAAAAAxzdGFrZV9hbW91bnQAAAALAAAAAAAAAA9zdGFrZV90aW1lc3RhbXAAAAAABg==",
        "AAAAAwAAAAAAAAAAAAAACFBvb2xUeXBlAAAAAgAAAAAAAAADWHlrAAAAAAAAAAAAAAAABlN0YWJsZQAAAAAAAQ==",
      ]),
      options
    );
  }
  public readonly fromJSON = {
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
    query_config: this.txFromJSON<Config>,
    query_vesting_contract_balance: this.txFromJSON<i128>,
    query_available_to_claim: this.txFromJSON<i128>,
    update_vesting_token: this.txFromJSON<Result<void>>,
    update_max_complexity: this.txFromJSON<Result<void>>,
    update: this.txFromJSON<null>,
    migrate_admin_key: this.txFromJSON<Result<void>>,
    propose_admin: this.txFromJSON<Result<string>>,
    revoke_admin_change: this.txFromJSON<Result<void>>,
    accept_admin: this.txFromJSON<Result<string>>,
    add_new_key_to_storage: this.txFromJSON<Result<void>>,
    query_version: this.txFromJSON<string>,
  };
}
