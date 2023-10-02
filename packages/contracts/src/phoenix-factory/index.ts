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
};

export class Contract {
  spec: ContractSpec;
  constructor(public readonly options: methodOptions.ClassOptions) {
    this.spec = new ContractSpec([
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAGX2FkbWluAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAVY3JlYXRlX2xpcXVpZGl0eV9wb29sAAAAAAAAAAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAALcXVlcnlfcG9vbHMAAAAAAAAAAAEAAAPpAAAD6gAAABMAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAABAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAA",
    ]);
  }
  async initialize<R extends methodOptions.ResponseTypes = undefined>(
    { _admin }: { _admin: Address },
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
        args: this.spec.funcArgsToScVals("initialize", { _admin }),
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
        method: "create_liquidity_pool",
        args: this.spec.funcArgsToScVals("create_liquidity_pool", {}),
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
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
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
}
