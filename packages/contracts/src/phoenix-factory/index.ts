import { ContractSpec, Address, xdr } from "stellar-sdk";
import { Buffer } from "buffer";
import { AssembledTransaction, Ok, Err } from "@phoenix-protocol/utils";
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
  Error_,
  Result,
} from "@phoenix-protocol/utils";
import type { ClassOptions, XDR_BASE64 } from "@phoenix-protocol/utils";

export * from "@phoenix-protocol/utils";
if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  futurenet: {
    networkPassphrase: "Test SDF Future Network ; October 2022",
    contractId: "0",
  },
} as const;

/**
    
    */
export interface PairTupleKey {
  /**
    
    */
  token_a: string;
  /**
    
    */
  token_b: string;
}

/**
    
    */
export interface Config {
  /**
    
    */
  admin: string;
  /**
    
    */
  multihop_address: string;
}

/**
    
    */
export interface Asset {
  /**
    Address of the asset
    */
  address: string;
  /**
    The total amount of those tokens in the pool
    */
  amount: i128;
}

/**
    This struct is used to return a query result with the total amount of LP tokens and assets in a specific pool.
    */
export interface PoolResponse {
  /**
    The asset A in the pool together with asset amounts
    */
  asset_a: Asset;
  /**
    The asset B in the pool together with asset amounts
    */
  asset_b: Asset;
  /**
    The total amount of LP tokens currently issued
    */
  asset_lp_share: Asset;
}

/**
    
    */
export interface LiquidityPoolInfo {
  /**
    
    */
  pool_address: string;
  /**
    
    */
  pool_response: PoolResponse;
  /**
    
    */
  total_fee_bps: i64;
}

/**
    
    */
export interface TokenInitInfo {
  /**
    
    */
  token_a: string;
  /**
    
    */
  token_b: string;
  /**
    
    */
  token_wasm_hash: Buffer;
}

/**
    
    */
export interface StakeInitInfo {
  /**
    
    */
  max_distributions: u32;
  /**
    
    */
  min_bond: i128;
  /**
    
    */
  min_reward: i128;
  /**
    
    */
  stake_wasm_hash: Buffer;
}

/**
    
    */
export interface LiquidityPoolInitInfo {
  /**
    
    */
  admin: string;
  /**
    
    */
  fee_recipient: string;
  /**
    
    */
  lp_wasm_hash: Buffer;
  /**
    
    */
  max_allowed_slippage_bps: i64;
  /**
    
    */
  max_allowed_spread_bps: i64;
  /**
    
    */
  max_referral_bps: i64;
  /**
    
    */
  share_token_decimals: u32;
  /**
    
    */
  stake_init_info: StakeInitInfo;
  /**
    
    */
  swap_fee_bps: i64;
  /**
    
    */
  token_init_info: TokenInitInfo;
}

/**
    
    */
export const Errors = {};

export class Contract {
  spec: ContractSpec;
  constructor(public readonly options: ClassOptions) {
    this.spec = new ContractSpec([
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAABJtdWx0aWhvcF93YXNtX2hhc2gAAAAAA+4AAAAgAAAAAA==",
      "AAAAAAAAAAAAAAAVY3JlYXRlX2xpcXVpZGl0eV9wb29sAAAAAAAAAQAAAAAAAAAMbHBfaW5pdF9pbmZvAAAH0AAAABVMaXF1aWRpdHlQb29sSW5pdEluZm8AAAAAAAABAAAAEw==",
      "AAAAAAAAAAAAAAALcXVlcnlfcG9vbHMAAAAAAAAAAAEAAAPqAAAAEw==",
      "AAAAAAAAAAAAAAAScXVlcnlfcG9vbF9kZXRhaWxzAAAAAAABAAAAAAAAAAxwb29sX2FkZHJlc3MAAAATAAAAAQAAB9AAAAARTGlxdWlkaXR5UG9vbEluZm8AAAA=",
      "AAAAAAAAAAAAAAAXcXVlcnlfYWxsX3Bvb2xzX2RldGFpbHMAAAAAAAAAAAEAAAPqAAAH0AAAABFMaXF1aWRpdHlQb29sSW5mbwAAAA==",
      "AAAAAAAAAAAAAAAccXVlcnlfZm9yX3Bvb2xfYnlfdG9rZW5fcGFpcgAAAAIAAAAAAAAAB3Rva2VuX2EAAAAAEwAAAAAAAAAHdG9rZW5fYgAAAAATAAAAAQAAABM=",
      "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAAT",
      "AAAAAAAAAAAAAAAKZ2V0X2NvbmZpZwAAAAAAAAAAAAEAAAfQAAAABkNvbmZpZwAA",
      "AAAAAQAAAAAAAAAAAAAADFBhaXJUdXBsZUtleQAAAAIAAAAAAAAAB3Rva2VuX2EAAAAAEwAAAAAAAAAHdG9rZW5fYgAAAAAT",
      "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAABBtdWx0aWhvcF9hZGRyZXNzAAAAEw==",
      "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAABRBZGRyZXNzIG9mIHRoZSBhc3NldAAAAAdhZGRyZXNzAAAAABMAAAAsVGhlIHRvdGFsIGFtb3VudCBvZiB0aG9zZSB0b2tlbnMgaW4gdGhlIHBvb2wAAAAGYW1vdW50AAAAAAAL",
      "AAAAAQAAAG5UaGlzIHN0cnVjdCBpcyB1c2VkIHRvIHJldHVybiBhIHF1ZXJ5IHJlc3VsdCB3aXRoIHRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGFuZCBhc3NldHMgaW4gYSBzcGVjaWZpYyBwb29sLgAAAAAAAAAAAAxQb29sUmVzcG9uc2UAAAADAAAAM1RoZSBhc3NldCBBIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYQAAAAfQAAAABUFzc2V0AAAAAAAAM1RoZSBhc3NldCBCIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYgAAAAfQAAAABUFzc2V0AAAAAAAALlRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGN1cnJlbnRseSBpc3N1ZWQAAAAAAA5hc3NldF9scF9zaGFyZQAAAAAH0AAAAAVBc3NldAAAAA==",
      "AAAAAQAAAAAAAAAAAAAAEUxpcXVpZGl0eVBvb2xJbmZvAAAAAAAAAwAAAAAAAAAMcG9vbF9hZGRyZXNzAAAAEwAAAAAAAAANcG9vbF9yZXNwb25zZQAAAAAAB9AAAAAMUG9vbFJlc3BvbnNlAAAAAAAAAA10b3RhbF9mZWVfYnBzAAAAAAAABw==",
      "AAAAAQAAAAAAAAAAAAAADVRva2VuSW5pdEluZm8AAAAAAAADAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEwAAAAAAAAAPdG9rZW5fd2FzbV9oYXNoAAAAA+4AAAAg",
      "AAAAAQAAAAAAAAAAAAAADVN0YWtlSW5pdEluZm8AAAAAAAAEAAAAAAAAABFtYXhfZGlzdHJpYnV0aW9ucwAAAAAAAAQAAAAAAAAACG1pbl9ib25kAAAACwAAAAAAAAAKbWluX3Jld2FyZAAAAAAACwAAAAAAAAAPc3Rha2Vfd2FzbV9oYXNoAAAAA+4AAAAg",
      "AAAAAQAAAAAAAAAAAAAAFUxpcXVpZGl0eVBvb2xJbml0SW5mbwAAAAAAAAoAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAANZmVlX3JlY2lwaWVudAAAAAAAABMAAAAAAAAADGxwX3dhc21faGFzaAAAA+4AAAAgAAAAAAAAABhtYXhfYWxsb3dlZF9zbGlwcGFnZV9icHMAAAAHAAAAAAAAABZtYXhfYWxsb3dlZF9zcHJlYWRfYnBzAAAAAAAHAAAAAAAAABBtYXhfcmVmZXJyYWxfYnBzAAAABwAAAAAAAAAUc2hhcmVfdG9rZW5fZGVjaW1hbHMAAAAEAAAAAAAAAA9zdGFrZV9pbml0X2luZm8AAAAH0AAAAA1TdGFrZUluaXRJbmZvAAAAAAAAAAAAAAxzd2FwX2ZlZV9icHMAAAAHAAAAAAAAAA90b2tlbl9pbml0X2luZm8AAAAH0AAAAA1Ub2tlbkluaXRJbmZvAAAA",
    ]);
  }
  private readonly parsers = {
    initialize: () => {},
    createLiquidityPool: (result: string | xdr.ScVal): string =>
      this.spec.funcResToNative("create_liquidity_pool", result),
    queryPools: (result: string | xdr.ScVal): Array<string> =>
      this.spec.funcResToNative("query_pools", result),
    queryPoolDetails: (result: string | xdr.ScVal): LiquidityPoolInfo =>
      this.spec.funcResToNative("query_pool_details", result),
    queryAllPoolsDetails: (
      result: string | xdr.ScVal
    ): Array<LiquidityPoolInfo> =>
      this.spec.funcResToNative("query_all_pools_details", result),
    queryForPoolByTokenPair: (result: string | xdr.ScVal): string =>
      this.spec.funcResToNative("query_for_pool_by_token_pair", result),
    getAdmin: (result: string | xdr.ScVal): string =>
      this.spec.funcResToNative("get_admin", result),
    getConfig: (result: string | xdr.ScVal): Config =>
      this.spec.funcResToNative("get_config", result),
  };
  private txFromJSON = <T>(json: string): AssembledTransaction<T> => {
    const { method, ...tx } = JSON.parse(json);
    return AssembledTransaction.fromJSON(
      {
        ...this.options,
        method,
        //@ts-ignore
        parseResultXdr: this.parsers[method],
      },
      tx
    );
  };
  public readonly fromJSON = {
    initialize: this.txFromJSON<
      ReturnType<(typeof this.parsers)["initialize"]>
    >,
    createLiquidityPool: this.txFromJSON<
      ReturnType<(typeof this.parsers)["createLiquidityPool"]>
    >,
    queryPools: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryPools"]>
    >,
    queryPoolDetails: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryPoolDetails"]>
    >,
    queryAllPoolsDetails: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryAllPoolsDetails"]>
    >,
    queryForPoolByTokenPair: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryForPoolByTokenPair"]>
    >,
    getAdmin: this.txFromJSON<ReturnType<(typeof this.parsers)["getAdmin"]>>,
    getConfig: this.txFromJSON<ReturnType<(typeof this.parsers)["getConfig"]>>,
  };
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize = async (
    {
      admin,
      multihop_wasm_hash,
    }: { admin: string; multihop_wasm_hash: Buffer },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "initialize",
      args: this.spec.funcArgsToScVals("initialize", {
        admin: new Address(admin),
        multihop_wasm_hash,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["initialize"],
    });
  };

  /**
   * Construct and simulate a create_liquidity_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  createLiquidityPool = async (
    { lp_init_info }: { lp_init_info: LiquidityPoolInitInfo },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "create_liquidity_pool",
      args: this.spec.funcArgsToScVals("create_liquidity_pool", {
        lp_init_info,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["createLiquidityPool"],
    });
  };

  /**
   * Construct and simulate a query_pools transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryPools = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_pools",
      args: this.spec.funcArgsToScVals("query_pools", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryPools"],
    });
  };

  /**
   * Construct and simulate a query_pool_details transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryPoolDetails = async (
    { pool_address }: { pool_address: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_pool_details",
      args: this.spec.funcArgsToScVals("query_pool_details", {
        pool_address: new Address(pool_address),
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryPoolDetails"],
    });
  };

  /**
   * Construct and simulate a query_all_pools_details transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryAllPoolsDetails = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_all_pools_details",
      args: this.spec.funcArgsToScVals("query_all_pools_details", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryAllPoolsDetails"],
    });
  };

  /**
   * Construct and simulate a query_for_pool_by_token_pair transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryForPoolByTokenPair = async (
    { token_a, token_b }: { token_a: string; token_b: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_for_pool_by_token_pair",
      args: this.spec.funcArgsToScVals("query_for_pool_by_token_pair", {
        token_a: new Address(token_a),
        token_b: new Address(token_b),
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryForPoolByTokenPair"],
    });
  };

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  getAdmin = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "get_admin",
      args: this.spec.funcArgsToScVals("get_admin", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["getAdmin"],
    });
  };

  /**
   * Construct and simulate a get_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  getConfig = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "get_config",
      args: this.spec.funcArgsToScVals("get_config", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["getConfig"],
    });
  };
}
