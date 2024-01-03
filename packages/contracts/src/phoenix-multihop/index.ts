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
export interface Referral {
  /**
    Address of the referral
    */
  address: string;
  /**
    fee in bps, later parsed to percentage
    */
  fee: i64;
}

/**
    
    */
export interface Swap {
  /**
    
    */
  ask_asset: string;
  /**
    
    */
  offer_asset: string;
}

/**
    
    */
export interface Pair {
  /**
    
    */
  token_a: string;
  /**
    
    */
  token_b: string;
}

/**
    
    */
export type DataKey =
  | { tag: "PairKey"; values: readonly [Pair] }
  | { tag: "FactoryKey"; values: void }
  | { tag: "Admin"; values: void }
  | { tag: "Initialized"; values: void };

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
export interface SimulateSwapResponse {
  /**
    
    */
  ask_amount: i128;
  /**
    
    */
  spread_amount: Array<i128>;
  /**
    
    */
  total_commission_amount: i128;
}

/**
    
    */
export interface SimulateReverseSwapResponse {
  /**
    
    */
  offer_amount: i128;
  /**
    
    */
  spread_amount: Array<i128>;
  /**
    
    */
  total_commission_amount: i128;
}

/**
    
    */
export const Errors = {};

export class Contract {
  spec: ContractSpec;
  constructor(public readonly options: ClassOptions) {
    this.spec = new ContractSpec([
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAdmYWN0b3J5AAAAABMAAAAA",
      "AAAAAAAAAAAAAAAEc3dhcAAAAAYAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAACHJlZmVycmFsAAAD6AAAB9AAAAAIUmVmZXJyYWwAAAAAAAAACm9wZXJhdGlvbnMAAAAAA+oAAAfQAAAABFN3YXAAAAAAAAAAEG1heF9iZWxpZWZfcHJpY2UAAAPoAAAABwAAAAAAAAAObWF4X3NwcmVhZF9icHMAAAAAA+gAAAAHAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
      "AAAAAAAAAAAAAAANc2ltdWxhdGVfc3dhcAAAAAAAAAIAAAAAAAAACm9wZXJhdGlvbnMAAAAAA+oAAAfQAAAABFN3YXAAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAfQAAAAFFNpbXVsYXRlU3dhcFJlc3BvbnNl",
      "AAAAAAAAAAAAAAAVc2ltdWxhdGVfcmV2ZXJzZV9zd2FwAAAAAAAAAgAAAAAAAAAKb3BlcmF0aW9ucwAAAAAD6gAAB9AAAAAEU3dhcAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAB9AAAAAbU2ltdWxhdGVSZXZlcnNlU3dhcFJlc3BvbnNlAA==",
      "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAAT",
      "AAAAAQAAAAAAAAAAAAAACFJlZmVycmFsAAAAAgAAABdBZGRyZXNzIG9mIHRoZSByZWZlcnJhbAAAAAAHYWRkcmVzcwAAAAATAAAAJmZlZSBpbiBicHMsIGxhdGVyIHBhcnNlZCB0byBwZXJjZW50YWdlAAAAAAADZmVlAAAAAAc=",
      "AAAAAQAAAAAAAAAAAAAABFN3YXAAAAACAAAAAAAAAAlhc2tfYXNzZXQAAAAAAAATAAAAAAAAAAtvZmZlcl9hc3NldAAAAAAT",
      "AAAAAQAAAAAAAAAAAAAABFBhaXIAAAACAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEw==",
      "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAEAAAAAAAAAB1BhaXJLZXkAAAAAAQAAB9AAAAAEUGFpcgAAAAAAAAAAAAAACkZhY3RvcnlLZXkAAAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAALSW5pdGlhbGl6ZWQA",
      "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAABRBZGRyZXNzIG9mIHRoZSBhc3NldAAAAAdhZGRyZXNzAAAAABMAAAAsVGhlIHRvdGFsIGFtb3VudCBvZiB0aG9zZSB0b2tlbnMgaW4gdGhlIHBvb2wAAAAGYW1vdW50AAAAAAAL",
      "AAAAAQAAAG5UaGlzIHN0cnVjdCBpcyB1c2VkIHRvIHJldHVybiBhIHF1ZXJ5IHJlc3VsdCB3aXRoIHRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGFuZCBhc3NldHMgaW4gYSBzcGVjaWZpYyBwb29sLgAAAAAAAAAAAAxQb29sUmVzcG9uc2UAAAADAAAAM1RoZSBhc3NldCBBIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYQAAAAfQAAAABUFzc2V0AAAAAAAAM1RoZSBhc3NldCBCIGluIHRoZSBwb29sIHRvZ2V0aGVyIHdpdGggYXNzZXQgYW1vdW50cwAAAAAHYXNzZXRfYgAAAAfQAAAABUFzc2V0AAAAAAAALlRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGN1cnJlbnRseSBpc3N1ZWQAAAAAAA5hc3NldF9scF9zaGFyZQAAAAAH0AAAAAVBc3NldAAAAA==",
      "AAAAAQAAAAAAAAAAAAAAFFNpbXVsYXRlU3dhcFJlc3BvbnNlAAAAAwAAAAAAAAAKYXNrX2Ftb3VudAAAAAAACwAAAAAAAAANc3ByZWFkX2Ftb3VudAAAAAAAA+oAAAALAAAAAAAAABd0b3RhbF9jb21taXNzaW9uX2Ftb3VudAAAAAAL",
      "AAAAAQAAAAAAAAAAAAAAG1NpbXVsYXRlUmV2ZXJzZVN3YXBSZXNwb25zZQAAAAADAAAAAAAAAAxvZmZlcl9hbW91bnQAAAALAAAAAAAAAA1zcHJlYWRfYW1vdW50AAAAAAAD6gAAAAsAAAAAAAAAF3RvdGFsX2NvbW1pc3Npb25fYW1vdW50AAAAAAs=",
    ]);
  }
  private readonly parsers = {
    initialize: () => {},
    swap: () => {},
    simulateSwap: (result: string | xdr.ScVal): SimulateSwapResponse =>
      this.spec.funcResToNative("simulate_swap", result),
    simulateReverseSwap: (
      result: string | xdr.ScVal
    ): SimulateReverseSwapResponse =>
      this.spec.funcResToNative("simulate_reverse_swap", result),
    getAdmin: (result: string | xdr.ScVal): string =>
      this.spec.funcResToNative("get_admin", result),
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
    swap: this.txFromJSON<ReturnType<(typeof this.parsers)["swap"]>>,
    simulateSwap: this.txFromJSON<
      ReturnType<(typeof this.parsers)["simulateSwap"]>
    >,
    simulateReverseSwap: this.txFromJSON<
      ReturnType<(typeof this.parsers)["simulateReverseSwap"]>
    >,
    getAdmin: this.txFromJSON<ReturnType<(typeof this.parsers)["getAdmin"]>>,
  };
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize = async (
    { admin, factory }: { admin: string; factory: string },
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
        factory: new Address(factory),
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["initialize"],
    });
  };

  /**
   * Construct and simulate a swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  swap = async (
    {
      recipient,
      referral,
      operations,
      max_belief_price,
      max_spread_bps,
      amount,
    }: {
      recipient: string;
      referral: Option<Referral>;
      operations: Array<Swap>;
      max_belief_price: Option<i64>;
      max_spread_bps: Option<i64>;
      amount: i128;
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
        recipient: new Address(recipient),
        referral,
        operations,
        max_belief_price,
        max_spread_bps,
        amount,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["swap"],
    });
  };

  /**
   * Construct and simulate a simulate_swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  simulateSwap = async (
    { operations, amount }: { operations: Array<Swap>; amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
    } = {}
  ) => {
    return await AssembledTransaction.fromSimulation({
      method: "simulate_swap",
      args: this.spec.funcArgsToScVals("simulate_swap", { operations, amount }),
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
    { operations, amount }: { operations: Array<Swap>; amount: i128 },
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
        operations,
        amount,
      }),
      ...options,
      ...this.options,
      errorTypes: Errors,
      parseResultXdr: this.parsers["simulateReverseSwap"],
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
}
