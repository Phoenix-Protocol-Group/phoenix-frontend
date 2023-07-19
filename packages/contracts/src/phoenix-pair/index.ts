import * as SorobanClient from 'soroban-client';
import { xdr } from 'soroban-client';
import { Buffer } from "buffer";
import { scValStrToJs, scValToJs, addressToScVal, u128ToScVal, i128ToScVal, strToScVal } from './convert.js';
import { invoke, InvokeArgs } from './invoke.js';


export * from './constants.js'
export * from './server.js'
export * from './invoke.js'

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
export interface Error_ { message: string };

export interface Result<T, E = Error_> {
    unwrap(): T,
    unwrapErr(): E,
    isOk(): boolean,
    isErr(): boolean,
};

export class Ok<T> implements Result<T> {
    constructor(readonly value: T) { }
    unwrapErr(): Error_ {
        throw new Error('No error');
    }
    unwrap(): T {
        return this.value;
    }

    isOk(): boolean {
        return true;
    }

    isErr(): boolean {
        return !this.isOk()
    }
}

export class Err<T> implements Result<T> {
    constructor(readonly error: Error_) { }
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
        return !this.isOk()
    }
}

if (typeof window !== 'undefined') {
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

export async function initialize({admin, token_wasm_hash, token_a, token_b, share_token_decimals, swap_fee_bps, fee_recipient, max_allowed_slippage_bps, max_allowed_spread_bps}: {admin: Address, token_wasm_hash: Buffer, token_a: Address, token_b: Address, share_token_decimals: u32, swap_fee_bps: i64, fee_recipient: Address, max_allowed_slippage_bps: i64, max_allowed_spread_bps: i64}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Result<void>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'initialize', 
        args: [((i) => addressToScVal(i))(admin),
        ((i) => xdr.ScVal.scvBytes(i))(token_wasm_hash),
        ((i) => addressToScVal(i))(token_a),
        ((i) => addressToScVal(i))(token_b),
        ((i) => xdr.ScVal.scvU32(i))(share_token_decimals),
        ((i) => xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(swap_fee_bps),
        ((i) => addressToScVal(i))(fee_recipient),
        ((i) => xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(max_allowed_slippage_bps),
        ((i) => xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(max_allowed_spread_bps)], 
    };
    
    try {
        
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return new Ok(scValStrToJs(response.xdr) as void);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function provide_liquidity({sender, desired_a, min_a, desired_b, min_b, custom_slippage_bps}: {sender: Address, desired_a: Option<i128>, min_a: Option<i128>, desired_b: Option<i128>, min_b: Option<i128>, custom_slippage_bps: Option<i64>}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Result<void>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'provide_liquidity', 
        args: [((i) => addressToScVal(i))(sender),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : i128ToScVal(i))(desired_a),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : i128ToScVal(i))(min_a),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : i128ToScVal(i))(desired_b),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : i128ToScVal(i))(min_b),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(custom_slippage_bps)], 
    };
    
    try {
        
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return new Ok(scValStrToJs(response.xdr) as void);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function swap({sender, sell_a, offer_amount, belief_price, max_spread_bps}: {sender: Address, sell_a: boolean, offer_amount: i128, belief_price: Option<i64>, max_spread_bps: Option<i64>}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Result<void>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'swap', 
        args: [((i) => addressToScVal(i))(sender),
        ((i) => xdr.ScVal.scvBool(i))(sell_a),
        ((i) => i128ToScVal(i))(offer_amount),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(belief_price),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(max_spread_bps)], 
    };
    
    try {
        
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return new Ok(scValStrToJs(response.xdr) as void);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function withdraw_liquidity({sender, share_amount, min_a, min_b}: {sender: Address, share_amount: i128, min_a: i128, min_b: i128}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Result<[i128, i128]>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'withdraw_liquidity', 
        args: [((i) => addressToScVal(i))(sender),
        ((i) => i128ToScVal(i))(share_amount),
        ((i) => i128ToScVal(i))(min_a),
        ((i) => i128ToScVal(i))(min_b)], 
    };
    
    try {
        
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return new Ok(scValStrToJs(response.xdr) as [i128, i128]);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function update_config({sender, new_admin, total_fee_bps, fee_recipient, max_allowed_slippage_bps, max_allowed_spread_bps}: {sender: Address, new_admin: Option<Address>, total_fee_bps: Option<i64>, fee_recipient: Option<Address>, max_allowed_slippage_bps: Option<i64>, max_allowed_spread_bps: Option<i64>}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Result<void>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'update_config', 
        args: [((i) => addressToScVal(i))(sender),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(new_admin),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(total_fee_bps),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(fee_recipient),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(max_allowed_slippage_bps),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(max_allowed_spread_bps)], 
    };
    
    try {
        
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return new Ok(scValStrToJs(response.xdr) as void);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function upgrade({new_wasm_hash}: {new_wasm_hash: Buffer}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Result<void>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'upgrade', 
        args: [((i) => xdr.ScVal.scvBytes(i))(new_wasm_hash)], 
    };
    
    try {
        
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return new Ok(scValStrToJs(response.xdr) as void);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function query_config( {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Result<Config>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'query_config', 
        
    };
    
    try {
        
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return new Ok(scValStrToJs(response.xdr) as Config);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function query_share_token_address( {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Result<Address>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'query_share_token_address', 
        
    };
    
    try {
        
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return new Ok(scValStrToJs(response.xdr) as Address);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function query_pool_info( {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Result<PoolResponse>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'query_pool_info', 
        
    };
    
    try {
        
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return new Ok(scValStrToJs(response.xdr) as PoolResponse);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function simulate_swap({sell_a, offer_amount}: {sell_a: boolean, offer_amount: i128}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Result<SimulateSwapResponse>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'simulate_swap', 
        args: [((i) => xdr.ScVal.scvBool(i))(sell_a),
        ((i) => i128ToScVal(i))(offer_amount)], 
    };
    
    try {
        
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return new Ok(scValStrToJs(response.xdr) as SimulateSwapResponse);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function simulate_reverse_swap({sell_a, ask_amount}: {sell_a: boolean, ask_amount: i128}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Result<SimulateReverseSwapResponse>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'simulate_reverse_swap', 
        args: [((i) => xdr.ScVal.scvBool(i))(sell_a),
        ((i) => i128ToScVal(i))(ask_amount)], 
    };
    
    try {
        
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return new Ok(scValStrToJs(response.xdr) as SimulateReverseSwapResponse);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

const Errors = [ 
{message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""}
]
export enum PairType {
  Xyk = 0,
}

function PairTypeFromXdr(base64Xdr: string): PairType {
    return  scValStrToJs(base64Xdr) as PairType;
}


function PairTypeToXdr(val: PairType): xdr.ScVal {
    return  xdr.ScVal.scvI32(val);
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
  token_a: Address;
  token_b: Address;
  /**
 * The total fees (in bps) charged by a pair of this type.
 * In relation to the returned amount of tokens
 */
total_fee_bps: i64;
}

function ConfigToXdr(config?: Config): xdr.ScVal {
    if (!config) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("fee_recipient"), val: ((i)=>addressToScVal(i))(config["fee_recipient"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("max_allowed_slippage_bps"), val: ((i)=>xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(config["max_allowed_slippage_bps"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("max_allowed_spread_bps"), val: ((i)=>xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(config["max_allowed_spread_bps"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("pair_type"), val: ((i)=>PairTypeToXdr(i))(config["pair_type"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("share_token"), val: ((i)=>addressToScVal(i))(config["share_token"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("token_a"), val: ((i)=>addressToScVal(i))(config["token_a"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("token_b"), val: ((i)=>addressToScVal(i))(config["token_b"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("total_fee_bps"), val: ((i)=>xdr.ScVal.scvI64(xdr.Int64.fromString(i.toString())))(config["total_fee_bps"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function ConfigFromXdr(base64Xdr: string): Config {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        fee_recipient: scValToJs(map.get("fee_recipient")) as unknown as Address,
        max_allowed_slippage_bps: scValToJs(map.get("max_allowed_slippage_bps")) as unknown as i64,
        max_allowed_spread_bps: scValToJs(map.get("max_allowed_spread_bps")) as unknown as i64,
        pair_type: scValToJs(map.get("pair_type")) as unknown as PairType,
        share_token: scValToJs(map.get("share_token")) as unknown as Address,
        token_a: scValToJs(map.get("token_a")) as unknown as Address,
        token_b: scValToJs(map.get("token_b")) as unknown as Address,
        total_fee_bps: scValToJs(map.get("total_fee_bps")) as unknown as i64
    };
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

function AssetToXdr(asset?: Asset): xdr.ScVal {
    if (!asset) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("address"), val: ((i)=>addressToScVal(i))(asset["address"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("amount"), val: ((i)=>i128ToScVal(i))(asset["amount"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


export function AssetFromXdr(base64Xdr: string): Asset {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        address: scValToJs(map.get("address")) as unknown as Address,
        amount: scValToJs(map.get("amount")) as unknown as i128
    };
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

function PoolResponseToXdr(poolResponse?: PoolResponse): xdr.ScVal {
    if (!poolResponse) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("asset_a"), val: ((i)=>AssetToXdr(i))(poolResponse["asset_a"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("asset_b"), val: ((i)=>AssetToXdr(i))(poolResponse["asset_b"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("asset_lp_share"), val: ((i)=>AssetToXdr(i))(poolResponse["asset_lp_share"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


export function PoolResponseFromXdr(base64Xdr: string): PoolResponse {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        asset_a: scValToJs(map.get("asset_a")) as unknown as Asset,
        asset_b: scValToJs(map.get("asset_b")) as unknown as Asset,
        asset_lp_share: scValToJs(map.get("asset_lp_share")) as unknown as Asset
    };
}

export interface SimulateSwapResponse {
  ask_amount: i128;
  commission_amount: i128;
  spread_amount: i128;
  total_return: i128;
}

function SimulateSwapResponseToXdr(simulateSwapResponse?: SimulateSwapResponse): xdr.ScVal {
    if (!simulateSwapResponse) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("ask_amount"), val: ((i)=>i128ToScVal(i))(simulateSwapResponse["ask_amount"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("commission_amount"), val: ((i)=>i128ToScVal(i))(simulateSwapResponse["commission_amount"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("spread_amount"), val: ((i)=>i128ToScVal(i))(simulateSwapResponse["spread_amount"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("total_return"), val: ((i)=>i128ToScVal(i))(simulateSwapResponse["total_return"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


export function SimulateSwapResponseFromXdr(base64Xdr: string): SimulateSwapResponse {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        ask_amount: scValToJs(map.get("ask_amount")) as unknown as i128,
        commission_amount: scValToJs(map.get("commission_amount")) as unknown as i128,
        spread_amount: scValToJs(map.get("spread_amount")) as unknown as i128,
        total_return: scValToJs(map.get("total_return")) as unknown as i128
    };
}

export interface SimulateReverseSwapResponse {
  commission_amount: i128;
  offer_amount: i128;
  spread_amount: i128;
}

export function SimulateReverseSwapResponseToXdr(simulateReverseSwapResponse?: SimulateReverseSwapResponse): xdr.ScVal {
    if (!simulateReverseSwapResponse) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("commission_amount"), val: ((i)=>i128ToScVal(i))(simulateReverseSwapResponse["commission_amount"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("offer_amount"), val: ((i)=>i128ToScVal(i))(simulateReverseSwapResponse["offer_amount"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("spread_amount"), val: ((i)=>i128ToScVal(i))(simulateReverseSwapResponse["spread_amount"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


export function SimulateReverseSwapResponseFromXdr(base64Xdr: string): SimulateReverseSwapResponse {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        commission_amount: scValToJs(map.get("commission_amount")) as unknown as i128,
        offer_amount: scValToJs(map.get("offer_amount")) as unknown as i128,
        spread_amount: scValToJs(map.get("spread_amount")) as unknown as i128
    };
}
