import * as SorobanClient from "soroban-client";
import { xdr } from "soroban-client";
import { Buffer } from "buffer";
import {
  scValStrToJs,
  scValToJs,
  addressToScVal,
  u128ToScVal,
  i128ToScVal,
  strToScVal,
} from "./convert.js";
import { invoke, InvokeArgs } from "./invoke.js";

export * from "./server.js";
export * from "./invoke.js";

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

let Errors: Error_[] = [];

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

export async function initialize(
  {
    admin,
    contractId,
    decimal,
    name,
    symbol,
  }: {
    admin: Address;
    contractId: string;
    decimal: u32;
    name: Buffer;
    symbol: Buffer;
  },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<void> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "initialize",
    args: [
      ((i) => addressToScVal(i))(admin),
      ((i) => xdr.ScVal.scvU32(i))(decimal),
      ((i) => xdr.ScVal.scvBytes(i))(name),
      ((i) => xdr.ScVal.scvBytes(i))(symbol),
    ],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return;
}

export async function allowance(
  {
    from,
    spender,
    contractId,
  }: { from: Address; spender: Address; contractId: string },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<i128> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "allowance",
    args: [
      ((i) => addressToScVal(i))(from),
      ((i) => addressToScVal(i))(spender),
    ],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return scValStrToJs(response.xdr) as i128;
}

export async function increase_allowance(
  { from, spender, amount }: { from: Address; spender: Address; amount: i128 },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  },
  contractId: string
): Promise<void> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "increase_allowance",
    args: [
      ((i) => addressToScVal(i))(from),
      ((i) => addressToScVal(i))(spender),
      ((i) => i128ToScVal(i))(amount),
    ],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return;
}

export async function decrease_allowance(
  { from, spender, amount }: { from: Address; spender: Address; amount: i128 },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  },
  contractId: string
): Promise<void> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "decrease_allowance",
    args: [
      ((i) => addressToScVal(i))(from),
      ((i) => addressToScVal(i))(spender),
      ((i) => i128ToScVal(i))(amount),
    ],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return;
}

export async function balance(
  { id }: { id: Address },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  },
  contractId: string
): Promise<i128> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "balance",
    args: [((i) => addressToScVal(i))(id)],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return scValStrToJs(response.xdr) as i128;
}

export async function spendable_balance(
  { id, contractId }: { id: Address; contractId: string },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<i128> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "spendable_balance",
    args: [((i) => addressToScVal(i))(id)],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return scValStrToJs(response.xdr) as i128;
}

export async function authorized(
  { id, contractId }: { id: Address; contractId: string },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<boolean> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "authorized",
    args: [((i) => addressToScVal(i))(id)],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return scValStrToJs(response.xdr) as boolean;
}

export async function transfer(
  {
    from,
    to,
    amount,
    contractId,
  }: { from: Address; to: Address; amount: i128; contractId: string },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<void> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "transfer",
    args: [
      ((i) => addressToScVal(i))(from),
      ((i) => addressToScVal(i))(to),
      ((i) => i128ToScVal(i))(amount),
    ],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return;
}

export async function transfer_from(
  {
    spender,
    from,
    to,
    amount,
    contractId,
  }: {
    spender: Address;
    from: Address;
    to: Address;
    amount: i128;
    contractId: string;
  },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<void> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "transfer_from",
    args: [
      ((i) => addressToScVal(i))(spender),
      ((i) => addressToScVal(i))(from),
      ((i) => addressToScVal(i))(to),
      ((i) => i128ToScVal(i))(amount),
    ],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return;
}

export async function burn(
  {
    from,
    amount,
    contractId,
  }: { from: Address; amount: i128; contractId: string },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<void> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "burn",
    args: [((i) => addressToScVal(i))(from), ((i) => i128ToScVal(i))(amount)],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return;
}

export async function burn_from(
  {
    spender,
    from,
    amount,
    contractId,
  }: { spender: Address; from: Address; amount: i128; contractId: string },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<void> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "burn_from",
    args: [
      ((i) => addressToScVal(i))(spender),
      ((i) => addressToScVal(i))(from),
      ((i) => i128ToScVal(i))(amount),
    ],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return;
}

export async function clawback(
  {
    from,
    amount,
    contractId,
  }: { from: Address; amount: i128; contractId: string },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<void> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "clawback",
    args: [((i) => addressToScVal(i))(from), ((i) => i128ToScVal(i))(amount)],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return;
}

export async function set_authorized(
  {
    id,
    authorize,
    contractId,
  }: { id: Address; authorize: boolean; contractId: string },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<void> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "set_authorized",
    args: [
      ((i) => addressToScVal(i))(id),
      ((i) => xdr.ScVal.scvBool(i))(authorize),
    ],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return;
}

export async function mint(
  { to, amount, contractId }: { to: Address; amount: i128; contractId: string },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<void> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "mint",
    args: [((i) => addressToScVal(i))(to), ((i) => i128ToScVal(i))(amount)],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return;
}

export async function set_admin(
  { new_admin, contractId }: { new_admin: Address; contractId: string },
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  }
): Promise<void> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "set_admin",
    args: [((i) => addressToScVal(i))(new_admin)],
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return;
}

export async function decimals(
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  },
  contractId: string
): Promise<u32> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "decimals",
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return scValStrToJs(response.xdr) as u32;
}

export async function name(
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  },
  contractId: string
): Promise<Buffer> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "name",
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return scValStrToJs(response.xdr) as Buffer;
}

export async function symbol(
  { signAndSend, fee }: { signAndSend?: boolean; fee?: number } = {
    signAndSend: false,
    fee: 100,
  },
  contractId: string
): Promise<Buffer> {
  let invokeArgs: InvokeArgs = {
    signAndSend,
    contractId,
    fee,
    method: "symbol",
  };

  // @ts-ignore Type does exist
  const response = await invoke(invokeArgs);
  return scValStrToJs(response.xdr) as Buffer;
}

export interface AllowanceDataKey {
  from: Address;
  spender: Address;
}

function AllowanceDataKeyToXdr(allowanceDataKey?: AllowanceDataKey): xdr.ScVal {
  if (!allowanceDataKey) {
    return xdr.ScVal.scvVoid();
  }
  let arr = [
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("from"),
      val: ((i) => addressToScVal(i))(allowanceDataKey["from"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("spender"),
      val: ((i) => addressToScVal(i))(allowanceDataKey["spender"]),
    }),
  ];
  return xdr.ScVal.scvMap(arr);
}

function AllowanceDataKeyFromXdr(base64Xdr: string): AllowanceDataKey {
  let scVal = strToScVal(base64Xdr);
  let obj: [string, any][] = scVal
    .map()!
    .map((e) => [e.key().str() as string, e.val()]);
  let map = new Map<string, any>(obj);
  if (!obj) {
    throw new Error("Invalid XDR");
  }
  return {
    from: scValToJs(map.get("from")) as unknown as Address,
    spender: scValToJs(map.get("spender")) as unknown as Address,
  };
}

export type DataKey =
  | { tag: "Allowance"; values: [AllowanceDataKey] }
  | { tag: "Balance"; values: [Address] }
  | { tag: "Nonce"; values: [Address] }
  | { tag: "State"; values: [Address] }
  | { tag: "Admin"; values: void };

function DataKeyToXdr(dataKey?: DataKey): xdr.ScVal {
  if (!dataKey) {
    return xdr.ScVal.scvVoid();
  }
  let res: xdr.ScVal[] = [];
  switch (dataKey.tag) {
    case "Allowance":
      res.push(((i) => xdr.ScVal.scvSymbol(i))("Allowance"));
      res.push(((i) => AllowanceDataKeyToXdr(i))(dataKey.values[0]));
      break;
    case "Balance":
      res.push(((i) => xdr.ScVal.scvSymbol(i))("Balance"));
      res.push(((i) => addressToScVal(i))(dataKey.values[0]));
      break;
    case "Nonce":
      res.push(((i) => xdr.ScVal.scvSymbol(i))("Nonce"));
      res.push(((i) => addressToScVal(i))(dataKey.values[0]));
      break;
    case "State":
      res.push(((i) => xdr.ScVal.scvSymbol(i))("State"));
      res.push(((i) => addressToScVal(i))(dataKey.values[0]));
      break;
    case "Admin":
      res.push(((i) => xdr.ScVal.scvSymbol(i))("Admin"));
      break;
  }
  return xdr.ScVal.scvVec(res);
}

function DataKeyFromXdr(base64Xdr: string): DataKey {
  type Tag = DataKey["tag"];
  type Value = DataKey["values"];
  let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [
    Tag,
    Value
  ];
  if (!tag) {
    throw new Error("Missing enum tag when decoding DataKey from XDR");
  }
  return { tag, values } as DataKey;
}

export interface TokenMetadata {
  decimal: u32;
  name: Buffer;
  symbol: Buffer;
}

function TokenMetadataToXdr(tokenMetadata?: TokenMetadata): xdr.ScVal {
  if (!tokenMetadata) {
    return xdr.ScVal.scvVoid();
  }
  let arr = [
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("decimal"),
      val: ((i) => xdr.ScVal.scvU32(i))(tokenMetadata["decimal"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("name"),
      val: ((i) => xdr.ScVal.scvBytes(i))(tokenMetadata["name"]),
    }),
    new xdr.ScMapEntry({
      key: ((i) => xdr.ScVal.scvSymbol(i))("symbol"),
      val: ((i) => xdr.ScVal.scvBytes(i))(tokenMetadata["symbol"]),
    }),
  ];
  return xdr.ScVal.scvMap(arr);
}

function TokenMetadataFromXdr(base64Xdr: string): TokenMetadata {
  let scVal = strToScVal(base64Xdr);
  let obj: [string, any][] = scVal
    .map()!
    .map((e) => [e.key().str() as string, e.val()]);
  let map = new Map<string, any>(obj);
  if (!obj) {
    throw new Error("Invalid XDR");
  }
  return {
    decimal: scValToJs(map.get("decimal")) as unknown as u32,
    name: scValToJs(map.get("name")) as unknown as Buffer,
    symbol: scValToJs(map.get("symbol")) as unknown as Buffer,
  };
}
