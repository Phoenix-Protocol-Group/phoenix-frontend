import * as SorobanClient from "soroban-client";
import { ContractSpec, Address } from "soroban-client";
import { Buffer } from "buffer";
import { invoke as Invoke } from "@phoenix-protocol/utils";
import { methodOptions } from "@phoenix-protocol/utils";
import { Option, i128, i64, u32 } from "../types";
import { scValToJs } from "@phoenix-protocol/utils/build/convert";

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
  let err = Errors[i];
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

const Errors: Record<number, any> = {
  1: { message: "Initialization errors" },
  2: { message: "" },
  3: { message: "Swap errors" },
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
  19: { message: "Liquidity errors" },
  20: { message: "" },
  21: { message: "Other errors" },
  22: { message: "" },
};
export enum PairType {
  Xyk = 0,
}

export interface Config {
  fee_recipient: Address;
  /**
   * The maximum amount of slippage (in bps) that is tolerated during providing liquidity
   */
  max_allowed_slippage_bps: i64;
  /**
   * The maximum amount of spread (in bps) that is tolerated during swap
   */
  max_allowed_spread_bps: i64;
  pair_type: PairType;
  share_token: Address;
  stake_contract: Address;
  token_a: Address;
  token_b: Address;
  /**
   * The total fees (in bps) charged by a pair of this type.
   * In relation to the returned amount of tokens
   */
  total_fee_bps: i64;
}

export interface Asset {
  /**
   * Address of the asset
   */
  address: Address;
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
  token_a: Address;
  token_b: Address;
  token_wasm_hash: Buffer;
}

export interface StakeInitInfo {
  max_distributions: u32;
  min_bond: i128;
  min_reward: i128;
  stake_wasm_hash: Buffer;
}

export class Contract {
  spec: ContractSpec;
  constructor(public readonly options: methodOptions.ClassOptions) {
    this.spec = new ContractSpec([
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAACAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAABRzaGFyZV90b2tlbl9kZWNpbWFscwAAAAQAAAAAAAAADHN3YXBfZmVlX2JwcwAAAAcAAAAAAAAADWZlZV9yZWNpcGllbnQAAAAAAAATAAAAAAAAABhtYXhfYWxsb3dlZF9zbGlwcGFnZV9icHMAAAAHAAAAAAAAABZtYXhfYWxsb3dlZF9zcHJlYWRfYnBzAAAAAAAHAAAAAAAAAA90b2tlbl9pbml0X2luZm8AAAAH0AAAAA1Ub2tlbkluaXRJbmZvAAAAAAAAAAAAAA9zdGFrZV9pbml0X2luZm8AAAAH0AAAAA1TdGFrZUluaXRJbmZvAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAARcHJvdmlkZV9saXF1aWRpdHkAAAAAAAAGAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAACWRlc2lyZWRfYQAAAAAAA+gAAAALAAAAAAAAAAVtaW5fYQAAAAAAA+gAAAALAAAAAAAAAAlkZXNpcmVkX2IAAAAAAAPoAAAACwAAAAAAAAAFbWluX2IAAAAAAAPoAAAACwAAAAAAAAATY3VzdG9tX3NsaXBwYWdlX2JwcwAAAAPoAAAABwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAAEc3dhcAAAAAUAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAGc2VsbF9hAAAAAAABAAAAAAAAAAxvZmZlcl9hbW91bnQAAAALAAAAAAAAAAxiZWxpZWZfcHJpY2UAAAPoAAAABwAAAAAAAAAObWF4X3NwcmVhZF9icHMAAAAAA+gAAAAHAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAASd2l0aGRyYXdfbGlxdWlkaXR5AAAAAAAEAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAADHNoYXJlX2Ftb3VudAAAAAsAAAAAAAAABW1pbl9hAAAAAAAACwAAAAAAAAAFbWluX2IAAAAAAAALAAAAAQAAA+kAAAPtAAAAAgAAAAsAAAALAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAANdXBkYXRlX2NvbmZpZwAAAAAAAAYAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAJbmV3X2FkbWluAAAAAAAD6AAAABMAAAAAAAAADXRvdGFsX2ZlZV9icHMAAAAAAAPoAAAABwAAAAAAAAANZmVlX3JlY2lwaWVudAAAAAAAA+gAAAATAAAAAAAAABhtYXhfYWxsb3dlZF9zbGlwcGFnZV9icHMAAAPoAAAABwAAAAAAAAAWbWF4X2FsbG93ZWRfc3ByZWFkX2JwcwAAAAAD6AAAAAcAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAAMcXVlcnlfY29uZmlnAAAAAAAAAAEAAAPpAAAH0AAAAAZDb25maWcAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAZcXVlcnlfc2hhcmVfdG9rZW5fYWRkcmVzcwAAAAAAAAAAAAABAAAD6QAAABMAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAAccXVlcnlfc3Rha2VfY29udHJhY3RfYWRkcmVzcwAAAAAAAAABAAAD6QAAABMAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAAPcXVlcnlfcG9vbF9pbmZvAAAAAAAAAAABAAAD6QAAB9AAAAAMUG9vbFJlc3BvbnNlAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAANc2ltdWxhdGVfc3dhcAAAAAAAAAIAAAAAAAAABnNlbGxfYQAAAAAAAQAAAAAAAAAMb2ZmZXJfYW1vdW50AAAACwAAAAEAAAPpAAAH0AAAABRTaW11bGF0ZVN3YXBSZXNwb25zZQAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAVc2ltdWxhdGVfcmV2ZXJzZV9zd2FwAAAAAAAAAgAAAAAAAAAGc2VsbF9hAAAAAAABAAAAAAAAAAphc2tfYW1vdW50AAAAAAALAAAAAQAAA+kAAAfQAAAAG1NpbXVsYXRlUmV2ZXJzZVN3YXBSZXNwb25zZQAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAWAAAAFUluaXRpYWxpemF0aW9uIGVycm9ycwAAAAAAACFGaXJzdFRva2VuTXVzdEJlU21hbGxlclRoZW5TZWNvbmQAAAAAAAABAAAAAAAAAA1JbnZhbGlkRmVlQnBzAAAAAAAAAgAAAAtTd2FwIGVycm9ycwAAAAAZU2xpcHBhZ2VUb2xlcmFuY2VFeGNlZWRlZAAAAAAAAAMAAAAAAAAAGVNsaXBwYWdlVG9sZXJhbmNlVmlvbGF0ZWQAAAAAAAAEAAAAAAAAABdTcHJlYWRFeGNlZWRzTWF4QWxsb3dlZAAAAAAFAAAAAAAAABBFbXB0eVBvb2xCYWxhbmNlAAAABgAAAAAAAAAMQ29uZmlnTm90U2V0AAAABwAAAAAAAAAXRmFpbGVkVG9Mb2FkRnJvbVN0b3JhZ2UAAAAACAAAAAAAAAAgSW5jb3JyZWN0TGlxdWlkaXR5UGFyYW1ldGVyc0ZvckEAAAAJAAAAAAAAACBJbmNvcnJlY3RMaXF1aWRpdHlQYXJhbWV0ZXJzRm9yQgAAAAoAAAAAAAAAH0ZhaWxlZFRvR2V0QWRtaW5BZGRyRnJvbVN0b3JhZ2UAAAAACwAAAAAAAAAhRmFpbGVkVG9HZXRUb3RhbFNoYXJlc0Zyb21TdG9yYWdlAAAAAAAADAAAAAAAAAAiRmFpbGVkVG9HZXRQb29sQmFsYW5jZUFGcm9tU3RvcmFnZQAAAAAADQAAAAAAAAAiRmFpbGVkVG9HZXRQb29sQmFsYW5jZUJGcm9tU3RvcmFnZQAAAAAADgAAAAAAAAAcRGVwb3NpdEFtb3VudEFFeGNlZWRzRGVzaXJlZAAAAA8AAAAAAAAAFkRlcG9zaXRBbW91bnRCZWxvd01pbkEAAAAAABAAAAAAAAAAHERlcG9zaXRBbW91bnRCRXhjZWVkc0Rlc2lyZWQAAAARAAAAAAAAABZEZXBvc2l0QW1vdW50QmVsb3dNaW5CAAAAAAASAAAAEExpcXVpZGl0eSBlcnJvcnMAAAAXV2l0aGRyYXdNaW5Ob3RTYXRpc2ZpZWQAAAAAEwAAAAAAAAAOSW52YWxpZEFtb3VudHMAAAAAABQAAAAMT3RoZXIgZXJyb3JzAAAADFVuYXV0aG9yaXplZAAAABUAAAAAAAAAH0FyZ3VtZW50c0ludmFsaWRMZXNzT3JFcXVhbFplcm8AAAAAFg==",
      "AAAAAwAAAAAAAAAAAAAACFBhaXJUeXBlAAAAAQAAAAAAAAADWHlrAAAAAAA=",
      "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAACQAAAAAAAAANZmVlX3JlY2lwaWVudAAAAAAAABMAAABUVGhlIG1heGltdW0gYW1vdW50IG9mIHNsaXBwYWdlIChpbiBicHMpIHRoYXQgaXMgdG9sZXJhdGVkIGR1cmluZyBwcm92aWRpbmcgbGlxdWlkaXR5AAAAGG1heF9hbGxvd2VkX3NsaXBwYWdlX2JwcwAAAAcAAABDVGhlIG1heGltdW0gYW1vdW50IG9mIHNwcmVhZCAoaW4gYnBzKSB0aGF0IGlzIHRvbGVyYXRlZCBkdXJpbmcgc3dhcAAAAAAWbWF4X2FsbG93ZWRfc3ByZWFkX2JwcwAAAAAABwAAAAAAAAAJcGFpcl90eXBlAAAAAAAH0AAAAAhQYWlyVHlwZQAAAAAAAAALc2hhcmVfdG9rZW4AAAAAEwAAAAAAAAAOc3Rha2VfY29udHJhY3QAAAAAABMAAAAAAAAAB3Rva2VuX2EAAAAAEwAAAAAAAAAHdG9rZW5fYgAAAAATAAAAZFRoZSB0b3RhbCBmZWVzIChpbiBicHMpIGNoYXJnZWQgYnkgYSBwYWlyIG9mIHRoaXMgdHlwZS4KSW4gcmVsYXRpb24gdG8gdGhlIHJldHVybmVkIGFtb3VudCBvZiB0b2tlbnMAAAANdG90YWxfZmVlX2JwcwAAAAAAAAc=",
      "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAABRBZGRyZXNzIG9mIHRoZSBhc3NldAAAAAdhZGRyZXNzAAAAABMAAAAsVGhlIHRvdGFsIGFtb3VudCBvZiB0aG9zZSB0b2tlbnMgaW4gdGhlIHBvb2wAAAAGYW1vdW50AAAAAAAL",
      "AAAAAQAAAG5UaGlzIHN0cnVjdCBpcyB1c2VkIHRvIHJldHVybiBhIHF1ZXJ5IHJlc3VsdCB3aXRoIHRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGFuZCBhc3NldHMgaW4gYSBzcGVjaWZpYyBwb29sLgAAAAAAAAAAAAxQb29sUmVzcG9uc2UAAAADAAAAM1RoZSBhc3NldCBBIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYQAAAAfQAAAABUFzc2V0AAAAAAAAM1RoZSBhc3NldCBCIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYgAAAAfQAAAABUFzc2V0AAAAAAAALlRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGN1cnJlbnRseSBpc3N1ZWQAAAAAAA5hc3NldF9scF9zaGFyZQAAAAAH0AAAAAVBc3NldAAAAA==",
      "AAAAAQAAAAAAAAAAAAAAFFNpbXVsYXRlU3dhcFJlc3BvbnNlAAAABAAAAAAAAAAKYXNrX2Ftb3VudAAAAAAACwAAAAAAAAARY29tbWlzc2lvbl9hbW91bnQAAAAAAAALAAAAAAAAAA1zcHJlYWRfYW1vdW50AAAAAAAACwAAAAAAAAAMdG90YWxfcmV0dXJuAAAACw==",
      "AAAAAQAAAAAAAAAAAAAAG1NpbXVsYXRlUmV2ZXJzZVN3YXBSZXNwb25zZQAAAAADAAAAAAAAABFjb21taXNzaW9uX2Ftb3VudAAAAAAAAAsAAAAAAAAADG9mZmVyX2Ftb3VudAAAAAsAAAAAAAAADXNwcmVhZF9hbW91bnQAAAAAAAAL",
      "AAAAAQAAAAAAAAAAAAAADVRva2VuSW5pdEluZm8AAAAAAAADAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEwAAAAAAAAAPdG9rZW5fd2FzbV9oYXNoAAAAA+4AAAAg",
      "AAAAAQAAAAAAAAAAAAAADVN0YWtlSW5pdEluZm8AAAAAAAAEAAAAAAAAABFtYXhfZGlzdHJpYnV0aW9ucwAAAAAAAAQAAAAAAAAACG1pbl9ib25kAAAACwAAAAAAAAAKbWluX3Jld2FyZAAAAAAACwAAAAAAAAAPc3Rha2Vfd2FzbV9oYXNoAAAAA+4AAAAg",
    ]);
  }
  async initialize<R extends methodOptions.ResponseTypes = undefined>(
    {
      admin,
      share_token_decimals,
      swap_fee_bps,
      fee_recipient,
      max_allowed_slippage_bps,
      max_allowed_spread_bps,
      token_init_info,
      stake_init_info,
    }: {
      admin: Address;
      share_token_decimals: u32;
      swap_fee_bps: i64;
      fee_recipient: Address;
      max_allowed_slippage_bps: i64;
      max_allowed_spread_bps: i64;
      token_init_info: TokenInitInfo;
      stake_init_info: StakeInitInfo;
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
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "initialize",
        args: this.spec.funcArgsToScVals("initialize", {
          admin,
          share_token_decimals,
          swap_fee_bps,
          fee_recipient,
          max_allowed_slippage_bps,
          max_allowed_spread_bps,
          token_init_info,
          stake_init_info,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr: any): Ok<void> | Err<Error_> | undefined => {
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

  async provideLiquidity<R extends methodOptions.ResponseTypes = undefined>(
    {
      sender,
      desired_a,
      min_a,
      desired_b,
      min_b,
      custom_slippage_bps,
    }: {
      sender: Address;
      desired_a: Option<i128>;
      min_a: Option<i128>;
      desired_b: Option<i128>;
      min_b: Option<i128>;
      custom_slippage_bps: Option<i64>;
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
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "provide_liquidity",
        args: this.spec.funcArgsToScVals("provide_liquidity", {
          sender,
          desired_a,
          min_a,
          desired_b,
          min_b,
          custom_slippage_bps,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr: any): Ok<void> | Err<Error_> | undefined => {
          return new Ok(void 0);
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

  async swap<R extends methodOptions.ResponseTypes = undefined>(
    {
      sender,
      sell_a,
      offer_amount,
      belief_price,
      max_spread_bps,
    }: {
      sender: Address;
      sell_a: boolean;
      offer_amount: i128;
      belief_price: Option<i64>;
      max_spread_bps: Option<i64>;
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
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "swap",
        args: this.spec.funcArgsToScVals("swap", {
          sender,
          sell_a,
          offer_amount,
          belief_price,
          max_spread_bps,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr: any): Ok<void> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("swap", xdr));
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

  async withdrawLiquidity<R extends methodOptions.ResponseTypes = undefined>(
    {
      sender,
      share_amount,
      min_a,
      min_b,
    }: { sender: Address; share_amount: i128; min_a: i128; min_b: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<readonly [i128, i128]> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "withdraw_liquidity",
        args: this.spec.funcArgsToScVals("withdraw_liquidity", {
          sender,
          share_amount,
          min_a,
          min_b,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (
          xdr: any
        ): Ok<readonly [i128, i128]> | Err<Error_> | undefined => {
          return undefined;
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

  async updateConfig<R extends methodOptions.ResponseTypes = undefined>(
    {
      sender,
      new_admin,
      total_fee_bps,
      fee_recipient,
      max_allowed_slippage_bps,
      max_allowed_spread_bps,
    }: {
      sender: Address;
      new_admin: Option<Address>;
      total_fee_bps: Option<i64>;
      fee_recipient: Option<Address>;
      max_allowed_slippage_bps: Option<i64>;
      max_allowed_spread_bps: Option<i64>;
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
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "update_config",
        args: this.spec.funcArgsToScVals("update_config", {
          sender,
          new_admin,
          total_fee_bps,
          fee_recipient,
          max_allowed_slippage_bps,
          max_allowed_spread_bps,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr: any): Ok<void> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("update_config", xdr));
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

  async upgrade<R extends methodOptions.ResponseTypes = undefined>(
    { new_wasm_hash }: { new_wasm_hash: Buffer },
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
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "upgrade",
        args: this.spec.funcArgsToScVals("upgrade", { new_wasm_hash }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr: any): Ok<void> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("upgrade", xdr));
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
       *   - `undefined`, the default, parses the returned XDR as `Ok<Config> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
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
        parseResultXdr: (xdr: any): Ok<Config> | Err<Error_> | undefined => {
          const res = scValToJs(xdr);
          return new Ok(res as Config);
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

  async queryShareTokenAddress<
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
       *   - `undefined`, the default, parses the returned XDR as `Ok<Address> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "query_share_token_address",
        args: this.spec.funcArgsToScVals("query_share_token_address", {}),
        ...options,
        ...this.options,
        parseResultXdr: (xdr: any): Ok<Address> | Err<Error_> | undefined => {
          return new Ok(
            this.spec.funcResToNative("query_share_token_address", xdr)
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

  async queryStakeContractAddress<
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
       *   - `undefined`, the default, parses the returned XDR as `Ok<Address> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "query_stake_contract_address",
        args: this.spec.funcArgsToScVals("query_stake_contract_address", {}),
        ...options,
        ...this.options,
        parseResultXdr: (xdr: any): Ok<Address> | Err<Error_> | undefined => {
          return new Ok(
            this.spec.funcResToNative("query_stake_contract_address", xdr)
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

  async queryPoolInfo<R extends methodOptions.ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<PoolResponse> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "query_pool_info",
        args: this.spec.funcArgsToScVals("query_pool_info", {}),
        ...options,
        ...this.options,
        parseResultXdr: (
          xdr: any
        ): Ok<PoolResponse> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("query_pool_info", xdr));
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

  async simulateSwap<R extends methodOptions.ResponseTypes = undefined>(
    { sell_a, offer_amount }: { sell_a: boolean; offer_amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<SimulateSwapResponse> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "simulate_swap",
        args: this.spec.funcArgsToScVals("simulate_swap", {
          sell_a,
          offer_amount,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (
          xdr: any
        ): Ok<SimulateSwapResponse> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("simulate_swap", xdr));
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

  async simulateReverseSwap<R extends methodOptions.ResponseTypes = undefined>(
    { sell_a, ask_amount }: { sell_a: boolean; ask_amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<SimulateReverseSwapResponse> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `Invoke.invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) {
    try {
      return await Invoke.invoke({
        method: "simulate_reverse_swap",
        args: this.spec.funcArgsToScVals("simulate_reverse_swap", {
          sell_a,
          ask_amount,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (
          xdr: any
        ): Ok<SimulateReverseSwapResponse> | Err<Error_> | undefined => {
          return new Ok(
            this.spec.funcResToNative("simulate_reverse_swap", xdr)
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
