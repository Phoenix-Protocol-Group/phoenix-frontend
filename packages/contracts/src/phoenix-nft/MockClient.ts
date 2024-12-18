import { Buffer } from "buffer";
import type { i128, Option, u32, u64 } from "@stellar/stellar-sdk/contract";
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
    contractId: "CDTFIHRDY7LRUN4BSD7TQOF44NQZPWKQG3JKFVAI6YDO6XAZMEPCJYUJ",
  },
} as const;

export interface ApprovalAll {
  operator: string;
  owner: string;
}

export type ApprovalKey =
  | { tag: "All"; values: readonly [ApprovalAll] }
  | { tag: "ID"; values: readonly [i128] };

export type DataKey =
  | { tag: "Balance"; values: readonly [string] }
  | { tag: "Nonce"; values: readonly [string] }
  | { tag: "Minted"; values: readonly [string] }
  | { tag: "Admin"; values: void }
  | { tag: "Name"; values: void }
  | { tag: "Symbol"; values: void }
  | { tag: "URI"; values: readonly [i128] }
  | { tag: "Approval"; values: readonly [ApprovalKey] }
  | { tag: "Owner"; values: readonly [i128] }
  | { tag: "Supply"; values: void };

export type ContentType =
  | { tag: "Image"; values: void }
  | { tag: "Gif"; values: void }
  | { tag: "Video"; values: void }
  | { tag: "MP3"; values: void }
  | { tag: "Ticket"; values: void }
  | { tag: "Avatar"; values: readonly [AvatarAttributes] };

export interface Trait {
  score: u64;
  trait_type: string;
  value: string;
}

export interface AvatarAttributes {
  background: Trait;
  clothes: Trait;
  earring: Option<Trait>;
  eyes: Trait;
  fur: Trait;
  hat: Trait;
  mouth: Trait;
}

export interface NFT {
  content_type: ContentType;
  creator: string;
  id: u64;
  owner: string;
  royalties: u32;
  traits: Array<Trait>;
  uri: string;
}

export const Errors = {};

export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAARuYW1lAAAADgAAAAAAAAAGc3ltYm9sAAAAAAAOAAAAAAAAAAlyb3lhbHRpZXMAAAAAAAAEAAAAAAAAAAxjb250ZW50X3R5cGUAAAfQAAAAC0NvbnRlbnRUeXBlAAAAAAAAAAAGdHJhaXRzAAAAAAPoAAAD6gAAB9AAAAAFVHJhaXQAAAAAAAAA",
        "AAAAAAAAAAAAAAAFbm9uY2UAAAAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAFYWRtaW4AAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAVub25jZQAAAAAAAAsAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAADg==",
        "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAAA4=",
        "AAAAAAAAAAAAAAAJdG9rZW5fdXJpAAAAAAAAAQAAAAAAAAACaWQAAAAAAAsAAAABAAAADg==",
        "AAAAAAAAAAAAAAAEYXBwcgAAAAQAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAFbm9uY2UAAAAAAAALAAAAAAAAAAhvcGVyYXRvcgAAABMAAAAAAAAAAmlkAAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAIYXBwcl9hbGwAAAAEAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAABW5vbmNlAAAAAAAACwAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAAAAAAhhcHByb3ZlZAAAAAEAAAAA",
        "AAAAAAAAAAAAAAAIZ2V0X2FwcHIAAAABAAAAAAAAAAJpZAAAAAAACwAAAAEAAAAT",
        "AAAAAAAAAAAAAAAHaXNfYXBwcgAAAAACAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAEAAAAB",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAVvd25lcgAAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAFb3duZXIAAAAAAAABAAAAAAAAAAJpZAAAAAAACwAAAAEAAAAT",
        "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAAEAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAFbm9uY2UAAAAAAAALAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAACaWQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAUAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAVub25jZQAAAAAAAAsAAAAAAAAAAmlkAAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAEbWludAAAAAUAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAFbm9uY2UAAAAAAAALAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAACaWQAAAAAAAsAAAAAAAAAA3VyaQAAAAAOAAAAAA==",
        "AAAAAAAAAAAAAAAJbWludF9uZXh0AAAAAAAAAQAAAAAAAAADdXJpAAAAAA4AAAAA",
        "AAAAAAAAAAAAAAAEYnVybgAAAAMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAFbm9uY2UAAAAAAAALAAAAAAAAAAJpZAAAAAAACwAAAAA=",
        "AAAAAQAAAAAAAAAAAAAAC0FwcHJvdmFsQWxsAAAAAAIAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAAAAAAFb3duZXIAAAAAAAAT",
        "AAAAAgAAAAAAAAAAAAAAC0FwcHJvdmFsS2V5AAAAAAIAAAABAAAAAAAAAANBbGwAAAAAAQAAB9AAAAALQXBwcm92YWxBbGwAAAAAAQAAAAAAAAACSUQAAAAAAAEAAAAL",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACgAAAAEAAAAAAAAAB0JhbGFuY2UAAAAAAQAAABMAAAABAAAAAAAAAAVOb25jZQAAAAAAAAEAAAATAAAAAQAAAAAAAAAGTWludGVkAAAAAAABAAAAEwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAETmFtZQAAAAAAAAAAAAAABlN5bWJvbAAAAAAAAQAAAAAAAAADVVJJAAAAAAEAAAALAAAAAQAAAAAAAAAIQXBwcm92YWwAAAABAAAH0AAAAAtBcHByb3ZhbEtleQAAAAABAAAAAAAAAAVPd25lcgAAAAAAAAEAAAALAAAAAAAAAAAAAAAGU3VwcGx5AAA=",
        "AAAAAgAAAAAAAAAAAAAAC0NvbnRlbnRUeXBlAAAAAAYAAAAAAAAAAAAAAAVJbWFnZQAAAAAAAAAAAAAAAAAAA0dpZgAAAAAAAAAAAAAAAAVWaWRlbwAAAAAAAAAAAAAAAAAAA01QMwAAAAAAAAAAAAAAAAZUaWNrZXQAAAAAAAEAAAAAAAAABkF2YXRhcgAAAAAAAQAAB9AAAAAQQXZhdGFyQXR0cmlidXRlcw==",
        "AAAAAQAAAAAAAAAAAAAABVRyYWl0AAAAAAAAAwAAAAAAAAAFc2NvcmUAAAAAAAAGAAAAAAAAAAp0cmFpdF90eXBlAAAAAAARAAAAAAAAAAV2YWx1ZQAAAAAAABE=",
        "AAAAAQAAAAAAAAAAAAAAEEF2YXRhckF0dHJpYnV0ZXMAAAAHAAAAAAAAAApiYWNrZ3JvdW5kAAAAAAfQAAAABVRyYWl0AAAAAAAAAAAAAAdjbG90aGVzAAAAB9AAAAAFVHJhaXQAAAAAAAAAAAAAB2VhcnJpbmcAAAAD6AAAB9AAAAAFVHJhaXQAAAAAAAAAAAAABGV5ZXMAAAfQAAAABVRyYWl0AAAAAAAAAAAAAANmdXIAAAAH0AAAAAVUcmFpdAAAAAAAAAAAAAADaGF0AAAAB9AAAAAFVHJhaXQAAAAAAAAAAAAABW1vdXRoAAAAAAAH0AAAAAVUcmFpdAAAAA==",
        "AAAAAQAAAAAAAAAAAAAAA05GVAAAAAAHAAAAAAAAAAxjb250ZW50X3R5cGUAAAfQAAAAC0NvbnRlbnRUeXBlAAAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAlyb3lhbHRpZXMAAAAAAAAEAAAAAAAAAAZ0cmFpdHMAAAAAA+oAAAfQAAAABVRyYWl0AAAAAAAAAAAAAAN1cmkAAAAAEQ==",
      ]),
      options
    );
  }

  async initialize(
    {
      admin,
      name,
      symbol,
      royalties,
      content_type,
      traits,
    }: {
      admin: string;
      name: Buffer;
      symbol: Buffer;
      royalties: u32;
      content_type: ContentType;
      traits: Option<Array<Trait>>;
    },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async nonce(
    { id }: { id: string },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<i128>> {
    return {
      result: BigInt(12345) as i128,
    } as AssembledTransaction<i128>;
  }

  async admin(options?: {
    fee?: number;
    timeoutInSeconds?: number;
    simulate?: boolean;
  }): Promise<AssembledTransaction<string>> {
    return {
      result: "admin_address",
    } as AssembledTransaction<string>;
  }

  async set_admin(
    {
      admin,
      nonce,
      new_admin,
    }: { admin: string; nonce: i128; new_admin: string },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async name(options?: {
    fee?: number;
    timeoutInSeconds?: number;
    simulate?: boolean;
  }): Promise<AssembledTransaction<Buffer>> {
    return {
      result: Buffer.from("SampleName"),
    } as AssembledTransaction<Buffer>;
  }

  async symbol(options?: {
    fee?: number;
    timeoutInSeconds?: number;
    simulate?: boolean;
  }): Promise<AssembledTransaction<Buffer>> {
    return {
      result: Buffer.from("SYM"),
    } as AssembledTransaction<Buffer>;
  }

  async token_uri(
    { id }: { id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<Buffer>> {
    return {
      result: Buffer.from("http://token.uri"),
    } as AssembledTransaction<Buffer>;
  }

  async appr(
    {
      owner,
      nonce,
      operator,
      id,
    }: { owner: string; nonce: i128; operator: string; id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async appr_all(
    {
      owner,
      nonce,
      operator,
      approved,
    }: { owner: string; nonce: i128; operator: string; approved: boolean },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async get_appr(
    { id }: { id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<string>> {
    return {
      result: "approval_address",
    } as AssembledTransaction<string>;
  }

  async is_appr(
    { owner, operator }: { owner: string; operator: string },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<boolean>> {
    return {
      result: true,
    } as AssembledTransaction<boolean>;
  }

  async balance(
    { owner }: { owner: string },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<i128>> {
    return {
      result: BigInt(100) as i128,
    } as AssembledTransaction<i128>;
  }

  async owner(
    { id }: { id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<string>> {
    return {
      result: "owner_address",
    } as AssembledTransaction<string>;
  }

  async transfer(
    {
      from,
      nonce,
      to,
      id,
    }: { from: string; nonce: i128; to: string; id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async transfer_from(
    {
      spender,
      from,
      to,
      nonce,
      id,
    }: { spender: string; from: string; to: string; nonce: i128; id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async mint(
    {
      admin,
      nonce,
      to,
      id,
      uri,
    }: { admin: string; nonce: i128; to: string; id: i128; uri: Buffer },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async mint_next(
    { uri }: { uri: Buffer },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async burn(
    { admin, nonce, id }: { admin: string; nonce: i128; id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }
}

export class MockClient extends Client {
  async initialize(
    {
      admin,
      name,
      symbol,
      royalties,
      content_type,
      traits,
    }: {
      admin: string;
      name: Buffer;
      symbol: Buffer;
      royalties: u32;
      content_type: ContentType;
      traits: Option<Array<Trait>>;
    },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async nonce(
    { id }: { id: string },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<i128>> {
    return {
      result: BigInt(12345) as i128,
    } as AssembledTransaction<i128>;
  }

  async admin(options?: {
    fee?: number;
    timeoutInSeconds?: number;
    simulate?: boolean;
  }): Promise<AssembledTransaction<string>> {
    return {
      result: "admin_address",
    } as AssembledTransaction<string>;
  }

  async set_admin(
    {
      admin,
      nonce,
      new_admin,
    }: { admin: string; nonce: i128; new_admin: string },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async name(options?: {
    fee?: number;
    timeoutInSeconds?: number;
    simulate?: boolean;
  }): Promise<AssembledTransaction<Buffer>> {
    return {
      result: Buffer.from("SampleName"),
    } as AssembledTransaction<Buffer>;
  }

  async symbol(options?: {
    fee?: number;
    timeoutInSeconds?: number;
    simulate?: boolean;
  }): Promise<AssembledTransaction<Buffer>> {
    return {
      result: Buffer.from("SYM"),
    } as AssembledTransaction<Buffer>;
  }

  async token_uri(
    { id }: { id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<Buffer>> {
    return {
      result: Buffer.from("http://token.uri"),
    } as AssembledTransaction<Buffer>;
  }

  async appr(
    {
      owner,
      nonce,
      operator,
      id,
    }: { owner: string; nonce: i128; operator: string; id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async appr_all(
    {
      owner,
      nonce,
      operator,
      approved,
    }: { owner: string; nonce: i128; operator: string; approved: boolean },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async get_appr(
    { id }: { id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<string>> {
    return {
      result: "approval_address",
    } as AssembledTransaction<string>;
  }

  async is_appr(
    { owner, operator }: { owner: string; operator: string },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<boolean>> {
    return {
      result: true,
    } as AssembledTransaction<boolean>;
  }

  async balance(
    { owner }: { owner: string },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<i128>> {
    return {
      result: BigInt(100) as i128,
    } as AssembledTransaction<i128>;
  }

  async owner(
    { id }: { id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<string>> {
    return {
      result: "owner_address",
    } as AssembledTransaction<string>;
  }

  async transfer(
    {
      from,
      nonce,
      to,
      id,
    }: { from: string; nonce: i128; to: string; id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async transfer_from(
    {
      spender,
      from,
      to,
      nonce,
      id,
    }: { spender: string; from: string; to: string; nonce: i128; id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async mint(
    {
      admin,
      nonce,
      to,
      id,
      uri,
    }: { admin: string; nonce: i128; to: string; id: i128; uri: Buffer },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async mint_next(
    { uri }: { uri: Buffer },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }

  async burn(
    { admin, nonce, id }: { admin: string; nonce: i128; id: i128 },
    options?: { fee?: number; timeoutInSeconds?: number; simulate?: boolean }
  ): Promise<AssembledTransaction<null>> {
    return {
      result: null,
    } as AssembledTransaction<null>;
  }
}
