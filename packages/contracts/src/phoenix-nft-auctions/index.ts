import { Buffer } from "buffer";
import type { u64 } from "@stellar/stellar-sdk/contract";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";

export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "0",
  },
} as const;

export interface Auction {
  buy_now_price: u64;
  end_time: u64;
  highest_bid: u64;
  highest_bidder: string;
  id: u64;
  item_address: string;
  seller: string;
  status: AuctionStatus;
}

export type AuctionStatus =
  | { tag: "Active"; values: void }
  | { tag: "Ended"; values: void }
  | {
      tag: "Cancelled";
      values: void;
    };

export const Errors = {};

export interface Client {
  /**
   * Construct and simulate a create_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_auction: (
    {
      item_address,
      seller,
      buy_now_price,
      duration,
    }: {
      item_address: string;
      seller: string;
      buy_now_price: u64;
      duration: u64;
    },
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
  ) => Promise<AssembledTransaction<Auction>>;

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
  ) => Promise<AssembledTransaction<null>>;

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
  ) => Promise<AssembledTransaction<null>>;

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
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pause: (options?: {
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
  }) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a unpause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unpause: (options?: {
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
  }) => Promise<AssembledTransaction<null>>;

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
  ) => Promise<AssembledTransaction<Auction>>;

  /**
   * Construct and simulate a get_active_auctions transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_active_auctions: (options?: {
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
  }) => Promise<AssembledTransaction<Array<Auction>>>;

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
  ) => Promise<AssembledTransaction<Array<Auction>>>;

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
  ) => Promise<AssembledTransaction<readonly [u64, string]>>;
}

export class Client extends ContractClient {
  public readonly fromJSON = {
    create_auction: this.txFromJSON<Auction>,
    place_bid: this.txFromJSON<null>,
    finalize_auction: this.txFromJSON<null>,
    buy_now: this.txFromJSON<null>,
    pause: this.txFromJSON<null>,
    unpause: this.txFromJSON<null>,
    get_auction: this.txFromJSON<Auction>,
    get_active_auctions: this.txFromJSON<Array<Auction>>,
    get_auctions_by_seller: this.txFromJSON<Array<Auction>>,
    get_highest_bid: this.txFromJSON<readonly [u64, string]>,
  };

  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAQAAAAAAAAAAAAAAB0F1Y3Rpb24AAAAACAAAAAAAAAANYnV5X25vd19wcmljZQAAAAAAAAYAAAAAAAAACGVuZF90aW1lAAAABgAAAAAAAAALaGlnaGVzdF9iaWQAAAAABgAAAAAAAAAOaGlnaGVzdF9iaWRkZXIAAAAAABMAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAxpdGVtX2FkZHJlc3MAAAATAAAAAAAAAAZzZWxsZXIAAAAAABMAAAAAAAAABnN0YXR1cwAAAAAH0AAAAA1BdWN0aW9uU3RhdHVzAAAA",
        "AAAAAgAAAAAAAAAAAAAADUF1Y3Rpb25TdGF0dXMAAAAAAAADAAAAAAAAAAAAAAAGQWN0aXZlAAAAAAAAAAAAAAAAAAVFbmRlZAAAAAAAAAAAAAAAAAAACUNhbmNlbGxlZAAAAA==",
        "AAAAAAAAAAAAAAAOY3JlYXRlX2F1Y3Rpb24AAAAAAAQAAAAAAAAADGl0ZW1fYWRkcmVzcwAAABMAAAAAAAAABnNlbGxlcgAAAAAAEwAAAAAAAAANYnV5X25vd19wcmljZQAAAAAAAAYAAAAAAAAACGR1cmF0aW9uAAAABgAAAAEAAAfQAAAAB0F1Y3Rpb24A",
        "AAAAAAAAAAAAAAAJcGxhY2VfYmlkAAAAAAAAAwAAAAAAAAAKYXVjdGlvbl9pZAAAAAAABgAAAAAAAAAGYmlkZGVyAAAAAAATAAAAAAAAAApiaWRfYW1vdW50AAAAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAAQZmluYWxpemVfYXVjdGlvbgAAAAEAAAAAAAAACmF1Y3Rpb25faWQAAAAAAAYAAAAA",
        "AAAAAAAAAAAAAAAHYnV5X25vdwAAAAACAAAAAAAAAAphdWN0aW9uX2lkAAAAAAAGAAAAAAAAAAVidXllcgAAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAFcGF1c2UAAAAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAHdW5wYXVzZQAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAALZ2V0X2F1Y3Rpb24AAAAAAQAAAAAAAAAKYXVjdGlvbl9pZAAAAAAABgAAAAEAAAfQAAAAB0F1Y3Rpb24A",
        "AAAAAAAAAAAAAAATZ2V0X2FjdGl2ZV9hdWN0aW9ucwAAAAAAAAAAAQAAA+oAAAfQAAAAB0F1Y3Rpb24A",
        "AAAAAAAAAAAAAAAWZ2V0X2F1Y3Rpb25zX2J5X3NlbGxlcgAAAAAAAQAAAAAAAAAGc2VsbGVyAAAAAAATAAAAAQAAA+oAAAfQAAAAB0F1Y3Rpb24A",
        "AAAAAAAAAAAAAAAPZ2V0X2hpZ2hlc3RfYmlkAAAAAAEAAAAAAAAACmF1Y3Rpb25faWQAAAAAAAYAAAABAAAD7QAAAAIAAAAGAAAAEw==",
      ]),
      options
    );
  }
}
