import { Buffer } from "buffer";
import type { i128, u128, u32, u64 } from "@stellar/stellar-sdk/contract";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";

export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  unknown: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    contractId: "CAJBBU2MFQUZEVMBJAHDGHJWT55BG24RFEPS3XCRH7BEX3LNNZVI7ZKX",
  },
} as const;

export const Errors = {
  0: { message: "" },
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
  14: { message: "" },
  15: { message: "" },
  16: { message: "" },
  17: { message: "" },
  18: { message: "" },
  19: { message: "" },
  20: { message: "" },
  21: { message: "" },
  22: { message: "" },
  23: { message: "" },
  24: { message: "" },
  25: { message: "" },
  26: { message: "" },
  27: { message: "" },
  28: { message: "" },
  29: { message: "" },
  30: { message: "" },
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

export interface VestingInfoKey {
  index: u64;
  recipient: string;
}

/**
 * Curve types
 */
export type Curve =
  | { tag: "Constant"; values: readonly [u128] }
  | {
      tag: "SaturatingLinear";
      values: readonly [SaturatingLinear];
    }
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
  ) => Promise<AssembledTransaction<VestingInfo>>;

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
  ) => Promise<AssembledTransaction<Array<VestingInfo>>>;

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
}

export class Client extends ContractClient {
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    create_vesting_schedules: this.txFromJSON<null>,
    claim: this.txFromJSON<null>,
    query_balance: this.txFromJSON<i128>,
    query_vesting_info: this.txFromJSON<VestingInfo>,
    query_all_vesting_info: this.txFromJSON<Array<VestingInfo>>,
    query_token_info: this.txFromJSON<VestingTokenInfo>,
    query_vesting_contract_balance: this.txFromJSON<i128>,
    query_available_to_claim: this.txFromJSON<i128>,
    update: this.txFromJSON<null>,
  };

  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAA12ZXN0aW5nX3Rva2VuAAAAAAAH0AAAABBWZXN0aW5nVG9rZW5JbmZvAAAAAAAAABZtYXhfdmVzdGluZ19jb21wbGV4aXR5AAAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAAYY3JlYXRlX3Zlc3Rpbmdfc2NoZWR1bGVzAAAAAQAAAAAAAAARdmVzdGluZ19zY2hlZHVsZXMAAAAAAAPqAAAH0AAAAA9WZXN0aW5nU2NoZWR1bGUAAAAAAA==",
        "AAAAAAAAAAAAAAAFY2xhaW0AAAAAAAACAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAABWluZGV4AAAAAAAABgAAAAA=",
        "AAAAAAAAAAAAAAANcXVlcnlfYmFsYW5jZQAAAAAAAAEAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAScXVlcnlfdmVzdGluZ19pbmZvAAAAAAACAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAABWluZGV4AAAAAAAABgAAAAEAAAfQAAAAC1Zlc3RpbmdJbmZvAA==",
        "AAAAAAAAAAAAAAAWcXVlcnlfYWxsX3Zlc3RpbmdfaW5mbwAAAAAAAQAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAQAAA+oAAAfQAAAAC1Zlc3RpbmdJbmZvAA==",
        "AAAAAAAAAAAAAAAQcXVlcnlfdG9rZW5faW5mbwAAAAAAAAABAAAH0AAAABBWZXN0aW5nVG9rZW5JbmZv",
        "AAAAAAAAAAAAAAAecXVlcnlfdmVzdGluZ19jb250cmFjdF9iYWxhbmNlAAAAAAAAAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAYcXVlcnlfYXZhaWxhYmxlX3RvX2NsYWltAAAAAgAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAAAAAAVpbmRleAAAAAAAAAYAAAABAAAACw==",
        "AAAAAAAAAAAAAAAGdXBkYXRlAAAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAfAAAAAAAAAANTdGQAAAAAAAAAAAAAAAAZVmVzdGluZ05vdEZvdW5kRm9yQWRkcmVzcwAAAAAAAAEAAAAAAAAAHUFsbG93YW5jZU5vdEZvdW5kRm9yR2l2ZW5QYWlyAAAAAAAAAgAAAAAAAAAOTWludGVyTm90Rm91bmQAAAAAAAMAAAAAAAAAGE5vQmFsYW5jZUZvdW5kRm9yQWRkcmVzcwAAAAQAAAAAAAAADU5vQ29uZmlnRm91bmQAAAAAAAAFAAAAAAAAAAxOb0FkbWluRm91bmQAAAAGAAAAAAAAAA5NaXNzaW5nQmFsYW5jZQAAAAAABwAAAAAAAAAYVmVzdGluZ0NvbXBsZXhpdHlUb29IaWdoAAAACAAAAAAAAAAXVG90YWxWZXN0ZWRPdmVyQ2FwYWNpdHkAAAAACQAAAAAAAAAVSW52YWxpZFRyYW5zZmVyQW1vdW50AAAAAAAACgAAAAAAAAAVQ2FudE1vdmVWZXN0aW5nVG9rZW5zAAAAAAAACwAAAAAAAAARTm90RW5vdWdoQ2FwYWNpdHkAAAAAAAAMAAAAAAAAAA1Ob3RBdXRob3JpemVkAAAAAAAADQAAAAAAAAAQTmV2ZXJGdWxseVZlc3RlZAAAAA4AAAAAAAAAEVZlc3RzTW9yZVRoYW5TZW50AAAAAAAADwAAAAAAAAARSW52YWxpZEJ1cm5BbW91bnQAAAAAAAAQAAAAAAAAABFJbnZhbGlkTWludEFtb3VudAAAAAAAABEAAAAAAAAAFkludmFsaWRBbGxvd2FuY2VBbW91bnQAAAAAABIAAAAAAAAAIER1cGxpY2F0ZUluaXRpYWxCYWxhbmNlQWRkcmVzc2VzAAAAEwAAAAAAAAAKQ3VydmVFcnJvcgAAAAAAFAAAAAAAAAAQTm9XaGl0ZWxpc3RGb3VuZAAAABUAAAAAAAAAEE5vVG9rZW5JbmZvRm91bmQAAAAWAAAAAAAAAB1Ob1Zlc3RpbmdDb21wbGV4aXR5VmFsdWVGb3VuZAAAAAAAABcAAAAAAAAAEE5vQWRkcmVzc2VzVG9BZGQAAAAYAAAAAAAAABZOb0Vub3VnaHRUb2tlbnNUb1N0YXJ0AAAAAAAZAAAAAAAAABBOb3RFbm91Z2hCYWxhbmNlAAAAGgAAAAAAAAASVmVzdGluZ0JvdGhQcmVzZW50AAAAAAAbAAAAAAAAABJWZXN0aW5nTm9uZVByZXNlbnQAAAAAABwAAAAAAAAADUN1cnZlQ29uc3RhbnQAAAAAAAAdAAAAAAAAABRDdXJ2ZVNMTm90RGVjcmVhc2luZwAAAB4=",
        "AAAAAQAAAAAAAAAAAAAAEFZlc3RpbmdUb2tlbkluZm8AAAAEAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAACGRlY2ltYWxzAAAABAAAAAAAAAAEbmFtZQAAABAAAAAAAAAABnN5bWJvbAAAAAAAEA==",
        "AAAAAQAAAAAAAAAAAAAAD1Zlc3RpbmdTY2hlZHVsZQAAAAACAAAAAAAAAAVjdXJ2ZQAAAAAAB9AAAAAFQ3VydmUAAAAAAAAAAAAACXJlY2lwaWVudAAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAC1Zlc3RpbmdJbmZvAAAAAAMAAAAAAAAAB2JhbGFuY2UAAAAACgAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAIc2NoZWR1bGUAAAfQAAAABUN1cnZlAAAA",
        "AAAAAQAAAAAAAAAAAAAADlZlc3RpbmdJbmZvS2V5AAAAAAACAAAAAAAAAAVpbmRleAAAAAAAAAYAAAAAAAAACXJlY2lwaWVudAAAAAAAABM=",
        "AAAAAgAAAAtDdXJ2ZSB0eXBlcwAAAAAAAAAABUN1cnZlAAAAAAAAAwAAAAEAAAAxQ29uc3RhbiBjdXJ2ZSwgaXQgd2lsbCBhbHdheXMgaGF2ZSB0aGUgc2FtZSB2YWx1ZQAAAAAAAAhDb25zdGFudAAAAAEAAAAKAAAAAQAAAE5MaW5lYXIgY3VydmUgdGhhdCBncm93IGxpbmVhcmx5IGJ1dCBsYXRlcgp0ZW5kcyB0byBhIGNvbnN0YW50IHNhdHVyYXRlZCB2YWx1ZS4AAAAAABBTYXR1cmF0aW5nTGluZWFyAAAAAQAAB9AAAAAQU2F0dXJhdGluZ0xpbmVhcgAAAAEAAAAbQ3VydmUgd2l0aCBkaWZmZXJlbnQgc2xvcGVzAAAAAA9QaWVjZXdpc2VMaW5lYXIAAAAAAQAAB9AAAAAPUGllY2V3aXNlTGluZWFyAA==",
        "AAAAAQAAAQ1TYXR1cmF0aW5nIExpbmVhcgokJGYoeCk9XGJlZ2lue2Nhc2VzfQpbbWluKHkpICogYW1vdW50XSwgICYgXHRleHR7aWYgeCA8PSAkeF8xJCB9IFxcXFwKW3kgKiBhbW91bnRdLCAgJiBcdGV4dHtpZiAkeF8xJCA+PSB4IDw9ICR4XzIkIH0gXFxcXApbbWF4KHkpICogYW1vdW50XSwgICYgXHRleHR7aWYgeCA+PSAkeF8yJCB9ClxlbmR7Y2FzZXN9JCQKCm1pbl95IGZvciBhbGwgeCA8PSBtaW5feCwgbWF4X3kgZm9yIGFsbCB4ID49IG1heF94LCBsaW5lYXIgaW4gYmV0d2VlbgAAAAAAAAAAAAAQU2F0dXJhdGluZ0xpbmVhcgAAAAQAAAAjdGltZSB3aGVuIGN1cnZlIGhhcyBmdWxseSBzYXR1cmF0ZWQAAAAABW1heF94AAAAAAAABgAAABttYXggdmFsdWUgYXQgc2F0dXJhdGVkIHRpbWUAAAAABW1heF95AAAAAAAACgAAABV0aW1lIHdoZW4gY3VydmUgc3RhcnQAAAAAAAAFbWluX3gAAAAAAAAGAAAAF21pbiB2YWx1ZSBhdCBzdGFydCB0aW1lAAAAAAVtaW5feQAAAAAAAAo=",
        "AAAAAQAAAVlUaGlzIGlzIGEgZ2VuZXJhbGl6YXRpb24gb2YgU2F0dXJhdGluZ0xpbmVhciwgc3RlcHMgbXVzdCBiZSBhcnJhbmdlZCB3aXRoIGluY3JlYXNpbmcgdGltZSBbYHU2NGBdLgpBbnkgcG9pbnQgYmVmb3JlIGZpcnN0IHN0ZXAgZ2V0cyB0aGUgZmlyc3QgdmFsdWUsIGFmdGVyIGxhc3Qgc3RlcCB0aGUgbGFzdCB2YWx1ZS4KT3RoZXJ3aXNlLCBpdCBpcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdGhlIHR3byBjbG9zZXN0IHBvaW50cy4KVmVjIG9mIGxlbmd0aCAxIC0+IFtgQ29uc3RhbnRgXShDdXJ2ZTo6Q29uc3RhbnQpIC4KVmVjIG9mIGxlbmd0aCAyIC0+IFtgU2F0dXJhdGluZ0xpbmVhcmBdIC4AAAAAAAAAAAAABFN0ZXAAAAACAAAAAAAAAAR0aW1lAAAABgAAAAAAAAAFdmFsdWUAAAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAAD1BpZWNld2lzZUxpbmVhcgAAAAABAAAABXN0ZXBzAAAAAAAABXN0ZXBzAAAAAAAD6gAAB9AAAAAEU3RlcA==",
      ]),
      options
    );
  }
}
