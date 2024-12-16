import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
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
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CB6IQKYTKY7K323F2MWO5776LWX572QKTMAFHR3SGJLG3IOPY7TKIB3M",
  }
} as const

export const Errors = {
  1: {message:"SpreadExceedsLimit"},

  2: {message:"ProvideLiquiditySlippageToleranceTooHigh"},

  3: {message:"WithdrawLiquidityMinimumAmountOfAOrBIsNotSatisfied"},

  4: {message:"ValidateFeeBpsTotalFeesCantBeGreaterThan100"},

  5: {message:"TotalSharesEqualZero"},

  6: {message:"AssetNotInPool"},

  7: {message:"AlreadyInitialized"},

  8: {message:"TokenABiggerThanTokenB"},

  9: {message:"InvalidBps"},

  10: {message:"LowLiquidity"},

  11: {message:"Unauthorized"},

  12: {message:"IncorrectAssetSwap"},

  13: {message:"NewtonMethodFailed"},

  14: {message:"CalcYErr"},

  15: {message:"SwapMinReceivedBiggerThanReturn"},

  16: {message:"ProvideLiquidityBothTokensMustBeMoreThanZero"},

  17: {message:"DivisionByZero"},

  18: {message:"InvalidAMP"},

  19: {message:"TransactionAfterTimestampDeadline"},

  20: {message:"SlippageToleranceExceeded"},

  21: {message:"IssuedSharesLessThanUserRequested"},

  22: {message:"SwapFeeBpsOverLimit"},

  23: {message:"UserDeclinesPoolFee"}
}
export enum PairType {
  Xyk = 0,
  Stable = 1,
}


export interface Config {
  /**
 * Default slippage, in case the customer hasn't specified
 */
default_slippage_bps: i64;
  fee_recipient: string;
  /**
 * The maximum amount of slippage (in bps) that is tolerated during providing liquidity
 */
max_allowed_slippage_bps: i64;
  /**
 * The maximum amount of spread (in bps) that is tolerated during swap
 */
max_allowed_spread_bps: i64;
  pool_type: PairType;
  share_token: string;
  stake_contract: string;
  token_a: string;
  token_b: string;
  /**
 * The total fees (in bps) charged by a pool of this type.
 * In relation to the returned amount of tokens
 */
total_fee_bps: i64;
}


export interface AmplifierParameters {
  init_amp: u64;
  init_amp_time: u64;
  next_amp: u64;
  next_amp_time: u64;
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


export interface StableLiquidityPoolInfo {
  pool_address: string;
  pool_response: PoolResponse;
  total_fee_bps: i64;
}


export interface SimulateSwapResponse {
  ask_amount: i128;
  commission_amount: i128;
  spread_amount: i128;
  total_return: i128;
}


export interface SimulateReverseSwapResponse {
  commission_amount: i128;
  offer_amount: i128;
  spread_amount: i128;
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
  initialize: ({stake_wasm_hash, token_wasm_hash, lp_init_info, factory_addr, _share_token_decimal, share_token_name, share_token_symbol, amp, max_allowed_fee_bps}: {stake_wasm_hash: Buffer, token_wasm_hash: Buffer, lp_init_info: LiquidityPoolInitInfo, factory_addr: string, _share_token_decimal: u32, share_token_name: string, share_token_symbol: string, amp: u64, max_allowed_fee_bps: i64}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a provide_liquidity transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  provide_liquidity: ({sender, desired_a, desired_b, custom_slippage_bps, deadline, min_shares_to_receive}: {sender: string, desired_a: i128, desired_b: i128, custom_slippage_bps: Option<i64>, deadline: Option<u64>, min_shares_to_receive: Option<u128>}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  swap: ({sender, offer_asset, offer_amount, ask_asset_min_amount, max_spread_bps, deadline, max_allowed_fee_bps}: {sender: string, offer_asset: string, offer_amount: i128, ask_asset_min_amount: Option<i128>, max_spread_bps: Option<i64>, deadline: Option<u64>, max_allowed_fee_bps: Option<i64>}, options?: {
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
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a withdraw_liquidity transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_liquidity: ({sender, share_amount, min_a, min_b, deadline}: {sender: string, share_amount: i128, min_a: i128, min_b: i128, deadline: Option<u64>}, options?: {
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
  }) => Promise<AssembledTransaction<readonly [i128, i128]>>

  /**
   * Construct and simulate a update_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_config: ({sender, new_admin, total_fee_bps, fee_recipient, max_allowed_slippage_bps, max_allowed_spread_bps}: {sender: string, new_admin: Option<string>, total_fee_bps: Option<i64>, fee_recipient: Option<string>, max_allowed_slippage_bps: Option<i64>, max_allowed_spread_bps: Option<i64>}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: ({new_wasm_hash}: {new_wasm_hash: Buffer}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

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
  }) => Promise<AssembledTransaction<Config>>

  /**
   * Construct and simulate a query_share_token_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_share_token_address: (options?: {
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
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a query_stake_contract_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_stake_contract_address: (options?: {
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
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a query_pool_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_pool_info: (options?: {
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
  }) => Promise<AssembledTransaction<PoolResponse>>

  /**
   * Construct and simulate a query_pool_info_for_factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_pool_info_for_factory: (options?: {
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
  }) => Promise<AssembledTransaction<StableLiquidityPoolInfo>>

  /**
   * Construct and simulate a simulate_swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  simulate_swap: ({offer_asset, offer_amount}: {offer_asset: string, offer_amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<SimulateSwapResponse>>

  /**
   * Construct and simulate a simulate_reverse_swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  simulate_reverse_swap: ({offer_asset, ask_amount}: {offer_asset: string, ask_amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<SimulateReverseSwapResponse>>

  /**
   * Construct and simulate a query_share transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_share: ({amount}: {amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<readonly [Asset, Asset]>>

  /**
   * Construct and simulate a query_total_issued_lp transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_total_issued_lp: (options?: {
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
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a update transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update: ({new_wasm_hash}: {new_wasm_hash: Buffer}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAACQAAAAAAAAAPc3Rha2Vfd2FzbV9oYXNoAAAAA+4AAAAgAAAAAAAAAA90b2tlbl93YXNtX2hhc2gAAAAD7gAAACAAAAAAAAAADGxwX2luaXRfaW5mbwAAB9AAAAAVTGlxdWlkaXR5UG9vbEluaXRJbmZvAAAAAAAAAAAAAAxmYWN0b3J5X2FkZHIAAAATAAAAAAAAABRfc2hhcmVfdG9rZW5fZGVjaW1hbAAAAAQAAAAAAAAAEHNoYXJlX3Rva2VuX25hbWUAAAAQAAAAAAAAABJzaGFyZV90b2tlbl9zeW1ib2wAAAAAABAAAAAAAAAAA2FtcAAAAAAGAAAAAAAAABNtYXhfYWxsb3dlZF9mZWVfYnBzAAAAAAcAAAAA",
        "AAAAAAAAAAAAAAARcHJvdmlkZV9saXF1aWRpdHkAAAAAAAAGAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAACWRlc2lyZWRfYQAAAAAAAAsAAAAAAAAACWRlc2lyZWRfYgAAAAAAAAsAAAAAAAAAE2N1c3RvbV9zbGlwcGFnZV9icHMAAAAD6AAAAAcAAAAAAAAACGRlYWRsaW5lAAAD6AAAAAYAAAAAAAAAFW1pbl9zaGFyZXNfdG9fcmVjZWl2ZQAAAAAAA+gAAAAKAAAAAA==",
        "AAAAAAAAAAAAAAAEc3dhcAAAAAcAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAALb2ZmZXJfYXNzZXQAAAAAEwAAAAAAAAAMb2ZmZXJfYW1vdW50AAAACwAAAAAAAAAUYXNrX2Fzc2V0X21pbl9hbW91bnQAAAPoAAAACwAAAAAAAAAObWF4X3NwcmVhZF9icHMAAAAAA+gAAAAHAAAAAAAAAAhkZWFkbGluZQAAA+gAAAAGAAAAAAAAABNtYXhfYWxsb3dlZF9mZWVfYnBzAAAAA+gAAAAHAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAASd2l0aGRyYXdfbGlxdWlkaXR5AAAAAAAFAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAADHNoYXJlX2Ftb3VudAAAAAsAAAAAAAAABW1pbl9hAAAAAAAACwAAAAAAAAAFbWluX2IAAAAAAAALAAAAAAAAAAhkZWFkbGluZQAAA+gAAAAGAAAAAQAAA+0AAAACAAAACwAAAAs=",
        "AAAAAAAAAAAAAAANdXBkYXRlX2NvbmZpZwAAAAAAAAYAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAJbmV3X2FkbWluAAAAAAAD6AAAABMAAAAAAAAADXRvdGFsX2ZlZV9icHMAAAAAAAPoAAAABwAAAAAAAAANZmVlX3JlY2lwaWVudAAAAAAAA+gAAAATAAAAAAAAABhtYXhfYWxsb3dlZF9zbGlwcGFnZV9icHMAAAPoAAAABwAAAAAAAAAWbWF4X2FsbG93ZWRfc3ByZWFkX2JwcwAAAAAD6AAAAAcAAAAA",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAMcXVlcnlfY29uZmlnAAAAAAAAAAEAAAfQAAAABkNvbmZpZwAA",
        "AAAAAAAAAAAAAAAZcXVlcnlfc2hhcmVfdG9rZW5fYWRkcmVzcwAAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAccXVlcnlfc3Rha2VfY29udHJhY3RfYWRkcmVzcwAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAPcXVlcnlfcG9vbF9pbmZvAAAAAAAAAAABAAAH0AAAAAxQb29sUmVzcG9uc2U=",
        "AAAAAAAAAAAAAAAbcXVlcnlfcG9vbF9pbmZvX2Zvcl9mYWN0b3J5AAAAAAAAAAABAAAH0AAAABdTdGFibGVMaXF1aWRpdHlQb29sSW5mbwA=",
        "AAAAAAAAAAAAAAANc2ltdWxhdGVfc3dhcAAAAAAAAAIAAAAAAAAAC29mZmVyX2Fzc2V0AAAAABMAAAAAAAAADG9mZmVyX2Ftb3VudAAAAAsAAAABAAAH0AAAABRTaW11bGF0ZVN3YXBSZXNwb25zZQ==",
        "AAAAAAAAAAAAAAAVc2ltdWxhdGVfcmV2ZXJzZV9zd2FwAAAAAAAAAgAAAAAAAAALb2ZmZXJfYXNzZXQAAAAAEwAAAAAAAAAKYXNrX2Ftb3VudAAAAAAACwAAAAEAAAfQAAAAG1NpbXVsYXRlUmV2ZXJzZVN3YXBSZXNwb25zZQA=",
        "AAAAAAAAAAAAAAALcXVlcnlfc2hhcmUAAAAAAQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAA+0AAAACAAAH0AAAAAVBc3NldAAAAAAAB9AAAAAFQXNzZXQAAAA=",
        "AAAAAAAAAAAAAAAVcXVlcnlfdG90YWxfaXNzdWVkX2xwAAAAAAAAAAAAAAEAAAAL",
        "AAAAAAAAAAAAAAAGdXBkYXRlAAAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAXAAAAAAAAABJTcHJlYWRFeGNlZWRzTGltaXQAAAAAAAEAAAAAAAAAKFByb3ZpZGVMaXF1aWRpdHlTbGlwcGFnZVRvbGVyYW5jZVRvb0hpZ2gAAAACAAAAAAAAADJXaXRoZHJhd0xpcXVpZGl0eU1pbmltdW1BbW91bnRPZkFPckJJc05vdFNhdGlzZmllZAAAAAAAAwAAAAAAAAArVmFsaWRhdGVGZWVCcHNUb3RhbEZlZXNDYW50QmVHcmVhdGVyVGhhbjEwMAAAAAAEAAAAAAAAABRUb3RhbFNoYXJlc0VxdWFsWmVybwAAAAUAAAAAAAAADkFzc2V0Tm90SW5Qb29sAAAAAAAGAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAcAAAAAAAAAFlRva2VuQUJpZ2dlclRoYW5Ub2tlbkIAAAAAAAgAAAAAAAAACkludmFsaWRCcHMAAAAAAAkAAAAAAAAADExvd0xpcXVpZGl0eQAAAAoAAAAAAAAADFVuYXV0aG9yaXplZAAAAAsAAAAAAAAAEkluY29ycmVjdEFzc2V0U3dhcAAAAAAADAAAAAAAAAASTmV3dG9uTWV0aG9kRmFpbGVkAAAAAAANAAAAAAAAAAhDYWxjWUVycgAAAA4AAAAAAAAAH1N3YXBNaW5SZWNlaXZlZEJpZ2dlclRoYW5SZXR1cm4AAAAADwAAAAAAAAAsUHJvdmlkZUxpcXVpZGl0eUJvdGhUb2tlbnNNdXN0QmVNb3JlVGhhblplcm8AAAAQAAAAAAAAAA5EaXZpc2lvbkJ5WmVybwAAAAAAEQAAAAAAAAAKSW52YWxpZEFNUAAAAAAAEgAAAAAAAAAhVHJhbnNhY3Rpb25BZnRlclRpbWVzdGFtcERlYWRsaW5lAAAAAAAAEwAAAAAAAAAZU2xpcHBhZ2VUb2xlcmFuY2VFeGNlZWRlZAAAAAAAABQAAAAAAAAAIUlzc3VlZFNoYXJlc0xlc3NUaGFuVXNlclJlcXVlc3RlZAAAAAAAABUAAAAAAAAAE1N3YXBGZWVCcHNPdmVyTGltaXQAAAAAFgAAAAAAAAATVXNlckRlY2xpbmVzUG9vbEZlZQAAAAAX",
        "AAAAAwAAAAAAAAAAAAAACFBhaXJUeXBlAAAAAgAAAAAAAAADWHlrAAAAAAAAAAAAAAAABlN0YWJsZQAAAAAAAQ==",
        "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAACgAAADdEZWZhdWx0IHNsaXBwYWdlLCBpbiBjYXNlIHRoZSBjdXN0b21lciBoYXNuJ3Qgc3BlY2lmaWVkAAAAABRkZWZhdWx0X3NsaXBwYWdlX2JwcwAAAAcAAAAAAAAADWZlZV9yZWNpcGllbnQAAAAAAAATAAAAVFRoZSBtYXhpbXVtIGFtb3VudCBvZiBzbGlwcGFnZSAoaW4gYnBzKSB0aGF0IGlzIHRvbGVyYXRlZCBkdXJpbmcgcHJvdmlkaW5nIGxpcXVpZGl0eQAAABhtYXhfYWxsb3dlZF9zbGlwcGFnZV9icHMAAAAHAAAAQ1RoZSBtYXhpbXVtIGFtb3VudCBvZiBzcHJlYWQgKGluIGJwcykgdGhhdCBpcyB0b2xlcmF0ZWQgZHVyaW5nIHN3YXAAAAAAFm1heF9hbGxvd2VkX3NwcmVhZF9icHMAAAAAAAcAAAAAAAAACXBvb2xfdHlwZQAAAAAAB9AAAAAIUGFpclR5cGUAAAAAAAAAC3NoYXJlX3Rva2VuAAAAABMAAAAAAAAADnN0YWtlX2NvbnRyYWN0AAAAAAATAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEwAAAGRUaGUgdG90YWwgZmVlcyAoaW4gYnBzKSBjaGFyZ2VkIGJ5IGEgcG9vbCBvZiB0aGlzIHR5cGUuCkluIHJlbGF0aW9uIHRvIHRoZSByZXR1cm5lZCBhbW91bnQgb2YgdG9rZW5zAAAADXRvdGFsX2ZlZV9icHMAAAAAAAAH",
        "AAAAAQAAAAAAAAAAAAAAE0FtcGxpZmllclBhcmFtZXRlcnMAAAAABAAAAAAAAAAIaW5pdF9hbXAAAAAGAAAAAAAAAA1pbml0X2FtcF90aW1lAAAAAAAABgAAAAAAAAAIbmV4dF9hbXAAAAAGAAAAAAAAAA1uZXh0X2FtcF90aW1lAAAAAAAABg==",
        "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAABRBZGRyZXNzIG9mIHRoZSBhc3NldAAAAAdhZGRyZXNzAAAAABMAAAAsVGhlIHRvdGFsIGFtb3VudCBvZiB0aG9zZSB0b2tlbnMgaW4gdGhlIHBvb2wAAAAGYW1vdW50AAAAAAAL",
        "AAAAAQAAAG5UaGlzIHN0cnVjdCBpcyB1c2VkIHRvIHJldHVybiBhIHF1ZXJ5IHJlc3VsdCB3aXRoIHRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGFuZCBhc3NldHMgaW4gYSBzcGVjaWZpYyBwb29sLgAAAAAAAAAAAAxQb29sUmVzcG9uc2UAAAAEAAAAM1RoZSBhc3NldCBBIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYQAAAAfQAAAABUFzc2V0AAAAAAAAM1RoZSBhc3NldCBCIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYgAAAAfQAAAABUFzc2V0AAAAAAAALlRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGN1cnJlbnRseSBpc3N1ZWQAAAAAAA5hc3NldF9scF9zaGFyZQAAAAAH0AAAAAVBc3NldAAAAAAAADhUaGUgYWRkcmVzcyBvZiB0aGUgU3Rha2UgY29udHJhY3QgZm9yIHRoZSBsaXF1aWRpdHkgcG9vbAAAAA1zdGFrZV9hZGRyZXNzAAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAF1N0YWJsZUxpcXVpZGl0eVBvb2xJbmZvAAAAAAMAAAAAAAAADHBvb2xfYWRkcmVzcwAAABMAAAAAAAAADXBvb2xfcmVzcG9uc2UAAAAAAAfQAAAADFBvb2xSZXNwb25zZQAAAAAAAAANdG90YWxfZmVlX2JwcwAAAAAAAAc=",
        "AAAAAQAAAAAAAAAAAAAAFFNpbXVsYXRlU3dhcFJlc3BvbnNlAAAABAAAAAAAAAAKYXNrX2Ftb3VudAAAAAAACwAAAAAAAAARY29tbWlzc2lvbl9hbW91bnQAAAAAAAALAAAAAAAAAA1zcHJlYWRfYW1vdW50AAAAAAAACwAAAAAAAAAMdG90YWxfcmV0dXJuAAAACw==",
        "AAAAAQAAAAAAAAAAAAAAG1NpbXVsYXRlUmV2ZXJzZVN3YXBSZXNwb25zZQAAAAADAAAAAAAAABFjb21taXNzaW9uX2Ftb3VudAAAAAAAAAsAAAAAAAAADG9mZmVyX2Ftb3VudAAAAAsAAAAAAAAADXNwcmVhZF9hbW91bnQAAAAAAAAL",
        "AAAAAQAAAAAAAAAAAAAADVRva2VuSW5pdEluZm8AAAAAAAACAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAADVN0YWtlSW5pdEluZm8AAAAAAAAEAAAAAAAAAAdtYW5hZ2VyAAAAABMAAAAAAAAADm1heF9jb21wbGV4aXR5AAAAAAAEAAAAAAAAAAhtaW5fYm9uZAAAAAsAAAAAAAAACm1pbl9yZXdhcmQAAAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAAFUxpcXVpZGl0eVBvb2xJbml0SW5mbwAAAAAAAAkAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAUZGVmYXVsdF9zbGlwcGFnZV9icHMAAAAHAAAAAAAAAA1mZWVfcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAYbWF4X2FsbG93ZWRfc2xpcHBhZ2VfYnBzAAAABwAAAAAAAAAWbWF4X2FsbG93ZWRfc3ByZWFkX2JwcwAAAAAABwAAAAAAAAAQbWF4X3JlZmVycmFsX2JwcwAAAAcAAAAAAAAAD3N0YWtlX2luaXRfaW5mbwAAAAfQAAAADVN0YWtlSW5pdEluZm8AAAAAAAAAAAAADHN3YXBfZmVlX2JwcwAAAAcAAAAAAAAAD3Rva2VuX2luaXRfaW5mbwAAAAfQAAAADVRva2VuSW5pdEluZm8AAAA=",
        "AAAAAwAAAAAAAAAAAAAACFBvb2xUeXBlAAAAAgAAAAAAAAADWHlrAAAAAAAAAAAAAAAABlN0YWJsZQAAAAAAAQ==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        provide_liquidity: this.txFromJSON<null>,
        swap: this.txFromJSON<i128>,
        withdraw_liquidity: this.txFromJSON<readonly [i128, i128]>,
        update_config: this.txFromJSON<null>,
        upgrade: this.txFromJSON<null>,
        query_config: this.txFromJSON<Config>,
        query_share_token_address: this.txFromJSON<string>,
        query_stake_contract_address: this.txFromJSON<string>,
        query_pool_info: this.txFromJSON<PoolResponse>,
        query_pool_info_for_factory: this.txFromJSON<StableLiquidityPoolInfo>,
        simulate_swap: this.txFromJSON<SimulateSwapResponse>,
        simulate_reverse_swap: this.txFromJSON<SimulateReverseSwapResponse>,
        query_share: this.txFromJSON<readonly [Asset, Asset]>,
        query_total_issued_lp: this.txFromJSON<i128>,
        update: this.txFromJSON<null>
  }
}
