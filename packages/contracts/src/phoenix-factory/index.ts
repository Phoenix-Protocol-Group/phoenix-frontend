import * as SorobanClient from "soroban-client";
import { xdr } from "soroban-client";
import { Buffer } from "buffer";
import { convert } from "@phoenix-protocol/utils";
const {
  scValStrToJs,
  scValToJs,
  addressToScVal,
  u128ToScVal,
  i128ToScVal,
  strToScVal,
} = convert;
import { invoke } from "@phoenix-protocol/utils";
import { ResponseTypes } from "@phoenix-protocol/utils/build/invoke";

export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Address = string;
export type Option<T> = T | undefined;
export type Typepoint = bigint;
export type Duration = bigint;

/// Error interface containing the error message
export interface Error_ {
  message: string;
}

export interface Result<T, E = Error_> {
  unwrap(): T;
  unwrapErr(): E;
  isOk(): boolean;
  isErr(): boolean;
}

export class Ok<T> implements Result<T> {
  constructor(readonly value: T) {}
  unwrapErr(): Error_ {
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

export class Err<T> implements Result<T> {
  constructor(readonly error: Error_) {}
  unwrapErr(): Error_ {
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

const regex = /ContractError\((\d+)\)/;

function getError(err: string): Err<Error_> | undefined {
  const match = err.match(regex);
  if (!match) {
    return undefined;
  }
  if (Errors == undefined) {
    return undefined;
  }
  // @ts-ignore
  let i = parseInt(match[1], 10);
  if (i < Errors.length) {
    return new Err(Errors[i]!);
  }
  return undefined;
}

export async function createLiquidityPool<R extends ResponseTypes = undefined>(
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
  } = {},
  contractId: string
) {
  return await invoke.invoke({
    method: "create_liquidity_pool",
    ...options,
    contractId,
    parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
      try {
        return new Ok(scValStrToJs(xdr));
      } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
          return err;
        } else {
          throw e;
        }
      }
    },
  });
}

export async function queryPools<R extends ResponseTypes = undefined>(
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
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number;
  } = {},
  contractId: string
) {
  return await invoke.invoke({
    method: "query_pools",
    ...options,
    contractId,
    parseResultXdr: (xdr): Ok<Array<Address>> | Err<Error_> | undefined => {
      try {
        return new Ok(scValStrToJs(xdr));
      } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
          return err;
        } else {
          throw e;
        }
      }
    },
  });
}

const Errors = [{ message: "" }];
