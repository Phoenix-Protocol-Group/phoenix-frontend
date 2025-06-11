import { Buffer } from "buffer";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type { u64, u128, Option } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const ContractError = {
  0: { message: "Unauthorized" },
  1: { message: "AuctionNotFound" },
  2: { message: "IDMissmatch" },
  3: { message: "BidNotEnough" },
  4: { message: "AuctionNotFinished" },
  5: { message: "NotEnoughBalance" },
  6: { message: "InvalidInputs" },
  7: { message: "AuctionNotActive" },
  8: { message: "MinPriceNotReached" },
  9: { message: "MissingHighestBid" },
  10: { message: "AuctionNotPaused" },
  11: { message: "PaymentProcessingFailed" },
  12: { message: "NoBuyNowOption" },
  13: { message: "AlreadyInitialized" },
  14: { message: "InvalidBidder" },
  15: { message: "AdminNotFound" },
  16: { message: "NoBidFound" },
  17: { message: "ConfigNotFound" },
  18: { message: "AuctionCreationFeeNotCovered" },
  19: { message: "KeyNotFound" },
  20: { message: "BidderNotFound" },
};

export type DataKey =
  | { tag: "Admin"; values: void }
  | { tag: "IsInitialized"; values: void }
  | { tag: "AuctionId"; values: void }
  | { tag: "AllAuctions"; values: void }
  | { tag: "HighestBid"; values: readonly [u64] }
  | { tag: "Config"; values: void };

export interface ItemInfo {
  amount: u64;
  buy_now_price: Option<u64>;
  collection_addr: string;
  item_id: u64;
  minimum_price: Option<u64>;
}

export interface Auction {
  auction_token: string;
  end_time: u64;
  highest_bid: Option<u64>;
  id: u64;
  item_info: ItemInfo;
  seller: string;
  status: AuctionStatus;
}

export interface HighestBid {
  bid: u64;
  bidder: Option<string>;
}

export type AuctionStatus =
  | { tag: "Active"; values: void }
  | { tag: "Ended"; values: void }
  | { tag: "Cancelled"; values: void }
  | { tag: "Paused"; values: void };

export interface Config {
  auction_creation_fee: u128;
  auction_token: string;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    {
      admin,
      auction_token,
      auction_creation_fee,
    }: { admin: string; auction_token: string; auction_creation_fee: u128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a create_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_auction: (
    {
      item_info,
      seller,
      duration,
    }: { item_info: ItemInfo; seller: string; duration: u64 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<Auction>>>;

  /**
   * Construct and simulate a place_bid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  place_bid: (
    {
      auction_id,
      bidder,
      bid_amount,
    }: { auction_id: u64; bidder: string; bid_amount: u64 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a finalize_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  finalize_auction: (
    { auction_id }: { auction_id: u64 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a buy_now transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  buy_now: (
    { auction_id, buyer }: { auction_id: u64; buyer: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pause: (
    { auction_id }: { auction_id: u64 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a unpause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unpause: (
    { auction_id }: { auction_id: u64 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a get_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_auction: (
    { auction_id }: { auction_id: u64 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<Auction>>>;

  /**
   * Construct and simulate a get_active_auctions transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_active_auctions: (
    { start_index, limit }: { start_index: Option<u64>; limit: Option<u64> },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<Array<Auction>>>>;

  /**
   * Construct and simulate a get_auctions_by_seller transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_auctions_by_seller: (
    { seller }: { seller: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<Array<Auction>>>>;

  /**
   * Construct and simulate a get_highest_bid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_highest_bid: (
    { auction_id }: { auction_id: u64 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<HighestBid>>>;

  /**
   * Construct and simulate a update_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_admin: (
    { new_admin }: { new_admin: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<string>>>;

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: (
    { new_wasm_hash }: { new_wasm_hash: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;
}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options);
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAA1hdWN0aW9uX3Rva2VuAAAAAAAAEwAAAAAAAAAUYXVjdGlvbl9jcmVhdGlvbl9mZWUAAAAKAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAOY3JlYXRlX2F1Y3Rpb24AAAAAAAMAAAAAAAAACWl0ZW1faW5mbwAAAAAAB9AAAAAISXRlbUluZm8AAAAAAAAABnNlbGxlcgAAAAAAEwAAAAAAAAAIZHVyYXRpb24AAAAGAAAAAQAAA+kAAAfQAAAAB0F1Y3Rpb24AAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAJcGxhY2VfYmlkAAAAAAAAAwAAAAAAAAAKYXVjdGlvbl9pZAAAAAAABgAAAAAAAAAGYmlkZGVyAAAAAAATAAAAAAAAAApiaWRfYW1vdW50AAAAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAQZmluYWxpemVfYXVjdGlvbgAAAAEAAAAAAAAACmF1Y3Rpb25faWQAAAAAAAYAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAHYnV5X25vdwAAAAACAAAAAAAAAAphdWN0aW9uX2lkAAAAAAAGAAAAAAAAAAVidXllcgAAAAAAABMAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAFcGF1c2UAAAAAAAABAAAAAAAAAAphdWN0aW9uX2lkAAAAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAHdW5wYXVzZQAAAAABAAAAAAAAAAphdWN0aW9uX2lkAAAAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAALZ2V0X2F1Y3Rpb24AAAAAAQAAAAAAAAAKYXVjdGlvbl9pZAAAAAAABgAAAAEAAAPpAAAH0AAAAAdBdWN0aW9uAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAATZ2V0X2FjdGl2ZV9hdWN0aW9ucwAAAAACAAAAAAAAAAtzdGFydF9pbmRleAAAAAPoAAAABgAAAAAAAAAFbGltaXQAAAAAAAPoAAAABgAAAAEAAAPpAAAD6gAAB9AAAAAHQXVjdGlvbgAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAWZ2V0X2F1Y3Rpb25zX2J5X3NlbGxlcgAAAAAAAQAAAAAAAAAGc2VsbGVyAAAAAAATAAAAAQAAA+kAAAPqAAAH0AAAAAdBdWN0aW9uAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAPZ2V0X2hpZ2hlc3RfYmlkAAAAAAEAAAAAAAAACmF1Y3Rpb25faWQAAAAAAAYAAAABAAAD6QAAB9AAAAAKSGlnaGVzdEJpZAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAMdXBkYXRlX2FkbWluAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAEAAAPpAAAAEwAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAVAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAAAAAAAAAAAA9BdWN0aW9uTm90Rm91bmQAAAAAAQAAAAAAAAALSURNaXNzbWF0Y2gAAAAAAgAAAAAAAAAMQmlkTm90RW5vdWdoAAAAAwAAAAAAAAASQXVjdGlvbk5vdEZpbmlzaGVkAAAAAAAEAAAAAAAAABBOb3RFbm91Z2hCYWxhbmNlAAAABQAAAAAAAAANSW52YWxpZElucHV0cwAAAAAAAAYAAAAAAAAAEEF1Y3Rpb25Ob3RBY3RpdmUAAAAHAAAAAAAAABJNaW5QcmljZU5vdFJlYWNoZWQAAAAAAAgAAAAAAAAAEU1pc3NpbmdIaWdoZXN0QmlkAAAAAAAACQAAAAAAAAAQQXVjdGlvbk5vdFBhdXNlZAAAAAoAAAAAAAAAF1BheW1lbnRQcm9jZXNzaW5nRmFpbGVkAAAAAAsAAAAAAAAADk5vQnV5Tm93T3B0aW9uAAAAAAAMAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAA0AAAAAAAAADUludmFsaWRCaWRkZXIAAAAAAAAOAAAAAAAAAA1BZG1pbk5vdEZvdW5kAAAAAAAADwAAAAAAAAAKTm9CaWRGb3VuZAAAAAAAEAAAAAAAAAAOQ29uZmlnTm90Rm91bmQAAAAAABEAAAAAAAAAHEF1Y3Rpb25DcmVhdGlvbkZlZU5vdENvdmVyZWQAAAASAAAAAAAAAAtLZXlOb3RGb3VuZAAAAAATAAAAAAAAAA5CaWRkZXJOb3RGb3VuZAAAAAAAFA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAANSXNJbml0aWFsaXplZAAAAAAAAAAAAAAAAAAACUF1Y3Rpb25JZAAAAAAAAAAAAAAAAAAAC0FsbEF1Y3Rpb25zAAAAAAEAAAAAAAAACkhpZ2hlc3RCaWQAAAAAAAEAAAAGAAAAAAAAAAAAAAAGQ29uZmlnAAA=",
        "AAAAAQAAAAAAAAAAAAAACEl0ZW1JbmZvAAAABQAAAAAAAAAGYW1vdW50AAAAAAAGAAAAAAAAAA1idXlfbm93X3ByaWNlAAAAAAAD6AAAAAYAAAAAAAAAD2NvbGxlY3Rpb25fYWRkcgAAAAATAAAAAAAAAAdpdGVtX2lkAAAAAAYAAAAAAAAADW1pbmltdW1fcHJpY2UAAAAAAAPoAAAABg==",
        "AAAAAQAAAAAAAAAAAAAAB0F1Y3Rpb24AAAAABwAAAAAAAAANYXVjdGlvbl90b2tlbgAAAAAAABMAAAAAAAAACGVuZF90aW1lAAAABgAAAAAAAAALaGlnaGVzdF9iaWQAAAAD6AAAAAYAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAlpdGVtX2luZm8AAAAAAAfQAAAACEl0ZW1JbmZvAAAAAAAAAAZzZWxsZXIAAAAAABMAAAAAAAAABnN0YXR1cwAAAAAH0AAAAA1BdWN0aW9uU3RhdHVzAAAA",
        "AAAAAQAAAAAAAAAAAAAACkhpZ2hlc3RCaWQAAAAAAAIAAAAAAAAAA2JpZAAAAAAGAAAAAAAAAAZiaWRkZXIAAAAAA+gAAAAT",
        "AAAAAgAAAAAAAAAAAAAADUF1Y3Rpb25TdGF0dXMAAAAAAAAEAAAAAAAAAAAAAAAGQWN0aXZlAAAAAAAAAAAAAAAAAAVFbmRlZAAAAAAAAAAAAAAAAAAACUNhbmNlbGxlZAAAAAAAAAAAAAAAAAAABlBhdXNlZAAA",
        "AAAAAQAAAAAAAAAAAAAABkNvbmZpZwAAAAAAAgAAAAAAAAAUYXVjdGlvbl9jcmVhdGlvbl9mZWUAAAAKAAAAAAAAAA1hdWN0aW9uX3Rva2VuAAAAAAAAEw==",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<Result<void>>,
    create_auction: this.txFromJSON<Result<Auction>>,
    place_bid: this.txFromJSON<Result<void>>,
    finalize_auction: this.txFromJSON<Result<void>>,
    buy_now: this.txFromJSON<Result<void>>,
    pause: this.txFromJSON<Result<void>>,
    unpause: this.txFromJSON<Result<void>>,
    get_auction: this.txFromJSON<Result<Auction>>,
    get_active_auctions: this.txFromJSON<Result<Array<Auction>>>,
    get_auctions_by_seller: this.txFromJSON<Result<Array<Auction>>>,
    get_highest_bid: this.txFromJSON<Result<HighestBid>>,
    update_admin: this.txFromJSON<Result<string>>,
    upgrade: this.txFromJSON<Result<void>>,
  };
}
