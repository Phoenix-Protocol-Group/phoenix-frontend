import * as SorobanClient from "soroban-client";
import { ContractSpec, Address } from "soroban-client";
import { Buffer } from "buffer";
import { invoke as Invoke } from "@phoenix-protocol/utils";
import { methodOptions } from "@phoenix-protocol/utils";
import { Option, i128, i64, u32 } from "../types";

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
  0: { message: "" },
  1: { message: "" },
  2: { message: "" },
  3: { message: "" },
  4: { message: "" },
  5: { message: "" },
  6: { message: "" },
  7: { message: "" },
  8: { message: "" },
};
export interface PairTupleKey {
  token_a: Address;
  token_b: Address;
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

export interface LiquidityPoolInfo {
  pool_address: Address;
  pool_response: PoolResponse;
  total_fee_bps: i64;
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

export interface LiquidityPoolInitInfo {
  admin: Address;
  fee_recipient: Address;
  lp_wasm_hash: Buffer;
  max_allowed_slippage_bps: i64;
  max_allowed_spread_bps: i64;
  share_token_decimals: u32;
  stake_init_info: StakeInitInfo;
  swap_fee_bps: i64;
  token_init_info: TokenInitInfo;
}

export class Contract {
  spec: ContractSpec;
  constructor(public readonly options: methodOptions.ClassOptions) {
    this.spec = new ContractSpec([
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAVY3JlYXRlX2xpcXVpZGl0eV9wb29sAAAAAAAAAQAAAAAAAAAMbHBfaW5pdF9pbmZvAAAH0AAAABVMaXF1aWRpdHlQb29sSW5pdEluZm8AAAAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAALcXVlcnlfcG9vbHMAAAAAAAAAAAEAAAPpAAAD6gAAABMAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAAScXVlcnlfcG9vbF9kZXRhaWxzAAAAAAABAAAAAAAAAAxwb29sX2FkZHJlc3MAAAATAAAAAQAAA+kAAAfQAAAAEUxpcXVpZGl0eVBvb2xJbmZvAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAAXcXVlcnlfYWxsX3Bvb2xzX2RldGFpbHMAAAAAAAAAAAEAAAPpAAAD6gAAB9AAAAARTGlxdWlkaXR5UG9vbEluZm8AAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAAccXVlcnlfZm9yX3Bvb2xfYnlfcGFpcl90dXBsZQAAAAEAAAAAAAAACnR1cGxlX3BhaXIAAAAAA+0AAAACAAAAEwAAABMAAAABAAAD6QAAABMAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAPpAAAAEwAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAJAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAAAAAAAAAAAAxDb25maWdOb3RTZXQAAAABAAAAAAAAAB9GYWlsZWRUb0dldEFkbWluQWRkckZyb21TdG9yYWdlAAAAAAIAAAAAAAAAIUZpcnN0VG9rZW5NdXN0QmVTbWFsbGVyVGhlblNlY29uZAAAAAAAAAMAAAAAAAAAG0xpcXVpZGl0eVBvb2xWZWN0b3JOb3RGb3VuZAAAAAAEAAAAAAAAABdNaW5TdGFrZUxlc3NPckVxdWFsWmVybwAAAAAFAAAAAAAAABFNaW5SZXdhcmRUb29TbWFsbAAAAAAAAAYAAAAAAAAAE0NvbnRyYWN0Tm90RGVwbG95ZWQAAAAABwAAAAAAAAAZTGlxdWlkaXR5UG9vbFBhaXJOb3RGb3VuZAAAAAAAAAg=",
      "AAAAAQAAAAAAAAAAAAAADFBhaXJUdXBsZUtleQAAAAIAAAAAAAAAB3Rva2VuX2EAAAAAEwAAAAAAAAAHdG9rZW5fYgAAAAAT",
      "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAABRBZGRyZXNzIG9mIHRoZSBhc3NldAAAAAdhZGRyZXNzAAAAABMAAAAsVGhlIHRvdGFsIGFtb3VudCBvZiB0aG9zZSB0b2tlbnMgaW4gdGhlIHBvb2wAAAAGYW1vdW50AAAAAAAL",
      "AAAAAQAAAG5UaGlzIHN0cnVjdCBpcyB1c2VkIHRvIHJldHVybiBhIHF1ZXJ5IHJlc3VsdCB3aXRoIHRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGFuZCBhc3NldHMgaW4gYSBzcGVjaWZpYyBwb29sLgAAAAAAAAAAAAxQb29sUmVzcG9uc2UAAAADAAAAM1RoZSBhc3NldCBBIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYQAAAAfQAAAABUFzc2V0AAAAAAAAM1RoZSBhc3NldCBCIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYgAAAAfQAAAABUFzc2V0AAAAAAAALlRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGN1cnJlbnRseSBpc3N1ZWQAAAAAAA5hc3NldF9scF9zaGFyZQAAAAAH0AAAAAVBc3NldAAAAA==",
      "AAAAAQAAAAAAAAAAAAAAEUxpcXVpZGl0eVBvb2xJbmZvAAAAAAAAAwAAAAAAAAAMcG9vbF9hZGRyZXNzAAAAEwAAAAAAAAANcG9vbF9yZXNwb25zZQAAAAAAB9AAAAAMUG9vbFJlc3BvbnNlAAAAAAAAAA10b3RhbF9mZWVfYnBzAAAAAAAABw==",
      "AAAAAQAAAAAAAAAAAAAADVRva2VuSW5pdEluZm8AAAAAAAADAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEwAAAAAAAAAPdG9rZW5fd2FzbV9oYXNoAAAAA+4AAAAg",
      "AAAAAQAAAAAAAAAAAAAADVN0YWtlSW5pdEluZm8AAAAAAAAEAAAAAAAAABFtYXhfZGlzdHJpYnV0aW9ucwAAAAAAAAQAAAAAAAAACG1pbl9ib25kAAAACwAAAAAAAAAKbWluX3Jld2FyZAAAAAAACwAAAAAAAAAPc3Rha2Vfd2FzbV9oYXNoAAAAA+4AAAAg",
      "AAAAAQAAAAAAAAAAAAAAFUxpcXVpZGl0eVBvb2xJbml0SW5mbwAAAAAAAAkAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAANZmVlX3JlY2lwaWVudAAAAAAAABMAAAAAAAAADGxwX3dhc21faGFzaAAAA+4AAAAgAAAAAAAAABhtYXhfYWxsb3dlZF9zbGlwcGFnZV9icHMAAAAHAAAAAAAAABZtYXhfYWxsb3dlZF9zcHJlYWRfYnBzAAAAAAAHAAAAAAAAABRzaGFyZV90b2tlbl9kZWNpbWFscwAAAAQAAAAAAAAAD3N0YWtlX2luaXRfaW5mbwAAAAfQAAAADVN0YWtlSW5pdEluZm8AAAAAAAAAAAAADHN3YXBfZmVlX2JwcwAAAAcAAAAAAAAAD3Rva2VuX2luaXRfaW5mbwAAAAfQAAAADVRva2VuSW5pdEluZm8AAAA=",
    ]);
  }
  async initialize<R extends methodOptions.ResponseTypes = undefined>(
    { admin }: { admin: Address },
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
        args: this.spec.funcArgsToScVals("initialize", { admin }),
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

  async createLiquidityPool<R extends methodOptions.ResponseTypes = undefined>(
    { lp_init_info }: { lp_init_info: LiquidityPoolInitInfo },
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
        method: "create_liquidity_pool",
        args: this.spec.funcArgsToScVals("create_liquidity_pool", {
          lp_init_info,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
          return new Ok(
            this.spec.funcResToNative("create_liquidity_pool", xdr)
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

  async queryPools<R extends methodOptions.ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<Array<Address>> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: "query_pools",
        args: this.spec.funcArgsToScVals("query_pools", {}),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<Array<Address>> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("query_pools", xdr));
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

  async queryPoolDetails<R extends methodOptions.ResponseTypes = undefined>(
    { pool_address }: { pool_address: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<LiquidityPoolInfo> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: "query_pool_details",
        args: this.spec.funcArgsToScVals("query_pool_details", {
          pool_address,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (
          xdr
        ): Ok<LiquidityPoolInfo> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("query_pool_details", xdr));
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

  async queryAllPoolsDetails<R extends methodOptions.ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Ok<Array<LiquidityPoolInfo>> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: "query_all_pools_details",
        args: this.spec.funcArgsToScVals("query_all_pools_details", {}),
        ...options,
        ...this.options,
        parseResultXdr: (
          xdr
        ): Ok<Array<LiquidityPoolInfo>> | Err<Error_> | undefined => {
          return new Ok(
            this.spec.funcResToNative("query_all_pools_details", xdr)
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

  async queryForPoolByPairTuple<
    R extends methodOptions.ResponseTypes = undefined
  >(
    { tuple_pair }: { tuple_pair: readonly [Address, Address] },
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
        method: "query_for_pool_by_pair_tuple",
        args: this.spec.funcArgsToScVals("query_for_pool_by_pair_tuple", {
          tuple_pair,
        }),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<Address> | Err<Error_> | undefined => {
          return new Ok(
            this.spec.funcResToNative("query_for_pool_by_pair_tuple", xdr)
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

  async getAdmin<R extends methodOptions.ResponseTypes = undefined>(
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
        method: "get_admin",
        args: this.spec.funcArgsToScVals("get_admin", {}),
        ...options,
        ...this.options,
        parseResultXdr: (xdr): Ok<Address> | Err<Error_> | undefined => {
          return new Ok(this.spec.funcResToNative("get_admin", xdr));
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
