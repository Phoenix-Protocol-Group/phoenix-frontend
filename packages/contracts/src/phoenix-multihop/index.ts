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
  555: { message: "" },
  4: { message: "" },
};
export interface Swap {
  ask_asset: Address;
  offer_asset: Address;
}

export interface Pair {
  token_a: Address;
  token_b: Address;
}

export type DataKey =
  | { tag: "PairKey"; values: readonly [Pair] }
  | { tag: "FactoryKey"; values: void }
  | { tag: "Admin"; values: void };

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

export class Contract {
  spec: ContractSpec;
  constructor(public readonly options: methodOptions.ClassOptions) {
    this.spec = new ContractSpec([
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAdmYWN0b3J5AAAAABMAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAAEc3dhcAAAAAMAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAACm9wZXJhdGlvbnMAAAAAA+oAAAfQAAAABFN3YXAAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAFAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAAAAAAAAAAAA1BZG1pbk5vdEZvdW5kAAAAAAAAAQAAAAAAAAAPRmFjdG9yeU5vdEZvdW5kAAAAAAIAAAAAAAAAEFJlbW90ZUNhbGxGYWlsZWQAAAIrAAAAAAAAAA9PcGVyYXRpb25zRW1wdHkAAAAABA==",
      "AAAAAQAAAAAAAAAAAAAABFN3YXAAAAACAAAAAAAAAAlhc2tfYXNzZXQAAAAAAAATAAAAAAAAAAtvZmZlcl9hc3NldAAAAAAT",
      "AAAAAQAAAAAAAAAAAAAABFBhaXIAAAACAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEw==",
      "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAEAAAAAAAAAB1BhaXJLZXkAAAAAAQAAB9AAAAAEUGFpcgAAAAAAAAAAAAAACkZhY3RvcnlLZXkAAAAAAAAAAAAAAAAABUFkbWluAAAA",
      "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAABRBZGRyZXNzIG9mIHRoZSBhc3NldAAAAAdhZGRyZXNzAAAAABMAAAAsVGhlIHRvdGFsIGFtb3VudCBvZiB0aG9zZSB0b2tlbnMgaW4gdGhlIHBvb2wAAAAGYW1vdW50AAAAAAAL",
      "AAAAAQAAAG5UaGlzIHN0cnVjdCBpcyB1c2VkIHRvIHJldHVybiBhIHF1ZXJ5IHJlc3VsdCB3aXRoIHRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGFuZCBhc3NldHMgaW4gYSBzcGVjaWZpYyBwb29sLgAAAAAAAAAAAAxQb29sUmVzcG9uc2UAAAADAAAAM1RoZSBhc3NldCBBIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYQAAAAfQAAAABUFzc2V0AAAAAAAAM1RoZSBhc3NldCBCIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYgAAAAfQAAAABUFzc2V0AAAAAAAALlRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGN1cnJlbnRseSBpc3N1ZWQAAAAAAA5hc3NldF9scF9zaGFyZQAAAAAH0AAAAAVBc3NldAAAAA==",
    ]);
  }
  async initialize<R extends methodOptions.ResponseTypes = undefined>(
    { admin, factory }: { admin: Address; factory: Address },
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
        args: this.spec.funcArgsToScVals("initialize", { admin, factory }),
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

  async swap<R extends methodOptions.ResponseTypes = undefined>(
    {
      recipient,
      operations,
      amount,
    }: { recipient: Address; operations: Array<Swap>; amount: i128 },
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
          recipient,
          operations,
          amount,
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
}
