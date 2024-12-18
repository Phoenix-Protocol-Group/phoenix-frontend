import { AssembledTransaction, u64 } from "@stellar/stellar-sdk/contract";
import { Auction } from "./index";

export class MockClient {
  async create_auction(
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
    options?: any
  ): Promise<AssembledTransaction<Auction>> {
    return {
      result: {
        buy_now_price,
        end_time: BigInt(Date.now() + Number(duration)),
        highest_bid: BigInt(0),
        highest_bidder: "",
        id: BigInt(1),
        item_address,
        seller,
        status: { tag: "Active", values: undefined },
      },
    } as AssembledTransaction<Auction>;
  }

  async place_bid(
    {
      auction_id,
      bidder,
      bid_amount,
    }: { auction_id: u64; bidder: string; bid_amount: u64 },
    options?: any
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async finalize_auction(
    { auction_id }: { auction_id: u64 },
    options?: any
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async buy_now(
    { auction_id, buyer }: { auction_id: u64; buyer: string },
    options?: any
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async pause(options?: any): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async unpause(options?: any): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async get_auction(
    { auction_id }: { auction_id: u64 },
    options?: any
  ): Promise<AssembledTransaction<Auction>> {
    return {
      result: {
        buy_now_price: BigInt(1000),
        end_time: BigInt(Date.now() + 1000000),
        highest_bid: BigInt(500),
        highest_bidder: "bidder1",
        id: auction_id,
        item_address: "item1",
        seller: "seller1",
        status: { tag: "Active", values: undefined },
      },
    } as AssembledTransaction<Auction>;
  }

  async get_active_auctions(
    options?: any
  ): Promise<AssembledTransaction<Array<Auction>>> {
    return {
      result: [
        {
          buy_now_price: BigInt(1000),
          end_time: BigInt(Date.now() + 1000000),
          highest_bid: BigInt(500),
          highest_bidder: "bidder1",
          id: BigInt(1),
          item_address: "item1",
          seller: "seller1",
          status: { tag: "Active", values: undefined },
        },
      ],
    } as AssembledTransaction<Array<Auction>>;
  }

  async get_auctions_by_seller(
    { seller }: { seller: string },
    options?: any
  ): Promise<AssembledTransaction<Array<Auction>>> {
    return {
      result: [
        {
          buy_now_price: BigInt(1000),
          end_time: BigInt(Date.now() + 1000000),
          highest_bid: BigInt(500),
          highest_bidder: "bidder1",
          id: BigInt(1),
          item_address: "item1",
          seller,
          status: { tag: "Active", values: undefined },
        },
      ],
    } as AssembledTransaction<Array<Auction>>;
  }

  async get_highest_bid(
    { auction_id }: { auction_id: u64 },
    options?: any
  ): Promise<AssembledTransaction<readonly [u64, string]>> {
    return {
      result: [BigInt(500), "bidder1"] as const,
    } as AssembledTransaction<readonly [u64, string]>;
  }
}
