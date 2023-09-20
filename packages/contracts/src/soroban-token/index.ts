import * as SorobanClient from "soroban-client";
import { ContractSpec, Address } from "soroban-client";
import { Buffer } from "buffer";
import { invoke as Invoke } from "@phoenix-protocol/utils";
import { methodOptions } from "@phoenix-protocol/utils";
import { Err, u32, i128 } from "../types";

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

export interface AllowanceDataKey {
  from: Address;
  spender: Address;
}

export interface AllowanceValue {
  amount: i128;
  expiration_ledger: u32;
}

export type DataKey =
  | { tag: "Allowance"; values: readonly [AllowanceDataKey] }
  | { tag: "Balance"; values: readonly [Address] }
  | { tag: "Nonce"; values: readonly [Address] }
  | { tag: "State"; values: readonly [Address] }
  | { tag: "Admin"; values: void };

export interface TokenMetadata {
  decimal: u32;
  name: string;
  symbol: string;
}

const Errors: Record<number, any> = {};

export class Contract {
  spec: ContractSpec;
  constructor(public readonly options: methodOptions.ClassOptions) {
    this.spec = new ContractSpec([
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABAAAAAA",
      "AAAAAAAAAAAAAAAJYWxsb3dhbmNlAAAAAAAAAgAAAAAAAAAEZnJvbQAAABMAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAEAAAAL",
      "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAAEAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABAAAAAA=",
      "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
      "AAAAAAAAAAAAAAARc3BlbmRhYmxlX2JhbGFuY2UAAAAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
      "AAAAAAAAAAAAAAAKYXV0aG9yaXplZAAAAAAAAQAAAAAAAAACaWQAAAAAABMAAAABAAAAAQ==",
      "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
      "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
      "AAAAAAAAAAAAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
      "AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
      "AAAAAAAAAAAAAAAIY2xhd2JhY2sAAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
      "AAAAAAAAAAAAAAAOc2V0X2F1dGhvcml6ZWQAAAAAAAIAAAAAAAAAAmlkAAAAAAATAAAAAAAAAAlhdXRob3JpemUAAAAAAAABAAAAAA==",
      "AAAAAAAAAAAAAAAEbWludAAAAAIAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
      "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=",
      "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
      "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
      "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
      "AAAAAQAAAAAAAAAAAAAAEEFsbG93YW5jZURhdGFLZXkAAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAAT",
      "AAAAAQAAAAAAAAAAAAAADkFsbG93YW5jZVZhbHVlAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABA==",
      "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAACUFsbG93YW5jZQAAAAAAAAEAAAfQAAAAEEFsbG93YW5jZURhdGFLZXkAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAQAAAAAAAAAFTm9uY2UAAAAAAAABAAAAEwAAAAEAAAAAAAAABVN0YXRlAAAAAAAAAQAAABMAAAAAAAAAAAAAAAVBZG1pbgAAAA==",
      "AAAAAQAAAAAAAAAAAAAADVRva2VuTWV0YWRhdGEAAAAAAAADAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABA=",
    ]);
  }
  async initialize<R extends methodOptions.ResponseTypes = undefined>(
    {
      admin,
      decimal,
      name,
      symbol,
    }: { admin: Address; decimal: u32; name: string; symbol: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "initialize",
      args: this.spec.funcArgsToScVals("initialize", {
        admin,
        decimal,
        name,
        symbol,
      }),
      ...options,
      ...this.options,
      parseResultXdr: () => {},
    });
  }

  async allowance<R extends methodOptions.ResponseTypes = undefined>(
    { from, spender }: { from: Address; spender: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "allowance",
      args: this.spec.funcArgsToScVals("allowance", { from, spender }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr: any): i128 => {
        return this.spec.funcResToNative("allowance", xdr);
      },
    });
  }

  async approve<R extends methodOptions.ResponseTypes = undefined>(
    {
      from,
      spender,
      amount,
      expiration_ledger,
    }: {
      from: Address;
      spender: Address;
      amount: i128;
      expiration_ledger: u32;
    },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "approve",
      args: this.spec.funcArgsToScVals("approve", {
        from,
        spender,
        amount,
        expiration_ledger,
      }),
      ...options,
      ...this.options,
      parseResultXdr: () => {},
    });
  }

  async balance<R extends methodOptions.ResponseTypes = undefined>(
    { id }: { id: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "balance",
      args: this.spec.funcArgsToScVals("balance", { id }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr: any): i128 => {
        return this.spec.funcResToNative("balance", xdr);
      },
    });
  }

  async spendableBalance<R extends methodOptions.ResponseTypes = undefined>(
    { id }: { id: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "spendable_balance",
      args: this.spec.funcArgsToScVals("spendable_balance", { id }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr: any): i128 => {
        return this.spec.funcResToNative("spendable_balance", xdr);
      },
    });
  }

  async authorized<R extends methodOptions.ResponseTypes = undefined>(
    { id }: { id: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `boolean`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "authorized",
      args: this.spec.funcArgsToScVals("authorized", { id }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr: any): boolean => {
        return this.spec.funcResToNative("authorized", xdr);
      },
    });
  }

  async transfer<R extends methodOptions.ResponseTypes = undefined>(
    { from, to, amount }: { from: Address; to: Address; amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "transfer",
      args: this.spec.funcArgsToScVals("transfer", { from, to, amount }),
      ...options,
      ...this.options,
      parseResultXdr: () => {},
    });
  }

  async transferFrom<R extends methodOptions.ResponseTypes = undefined>(
    {
      spender,
      from,
      to,
      amount,
    }: { spender: Address; from: Address; to: Address; amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "transfer_from",
      args: this.spec.funcArgsToScVals("transfer_from", {
        spender,
        from,
        to,
        amount,
      }),
      ...options,
      ...this.options,
      parseResultXdr: () => {},
    });
  }

  async burn<R extends methodOptions.ResponseTypes = undefined>(
    { from, amount }: { from: Address; amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "burn",
      args: this.spec.funcArgsToScVals("burn", { from, amount }),
      ...options,
      ...this.options,
      parseResultXdr: () => {},
    });
  }

  async burnFrom<R extends methodOptions.ResponseTypes = undefined>(
    {
      spender,
      from,
      amount,
    }: { spender: Address; from: Address; amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "burn_from",
      args: this.spec.funcArgsToScVals("burn_from", { spender, from, amount }),
      ...options,
      ...this.options,
      parseResultXdr: () => {},
    });
  }

  async clawback<R extends methodOptions.ResponseTypes = undefined>(
    { from, amount }: { from: Address; amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "clawback",
      args: this.spec.funcArgsToScVals("clawback", { from, amount }),
      ...options,
      ...this.options,
      parseResultXdr: () => {},
    });
  }

  async setAuthorized<R extends methodOptions.ResponseTypes = undefined>(
    { id, authorize }: { id: Address; authorize: boolean },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "set_authorized",
      args: this.spec.funcArgsToScVals("set_authorized", { id, authorize }),
      ...options,
      ...this.options,
      parseResultXdr: () => {},
    });
  }

  async mint<R extends methodOptions.ResponseTypes = undefined>(
    { to, amount }: { to: Address; amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "mint",
      args: this.spec.funcArgsToScVals("mint", { to, amount }),
      ...options,
      ...this.options,
      parseResultXdr: () => {},
    });
  }

  async setAdmin<R extends methodOptions.ResponseTypes = undefined>(
    { new_admin }: { new_admin: Address },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "set_admin",
      args: this.spec.funcArgsToScVals("set_admin", { new_admin }),
      ...options,
      ...this.options,
      parseResultXdr: () => {},
    });
  }

  async decimals<R extends methodOptions.ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `u32`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "decimals",
      args: this.spec.funcArgsToScVals("decimals", {}),
      ...options,
      ...this.options,
      parseResultXdr: (xdr: any): u32 => {
        return this.spec.funcResToNative("decimals", xdr);
      },
    });
  }

  async name<R extends methodOptions.ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `string`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "name",
      args: this.spec.funcArgsToScVals("name", {}),
      ...options,
      ...this.options,
      parseResultXdr: (xdr: any): string => {
        return this.spec.funcResToNative("name", xdr);
      },
    });
  }

  async symbol<R extends methodOptions.ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `string`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
    return await Invoke.invoke({
      method: "symbol",
      args: this.spec.funcArgsToScVals("symbol", {}),
      ...options,
      ...this.options,
      parseResultXdr: (xdr: any): string => {
        return this.spec.funcResToNative("symbol", xdr);
      },
    });
  }
}
