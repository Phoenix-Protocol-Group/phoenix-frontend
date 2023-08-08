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

export async function initialize<R extends ResponseTypes = undefined>(
  {
    admin,
    lp_token,
    token_per_power,
    min_bond,
    max_distributions,
    min_reward,
  }: {
    admin: Address;
    lp_token: Address;
    token_per_power: u128;
    min_bond: i128;
    max_distributions: u32;
    min_reward: i128;
  },
  contractId: string,
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
  return await invoke.invoke({
    contractId,
    method: "initialize",
    args: [
      ((i) => addressToScVal(i))(admin),
      ((i) => addressToScVal(i))(lp_token),
      ((i) => u128ToScVal(i))(token_per_power),
      ((i) => i128ToScVal(i))(min_bond),
      ((i) => xdr.ScVal.scvU32(i))(max_distributions),
      ((i) => i128ToScVal(i))(min_reward),
    ],
    ...options,
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

export async function bond<R extends ResponseTypes = undefined>(
  { sender, tokens }: { sender: Address; tokens: i128 },
  contractId: string,
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
  return await invoke.invoke({
    method: "bond",
    contractId,
    args: [((i) => addressToScVal(i))(sender), ((i) => i128ToScVal(i))(tokens)],
    ...options,
    // @ts-ignore
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

export async function unbond<R extends ResponseTypes = undefined>(
  {
    sender,
    stake_amount,
    stake_timestamp,
  }: { sender: Address; stake_amount: i128; stake_timestamp: u64 },
  contractId: string,
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
  return await invoke.invoke({
    method: "unbond",
    contractId,
    args: [
      ((i) => addressToScVal(i))(sender),
      ((i) => i128ToScVal(i))(stake_amount),
      ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        stake_timestamp
      ),
    ],
    ...options,
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

export async function createDistributionFlow<
  R extends ResponseTypes = undefined
>(
  {
    sender,
    manager,
    asset,
    amount,
    distribution_length,
  }: {
    sender: Address;
    manager: Address;
    asset: Address;
    amount: i128;
    distribution_length: u64;
  },
  contractId: string,
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
  return await invoke.invoke({
    method: "create_distribution_flow",
    contractId,
    args: [
      ((i) => addressToScVal(i))(sender),
      ((i) => addressToScVal(i))(manager),
      ((i) => addressToScVal(i))(asset),
      ((i) => i128ToScVal(i))(amount),
      ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        distribution_length
      ),
    ],
    ...options,
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

export async function distributeRewards<R extends ResponseTypes = undefined>(
  contractId: string,
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
  return await invoke.invoke({
    contractId,
    method: "distribute_rewards",
    ...options,
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

export async function withdrawRewards<R extends ResponseTypes = undefined>(
  { _receiver }: { _receiver: Option<Address> },
  contractId: string,
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
  return await invoke.invoke({
    method: "withdraw_rewards",
    contractId,
    args: [((i) => (!i ? xdr.ScVal.scvVoid() : addressToScVal(i)))(_receiver)],
    ...options,
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

export async function fundDistribution<R extends ResponseTypes = undefined>(
  {
    _start_time,
    _distribution_duration,
    _amount,
  }: { _start_time: u64; _distribution_duration: u64; _amount: u128 },
  contractId: string,
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
  return await invoke.invoke({
    method: "fund_distribution",
    contractId,
    args: [
      ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        _start_time
      ),
      ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        _distribution_duration
      ),
      ((i) => u128ToScVal(i))(_amount),
    ],
    ...options,
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

export async function queryConfig<R extends ResponseTypes = undefined>(
  contractId: string,
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number;
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `Ok<ConfigResponse> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
  return await invoke.invoke({
    contractId,
    method: "query_config",
    ...options,
    parseResultXdr: (xdr): Ok<ConfigResponse> | Err<Error_> | undefined => {
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

export async function queryAdmin<R extends ResponseTypes = undefined>(
  contractId: string,
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
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number;
  } = {}
) {
  return await invoke.invoke({
    contractId,
    method: "query_admin",
    ...options,
    parseResultXdr: (xdr): Ok<Address> | Err<Error_> | undefined => {
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

export async function queryStaked<R extends ResponseTypes = undefined>(
  { address }: { address: Address },
  contractId: string,
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number;
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `Ok<StakedResponse> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
  return await invoke.invoke({
    method: "query_staked",
    contractId,
    args: [((i) => addressToScVal(i))(address)],
    ...options,
    parseResultXdr: (xdr): Ok<StakedResponse> | Err<Error_> | undefined => {
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

export async function queryAnnualizedRewards<
  R extends ResponseTypes = undefined
>(
  contractId: string,
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number;
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `Ok<AnnualizedRewardsResponse> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R;
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number;
    contractId: string;
  }
) {
  return await invoke.invoke({
    method: "query_annualized_rewards",
    ...options,
    contractId,
    parseResultXdr: (
      xdr
    ): Ok<AnnualizedRewardsResponse> | Err<Error_> | undefined => {
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

export async function queryWithdrawableRewards<
  R extends ResponseTypes = undefined
>(
  { _address }: { _address: Address },
  contractId: string,
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
  return await invoke.invoke({
    method: "query_withdrawable_rewards",
    contractId,
    args: [((i) => addressToScVal(i))(_address)],
    ...options,
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

export async function queryDistributedRewards<
  R extends ResponseTypes = undefined
>(
  contractId: string,
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
  return await invoke.invoke({
    method: "query_distributed_rewards",
    contractId,
    ...options,
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

export interface StorageCurve {
  amount_to_distribute: u128;
  manager: Address;
  start_timestamp: u64;
  stop_timestamp: u64;
}

function StorageCurveToXdr(storageCurve?: StorageCurve): xdr.ScVal {
  if (!storageCurve) {
    return xdr.ScVal.scvVoid();
  }
  let arr = [
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("amount_to_distribute"),
      val: ((i) => u128ToScVal(i))(storageCurve["amount_to_distribute"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("manager"),
      val: ((i) => addressToScVal(i))(storageCurve["manager"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("start_timestamp"),
      val: ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        storageCurve["start_timestamp"]
      ),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("stop_timestamp"),
      val: ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        storageCurve["stop_timestamp"]
      ),
    }),
  ];
  return xdr.ScVal.scvMap(arr);
}

function StorageCurveFromXdr(base64Xdr: string): StorageCurve {
  let scVal = strToScVal(base64Xdr);
  let obj: [string, any][] = scVal
    .map()!
    .map((e) => [e.key().str() as string, e.val()]);
  let map = new Map<string, any>(obj);
  if (!obj) {
    throw new Error("Invalid XDR");
  }
  return {
    amount_to_distribute: scValToJs(
      map.get("amount_to_distribute")
    ) as unknown as u128,
    manager: scValToJs(map.get("manager")) as unknown as Address,
    start_timestamp: scValToJs(map.get("start_timestamp")) as unknown as u64,
    stop_timestamp: scValToJs(map.get("stop_timestamp")) as unknown as u64,
  };
}

export interface Distribution {
  /**
   * Bonus per staking day
   */
  bonus_per_day_bps: u64;
  /**
   * Total rewards distributed by this contract.
   */
  distributed_total: u128;
  /**
   * The manager of this distribution
   */
  manager: Address;
  /**
   * Max bonus for staking after 60 days
   */
  max_bonus_bps: u64;
  /**
   * Shares which were not fully distributed on previous distributions, and should be redistributed
   */
  shares_leftover: u64;
  /**
   * How many shares is single point worth
   */
  shares_per_point: u128;
  /**
   * Total rewards not yet withdrawn.
   */
  withdrawable_total: u128;
}

function DistributionToXdr(distribution?: Distribution): xdr.ScVal {
  if (!distribution) {
    return xdr.ScVal.scvVoid();
  }
  let arr = [
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("bonus_per_day_bps"),
      val: ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        distribution["bonus_per_day_bps"]
      ),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("distributed_total"),
      val: ((i) => u128ToScVal(i))(distribution["distributed_total"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("manager"),
      val: ((i) => addressToScVal(i))(distribution["manager"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("max_bonus_bps"),
      val: ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        distribution["max_bonus_bps"]
      ),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("shares_leftover"),
      val: ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        distribution["shares_leftover"]
      ),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("shares_per_point"),
      val: ((i) => u128ToScVal(i))(distribution["shares_per_point"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("withdrawable_total"),
      val: ((i) => u128ToScVal(i))(distribution["withdrawable_total"]),
    }),
  ];
  return xdr.ScVal.scvMap(arr);
}

function DistributionFromXdr(base64Xdr: string): Distribution {
  let scVal = strToScVal(base64Xdr);
  let obj: [string, any][] = scVal
    .map()!
    .map((e) => [e.key().str() as string, e.val()]);
  let map = new Map<string, any>(obj);
  if (!obj) {
    throw new Error("Invalid XDR");
  }
  return {
    bonus_per_day_bps: scValToJs(
      map.get("bonus_per_day_bps")
    ) as unknown as u64,
    distributed_total: scValToJs(
      map.get("distributed_total")
    ) as unknown as u128,
    manager: scValToJs(map.get("manager")) as unknown as Address,
    max_bonus_bps: scValToJs(map.get("max_bonus_bps")) as unknown as u64,
    shares_leftover: scValToJs(map.get("shares_leftover")) as unknown as u64,
    shares_per_point: scValToJs(map.get("shares_per_point")) as unknown as u128,
    withdrawable_total: scValToJs(
      map.get("withdrawable_total")
    ) as unknown as u128,
  };
}

const Errors = [
  { message: "" },
  { message: "" },
  { message: "" },
  { message: "" },
  { message: "" },
  { message: "" },
  { message: "" },
  { message: "" },
  { message: "" },
  { message: "" },
];
export interface ConfigResponse {
  config: Config;
}

function ConfigResponseToXdr(configResponse?: ConfigResponse): xdr.ScVal {
  if (!configResponse) {
    return xdr.ScVal.scvVoid();
  }
  let arr = [
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("config"),
      val: ((i) => ConfigToXdr(i))(configResponse["config"]),
    }),
  ];
  return xdr.ScVal.scvMap(arr);
}

function ConfigResponseFromXdr(base64Xdr: string): ConfigResponse {
  let scVal = strToScVal(base64Xdr);
  let obj: [string, any][] = scVal
    .map()!
    .map((e) => [e.key().str() as string, e.val()]);
  let map = new Map<string, any>(obj);
  if (!obj) {
    throw new Error("Invalid XDR");
  }
  return {
    config: scValToJs(map.get("config")) as unknown as Config,
  };
}

export interface StakedResponse {
  stakes: Array<Stake>;
}

function StakedResponseToXdr(stakedResponse?: StakedResponse): xdr.ScVal {
  if (!stakedResponse) {
    return xdr.ScVal.scvVoid();
  }
  let arr = [
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("stakes"),
      val: ((i) => xdr.ScVal.scvVec(i.map((i) => StakeToXdr(i))))(
        stakedResponse["stakes"]
      ),
    }),
  ];
  return xdr.ScVal.scvMap(arr);
}

function StakedResponseFromXdr(base64Xdr: string): StakedResponse {
  let scVal = strToScVal(base64Xdr);
  let obj: [string, any][] = scVal
    .map()!
    .map((e) => [e.key().str() as string, e.val()]);
  let map = new Map<string, any>(obj);
  if (!obj) {
    throw new Error("Invalid XDR");
  }
  return {
    stakes: scValToJs(map.get("stakes")) as unknown as Array<Stake>,
  };
}

export interface AnnualizedRewardsResponse {
  /**
   * None means contract does not know the value - total_staked or total_power could be 0.
   */
  amount: OptionUint;
  info: Address;
}

function AnnualizedRewardsResponseToXdr(
  annualizedRewardsResponse?: AnnualizedRewardsResponse
): xdr.ScVal {
  if (!annualizedRewardsResponse) {
    return xdr.ScVal.scvVoid();
  }
  let arr = [
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("amount"),
      val: ((i) => OptionUintToXdr(i))(annualizedRewardsResponse["amount"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("info"),
      val: ((i) => addressToScVal(i))(annualizedRewardsResponse["info"]),
    }),
  ];
  return xdr.ScVal.scvMap(arr);
}

function AnnualizedRewardsResponseFromXdr(
  base64Xdr: string
): AnnualizedRewardsResponse {
  let scVal = strToScVal(base64Xdr);
  let obj: [string, any][] = scVal
    .map()!
    .map((e) => [e.key().str() as string, e.val()]);
  let map = new Map<string, any>(obj);
  if (!obj) {
    throw new Error("Invalid XDR");
  }
  return {
    amount: scValToJs(map.get("amount")) as unknown as OptionUint,
    info: scValToJs(map.get("info")) as unknown as Address,
  };
}

export interface Config {
  lp_token: Address;
  max_distributions: u32;
  min_bond: i128;
  min_reward: i128;
  token_per_power: u128;
}

function ConfigToXdr(config?: Config): xdr.ScVal {
  if (!config) {
    return xdr.ScVal.scvVoid();
  }
  let arr = [
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("lp_token"),
      val: ((i) => addressToScVal(i))(config["lp_token"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("max_distributions"),
      val: ((i) => xdr.ScVal.scvU32(i))(config["max_distributions"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("min_bond"),
      val: ((i) => i128ToScVal(i))(config["min_bond"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("min_reward"),
      val: ((i) => i128ToScVal(i))(config["min_reward"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("token_per_power"),
      val: ((i) => u128ToScVal(i))(config["token_per_power"]),
    }),
  ];
  return xdr.ScVal.scvMap(arr);
}

function ConfigFromXdr(base64Xdr: string): Config {
  let scVal = strToScVal(base64Xdr);
  let obj: [string, any][] = scVal
    .map()!
    .map((e) => [e.key().str() as string, e.val()]);
  let map = new Map<string, any>(obj);
  if (!obj) {
    throw new Error("Invalid XDR");
  }
  return {
    lp_token: scValToJs(map.get("lp_token")) as unknown as Address,
    max_distributions: scValToJs(
      map.get("max_distributions")
    ) as unknown as u32,
    min_bond: scValToJs(map.get("min_bond")) as unknown as i128,
    min_reward: scValToJs(map.get("min_reward")) as unknown as i128,
    token_per_power: scValToJs(map.get("token_per_power")) as unknown as u128,
  };
}

export interface Stake {
  /**
   * The amount of staked tokens
   */
  stake: i128;
  /**
   * The timestamp when the stake was made
   */
  stake_timestamp: u64;
}

function StakeToXdr(stake?: Stake): xdr.ScVal {
  if (!stake) {
    return xdr.ScVal.scvVoid();
  }
  let arr = [
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("stake"),
      val: ((i) => i128ToScVal(i))(stake["stake"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("stake_timestamp"),
      val: ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        stake["stake_timestamp"]
      ),
    }),
  ];
  return xdr.ScVal.scvMap(arr);
}

function StakeFromXdr(base64Xdr: string): Stake {
  let scVal = strToScVal(base64Xdr);
  let obj: [string, any][] = scVal
    .map()!
    .map((e) => [e.key().str() as string, e.val()]);
  let map = new Map<string, any>(obj);
  if (!obj) {
    throw new Error("Invalid XDR");
  }
  return {
    stake: scValToJs(map.get("stake")) as unknown as i128,
    stake_timestamp: scValToJs(map.get("stake_timestamp")) as unknown as u64,
  };
}

export interface BondingInfo {
  /**
   * Last time when user has claimed rewards
   */
  last_reward_time: u64;
  /**
   * The rewards debt is a mechanism to determine how much a user has already been credited in terms of staking rewards.
   * Whenever a user deposits or withdraws staked tokens to the pool, the rewards for the user is updated based on the
   * accumulated rewards per share, and the difference is stored as reward debt. When claiming rewards, this reward debt
   * is used to determine how much rewards a user can actually claim.
   */
  reward_debt: u128;
  /**
   * Vec of stakes sorted by stake timestamp
   */
  stakes: Array<Stake>;
}

function BondingInfoToXdr(bondingInfo?: BondingInfo): xdr.ScVal {
  if (!bondingInfo) {
    return xdr.ScVal.scvVoid();
  }
  let arr = [
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("last_reward_time"),
      val: ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        bondingInfo["last_reward_time"]
      ),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("reward_debt"),
      val: ((i) => u128ToScVal(i))(bondingInfo["reward_debt"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("stakes"),
      val: ((i) => xdr.ScVal.scvVec(i.map((i) => StakeToXdr(i))))(
        bondingInfo["stakes"]
      ),
    }),
  ];
  return xdr.ScVal.scvMap(arr);
}

function BondingInfoFromXdr(base64Xdr: string): BondingInfo {
  let scVal = strToScVal(base64Xdr);
  let obj: [string, any][] = scVal
    .map()!
    .map((e) => [e.key().str() as string, e.val()]);
  let map = new Map<string, any>(obj);
  if (!obj) {
    throw new Error("Invalid XDR");
  }
  return {
    last_reward_time: scValToJs(map.get("last_reward_time")) as unknown as u64,
    reward_debt: scValToJs(map.get("reward_debt")) as unknown as u128,
    stakes: scValToJs(map.get("stakes")) as unknown as Array<Stake>,
  };
}

export type OptionUint =
  | { tag: "Some"; values: [u128] }
  | { tag: "None"; values: void };

function OptionUintToXdr(optionUint?: OptionUint): xdr.ScVal {
  if (!optionUint) {
    return xdr.ScVal.scvVoid();
  }
  let res: xdr.ScVal[] = [];
  switch (optionUint.tag) {
    case "Some":
      res.push(((i) => xdr.ScVal.scvSymbol(i))("Some"));
      res.push(((i) => u128ToScVal(i))(optionUint.values[0]));
      break;
    case "None":
      res.push(((i) => xdr.ScVal.scvSymbol(i))("None"));
      break;
  }
  return xdr.ScVal.scvVec(res);
}

function OptionUintFromXdr(base64Xdr: string): OptionUint {
  type Tag = OptionUint["tag"];
  type Value = OptionUint["values"];
  let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [
    Tag,
    Value
  ];
  if (!tag) {
    throw new Error("Missing enum tag when decoding OptionUint from XDR");
  }
  return { tag, values } as OptionUint;
}
