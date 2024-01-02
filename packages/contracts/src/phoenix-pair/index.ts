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
export const Errors = {
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
/**
    
    */
export enum PairType {
  Xyk = 0,
}

/**
    
    */
export interface Config {
  /**
    
    */
  fee_recipient: string;
  /**
    The maximum amount of slippage (in bps) that is tolerated during providing liquidity
    */
  max_allowed_slippage_bps: i64;
  /**
    The maximum amount of spread (in bps) that is tolerated during swap
    */
  max_allowed_spread_bps: i64;
  /**
    
    */
  pair_type: PairType;
  /**
    
    */
  share_token: string;
  /**
    
    */
  stake_contract: string;
  /**
    
    */
  token_a: string;
  /**
    
    */
  token_b: string;
  /**
    The total fees (in bps) charged by a pair of this type.
    * In relation to the returned amount of tokens
    */
  total_fee_bps: i64;
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
export interface SimulateSwapResponse {
  /**
    
    */
  ask_amount: i128;
  /**
    
    */
  commission_amount: i128;
  /**
    
    */
  spread_amount: i128;
  /**
    
    */
  total_return: i128;
}

/**
    
    */
export interface SimulateReverseSwapResponse {
  /**
    
    */
  commission_amount: i128;
  /**
    
    */
  offer_amount: i128;
  /**
    
    */
  spread_amount: i128;
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

export class Contract {
  spec: ContractSpec;
  constructor(public readonly options: ClassOptions) {
    this.spec = new ContractSpec([
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAACAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAABRzaGFyZV90b2tlbl9kZWNpbWFscwAAAAQAAAAAAAAADHN3YXBfZmVlX2JwcwAAAAcAAAAAAAAADWZlZV9yZWNpcGllbnQAAAAAAAATAAAAAAAAABhtYXhfYWxsb3dlZF9zbGlwcGFnZV9icHMAAAAHAAAAAAAAABZtYXhfYWxsb3dlZF9zcHJlYWRfYnBzAAAAAAAHAAAAAAAAAA90b2tlbl9pbml0X2luZm8AAAAH0AAAAA1Ub2tlbkluaXRJbmZvAAAAAAAAAAAAAA9zdGFrZV9pbml0X2luZm8AAAAH0AAAAA1TdGFrZUluaXRJbmZvAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAARcHJvdmlkZV9saXF1aWRpdHkAAAAAAAAGAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAACWRlc2lyZWRfYQAAAAAAA+gAAAALAAAAAAAAAAVtaW5fYQAAAAAAA+gAAAALAAAAAAAAAAlkZXNpcmVkX2IAAAAAAAPoAAAACwAAAAAAAAAFbWluX2IAAAAAAAPoAAAACwAAAAAAAAATY3VzdG9tX3NsaXBwYWdlX2JwcwAAAAPoAAAABwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAAEc3dhcAAAAAUAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAGc2VsbF9hAAAAAAABAAAAAAAAAAxvZmZlcl9hbW91bnQAAAALAAAAAAAAAAxiZWxpZWZfcHJpY2UAAAPoAAAABwAAAAAAAAAObWF4X3NwcmVhZF9icHMAAAAAA+gAAAAHAAAAAQAAA+kAAAALAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAASd2l0aGRyYXdfbGlxdWlkaXR5AAAAAAAEAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAADHNoYXJlX2Ftb3VudAAAAAsAAAAAAAAABW1pbl9hAAAAAAAACwAAAAAAAAAFbWluX2IAAAAAAAALAAAAAQAAA+kAAAPtAAAAAgAAAAsAAAALAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAANdXBkYXRlX2NvbmZpZwAAAAAAAAYAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAJbmV3X2FkbWluAAAAAAAD6AAAABMAAAAAAAAADXRvdGFsX2ZlZV9icHMAAAAAAAPoAAAABwAAAAAAAAANZmVlX3JlY2lwaWVudAAAAAAAA+gAAAATAAAAAAAAABhtYXhfYWxsb3dlZF9zbGlwcGFnZV9icHMAAAPoAAAABwAAAAAAAAAWbWF4X2FsbG93ZWRfc3ByZWFkX2JwcwAAAAAD6AAAAAcAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAAMcXVlcnlfY29uZmlnAAAAAAAAAAEAAAPpAAAH0AAAAAZDb25maWcAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAZcXVlcnlfc2hhcmVfdG9rZW5fYWRkcmVzcwAAAAAAAAAAAAABAAAD6QAAABMAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAAccXVlcnlfc3Rha2VfY29udHJhY3RfYWRkcmVzcwAAAAAAAAABAAAD6QAAABMAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAAPcXVlcnlfcG9vbF9pbmZvAAAAAAAAAAABAAAD6QAAB9AAAAAMUG9vbFJlc3BvbnNlAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
      "AAAAAAAAAAAAAAAbcXVlcnlfcG9vbF9pbmZvX2Zvcl9mYWN0b3J5AAAAAAAAAAABAAAD6QAAB9AAAAARTGlxdWlkaXR5UG9vbEluZm8AAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAAAAAAAAAAAAANc2ltdWxhdGVfc3dhcAAAAAAAAAIAAAAAAAAABnNlbGxfYQAAAAAAAQAAAAAAAAAMb2ZmZXJfYW1vdW50AAAACwAAAAEAAAPpAAAH0AAAABRTaW11bGF0ZVN3YXBSZXNwb25zZQAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
      "AAAAAAAAAAAAAAAVc2ltdWxhdGVfcmV2ZXJzZV9zd2FwAAAAAAAAAgAAAAAAAAAGc2VsbF9hAAAAAAABAAAAAAAAAAphc2tfYW1vdW50AAAAAAALAAAAAQAAA+kAAAfQAAAAG1NpbXVsYXRlUmV2ZXJzZVN3YXBSZXNwb25zZQAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
      "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAWAAAAFUluaXRpYWxpemF0aW9uIGVycm9ycwAAAAAAACFGaXJzdFRva2VuTXVzdEJlU21hbGxlclRoZW5TZWNvbmQAAAAAAAABAAAAAAAAAA1JbnZhbGlkRmVlQnBzAAAAAAAAAgAAAAtTd2FwIGVycm9ycwAAAAAZU2xpcHBhZ2VUb2xlcmFuY2VFeGNlZWRlZAAAAAAAAAMAAAAAAAAAGVNsaXBwYWdlVG9sZXJhbmNlVmlvbGF0ZWQAAAAAAAAEAAAAAAAAABdTcHJlYWRFeGNlZWRzTWF4QWxsb3dlZAAAAAAFAAAAAAAAABBFbXB0eVBvb2xCYWxhbmNlAAAABgAAAAAAAAAMQ29uZmlnTm90U2V0AAAABwAAAAAAAAAXRmFpbGVkVG9Mb2FkRnJvbVN0b3JhZ2UAAAAACAAAAAAAAAAgSW5jb3JyZWN0TGlxdWlkaXR5UGFyYW1ldGVyc0ZvckEAAAAJAAAAAAAAACBJbmNvcnJlY3RMaXF1aWRpdHlQYXJhbWV0ZXJzRm9yQgAAAAoAAAAAAAAAH0ZhaWxlZFRvR2V0QWRtaW5BZGRyRnJvbVN0b3JhZ2UAAAAACwAAAAAAAAAhRmFpbGVkVG9HZXRUb3RhbFNoYXJlc0Zyb21TdG9yYWdlAAAAAAAADAAAAAAAAAAiRmFpbGVkVG9HZXRQb29sQmFsYW5jZUFGcm9tU3RvcmFnZQAAAAAADQAAAAAAAAAiRmFpbGVkVG9HZXRQb29sQmFsYW5jZUJGcm9tU3RvcmFnZQAAAAAADgAAAAAAAAAcRGVwb3NpdEFtb3VudEFFeGNlZWRzRGVzaXJlZAAAAA8AAAAAAAAAFkRlcG9zaXRBbW91bnRCZWxvd01pbkEAAAAAABAAAAAAAAAAHERlcG9zaXRBbW91bnRCRXhjZWVkc0Rlc2lyZWQAAAARAAAAAAAAABZEZXBvc2l0QW1vdW50QmVsb3dNaW5CAAAAAAASAAAAEExpcXVpZGl0eSBlcnJvcnMAAAAXV2l0aGRyYXdNaW5Ob3RTYXRpc2ZpZWQAAAAAEwAAAAAAAAAOSW52YWxpZEFtb3VudHMAAAAAABQAAAAMT3RoZXIgZXJyb3JzAAAADFVuYXV0aG9yaXplZAAAABUAAAAAAAAAH0FyZ3VtZW50c0ludmFsaWRMZXNzT3JFcXVhbFplcm8AAAAAFg==",
      "AAAAAwAAAAAAAAAAAAAACFBhaXJUeXBlAAAAAQAAAAAAAAADWHlrAAAAAAA=",
      "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAACQAAAAAAAAANZmVlX3JlY2lwaWVudAAAAAAAABMAAABUVGhlIG1heGltdW0gYW1vdW50IG9mIHNsaXBwYWdlIChpbiBicHMpIHRoYXQgaXMgdG9sZXJhdGVkIGR1cmluZyBwcm92aWRpbmcgbGlxdWlkaXR5AAAAGG1heF9hbGxvd2VkX3NsaXBwYWdlX2JwcwAAAAcAAABDVGhlIG1heGltdW0gYW1vdW50IG9mIHNwcmVhZCAoaW4gYnBzKSB0aGF0IGlzIHRvbGVyYXRlZCBkdXJpbmcgc3dhcAAAAAAWbWF4X2FsbG93ZWRfc3ByZWFkX2JwcwAAAAAABwAAAAAAAAAJcGFpcl90eXBlAAAAAAAH0AAAAAhQYWlyVHlwZQAAAAAAAAALc2hhcmVfdG9rZW4AAAAAEwAAAAAAAAAOc3Rha2VfY29udHJhY3QAAAAAABMAAAAAAAAAB3Rva2VuX2EAAAAAEwAAAAAAAAAHdG9rZW5fYgAAAAATAAAAZFRoZSB0b3RhbCBmZWVzIChpbiBicHMpIGNoYXJnZWQgYnkgYSBwYWlyIG9mIHRoaXMgdHlwZS4KSW4gcmVsYXRpb24gdG8gdGhlIHJldHVybmVkIGFtb3VudCBvZiB0b2tlbnMAAAANdG90YWxfZmVlX2JwcwAAAAAAAAc=",
      "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAABRBZGRyZXNzIG9mIHRoZSBhc3NldAAAAAdhZGRyZXNzAAAAABMAAAAsVGhlIHRvdGFsIGFtb3VudCBvZiB0aG9zZSB0b2tlbnMgaW4gdGhlIHBvb2wAAAAGYW1vdW50AAAAAAAL",
      "AAAAAQAAAG5UaGlzIHN0cnVjdCBpcyB1c2VkIHRvIHJldHVybiBhIHF1ZXJ5IHJlc3VsdCB3aXRoIHRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGFuZCBhc3NldHMgaW4gYSBzcGVjaWZpYyBwb29sLgAAAAAAAAAAAAxQb29sUmVzcG9uc2UAAAADAAAAM1RoZSBhc3NldCBBIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYQAAAAfQAAAABUFzc2V0AAAAAAAAM1RoZSBhc3NldCBCIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYgAAAAfQAAAABUFzc2V0AAAAAAAALlRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGN1cnJlbnRseSBpc3N1ZWQAAAAAAA5hc3NldF9scF9zaGFyZQAAAAAH0AAAAAVBc3NldAAAAA==",
      "AAAAAQAAAAAAAAAAAAAAEUxpcXVpZGl0eVBvb2xJbmZvAAAAAAAAAwAAAAAAAAAMcG9vbF9hZGRyZXNzAAAAEwAAAAAAAAANcG9vbF9yZXNwb25zZQAAAAAAB9AAAAAMUG9vbFJlc3BvbnNlAAAAAAAAAA10b3RhbF9mZWVfYnBzAAAAAAAABw==",
      "AAAAAQAAAAAAAAAAAAAAFFNpbXVsYXRlU3dhcFJlc3BvbnNlAAAABAAAAAAAAAAKYXNrX2Ftb3VudAAAAAAACwAAAAAAAAARY29tbWlzc2lvbl9hbW91bnQAAAAAAAALAAAAAAAAAA1zcHJlYWRfYW1vdW50AAAAAAAACwAAAAAAAAAMdG90YWxfcmV0dXJuAAAACw==",
      "AAAAAQAAAAAAAAAAAAAAG1NpbXVsYXRlUmV2ZXJzZVN3YXBSZXNwb25zZQAAAAADAAAAAAAAABFjb21taXNzaW9uX2Ftb3VudAAAAAAAAAsAAAAAAAAADG9mZmVyX2Ftb3VudAAAAAsAAAAAAAAADXNwcmVhZF9hbW91bnQAAAAAAAAL",
      "AAAAAQAAAAAAAAAAAAAADVRva2VuSW5pdEluZm8AAAAAAAADAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEwAAAAAAAAAPdG9rZW5fd2FzbV9oYXNoAAAAA+4AAAAg",
      "AAAAAQAAAAAAAAAAAAAADVN0YWtlSW5pdEluZm8AAAAAAAAEAAAAAAAAABFtYXhfZGlzdHJpYnV0aW9ucwAAAAAAAAQAAAAAAAAACG1pbl9ib25kAAAACwAAAAAAAAAKbWluX3Jld2FyZAAAAAAACwAAAAAAAAAPc3Rha2Vfd2FzbV9oYXNoAAAAA+4AAAAg",
      "AAAAAQAAAAAAAAAAAAAAFUxpcXVpZGl0eVBvb2xJbml0SW5mbwAAAAAAAAkAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAANZmVlX3JlY2lwaWVudAAAAAAAABMAAAAAAAAADGxwX3dhc21faGFzaAAAA+4AAAAgAAAAAAAAABhtYXhfYWxsb3dlZF9zbGlwcGFnZV9icHMAAAAHAAAAAAAAABZtYXhfYWxsb3dlZF9zcHJlYWRfYnBzAAAAAAAHAAAAAAAAABRzaGFyZV90b2tlbl9kZWNpbWFscwAAAAQAAAAAAAAAD3N0YWtlX2luaXRfaW5mbwAAAAfQAAAADVN0YWtlSW5pdEluZm8AAAAAAAAAAAAADHN3YXBfZmVlX2JwcwAAAAcAAAAAAAAAD3Rva2VuX2luaXRfaW5mbwAAAAfQAAAADVRva2VuSW5pdEluZm8AAAA=",
    ]);
  }
  private readonly parsers = {
    initialize: (result: string | xdr.ScVal | Err): Ok<void> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(this.spec.funcResToNative("initialize", result));
    },
    provideLiquidity: (
      result: string | xdr.ScVal | Err
    ): Ok<void> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(this.spec.funcResToNative("provide_liquidity", result));
    },
    swap: (result: string | xdr.ScVal | Err): Ok<i128> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(this.spec.funcResToNative("swap", result));
    },
    withdrawLiquidity: (
      result: string | xdr.ScVal | Err
    ): Ok<readonly [i128, i128]> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(this.spec.funcResToNative("withdraw_liquidity", result));
    },
    updateConfig: (
      result: string | xdr.ScVal | Err
    ): Ok<void> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(this.spec.funcResToNative("update_config", result));
    },
    upgrade: (result: string | xdr.ScVal | Err): Ok<void> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(this.spec.funcResToNative("upgrade", result));
    },
    queryConfig: (
      result: string | xdr.ScVal | Err
    ): Ok<Config> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(this.spec.funcResToNative("query_config", result));
    },
    queryShareTokenAddress: (
      result: string | xdr.ScVal | Err
    ): Ok<string> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(
        this.spec.funcResToNative("query_share_token_address", result)
      );
    },
    queryStakeContractAddress: (
      result: string | xdr.ScVal | Err
    ): Ok<string> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(
        this.spec.funcResToNative("query_stake_contract_address", result)
      );
    },
    queryPoolInfo: (
      result: string | xdr.ScVal | Err
    ): Ok<PoolResponse> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(this.spec.funcResToNative("query_pool_info", result));
    },
    queryPoolInfoForFactory: (
      result: string | xdr.ScVal | Err
    ): Ok<LiquidityPoolInfo> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(
        this.spec.funcResToNative("query_pool_info_for_factory", result)
      );
    },
    simulateSwap: (
      result: string | xdr.ScVal | Err
    ): Ok<SimulateSwapResponse> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(this.spec.funcResToNative("simulate_swap", result));
    },
    simulateReverseSwap: (
      result: string | xdr.ScVal | Err
    ): Ok<SimulateReverseSwapResponse> | Err<Error_> => {
      if (result instanceof Err) return result;
      return new Ok(this.spec.funcResToNative("simulate_reverse_swap", result));
    },
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
    provideLiquidity: this.txFromJSON<
      ReturnType<(typeof this.parsers)["provideLiquidity"]>
    >,
    swap: this.txFromJSON<ReturnType<(typeof this.parsers)["swap"]>>,
    withdrawLiquidity: this.txFromJSON<
      ReturnType<(typeof this.parsers)["withdrawLiquidity"]>
    >,
    updateConfig: this.txFromJSON<
      ReturnType<(typeof this.parsers)["updateConfig"]>
    >,
    upgrade: this.txFromJSON<ReturnType<(typeof this.parsers)["upgrade"]>>,
    queryConfig: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryConfig"]>
    >,
    queryShareTokenAddress: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryShareTokenAddress"]>
    >,
    queryStakeContractAddress: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryStakeContractAddress"]>
    >,
    queryPoolInfo: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryPoolInfo"]>
    >,
    queryPoolInfoForFactory: this.txFromJSON<
      ReturnType<(typeof this.parsers)["queryPoolInfoForFactory"]>
    >,
    simulateSwap: this.txFromJSON<
      ReturnType<(typeof this.parsers)["simulateSwap"]>
    >,
    simulateReverseSwap: this.txFromJSON<
      ReturnType<(typeof this.parsers)["simulateReverseSwap"]>
    >,
  };
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize = async (
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
      admin: string;
      share_token_decimals: u32;
      swap_fee_bps: i64;
      fee_recipient: string;
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
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "initialize",
      args: this.spec.funcArgsToScVals("initialize", {
        admin: new Address(admin),
        share_token_decimals,
        swap_fee_bps,
        fee_recipient: new Address(fee_recipient),
        max_allowed_slippage_bps,
        max_allowed_spread_bps,
        token_init_info,
        stake_init_info,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["initialize"],
    });
  };

  /**
   * Construct and simulate a provide_liquidity transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  provideLiquidity = async (
    {
      sender,
      desired_a,
      min_a,
      desired_b,
      min_b,
      custom_slippage_bps,
    }: {
      sender: string;
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
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "provide_liquidity",
      args: this.spec.funcArgsToScVals("provide_liquidity", {
        sender: new Address(sender),
        desired_a,
        min_a,
        desired_b,
        min_b,
        custom_slippage_bps,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["provideLiquidity"],
    });
  };

  /**
   * Construct and simulate a swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  swap = async (
    {
      sender,
      sell_a,
      offer_amount,
      belief_price,
      max_spread_bps,
    }: {
      sender: string;
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
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "swap",
      args: this.spec.funcArgsToScVals("swap", {
        sender: new Address(sender),
        sell_a,
        offer_amount,
        belief_price,
        max_spread_bps,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["swap"],
    });
  };

  /**
   * Construct and simulate a withdraw_liquidity transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdrawLiquidity = async (
    {
      sender,
      share_amount,
      min_a,
      min_b,
    }: { sender: string; share_amount: i128; min_a: i128; min_b: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "withdraw_liquidity",
      args: this.spec.funcArgsToScVals("withdraw_liquidity", {
        sender: new Address(sender),
        share_amount,
        min_a,
        min_b,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["withdrawLiquidity"],
    });
  };

  /**
   * Construct and simulate a update_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  updateConfig = async (
    {
      sender,
      new_admin,
      total_fee_bps,
      fee_recipient,
      max_allowed_slippage_bps,
      max_allowed_spread_bps,
    }: {
      sender: string;
      new_admin: Option<string>;
      total_fee_bps: Option<i64>;
      fee_recipient: Option<string>;
      max_allowed_slippage_bps: Option<i64>;
      max_allowed_spread_bps: Option<i64>;
    },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "update_config",
      args: this.spec.funcArgsToScVals("update_config", {
        sender: new Address(sender),
        new_admin,
        total_fee_bps,
        fee_recipient,
        max_allowed_slippage_bps,
        max_allowed_spread_bps,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["updateConfig"],
    });
  };

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade = async (
    { new_wasm_hash }: { new_wasm_hash: Buffer },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "upgrade",
      args: this.spec.funcArgsToScVals("upgrade", { new_wasm_hash }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["upgrade"],
    });
  };

  /**
   * Construct and simulate a query_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryConfig = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_config",
      args: this.spec.funcArgsToScVals("query_config", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryConfig"],
    });
  };

  /**
   * Construct and simulate a query_share_token_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryShareTokenAddress = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_share_token_address",
      args: this.spec.funcArgsToScVals("query_share_token_address", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryShareTokenAddress"],
    });
  };

  /**
   * Construct and simulate a query_stake_contract_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryStakeContractAddress = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_stake_contract_address",
      args: this.spec.funcArgsToScVals("query_stake_contract_address", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryStakeContractAddress"],
    });
  };

  /**
   * Construct and simulate a query_pool_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryPoolInfo = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_pool_info",
      args: this.spec.funcArgsToScVals("query_pool_info", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryPoolInfo"],
    });
  };

  /**
   * Construct and simulate a query_pool_info_for_factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  queryPoolInfoForFactory = async (
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "query_pool_info_for_factory",
      args: this.spec.funcArgsToScVals("query_pool_info_for_factory", {}),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["queryPoolInfoForFactory"],
    });
  };

  /**
   * Construct and simulate a simulate_swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  simulateSwap = async (
    { sell_a, offer_amount }: { sell_a: boolean; offer_amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "simulate_swap",
      args: this.spec.funcArgsToScVals("simulate_swap", {
        sell_a,
        offer_amount,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["simulateSwap"],
    });
  };

  /**
   * Construct and simulate a simulate_reverse_swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  simulateReverseSwap = async (
    { sell_a, ask_amount }: { sell_a: boolean; ask_amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "simulate_reverse_swap",
      args: this.spec.funcArgsToScVals("simulate_reverse_swap", {
        sell_a,
        ask_amount,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["simulateReverseSwap"],
    });
  };
}
