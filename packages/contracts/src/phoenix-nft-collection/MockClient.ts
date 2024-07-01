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

export interface Collection {
  creator: string;
  description: string;
  id: u64;
  name: string;
  nft_contracts: Array<string>;
}

export const Errors = {};

export class Client extends ContractClient {
  public readonly fromJSON = {
    initialize: this.txFromJSON<Collection>,
    add_nft: this.txFromJSON<null>,
    remove_nft: this.txFromJSON<null>,
    get_details: this.txFromJSON<Collection>,
    get_nfts: this.txFromJSON<Array<string>>,
  };

  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAQAAAAAAAAAAAAAACkNvbGxlY3Rpb24AAAAAAAUAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAALZGVzY3JpcHRpb24AAAAAEQAAAAAAAAACaWQAAAAAAAYAAAAAAAAABG5hbWUAAAARAAAAAAAAAA1uZnRfY29udHJhY3RzAAAAAAAD6gAAABM=",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAEbmFtZQAAABEAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABEAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAEAAAfQAAAACkNvbGxlY3Rpb24AAA==",
        "AAAAAAAAAAAAAAAHYWRkX25mdAAAAAACAAAAAAAAAA1jb2xsZWN0aW9uX2lkAAAAAAAABgAAAAAAAAAUbmZ0X2NvbnRyYWN0X2FkZHJlc3MAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAKcmVtb3ZlX25mdAAAAAAAAgAAAAAAAAANY29sbGVjdGlvbl9pZAAAAAAAAAYAAAAAAAAAFG5mdF9jb250cmFjdF9hZGRyZXNzAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAALZ2V0X2RldGFpbHMAAAAAAQAAAAAAAAANY29sbGVjdGlvbl9pZAAAAAAAAAYAAAABAAAH0AAAAApDb2xsZWN0aW9uAAA=",
        "AAAAAAAAAAAAAAAIZ2V0X25mdHMAAAABAAAAAAAAAA1jb2xsZWN0aW9uX2lkAAAAAAAABgAAAAEAAAPqAAAAEw==",
      ]),
      options
    );
  }

  async initialize(
    {
      name,
      description,
      creator,
    }: { name: string; description: string; creator: string },
    options?: any
  ): Promise<AssembledTransaction<Collection>> {
    return {
      result: {
        creator,
        description,
        id: BigInt(1),
        name,
        nft_contracts: [],
      },
    } as unknown as AssembledTransaction<Collection>;
  }

  async add_nft(
    {
      collection_id,
      nft_contract_address,
    }: { collection_id: u64; nft_contract_address: string },
    options?: any
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async remove_nft(
    {
      collection_id,
      nft_contract_address,
    }: { collection_id: u64; nft_contract_address: string },
    options?: any
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async get_details(
    { collection_id }: { collection_id: u64 },
    options?: any
  ): Promise<AssembledTransaction<Collection>> {
    return {
      result: {
        creator: "creator1",
        description: "Sample description",
        id: collection_id,
        name: "Sample Collection",
        nft_contracts: ["nft1", "nft2"],
      },
    } as AssembledTransaction<Collection>;
  }

  async get_nfts(
    { collection_id }: { collection_id: u64 },
    options?: any
  ): Promise<AssembledTransaction<Array<string>>> {
    return {
      result: ["nft1", "nft2"],
    } as AssembledTransaction<Array<string>>;
  }
}

export class MockClient extends Client {
  async initialize(
    {
      name,
      description,
      creator,
    }: { name: string; description: string; creator: string },
    options?: any
  ): Promise<AssembledTransaction<Collection>> {
    return {
      result: {
        creator,
        description,
        id: BigInt(1),
        name,
        nft_contracts: [],
      },
    } as unknown as AssembledTransaction<Collection>;
  }

  async add_nft(
    {
      collection_id,
      nft_contract_address,
    }: { collection_id: u64; nft_contract_address: string },
    options?: any
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async remove_nft(
    {
      collection_id,
      nft_contract_address,
    }: { collection_id: u64; nft_contract_address: string },
    options?: any
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async get_details(
    { collection_id }: { collection_id: u64 },
    options?: any
  ): Promise<AssembledTransaction<Collection>> {
    return {
      result: {
        creator: "creator1",
        description: "Sample description",
        id: collection_id,
        name: "Sample Collection",
        nft_contracts: ["nft1", "nft2"],
      },
    } as AssembledTransaction<Collection>;
  }

  async get_nfts(
    { collection_id }: { collection_id: u64 },
    options?: any
  ): Promise<AssembledTransaction<Array<string>>> {
    return {
      result: ["nft1", "nft2"],
    } as AssembledTransaction<Array<string>>;
  }
}
